<template>
  <div
    class="homeStudentList"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
  >
    <div class="homeworkList">
      <h3 class="homeworkList_title title-top">{{titleName}}</h3>
      <div class="homeworkList_table">
        <el-table :data="homeworkList" style="width:100%" ref="homeworkList">
          <el-table-column label="学号" prop="studentNo" align="center"></el-table-column>
          <el-table-column label="姓名" prop="studentName" align="center"></el-table-column>
          <el-table-column label="性别" prop="sex" align="center"></el-table-column>
          <el-table-column label="疾病" prop="disease" align="center"></el-table-column>
          <el-table-column label="完成作业（份）" prop="finishCount" align="center" width="150"></el-table-column>
          <el-table-column label="作业完成率" prop="finishRate" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="100">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" size="small">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-row class="homeworkList_btn">
      <el-col :span="24">
        <el-button @click="goBack">返回</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import request from "@/utils/request";
export default {
  data() {
    return {
      homeworkList: [],
      titleName: "",
      loading: true
    };
  },
  methods: {
    handleClick(row) {
      this.$router.push({
        name: "Homeworkliststats",
        params: {
          titleName: row.studentName,
          startDateStr: this.$route.params.startDateStr,
          endDateStr: this.$route.params.endDateStr,
          studentId: row.studentId
        }
      });
    },
    goBack() {
      this.$router.back(-1);
    },
    getFormData(data) {
      this.titleName = data.titleName;
      let params = {
        startDateStr: data.startDateStr,
        endDateStr: data.endDateStr
      };
      if (data.classType == 1) {
        params.schoolClassId = data.schoolClassId;
        request
          .get("/api/auth/v1/homework/statistics/class", {
            params
          })
          .then(res => {
            this.loading = false;
            this.homeworkList = res.data;
          });
      } else {
        params.interestId = data.id;
        request
          .get("api/auth/v1/homework/statistics/interest-class", {
            params
          })
          .then(res => {
            this.loading = false;
            this.homeworkList = res.data;
          });
      }
    }
  },
  watch: {
    $route(to, form) {
      if (form.name == "HomeworkStats" && to.name == "Studentliststats") {
        if (JSON.stringify(to.params) != "{}") {
          this.getFormData(to.params);
        }
      }
    }
  },
  mounted() {
    this.getFormData(this.$route.params);
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.homeStudentList {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 15px;
  position: relative;
  min-height: 600px;
  .homeworkList_table {
    width: 800px;
    margin: auto;
  }
  .homeworkList_title {
    text-align: center;
  }
  .homeworkList_btn {
    text-align: center;
    margin-top: 20px;
  }
}
</style>
<style lang="scss">
.homeworkList_table {
  .el-table {
    td {
      border-bottom: 1px solid #ebeef5 !important;
    }
  }
}
</style>


