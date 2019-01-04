<template>
  <div>
    <div class="equipment-list-content">
      <div class="bottomC">
        <div class="print">
          <el-button @click="exportAction" type="primary" size="small">导出</el-button>
          <el-button @click="printAction" type="primary" size="small">打印</el-button>
          <el-button @click="handleExit" type="primary" size="small">返回</el-button>
        </div>
      </div>
      <div ref="printarea">
        <el-row class="title">
          <el-col :span="24" class="title-top">{{title}}</el-col>
        </el-row>

        <template>
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="studentNo" align="center" sortable label="学号"></el-table-column>
            <el-table-column prop="name" align="center" label="姓名"></el-table-column>
            <el-table-column prop="sex" align="center" label="性别">
              <template slot-scope="scope">
                <span>{{scope.row.sex == 1 ? '男' : '女'}}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="全部平均运动时长（min）">
              <template
                slot-scope="scope"
              >{{scope.row.duration?scope.row.duration : scope.row.sportTime || 0}}</template>

              <el-table-column
                prop="dataCalorieExpendValue"
                align="center"
                v-if="type==2"
                label="全部平均运动消耗（大卡）"
              ></el-table-column>
            </el-table-column>

            <el-table-column prop="stepNum" align="center" v-if="type==3" label="全部平均运动步数（步）"></el-table-column>

            <el-table-column prop="courseCount" align="center" label="参加体育课堂数"></el-table-column>
            <el-table-column prop="caozuo" align="center" label="操作">
              <template slot-scope="scope">
                <el-button @click="handleView(scope.index, scope.row)" size="small">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import requestYapi from "@/utils/requestyAPI";
import { formatDate, getSchoolYear } from "@/utils/index";
import Vue from "vue";
import Print from "@/utils/print";
Vue.use(Print);
import { BASE_API } from "../../../../config/prod.env";
import axios from "axios";
import { getToken } from "@/utils/auth";
export default {
  name: "classStudentList",
  data() {
    return {
      title: "广州市X小学学生详情列表",
      tableData: [],
      schoolName: "",
      schoolTypeName: "",
      schoolClassId: "",
      districtName: "",
      cityName: "",
      provinceName: "",
      startTime: "",
      endTime: "",
      type: "1",
      gradeName: "",
      className: "",
      typeStatus: ""
    };
  },
  methods: {
    init() {
      if (this.typeStatus == "interestClass") {
        let params = {
          classId: this.$route.query.schoolClassId,
          startTime: this.$route.query.startTime,
          endTime: this.$route.query.endTime
        };
        let e = this;
        e.startTime = e.$route.query.startTime;
        e.endTime = e.$route.query.endTime;
        e.type = e.$route.query.type;
        if (e.type == 1) {
          // 时长
          e.title =
            e.startTime +
            "至" +
            e.endTime +
            e.className +
            "学生体育课平均运动时长统计";
        } else if (e.type == 2) {
          // 卡路里消耗
          e.title =
            e.startTime +
            "至" +
            e.endTime +
            e.className +
            "学生体育课平均运动消耗列表";
        } else if (e.type == 3) {
          // 步数
          e.title =
            e.startTime +
            "至" +
            e.endTime +
            e.className +
            "学生体育课平均运动步数列表";
        }
        request
          .get("/api/auth/v1/course/statistics/interestClass/student", {
            params
          })
          .then(res => {
            e.tableData = res.data;
          });
      } else {
        let e = this;
        let url1 =
          "/api/auth/v1/course/statistics/sportTimeSchoolClassDetailed"; // 运动时长详细
        let url2 =
          "/api/auth/v1/course/statistics/calorieExpendSchoolClassDetailed"; // 卡路里详细
        let url3 = "/api/auth/v1/course/statistics/stepNumSchoolClassDetailed"; // 步数详细
        let url;

        // let schoolYearStart = e.schoolYear.slice(0, 4);
        // let schoolYearEnd = e.schoolYear.slice(5, 9);
        // const dictSchoolTypeGradeId = e.$route.query.dictSchoolTypeGradeId;
        // const dictGradeId = e.$route.query.dictGradeId;
        e.schoolClassId = e.$route.query.schoolClassId;
        // console.log(e.schoolClassId);
        if (e.type == 1) {
          // 时长
          url = url1;
          e.title =
            e.startTime +
            "至" +
            e.endTime +
            e.gradeName +
            e.className +
            "学生体育课平均运动时长统计";
        } else if (e.type == 2) {
          // 卡路里消耗
          url = url2;
          e.title =
            e.startTime +
            "至" +
            e.endTime +
            e.gradeName +
            e.className +
            "学生体育课平均运动消耗列表";
        } else if (e.type == 3) {
          // 步数
          url = url3;
          e.title =
            e.startTime +
            "至" +
            e.endTime +
            e.gradeName +
            e.className +
            "学生体育课平均运动步数列表";
        }
        request
          .get(url, {
            params: {
              startTime: e.startTime,
              endTime: e.endTime,
              schoolClassId: e.schoolClassId
              // dictSchoolTypeGradeId: dictSchoolTypeGradeId,
              // dictGradeId: dictGradeId
            }
          })
          .then(res => {
            // console.log(res.data);
            e.tableData = res.data;
          });
      }
    },
    handleView(index, row) {
      this.$router.push({
        path: "/lessonManagemnt/sportStats",
        query: {
          studentId: row.studentId,
          // rowData: row,
          typeStatus: this.$route.query.typeStatus || "",
          startTime: this.startTime,
          endTime: this.endTime,
          type: this.type,
          schoolClassId: this.schoolClassId,
          name: row.name
        }
      });
    },
    // 打印
    printAction() {
      this.$print(this.$refs.printarea);
    },

    // 导出
    exportAction() {
      let api1 =
        "/api/auth/v1/course/statistics/sportTimeSchoolClassDetailed/export"; // 统计运动时长详细
      let api2 =
        "/api/auth/v1/course/statistics/calorieExpendSchoolClassDetailed/export"; // 统计消耗详细（班级）
      let api3 =
        "/api/auth/v1/course/statistics/stepNumSchoolClassDetailed/export"; // 统计步数详细（班级）
      let api;
      const schoolYearStart = this.$route.query.schoolYearStart;
      const schoolYearEnd = this.$route.query.schoolYearEnd;
      let instance = axios.create({
        baseURL: process.env.BASE_API,
        timeout: 1000,
        headers: {
          Authorization: getToken()
        },
        responseType: "blob"
      });
      if (e.type == 1) {
        // 时长
        api = api1;
      } else if (e.type == 2) {
        // 消耗
        api = api2;
      } else if (e.type == 3) {
        // 步数
        api = api3;
      }
      let that = this;
      instance
        .get(api, {
          params: {
            schoolClassId: that.schoolClassId,
            schoolYearStart: schoolYearStart,
            schoolYearEnd: schoolYearEnd
          }
        })
        .then(function(response) {
          let fileName = response.headers["content-disposition"];
          let blob = new Blob([response.data], {
            type: "application/vnd.ms-excel"
          });
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = that.title + ".xls";
          link.click();
        })
        .catch(function(error) {
          if (error.response) {
            // 存在请求，但是服务器的返回一个状态码
            // console.log(error.response);
          } else {
            // 一些错误是在设置请求时触发的
            // console.log("Error", error.message);
          }
          // console.log(error.config);
        });
    },
    handleExit() {
      this.$router.go(-1);
    }
  },
  watch: {
    $route(to, from) {
      if (
        to.name == "classStudentList" &&
        typeof to.query.typeStatus != "undefined"
      ) {
        this.startTime = this.$route.query.startTime;
        this.typeStatus = this.$route.query.typeStatus;
        this.endTime = this.$route.query.endTime;
        this.schoolClassId = this.$route.query.schoolClassId;
        this.type = this.$route.query.type;
        this.gradeName = this.$route.query.gradeName;
        this.className = this.$route.query.className;
        this.init();
      }
    }
  },
  mounted() {
    this.startTime = this.$route.query.startTime;
    this.typeStatus = this.$route.query.typeStatus;
    this.endTime = this.$route.query.endTime;
    this.schoolClassId = this.$route.query.schoolClassId;
    this.type = this.$route.query.type;
    this.gradeName = this.$route.query.gradeName;
    this.className = this.$route.query.className;
    var schoolYearOptions = getSchoolYear();
    if (!this.schoolYear) {
      this.schoolYear = schoolYearOptions[schoolYearOptions.length - 1].value;
    }
    this.init();
  }
};
</script>

<style scoped>
.equipment-list-content {
  background-color: white;
  border-radius: 10px;
  padding: 25px;
  margin-top: 10px;
}
.bottomC {
  margin: 10px;
  text-align: right;
  width: 93%;
}
.title {
  text-align: center;
  font-weight: 600;
  line-height: 70px;
  font-size: 18px;
}
.point {
  color: #1e9fff;
  cursor: pointer;
}
</style>
