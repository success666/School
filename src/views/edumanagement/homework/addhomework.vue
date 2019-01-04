<template>
  <div class="work">
    <div class="search-form">
      <div class="title">{{homework.title}}</div>
      <el-form :inline="true" :model="homework" class>
        <el-row>
          <el-col>
            <span style="color: #6b6b6b;font-family: 'PingFang SC';font-weight: bold">班级：</span>
            {{homework.grade}}&nbsp;{{homework.class}}
          </el-col>
        </el-row>
        <el-form-item label="开始日期">
          <el-date-picker
            v-model="homework.startDate"
            type="date"
            :picker-options="pickerbeginDate"
            size="mini"
            placeholder="请选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker
            v-model="homework.endDate"
            type="date"
            :picker-options="pickerEndDate"
            size="mini"
            placeholder="请选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="primary" class="btn" size="mini" @click="saveHomework(1)">保存并推送</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button
            type="primary"
            class="btn"
            size="mini"
            :disabled="submitFlag"
            @click="saveHomework(2)"
          >保存</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button class="btn" size="mini" @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
      <el-button
        type="primary"
        @click="batchEdit"
        class="btn"
        style="margin-bottom: 10px"
        size="mini"
      >批量编辑</el-button>
      <el-table
        ref="multipleTable"
        :data="list"
        tooltip-effect="dark"
        :header-cell-style="headerStyle"
        :cell-style="cellStyle"
        style="width: 98%;border: 1px solid #F9F9F9"
        @selection-change="selectChange"
      >
        <el-table-column prop="student.id" type="selection"></el-table-column>
        <el-table-column prop="student.studentNo" label="学号"></el-table-column>
        <el-table-column prop="student.name" label="姓名" show-overflow-tooltip></el-table-column>
        <el-table-column label="性别" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.student.sex === 1">男</span>
            <span v-if="scope.row.student.sex === 2">女</span>
          </template>
        </el-table-column>
        <el-table-column label="疾病" show-overflow-tooltip>
          <template slot-scope="scope">
            <div style="text-align: left;width: 100%">{{scope.row.student.disease}}</div>
          </template>
        </el-table-column>
        <el-table-column label="作业详情" min-width="300">
          <template slot-scope="scope">
            <div class="homework-detail">
              <span v-for="(val, index) in scope.row.recommendHomeworkList" :key="index">
                <span
                  style="text-decoration: underline;cursor: pointer;color: #3787F2"
                  @click="showDialog(val.id)"
                >{{val.name}}</span>
                ({{val.exerciseGroupNo}}*{{val.groupTime}}
                <span v-if="val.groupTimeUnit === 1">次</span>
                <span v-if="val.groupTimeUnit === 2">秒</span>
                <span v-if="val.groupTimeUnit === 3">分</span>
                )
                <span v-if="index !== scope.row.recommendHomeworkList.length-1">、</span>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)" class="btn">编辑</el-button>
            <el-button
              size="mini"
              @click="handleReport(scope.$index, scope.row)"
              class="btn"
              :disabled="!viewReport"
            >体质报告</el-button>
          </template>
        </el-table-column>
      </el-table>
      <homeworkLibDialog ref="homeworkLibDialog"></homeworkLibDialog>
    </div>
  </div>
</template>

<script>
import HomeworkLibDialog from "@/components/Dialog/HomeworkLibDetailDialog";
import { formatDate } from "@/utils";
import { isHavePermissions } from "@/utils/auth";
import request from '@/utils/request';

export default {
  name: "AddHomework",
  components: {
    homeworkLibDialog: HomeworkLibDialog
  },
  methods: {
    cancel() {
      this.$router.push("homework");
    },
    showDialog(id) {
      this.$refs.homeworkLibDialog.showDialog(id);
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 4 || columnIndex === 5) {
        return { textAlign: "left" };
      } else {
        return { textAlign: "center" };
      }
    },
    headerStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 4 || columnIndex === 5) {
        return {
          textAlign: "left",
          color: "#525252",
          fontSize: "16px",
          backgroundColor: "#F9F9F9"
        };
      } else {
        return {
          textAlign: "center",
          color: "#525252",
          fontSize: "16px",
          backgroundColor: "#F9F9F9"
        };
      }
    },
    handleClose(done) {
      done();
      this.show = false;
    },
    saveHomework(pushState) {
      this.submitFlag = true;
      this.homework.pushState = pushState;
      var list = [];
      if (this.list) {
        this.list.forEach((val, index) => {
          var student = {
            homeworkStudentLibList: []
          };
          if (val.student.studentId) {
            student.studentId = val.student.studentId;
          }
          if (val.student.id && !val.student.studentId) {
            student.studentId = val.student.id;
          }
          if (val.student.id && val.student.studentId) {
            student.id = val.student.id;
          }
          if (val.student.homeworkExplain) {
            student.homeworkExplain = val.student.homeworkExplain;
          }
          student.delIds = val.student.ids;
          if (val.recommendHomeworkList) {
            val.recommendHomeworkList.forEach((v, i) => {
              var homework = {
                homeworkLibId: v.id,
                exerciseGroupNo: v.exerciseGroupNo,
                groupTime: v.groupTime,
                groupTimeUnit: v.groupTimeUnit
              };
              if (v.personHomeworkId) {
                homework.id = v.personHomeworkId;
              }
              student.homeworkStudentLibList.push(homework);
            });
          }
          list.push(student);
        });
      }
      this.homework.homeworkStudentList = list;
      this.homework.startDate = formatDate(
        this.homework.startDate,
        "yyyy-MM-dd"
      );
      this.homework.endDate = formatDate(this.homework.endDate, "yyyy-MM-dd");
      let schoolYear = "";
      let endDate = this.homework.startDate.split("-")[0] + "-07-31";
      if (new Date(this.homework.startDate) > new Date(endDate)) {
        schoolYear =
          this.homework.startDate.split("-")[0] +
          "-" +
          (Number(this.homework.startDate.split("-")[0]) + 1);
      }
      if (this.homework.id) {
        this.$store.dispatch("UpdateHomework", this.homework).then(response => {
          this.$alert("保存成功!", "提示", {
            confirmButtonText: "确定",
            callback: action => {
              this.$router.push({
                name: "HomeworkList",
                params: {
                  schoolYear: schoolYear,
                  type: "update"
                }
              });
            }
          });
        });
      } else {
        this.homework.homeworkStudentList.forEach((val, index) => {
          val.id = "";
        });
        this.$store.dispatch("SaveHomework", this.homework).then(response => {
          this.$alert("保存成功!", "提示", {
            confirmButtonText: "确定",
            callback: action => {
              this.$router.push({
                name: "HomeworkList",
                params: {
                  schoolYear: schoolYear,
                  type: "update"
                }
              });
            }
          });
        });
      }
      this.submitFlag = false;
    },
    batchEdit() {
      if (this.ids.length > 0) {
        this.homework.startDate = new Date(this.homework.startDate).getTime();
        this.homework.endDate = new Date(this.homework.endDate).getTime();
        this.routeLink = {
          path: "/personalHomeWordEditForm"
        };
        this.$router.push(this.routeLink);
      } else {
        this.$alert("请选择学生!", "提示", {
          confirmButtonText: "确定"
        });
      }
    },
    selectChange(val) {
      this.ids = val;
    },
    handleEdit(index, row) {
      this.homework.startDate = new Date(this.homework.startDate).getTime();
      this.homework.endDate = new Date(this.homework.endDate).getTime();
      this.ids = [];
      this.ids.push(row);
      this.routeLink = {
        path: "personalHomeWordEditForm"
      };
      this.$router.push(this.routeLink);
    },
    handleReport(index, row) {
      if(this.$route.name=="EditHomework"){
        request.get("api/auth/v1/physical/testItem/recordId",{
          params:{
            identityNo:row.student.identityNo,
            schoolYearStart:this.schoolYearStart,
            schoolYearEnd:this.schoolYearEnd,
          }
        }).then(res=>{
          if(res.data){
            this.$router.push({
              path: "/homework/physicalDetail",
              query: { id: res.data, type: "已关联"}
            });
          }else{
            this.$message.error('该学生没有体测报告');
          }
        })
      }else{
        request.get("api/auth/v1/physical/testItem/getTestItemId",{
        params:{
          schoolClassId:row.student.schoolClassId,
          studentId:row.student.id
        }
      }).then(res=>{
        if(res.data){
            this.$router.push({
              path: "/homework/physicalDetail",
              query: { id: res.data, type: "已关联"}
            });
          }else{
            this.$message.error('该学生没有体测报告');
          }
        })
      }
      
    },
    doRequest() {
      var schoolClassId = this.$route.query.schoolClassId;
      var id = this.$route.query.id;
      if (id && this.list.length <= 0) {
        this.homework.title = "编辑作业";
        this.homework.id = this.$route.query.id;
        this.$store
          .dispatch("GetHomeworkDetail", { id: this.homework.id })
          .then(response => {
            var list = response.data.homeworkStudentList;
            this.homework.grade = response.data.dictGradeName;
            this.homework.class = response.data.dictClassIdName;
            this.homework.startDate = response.data.startDate;
            this.homework.endDate = response.data.endDate;
            this.homework.schoolClassId = response.data.schoolClassId;
            this.schoolYearEnd=response.data.schoolYearEnd;
            this.schoolYearStart=response.data.schoolYearStart;
            this.list = [];
            if (list.length > 0) {
              list.forEach((val, index) => {
                var student = {
                  id: val.id,
                  name: val.name,
                  identityNo:val.identityNo,
                  studentNo: val.studentNo,
                  studentId: val.studentId,
                  disease: val.disease,
                  sex: val.sex,
                  homeworkExplain: val.homeworkExplain,
                  ids: ""
                };
                var recommendHomeworkList = [];
                if (val.homeworkStudentLibList) {
                  val.homeworkStudentLibList.forEach((v, i) => {
                    var data = {
                      id: v.homeworkLibId,
                      name: v.homeworkLibName,
                      personHomeworkId: v.id,
                      thumbnailUrl: v.thumbnailUrl,
                      exerciseGroupNo: v.exerciseGroupNo,
                      groupTime: v.groupTime,
                      groupTimeUnit: v.groupTimeUnit
                    };
                    student.ids += v.id + ",";
                    recommendHomeworkList.push(data);
                  });
                  student.ids = student.ids.substring(
                    0,
                    student.ids.length - 1
                  );
                  var item = {
                    student: student,
                    recommendHomeworkList: recommendHomeworkList
                  };
                  this.list.push(item);
                }
              });
            }
          });
      } else if (!id && this.list.length <= 0) {
        this.homework.schoolClassId = schoolClassId;
        this.homework.title = "新增作业";
        this.homework.grade = this.$route.query.grade;
        this.homework.class = this.$route.query.class;
        this.homework.classType = this.$route.query.classType;
        if (this.$route.query.startDate) {
          this.homework.startDate = this.$route.query.startDate;
          this.homework.endDate = this.$route.query.endDate;
        }
        let params = {};
        if (this.$route.query.classType == "1") {
          this.homework.schoolClassId = schoolClassId;
          this.homework.interestClassId = "0";
          params.classId = schoolClassId;
          params.interestClassId = "0";
        } else {
          params.classId = "0";
          params.interestClassId = schoolClassId;
          this.homework.schoolClassId = "0";
          this.homework.interestClassId = schoolClassId;
        }
        params.classType = this.$route.query.classType;
        this.$store.dispatch("RecommendHomework", params).then(response => {
          this.list = response.data;
        });
      } else if (this.list.length > 0) {
        this.homework.endDate = new Date(this.homework.endDate);
        this.homework.startDate = new Date(this.homework.startDate);
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    var data = {
      data: this.ids,
      list: this.list,
      homework: this.homework,
      desc: this.desc
    };
    if (to.name === "PersonalHomeWordEditForm") {
      var condition = JSON.stringify(data);
      localStorage.setItem("addHomeworkCondition", condition);
    } else {
      localStorage.removeItem("addHomeworkCondition");
    }

    next();
  },
  created() {
    var condition = localStorage.getItem("addHomeworkCondition");
    if (condition != null) {
      var data = JSON.parse(condition);
      this.homework = data.homework;
      this.list = data.list;
      this.desc = data.desc;
    }
  },
  mounted: function() {
    this.doRequest();
    this.viewReport = isHavePermissions("getStudent");
  },
  data() {
    return {
      schoolYearStart:"",
      schoolYearEnd:"",
      viewReport: false,
      submitFlag: false,
      show: true,
      homeworkdialogVisible: false,
      ids: [],
      desc: "",
      dialogFormVisible: false,
      pickerbeginDate: {
        disabledDate: time => {
          if (this.homework.endDate) {
            return time.getTime() > this.homework.endDate;
          } else {
            return null;
          }
        }
      },
      pickerEndDate: {
        disabledDate: time => {
          // var date = new Date()
          // date.setTime(this.homework.startDate.getTime() - 86400000)
          if (this.homework.startDate) {
            return time.getTime() < this.homework.startDate.getTime();
          } else {
            return null;
          }
        }
      },
      homework: {
        id: "",
        title: "",
        startDate: new Date(),
        endDate: new Date().setDate(new Date().getDate() + 6),
        grade: "",
        class: "",
        schoolClassId: "",
        pushState: ""
      },
      list: []
    };
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.title {
  width: 100%;
  height: 30px;
  line-height: 30px;
  font-size: 20px;
  font-weight: bold;
  text-align: left;
  margin-bottom: 20px;
}
.list {
  padding-left: 28px;
}
.search-form {
  min-height: 600px;
}
.homework-detail {
  overflow: hidden;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
.homework-detail:hover {
  -webkit-line-clamp: 20;
}
</style>
