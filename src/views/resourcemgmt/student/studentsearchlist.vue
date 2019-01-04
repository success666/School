<template>
  <div>
    <el-radio-group v-model="studentModel" @change="phyRouter" style="margin-bottom: 10px;">
      <el-radio-button label="1">学生管理</el-radio-button>
      <el-radio-button label="2">班级管理</el-radio-button>
      <el-radio-button label="3">学生统计</el-radio-button>
    </el-radio-group>
    <div class="search-form">
      <el-form :inline="true" :model="student" class="">
        <el-row>
          <el-col>
            <el-form-item label="学年">
              <el-select v-model="student.schoolYear" placeholder="请选择" size="mini" @change="schoolYearChange" style="width: 120px;">
                <el-option v-for="item in schoolYearOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="班级类型">
              <el-select v-model="student.classType" placeholder="请选择" size="mini" style="width: 100px;">
                <el-option label="全部" value="0"></el-option>
                <!--<el-option label="行政班" value="1"></el-option>-->
                <!--<el-option label="兴趣班" value="2"></el-option>-->
                <el-option v-for="item in classTypes" :key="item.type" :label="item.name" :value="item.type"></el-option>
              </el-select>
            </el-form-item>
            <template v-if="student.classType==1">
              <!--行政班班级-->
              <el-form-item label="">
                <el-select v-model="student.gradeId" placeholder="请选择年级" @change="getClass" size="mini" style="width: 120px;">
                  <el-option v-for="item in gradeOptions" :key="item.id" :label="item.gradeName" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="">
                <el-select v-model="student.classId" placeholder="请选择班级" size="mini" style="width: 120px;">
                  <el-option v-for="item in classOptions" :key="item.id" :label="item.dictClassName" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </template>
            <template v-if="student.classType==2">
              <!--兴趣班类型-->
              <el-form-item label="">
                <el-select v-model="student.interestId" placeholder="请选择" size="mini" style="width: 110px;">
                  <!--<el-option label="篮球班" value="1"></el-option>-->
                  <!--<el-option label="足球班" value="2"></el-option>-->
                  <!--<el-option label="美术班" value="3"></el-option>-->
                  <!--<el-option label="乒乓球班" value="4"></el-option>-->
                  <el-option v-for="item in interestOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </template>

            <el-form-item label="">
              <el-input v-model="student.name" placeholder="请输入学生姓名" size="mini" class="text-input" style="width: 130px;"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search(student)" class="btn" size="mini">查询</el-button>
              <el-button type="primary" @click="reset(student)" class="btn" size="mini">重置</el-button>
            </el-form-item>
            <el-form-item style="float: right">
              <el-button type="primary" @click="add" class="btn" size="mini" v-if="power.addStudent">添加学生</el-button>
              <el-button type="primary" @click="centerDialogVisible = true" class="btn" size="mini" v-if="power.importStudentExcel">批量导入</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="list">
      <section ref="printarea">
        <template>
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="name" label="姓名" align="center" width="110">
              <template slot-scope="scope">
                <span @click="handleDetail(scope.$index, scope.row)" class="btnhov">{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="sex" label="性别" align="center" width="80">
              <template slot-scope="scope">
                <span v-if="scope.row.sex==1">男</span>
                <span v-else-if="scope.row.sex==2">女</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column prop="className" label="行政班" align="center" width="130">
              <template slot-scope="scope">
                <span>{{scope.row.gradeName}}{{scope.row.className}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="shcClStuNo" label="行政班学号" align="center">
            <!--<el-table-column prop="studentNo" label="行政班学号" align="center" width="100">-->
            </el-table-column>
            <el-table-column prop="intDtlList" label="兴趣班" align="center" width="120">
              <template slot-scope="scope">
                <span v-if="!scope.row.intDtlList || scope.row.intDtlList==[]">无</span>
                <span v-else v-for="item in scope.row.intDtlList">{{item.interestName}}<br></span>
              </template>
            </el-table-column>
            <el-table-column prop="intDtlList" label="兴趣班学号" align="center">
              <template slot-scope="scope">
                <span v-if="!scope.row.intDtlList || scope.row.intDtlList==[]">无</span>
                <span v-else v-for="item in scope.row.intDtlList">{{item.intClStuNo}}<br></span>
              </template>
            </el-table-column>
            <el-table-column prop="identityNo" label="身份证/国外护照号" align="center" width="200">
            </el-table-column>
            <el-table-column label="操作" align="center" width="190">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.$index, scope.row)" v-if="power.updateStudent">编辑
                </el-button>
                <el-button size="mini" @click="handleDelete(scope.$index, scope.row)" v-if="power.deleteStudent">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </section>
      <!--<div class="page-action">-->
        <!--<el-button type="primary" @click="studentExport(searchForm)" size="mini">导出</el-button>-->
        <!--<el-button type="primary" @click="printAction" size="mini">打印</el-button>-->
      <!--</div>-->
      <div class="page">
        <span class="demonstration"></span>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchForm.pageNum" :page-sizes="[10, 20, 30, 50, 100]" :page-size="searchForm.pageSize" layout="prev, pager, next, sizes, jumper" backgroud="" :total="searchForm.total">
        </el-pagination>
      </div>
    </div>

    <el-dialog
      title="请选择需要导入的班级"
      :visible.sync="centerDialogVisible"
      width="30%"
      center style="margin-top: 15vh;">
      <!--<span>需要注意的是内容是默认不居中的</span>-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="importHandle(1)">行政班</el-button>
        <el-button @click="importHandle(2)">兴趣班</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Print from "@/utils/print";
import Vue from "vue";
import { getSchoolYear } from "@/utils/index";
import { getToken } from "@/utils/auth";
import axios from "axios";
import { isHavePermissions } from "@/utils/auth";
import request from '@/utils/request';

Vue.use(Print); // 注册

export default {
  name: "StudentSearchList",
  methods: {
    studentExport(student) {
      var data = {};
      var schoolYearList = student.schoolYear.split("-");
      if (schoolYearList.length > 0) {
        data.schoolYearStart = schoolYearList[0];
        data.schoolYearEnd = schoolYearList[1];
        data.schoolTypeGradeId = student.gradeId;
        data.schoolClassId = student.classId;
        data.name = student.name;
        data.pageSize = student.pageSize;
        data.pageNum = student.pageNum;
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
      this.searchForm.pageSize = val;
      this.doSearch(this.searchForm);
    },
    handleCurrentChange(val) {
      this.searchForm.pageNum = val;
      this.doSearch(this.searchForm);
    },
    phyRouter() {
      switch (this.studentModel) {
        case "2":
          this.$router.push("/studentManagement/classList");
          break;
        case "3":
          this.$router.push("/studentManagement/studentStats");
          break;
      }
      this.studentModel = "1";
    },
    handleEdit(index, row) {
      this.$router.push({
        path: "studentForm",
        query: {
          id: row.id,
          gradeId: row.gradeId,
          schoolYear: this.student.schoolYear,
          schoolClassId: row.schoolClassId,
          backUrl: "StudentSearchList"
        }
      });
    },
    handleDetail(index, row) {
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
    },
    handleDelete(index, row) {
      var condition = JSON.stringify(this.student);
      localStorage.setItem("studentSearchCondition", condition);
      this.$confirm("将删除此学生！").then(_ => {
        this.$store
          .dispatch("DeleteStudent", {
            id: row.id,
            schoolClassId: row.schoolClassId
          })
          .then(response => {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.doSearch(this.searchForm);
          });
      });
    },
    getGrade() {
      this.$store.dispatch("GetGrade").then(response => {
        this.gradeOptions = response.data;
      });
    },
    add() {
      this.$router.push({
        path: "addStudentForm",
        query: {
          backUrl: "StudentSearchList"
        }
      });
    },
    schoolYearChange() {
      this.student.classId = "";
      this.getClass();
    },
    getClass() {
      this.student.classId = "";
      this.getClassOption();
    },
    getClassOption() {
      var data = {};
      data.schoolTypeGradeId = this.student.gradeId;
      var list = this.student.schoolYear.split("-");
      if (list.length > 0) {
        data.schoolYearStart = list[0];
        data.schoolYearEnd = list[1];
      }
      this.$store.dispatch("GetClass", data).then(response => {
        this.classOptions = response.data;
      });
    },
    reset(student) {
      this.student.classType = "0";
      this.student.gradeId = "";
      this.classOptions = [];
      this.student.classId = "";
      this.student.name = "";
      var date = new Date();
      var month = date.getMonth();
      var diff = date.getFullYear() - 2008;
      if (month >= 7) {
        diff++;
      }
      this.student.schoolYear = 2007 + diff + "-" + (2008 + diff);
    },
    doRequest() {
      if (this.$route.params.schoolYear) {
        this.student.schoolYear = this.$route.params.schoolYear;
      }
      if (this.$route.params.name) {
        this.student.name = this.$route.params.name;
      }
      this.search(this.student);
    },
    getInterestClass() {
      let schoolYear = this.student.schoolYear;
      let params = {
        schoolYearStart: schoolYear.split("-")[0],
        schoolYearEnd: schoolYear.split("-")[1],
      };

      // requestYapi.get("/mock/35/api/auth/v1/school/class/type",{ // 班级类型下拉
      request.get("/api/auth/v1/school/class/type",{
        params
      }).then(res => {
        this.classTypes = res.data;
      });

      // requestYapi.get("/mock/35/api/auth/v1/interest-class",{ // 获取兴趣班列表
      request.get("/api/auth/v1/interest-class",{ // 获取兴趣班列表
        params
      }).then(res => {
        this.interestOptions = res.data;
      })
    },
    search(student) {
      this.searchForm = JSON.parse(JSON.stringify(student));
      this.doSearch(this.searchForm);
    },
    doSearch(student) {
      var params = {};
      params.schoolYear = student.schoolYear;
      params.classType = student.classType;
      params.schoolTypeGradeId = this.student.gradeId || null;
      params.schoolClassId = this.student.classId || null;
      params.name = this.student.name || null;
      params.interestId = this.student.interestId || null;
      params.pageSize = student.pageSize;
      params.pageNum = student.pageNum;
      params.sort = 1;
      // this.$store.dispatch("GetStudentList", data).then(response => {
      // requestYapi.get("/mock/35/api/auth/v2/student", data).then(response => {
      request.get("/api/auth/v2/student", { params }).then(response => {
        if (response.data) {
          this.tableData = response.data.list;
          this.searchForm.total = response.data.total;
          this.searchForm.pageNum = response.data.pageNum;
          this.searchForm.pageSize = response.data.pageSize;
        } else {
          this.tableData = [];
          this.searchForm.total = 0;
        }
      })
    },
    // 导入
    importHandle(index) {
      this.$router.push({
        path: 'studentImport',
        query: {
          backUrl: 'StudentSearchList',
          type: index // 班级类型：index: 0-全部；1-行政班；2-兴趣班
        }
      });
      this.centerDialogVisible = false
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === "StudentForm" || to.name === "AddStudentForm") {
      var condition = JSON.stringify(this.searchForm);
      localStorage.setItem("studentSearchCondition", condition);
    } else {
      localStorage.removeItem("studentSearchCondition");
    }
    next();
  },
  data() {
    return {
      centerDialogVisible: false,
      classTypes: [],
      interestOptions: [],
      power: {
        addStudent: false,
        updateStudent: false,
        getStudent: false,
        deleteStudent: false,
        importStudentExcel: false
      },
      powerArr: [
        "addStudent",
        "updateStudent",
        "getStudent",
        "deleteStudent",
        "importStudentExcel"
      ],
      printWidth: "",
      noprint: "",
      multiLine: [],
      schoolYearOptions: [],
      gradeOptions: [],
      classOptions: [],
      checked: '',
      student: {
        schoolYear: "",
        gradeId: "",
        classId: "",
        name: "",
        classType: '0', // 班级类型
        interestId: '', // 兴趣班id
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      studentModel: 1,
      tableData: [],
      searchForm: {}
    };
  },
  created() {
    var condition = localStorage.getItem("studentSearchCondition");
    if (condition != null) {
      this.student = JSON.parse(condition);
    }
  },
  watch: {
    $route(to, from) {
      if (to.name=="StudentSearchList"&&typeof to.params.type != "undefined" && to.params.type == "update") {
        this.doRequest();
      }
    }
  },
  mounted() {
    this.schoolYearOptions = getSchoolYear();
    if (!this.student.schoolYear) {
      this.student.schoolYear = this.schoolYearOptions[0].value;
    }
    this.getGrade();
    this.getInterestClass();
    var that = this;
    setTimeout(function() {
      that.getClassOption();
      that.doRequest();
    }, 200);
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
.list .table {
  margin-top: 10px;
  width: 100%;
  border-spacing: 0px;
  text-align: center;
}

.list .tbody {
}

.list tr {
  border: none;
  height: 40px;
}

.list th {
  border-bottom: 1px solid #ebeef5;
  font-size: 16px;
  color: #666666;
}

.list td {
  border: none;
  background-color: white;
  word-wrap: break-word;
  font-family: PingFang-SC-Medium;
  font-size: 14px;
  color: #6b6b6b;
}
tr:hover > td {
  background-color: #84bef9;
  color: #ffffff;
}
tr:hover > td .btn {
  color: #84bef9;
}
.noprint {
  display: none;
}
.print-width {
  width: 15%;
}
.btnhov {
  color: #287ee2;
  cursor: pointer;
}
.btnhov:hover {
  color: #ffd836;
}
.el-button--primary {
  color: #fff;
  background-color: #409EFF;
  border-color: #409EFF;
}
</style>
