<template>
  <div class="healthStudent">
    <div class="healthStudent-content" ref="printarea">
      <h3 class="title-top">{{titleName}}</h3>
      <div class="healthStudent-table">
        <el-table :data="tableData" style="width: 100%" :max-height="tableHeight">
          <el-table-column prop="studentNo" label="学号" align="center" min-width="120px">
          </el-table-column>
          <el-table-column prop="name" label="姓名" align="center" min-width="120px">
          </el-table-column>
          <el-table-column prop="sex" label="性别" align="center" :formatter="formatter" min-width="80px">
          </el-table-column>
          <template v-for="(item,index) in columnArr">
            <el-table-column v-if="item.fieldName!='eyeEyesightLevel'&& item.fieldName!='torsoTiltAngleLevel'" :prop="item.fieldName" :label="item.label" :sortable="true" align="center" :key="index" min-width="100px">
            </el-table-column>
            <el-table-column v-else :prop="item.fieldName" :label="item.label" :sortable="true" align="center" :key="index" :formatter="formatterValue" min-width="100px">
            </el-table-column>
          </template>

          <el-table-column label="操作" align="center" min-width="130px">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-row>
      <el-col :span="24" style="text-align: center;margin-top:20px;">
        <el-button @click="exportData" type="primary" size="mini">导出</el-button>
        <el-button @click="printAction" type="primary" size="mini">打印</el-button>
      </el-col>
    </el-row>
    <el-row class="footer">
      <el-col :span="24" style="text-align: center;">
        <span>体综合体质达标标准参考</span>
        <span class="getdoc" @click="downDoc">《国家学生体质健康标准（2014修订）》</span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import request from "@/utils/request";
import { BASE_API } from "../../../../config/prod.env";
import axios from "axios";
import { getToken, isHavePermissions } from "@/utils/auth";

export default {
  name: "studentHealthStatsList",
  data() {
    return {
      columnArr: [],
      titleName: "",
      tableData: [],
      str: "",
      tableHeight: 500
    };
  },
  methods: {
    formatterValue(row, column, cellValue, index) {
      let value = cellValue;
      if (column.property == "eyeEyesightLevel") {
        switch (cellValue) {
          case 10:
            value = "视力正常";
            break;
          case 11:
            value = "轻度近视";
            break;
          case 12:
            value = "中度近视";
            break;
          case 13:
            value = "重度近视";
            break;
        }
      } else {
        switch (cellValue) {
          case 14:
            value = "阴性";
            break;
          case 15:
            value = "阳性";
            break;
          case 16:
            value = "强阳性";
            break;
        }
      }
      return value;
    },
    handleEdit(index, row) {
      this.$router.push({
        path: "/testItemDetail",
        query: {
          id: row.id,
          type:"已关联"
        }
      });
    },
    exportData() {
      let api = "api/auth/v1/physical/testItem/classDetailExport/stats";
      let params = {};
      params["schoolYearArr[0]"] = this.$route.query.schoolYear;
      params.classId = this.$route.query.classId;
      params.gradeId = this.$route.query.gradeId;
      let instance = axios.create({
        baseURL: process.env.BASE_API,
        timeout: 1000,
        headers: {
          Authorization: getToken()
        },
        responseType: "blob"
      });
      let that = this;
      instance
        .get(api, {
          params: params
        })
        .then(function(response) {
          let fileName = response.headers["content-disposition"];
          let blob = new Blob([response.data], {
            type: "application/vnd.ms-excel"
          });
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = that.titleName + "场地配置详情.xls";
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
    downDoc() {
      let routeData = this.$router.resolve({
        name: "newPageHtml",
        query: { id: "health2014" }
      });
      window.open(routeData.href, "_blank");

      /*request.get("/api/auth/v1/physical/studentStandardTemplate").then(res=>{
        console.log(res);
        window.open(res.data.url)
      })*/
    },
    formatter(row, column, cellValue, index) {
      if (cellValue == 2) {
        return "女";
      } else {
        return "男";
      }
    }
  },
  watch: {
    $route(to, from) {
      if (typeof to.params.type != "undefined" && to.params.type == "update") {
        getParamsData(this, to.params);
      }
    }
  },
  mounted() {
    getParamsData(this, this.$route.params);
  }
};
function getParamsData(vm, params) {
  let gradeId = params.gradeId;
  let classId = params.classId;
  // console.log(params);
  vm.titleName = params.titleName;
  vm.columnArr = params.searchField;
  let searchData = {
    schoolYearArr: params.schoolYear,
    gradeId,
    classId
  };
  params.searchField.forEach(element => {
    searchData[element.searchName] = element.value;
  });
  getFormData(searchData, vm);
}
function getFormData(searchData, vm) {
  request
    .get("/api/auth/v1/physical/testItem/classDetail/stats", {
      params: searchData
    })
    .then(res => {
      vm.tableData = res.data[0].phyStatsList;
      setTimeout(function() {
        vm.tableHeight = document.body.clientHeight - 110;
      }, 500);
    });
}
</script>

<style scoped lang="scss">
.healthStudent {
  position: relative;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 15px;
  position: relative;
  min-height: 580px;
  h3 {
    text-align: center;
    line-height: 32px;
  }
  .healthStudent-table {
    padding: 0px 15px;
  }
}

.footer {
  position: absolute;
  width: 100%;
  bottom: 0px;
  font-size: 12px;
  text-align: center;
  padding-top: 20px;
  margin-bottom: 10px;
  .getdoc {
    color: rgb(3, 76, 150);
    cursor: pointer;
    &:hover {
      color: #0c5cbf;
    }
  }
}
</style>
