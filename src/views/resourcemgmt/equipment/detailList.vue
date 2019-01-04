<template>
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
        <el-col :span="24" class="title-top">{{title}}器材配置详情</el-col>
      </el-row>

      <section>
        <template>
          <el-table
            :data="tableData"
            style="width: 1000px;margin:0 auto;">
            <el-table-column
              prop="equipmentName"
              align="center"
              label="名称">
            </el-table-column>
            <el-table-column
              prop="unit"
              align="center"
              label="单位">
            </el-table-column>
            <el-table-column
              prop="standardConfigQuantity"
              align="center"
              label="达标值">
            </el-table-column>
            <el-table-column
              prop="actualConfigQuantity"
              align="center"
              label="实际数量">
            </el-table-column>
            <el-table-column
              prop="isStandard"
              align="center"
              sortable
              label="是否达标">
              <!--<template slot-scope="scope">-->
                <!--<span>{{scope.row.isStandard===1 ? '是' : '否'}}</span>-->
              <!--</template>-->
            </el-table-column>
          </el-table>

        </template>
      </section>

    </div>
  </div>
</template>

<script>
  import request from '@/utils/request'
  import { getSchoolYear } from '@/utils/index'
  import Vue from 'vue'
  import Print from '@/utils/print'
  Vue.use(Print)
  import { BASE_API } from "../../../../config/prod.env";
  import axios from "axios";
  import { getToken } from "@/utils/auth";

  export default {
    name: 'detailList',
    data() {
      return {
        title: '',
        tableData: [],
        schoolYearOptions: [],
        schoolName: '',
        schoolTypeName: '',
        districtName: '',
        cityName: '',
        provinceName: ''
      }
    },
    methods: {
      init() {
        const schoolYearStart = this.$route.query.schoolYearStart;
        const schoolYearEnd = this.$route.query.schoolYearEnd;
        // this.title = this.$route.query.title;
        // console.log(this.title);
        request.get('/api/auth/v1/equipment/statistics/detail', {
          params: {
            schoolYearStart: schoolYearStart,
            schoolYearEnd: schoolYearEnd,
            schoolId: this.schoolId || ''
          }
        }).then((res) => {
          this.tableData = res.data.schoolEquipmentDetailList;
          this.title = res.data.schoolYearStart +'-'+ res.data.schoolYearEnd + '学年' + res.data.schoolName;
        })
      },
      // // 打印
      printAction() {
        this.$print(this.$refs.printarea)
      },

      // 导出
      exportAction() {
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
      let that = this;
      instance
        .get('/api/auth/v1/equipment/statistics/detail/export', {
          params: {
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
          link.download = that.title + "器材配置详情.xls";
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
      this.schoolYearOptions = getSchoolYear();
      if (!this.schoolYear) {
        // this.schoolYear = this.schoolYearOptions[this.schoolYearOptions.length - 1].value
        this.schoolYear = this.schoolYearOptions[0].value
      }
      this.init();
    }
  }
</script>

<style scoped>
  .equipment-list-content {
    background-color: white;
    border-radius: 10px;
    padding: 25px;
    margin-top: 10px;
  }
  .bottomC{
    margin: 10px;
    text-align: right;
    width: 93%
  }
  .title{
    text-align: center;
    font-weight: 600;
    line-height: 70px;
    font-size: 18px;
  }
  .point{
    color: #1e9fff;
    cursor: pointer;
  }
</style>
