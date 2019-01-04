<template>
  <div>
    <div class="list">
      <section ref="printarea">
        <div
          class="title title-top"
        >{{student.schoolYear}}学年{{student.gradeName}}{{student.className}}学生列表</div>
        <template>
          <el-table
            :data="list"
            style="width: 100%"
            key="list"
            @cell-click="handleDetail"
            class="classStudentList"
          >
            <template v-for="(item,index) in columnArr">
              <el-table-column
                v-if="(item.fieldName=='interestClassName' || item.fieldName=='interestStudentNo') && classType==1"
                :label="item.label"
                align="center"
              >
                <template slot-scope="scope">
                  <div v-if="item.fieldName=='interestClassName'">
                    <span
                      v-for="(itemInst, index) in scope.row.interestClassDetailList"
                      :key="index"
                    >
                      {{itemInst.interestClassName}}
                      <br>
                    </span>
                  </div>
                  <div v-else>
                    <span
                      v-for="(itemInst, index) in scope.row.interestClassDetailList"
                      :key="index"
                    >
                      {{itemInst.interestStudentNo}}
                      <br>
                    </span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                v-else
                :class-name="item.className"
                :prop="item.fieldName"
                :label="item.label"
                align="center"
                :width="item.width"
                :key="index"
                :formatter="formatterVal"
              ></el-table-column>
              <!--<el-table-column :class-name="item.className" :prop="item.fieldName" :label="item.label" align="center" :width="item.width" :key="index" :formatter="formatterVal"></el-table-column>-->
            </template>
            <el-table-column
              label="操作"
              align="center"
              width="190"
              v-if="power.updateStudent || power.deleteStudent"
            >
              <template slot-scope="scope">
                <el-button
                  @click="handleEdit(scope.$index, scope.row)"
                  size="small"
                  v-if="power.updateStudent"
                >编辑</el-button>
                <el-button
                  @click="handleDelete(scope.$index, scope.row)"
                  size="small"
                  v-if="power.deleteStudent"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </section>
      <div class="page">
        <span class="demonstration"></span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="student.pageNum"
          :page-sizes="[10, 20, 30]"
          :page-size="student.pageSize"
          layout="prev, pager, next, sizes, jumper"
          backgroud
          :total="student.totalPage"
        ></el-pagination>
      </div>
      <!--<div class="page-action">-->
      <!--<el-button type="primary" @click="studentExport(student)">导出</el-button>-->
      <!--<el-button type="primary" @click="printAction">打印</el-button>-->
      <!--</div>-->
    </div>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import axios from "axios";
import { isHavePermissions } from "@/utils/auth";
import request from "@/utils/request";
import requestYapi from "@/utils/requestyAPI";

export default {
  name: "ClassStudentList",
  methods: {
    formatterVal(row, column, cellValue, index) {
      // console.log(row, column, cellValue, index);
      let value;
      switch (column.property) {
        case "sex":
          if (cellValue == 1) {
            value = "男";
          } else {
            value = "女";
          }
          break;
        case "status":
          if (cellValue == 1) {
            value = "在本班";
          } else {
            value = "不在本班";
          }
          break;
        case "gradeName":
          value = row.gradeName + row.className;
          break;
        default:
          value = cellValue;
          break;
      }
      return value;
    },
    studentExport(student) {
      var data = {};
      var schoolYearList = student.schoolYear.split("-");
      if (schoolYearList.length > 0) {
        data.schoolYearStart = schoolYearList[0];
        data.schoolYearEnd = schoolYearList[1];
        data.schoolTypeGradeId = student.schoolTypeGradeId;
        data.schoolClassId = student.schoolClassId;
        var instance = axios.create({
          baseURL: process.env.BASE_API,
          timeout: 1000,
          headers: {
            Authorization: getToken()
          },
          responseType: "blob"
        });
        instance
          .get(
            "/api/auth/v1/student/studentExport?schoolYearStart=" +
              data.schoolYearStart +
              "&schoolYearEnd=" +
              data.schoolYearEnd +
              "&schoolTypeGradeId=" +
              data.schoolTypeGradeId +
              "&schoolClassId=" +
              data.schoolClassId
          )
          .then(function(response) {
            // console.log(response)
            var blob = new Blob([response.data], {
              type: "application/vnd.ms-excel"
            });
            var link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download =
              data.schoolYearStart +
              "-" +
              data.schoolYearEnd +
              "学年" +
              student.gradeName +
              student.className +
              "学生列表.xls";
            link.click();
          })
          .catch(function(error) {
            if (error.response) {
              // 存在请求，但是服务器的返回一个状态码
              console.log(error.response);
            } else {
              // 一些错误是在设置请求时触发的
              console.log("Error", error.message);
            }
            console.log(error.config);
          });
      }
    },
    // 打印
    printAction() {
      var that = this;
      var t;
      this.noprint = "noprint";
      this.printWidth = "print-width";
      clearTimeout(t);
      t = setTimeout(function() {
        that.$print(that.$refs.printarea);
        that.noprint = "";
        that.printWidth = "";
      }, 500);
    },
    handleSizeChange(val) {
      this.student.pageSize = val;
      if (this.classType == 1) {
        this.doRequest();
      } else {
        this.getInsterStudent();
      }
    },
    handleCurrentChange(val) {
      this.student.pageNum = val;
      if (this.classType == 1) {
        this.doRequest();
      } else {
        this.getInsterStudent();
      }
    },
    handleEdit(index, row) {
      this.$router.push({
        path: "studentForm",
        query: {
          id: row.id,
          schoolYear: this.student.schoolYear,
          schoolClassId: row.schoolClassId,
          backUrl: "ClassStudentList"
        }
      });
    },
    handleDetail(row, column, cell, event) {
      if (!this.power.getStudent) return;
      if (column.property == "name") {
        request.get("api/auth/v1/physical/testItem/getTestItemId",{
          params:{
            schoolClassId:row.schoolClassId,
            studentId:row.id
          }
        }).then(res=>{
          if(res.data){
            this.$router.push({
              path: "physicalDetail",
              query: { id: res.data, type: "已关联"}
            });
          }else{
            this.$message.error('该学生没有体测报告');
          }
        })
      }
    },
    handleDelete(index, row) {
      var condition = JSON.stringify(this.student);
      localStorage.setItem("studentCondition", condition);
      this.$confirm("将删除此学生！").then(_ => {
        // this.$store.dispatch("DeleteStudent", {
        //     id: row.id,
        //     schoolClassId: row.schoolClassId,
        //     classType: this.classType
        //   })
        request
          .delete("/api/auth/v2/student/" + row.id, {
            params: {
              id: row.id,
              schoolClassId: row.schoolClassId,
              classType: this.classType
            }
          })
          .then(response => {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            if (this.classType == 1) {
              this.doRequest();
            } else {
              this.getInsterStudent();
            }
          });
      });
    },
    doRequest() {
      this.list = [];
      var params = {};
      var schoolYearList = this.student.schoolYear.split("-");
      if (schoolYearList.length > 0) {
        params.schoolYearStart = schoolYearList[0];
        params.schoolYearEnd = schoolYearList[1];
      }
      // data.schoolTypeGradeId = this.student.schoolTypeGradeId;
      params.schoolClassId = this.student.schoolClassId;
      params.pageSize = this.student.pageSize;
      params.pageNum = this.student.pageNum;
      if (this.student.schoolClassId) {
        // this.$store.dispatch('GetStudentList', data).then(response => {
        request
          .get("/api/auth/v1/school/class/student-list", { params })
          .then(response => {
            // requestYapi.get('/mock/35/api/auth/v1/school/class/student-list', data).then(response => {
            this.list = response.data.list;
            this.student.totalPage = response.data.total;
            this.student.pageNum = response.data.pageNum;
            this.student.pageSize = response.data.pageSize;
            this.list.forEach((val, index) => {
              val.gradeName = this.student.gradeName;
              val.className = this.student.className;
              val.dictClassId = this.dictClassId;
            });
          });
      }
    },
    getInsterStudent() {
      this.list = [];
      var params = {
        pageSize: this.student.pageSize,
        pageNum: this.student.pageNum,
        interestClassId: this.student.interestClassId
      };
      request
        .get("/api/auth/v1/interest-class/student-list", { params })
        .then(response => {
          // requestYapi.get('/mock/35/api/auth/v1/interest-class/student-list', { params }).then(response => {
          this.list = response.data.list;
          this.student.totalPage = response.data.total;
          // console.log(response.data.total)
          this.student.pageNum = response.data.pageNum;
          this.student.pageSize = response.data.pageSize;
          // this.list.forEach((val, index) => {
          //   // val.gradeName = this.student.gradeName
          //   // val.className = this.student.className
          //   val.dictClassId = this.student.interestClassId;
          // });
        });
    }
  },
  data() {
    return {
      columnArr: [],
      classTypeList1: [
        {
          fieldName: "name",
          label: "姓名",
          width: 150,
          className: "nameStyle"
        },
        { fieldName: "sex", label: "性别", width: 80 },
        { fieldName: "studentNo", label: "行政班学号" },
        { fieldName: "status", label: "行政班学籍状态", width: 130 },
        { fieldName: "interestClassName", label: "兴趣班" },
        { fieldName: "interestStudentNo", label: "兴趣班学号" },
        { fieldName: "identityNo", label: "身份证/国外护照号", width: 200 }
      ],
      classTypeList2: [
        {
          fieldName: "name",
          label: "姓名",
          width: 120,
          className: "nameStyle"
        },
        { fieldName: "sex", label: "性别", width: 80 },
        { fieldName: "status", label: "兴趣班学籍状态", width: 130 },
        { fieldName: "interestStudentNo", label: "兴趣班学号" },
        { fieldName: "studentNo", label: "行政班学号" },
        { fieldName: "gradeName", label: "行政班", width: 150 },
        { fieldName: "identityNo", label: "身份证/国外护照号", width: 200 }
      ],
      classType: "",
      power: {
        updateStudent: false,
        getStudent: false,
        deleteStudent: false
      },
      powerArr: ["updateStudent", "getStudent", "deleteStudent"],
      printWidth: "",
      noprint: "",
      student: {
        schoolYear: "",
        schoolTypeGradeId: "",
        schoolClassId: "",
        gradeName: "",
        className: "",
        name: "",
        pageSize: 10,
        pageNum: 1,
        totalPage: 10
      },
      list: []
    };
  },
  watch: {
    $route(to, form) {
      if (to.name == "ClassStudentList" && to.query.type == "update") {
        if (form.name == "ClassList") {
          this.classType = to.query.classType;
        }
        if (this.classType == 1) {
          this.columnArr = this.classTypeList1;
          if (form.name == "ClassList") {
            var schoolClassId = to.query.schoolClassId;
            var schoolTypeGradeId = to.query.schoolTypeGradeId;
            var gradeName = to.query.gradeName;
            var className = to.query.className;
            var schoolYear = to.query.schoolYear;
            var dictClassId = to.query.dictClassId;
            if (typeof schoolClassId !== "undefined") {
              this.dictClassId = dictClassId;
              this.student.gradeName = gradeName;
              this.student.className = className;
              this.student.schoolClassId = schoolClassId;
              this.student.schoolYear = schoolYear;
              this.student.schoolTypeGradeId = schoolTypeGradeId;
            }
          }
          this.doRequest();
        } else {
          this.columnArr = this.classTypeList2;
          if (form.name == "ClassList") {
            this.student.interestClassId = to.query.id;
            this.student.gradeName = "";
            this.student.className = to.query.name;
            this.student.schoolYear = to.query.schoolYear;
            this.student.schoolClassId = to.query.id;
          }
          this.getInsterStudent();
        }
      }
    }
  },
  mounted() {
    this.classType = this.$route.query.classType;
    if (this.classType == 1) {
      // 行政班
      this.columnArr = this.classTypeList1;
      var schoolClassId = this.$route.query.schoolClassId; // 好像没传
      var schoolTypeGradeId = this.$route.query.schoolTypeGradeId;
      var gradeName = this.$route.query.gradeName;
      var className = this.$route.query.className;
      var schoolYear = this.$route.query.schoolYear;
      // var dictClassId = this.$route.query.dictClassId;
      if (typeof schoolClassId !== "undefined") {
        this.student.gradeName = gradeName;
        this.student.className = className;
        this.student.schoolClassId = schoolClassId;
        this.student.schoolYear = schoolYear;
        this.student.schoolTypeGradeId = schoolTypeGradeId;
      }
      this.doRequest();
    } else {
      // 兴趣班
      this.columnArr = this.classTypeList2;
      this.student.interestClassId = this.$route.query.id;
      this.student.className = this.$route.query.name;
      this.student.schoolYear = this.$route.query.schoolYear;
      this.student.schoolClassId = this.$route.query.id;
      this.getInsterStudent();
    }
    this.powerArr.forEach(val => {
      this.power[val] = isHavePermissions(val);
    });
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.page {
  margin-top: 30px;
}
.title {
  width: 100%;
  height: 80px;
  line-height: 80px;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
}

.list {
  padding-left: 20px;
  padding-right: 20px;
}
</style>
<style lang="scss">
.classStudentList {
  td.nameStyle {
    .cell {
      color: #03a9f4;
      text-decoration: underline;
      cursor: pointer;
    }
  }
}
</style>

