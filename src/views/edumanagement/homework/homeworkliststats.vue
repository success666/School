<template>
  <div class="studentList_stats">
    <div class="studentList">
      <el-row class="studentList_title">
        <el-col :span="24" class="title-top">{{titleName}}</el-col>
      </el-row>
      <div class="studentList_table">
        <el-table :data="studentList" style="width:100%" ref="studentList">
          <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
          <el-table-column
            label="作业详情"
            prop="homeworkDetails"
            align="center"
            :formatter="formatter"
          ></el-table-column>
          <el-table-column label="布置日期" prop="arrangeTime" align="center" width="180"></el-table-column>
          <el-table-column label="完成日期" prop="finishTime" align="center" width="180"></el-table-column>
          <el-table-column
            label="作业反馈"
            prop="homeworkFeedback"
            align="center"
            width="150"
            :formatter="formatterBack"
          ></el-table-column>
          <el-table-column label="操作" align="center" width="100">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" size="small">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-row class="studentList_stats_btn">
        <el-col :span="24">
          <el-button @click="goBack">返回</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import request from "@/utils/request";
export default {
  data() {
    return {
      studentList: [],
      titleName: ""
    };
  },
  methods: {
    formatter(row, column, cellValue, index) {
      if (cellValue.length == 1) {
        return cellValue[0].homeworkLibName;
      } else {
        let value = [];
        for (let i = 0; i < cellValue.length; i++) {
          value.push(cellValue[i].homeworkLibName);
        }
        return value.join(";");
      }
    },
    formatterBack(row, column, cellValue, index) {
      switch (cellValue) {
        case "1":
          return "轻松过";
        case "2":
          return "刚刚好";
        case "3":
          return "太辛苦";
        case "4":
          return "未完成";
      }
    },
    handleClick(row) {
      this.$router.push({
        path: "/personalDetail",
        query: {
          ids: row.homeworkStudentId
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
        endDateStr: data.endDateStr,
        studentId: data.studentId
      };
      request
        .get("/api/auth/v1/homework/statistics/student", {
          params
        })
        .then(res => {
          this.studentList = res.data;
          this.formType = false;
        });
    }
  },
  watch: {
    $route(to, form) {
      if (to.name == "Homeworkliststats" && form.name == "Studentliststats") {
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
<style lang="scss" scoped>
.studentList_stats {
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
  .studentList_stats_btn {
    margin-top: 10px;
    text-align: center;
  }
}
</style>
<style lang="scss">
.studentList_stats {
  .el-table {
    td {
      border-bottom: 1px solid #ebeef5 !important;
    }
  }
}
</style>


