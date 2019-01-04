<template>
  <div>
    <div class="equipment-list-content" 
    v-loading="loading"
    element-loading-text="正在加载中">
      <h2 class="title-top">{{schoolYear}}学年度{{title}}{{gradeName}}{{className}}学生详情列表</h2>
      <section>
        <div ref="printarea">
          <template>
            <el-table :data="tableData" stripe style="width: 100%">
              <el-table-column prop="name" label="姓名" align="center"></el-table-column>
              <el-table-column prop="sex" label="性别" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.sex === 1 ? '男' : '女'}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="studentNo" label="行政班学号" align="center"></el-table-column>
              <el-table-column prop="status" label="行政班学籍状态" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.status === 1 ? '在本班' : '不在本班'}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="identityNo" label="身份证/国外护照号" align="center"></el-table-column>
              <el-table-column prop="address" label="操作" align="center">
                <template slot-scope="scope">
                  <el-button size="mini" @click="handleView(scope.$index, scope.row)">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </div>

        <div class="bottomC">
          <div class="print">
            <el-button @click="exportAction" type="primary" size="small">导出</el-button>
            <el-button @click="printAction" type="primary" size="small">打印</el-button>
            <el-button @click="handleExit" type="primary" size="small">返回</el-button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import { getSchoolYear } from "@/utils/index";
import { BASE_API } from "../../../../config/prod.env";
import axios from "axios";
import { getToken } from "@/utils/auth";
export default {
  name: "studentList",
  data() {
    return {
      loading:true,
      title: "广州市X小学学生详情列表",
      tableData: [],
      schoolYear: "",
      schoolYearOptions: [],
      schoolName: "",
      gradeName: "",
      className: ""
    };
  },
  methods: {
    init() {
      this.loading=true;
      const schoolYear = this.$route.query.schoolYear;
      const gradeId = this.$route.query.gradeId;
      const classId = this.$route.query.classId;
      // console.log('classId', classId);
      request
        .get("/api/auth/v1/resourceMgmt/student/stats/class", {
          params: {
            schoolYear: schoolYear,
            gradeId: gradeId,
            classId: classId
          }
        })
        .then(res => {
          this.loading=false
          // console.log(res.data);
          this.tableData = res.data;
        }).catch(()=>{
          this.loading=false;
        });
    },
    handleView(index, row) {
      request.get("api/auth/v1/physical/testItem/getTestItemId",{
        params:{
          schoolClassId:row.schoolClassId,
          studentId:row.studentId
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
      console.log(row);
      return;
      this.$router.push({
        path: "physicalDetail",
        query: { id: row.id, type: "已关联" }
      });
    },
    // 打印
    printAction() {
      // this.$print(this.$refs.printarea)
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
    // 导出
    // exportAction() {
    //   let student = this.$route.query.student;
    //   request.get('/api/auth/v1/resourceMgmt/student/stats/class/export',{
    //     params: student
    //   }).then((res) => {
    //     console.log("导出",res);
    //     // window.location.href = res.data;
    //   })
    // },
    // 导出
    exportAction() {
      const schoolYear = this.$route.query.schoolYear;
      const gradeId = this.$route.query.gradeId;
      const classId = this.$route.query.classId;
      let api = "/api/auth/v1/resourceMgmt/student/stats/class/export";
      let instance = axios.create({
        baseURL: process.env.BASE_API,
        timeout: 1000,
        headers: {
          Authorization: getToken()
        },
        responseType: "blob"
      });
      let params = {
        schoolYear: schoolYear,
        gradeId: gradeId,
        classId: classId
      };
      let that = this;
      instance
        .get(api, params)
        .then(function(response) {
          let fileName = response.headers["content-disposition"];
          let blob = new Blob([response.data], {
            type: "application/vnd.ms-excel"
          });
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = that.title + "学生详情.xls";
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
    },
    handleExit() {
      this.$router.go(-1);
    }
  },
  mounted() {
    this.title = this.$route.query.title;
    this.gradeName = this.$route.query.gradeName;
    this.className = this.$route.query.className;
    this.schoolYearOptions = getSchoolYear();
    // console.log(this.schoolYearOptions);
    if (!this.schoolYear) {
      // this.schoolYear = this.schoolYearOptions[this.schoolYearOptions.length - 1].value
      this.schoolYear = this.schoolYearOptions[0].value;
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
  position: relative;
}
.charts_title {
  line-height: 30px;
  text-align: center;
  font-size: 20px;
  color: #333;
  font-weight: 600;
  margin: 20px 0 50px;
}
.bottomC {
  margin-top: 20px;
  text-align: right;
  width: 90%;
}
</style>
