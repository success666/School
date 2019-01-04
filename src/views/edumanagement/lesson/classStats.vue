<template>
  <div>
    <el-radio-group v-model="routerModel" @change="modelRouter" style="margin-bottom: 10px;">
      <el-radio-button label="1">课堂表现管理</el-radio-button>
      <el-radio-button label="2">课堂表现统计</el-radio-button>
    </el-radio-group>
    <div class="search-form">
      <el-form :inline="true" :model="lesson" class="" style="font-size: 16px">
        <el-form-item label="年级：">
          <el-select v-model="lesson.dictGradeId" placeholder="请选择" size="mini" @change="changeGrade" style="width: 110px;">
            <el-option label="全部" value=''>全部</el-option>
            <el-option v-for="(item, index) in gradeOptions" :key="index" :label="item.gradeName" :value="item.gradeId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间" class="item-dispIb">
          <el-date-picker type="date" size="small" placeholder="选择开始日期" :picker-options="pickerOptions" v-model="lesson.startTime.value" value-format="yyyy-MM-dd" @change="changeDate($event,'startTime')" style="width: 150px;"></el-date-picker>
          <span>至</span>
          <el-date-picker type="date" size="small" placeholder="选择最后日期" :picker-options="pickerOptions" v-model="lesson.endTime.value" value-format="yyyy-MM-dd" @change="changeDate($event,'endTime')" style="width: 150px;"></el-date-picker>
        </el-form-item>
        <el-form-item label="">
          <el-radio-group v-model="lesson.radio" @change="changRadio">
            <el-radio label="1">近两周</el-radio>
            <el-radio label="2">近一个月</el-radio>
            <el-radio label="3">近三个月</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="指标：">
          <el-select placeholder="请选择" size="mini" v-model="lesson.type" style="width: 135px;">
            <el-option label="平均运动时长" value="1"></el-option>
            <el-option label="平均运动消耗" value="2"></el-option>
            <el-option label="平均运动步数" value="3"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item style="margin-right: 40px;">
          <el-button type="primary" @click="search(1)" class="btn" size="mini">查询</el-button>
          <el-button type="primary" @click="resetForm" class="btn" size="mini">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="list">
      <section>
        <div v-show="isStats">
          <h2 class="title-top">{{title}}
            <el-popover class="titlemessage" placement="right" width="280" trigger="click">
              <div class="titlemessage">
                <div>{{iconTitle}}</div>
              </div>
              <span slot="reference" class="shuoming">?</span>
            </el-popover>
          </h2>
          <div style="height:500px;max-width:1100px;margin: 0 auto;position: relative;">
            <el-popover class="shaixuan" placement="left" width="400" trigger="click">
              <template v-for="(n) in screen">
                <!-- `checked` 为 true 或 false -->
                <el-checkbox :key="n.name" v-model="n.isSelect" true-label="true" false-label="false" @change="screenChange">{{ n.name }}</el-checkbox>
              </template>
              <el-button class="chartsBtn" slot="reference" type="primary" size="mini">筛选</el-button>
            </el-popover>
            <div id="charts-left" ref="leftChart" style="width: 20%;height:400px;float:left;"></div>
            <div id="charts-right" ref="rightChart" style="width: 80%;height:400px;float:right;"></div>

          </div>
        </div>
        <!-- 表格 -->
        <div class="table" v-show="!isStats" ref="printarea">
          <h2 class="title-top" style="    margin-bottom: 49px;">{{title}}
            <el-popover class="titlemessage" placement="right" width="280" trigger="click">
              <div class="titlemessage">
                <div>{{iconTitle}}</div>
              </div>
              <span slot="reference" class="shuoming">?</span>
            </el-popover>
          </h2>
          <el-popover class="shaixuan1" placement="left" width="400" trigger="click">
            <template v-for="(n) in screen">
              <!-- `checked` 为 true 或 false -->
              <el-checkbox :key="n.name" v-model="n.isSelect" true-label="true" false-label="false" @change="screenChange">{{ n.name }}</el-checkbox>
            </template>
            <el-button class="chartsBtn1" slot="reference" type="primary" size="mini">筛选</el-button>
          </el-popover>
          <template>
            <el-table :data="tableData" stripe style="width:960px;margin:0 auto;" @cell-click="cellClick">

              <el-table-column
                align="center"
                class-name="tableData_cell" width="200"
                label="区域">
                <template slot-scope="scope">
                  {{scope.row.gradeName || scope.row.classType || scope.row.schoolClassName || scope.row.name}}
                </template>
              </el-table-column>
           
              <el-table-column
                v-if="lesson.type == 1"
                align="center"
                class-name="tableData_cell" width="250"
                label="全部平均运动时长(min)">
                <template slot-scope="scope">
                  {{scope.row.duration || scope.row.sportTime || 0}}
                </template>
              </el-table-column>

              <el-table-column
                v-if="lesson.type == 1"
                align="center"
                class-name="tableData_cell" width="250"
                label="男生平均运动时长(min)">
                <template slot-scope="scope">
                  {{scope.row.maleDuration || scope.row.manSportTime || 0}}
                </template>
              </el-table-column>

              <el-table-column
                v-if="lesson.type == 1"
                align="center"
                class-name="tableData_cell" width="250"
                label="女生平均运动时长(min)">
                <template slot-scope="scope">
                  {{scope.row.maleDuration || scope.row.girlSportTime || 0}}
                </template>
              </el-table-column>

              <el-table-column
                v-if="lesson.type == 2"
                align="center"
                class-name="tableData_cell" width="250"
                label="全部平均运动消耗(大卡)">
                <template slot-scope="scope">
                  {{scope.row.cal || scope.row.calorieExpendValue || 0}}
                </template>
              </el-table-column>

              <el-table-column
                v-if="lesson.type == 2"
                align="center"
                class-name="tableData_cell" width="250"
                label="男生平均运动消耗(大卡)">
                <template slot-scope="scope">
                  {{scope.row.maleCal || scope.row.manCalorieExpendValue || 0}}
                </template>
              </el-table-column>

              <el-table-column
                v-if="lesson.type == 2"
                align="center"
                class-name="tableData_cell" width="250"
                label="女生平均运动消耗(大卡)">
                <template slot-scope="scope">
                  {{scope.row.femaleCal || scope.row.girlCalorieExpendValue || 0}}
                </template>
              </el-table-column>

              <el-table-column
                v-if="lesson.type == 3"
                align="center"
                class-name="tableData_cell" width="250"
                label="全部平均运动步数(步)">
                <template slot-scope="scope">
                  {{scope.row.steps || scope.row.stepNum || 0}}
                </template>
              </el-table-column>

              <el-table-column
                v-if="lesson.type == 3"
                align="center"
                class-name="tableData_cell" width="250"
                label="男生平均运动步数(步)">
                <template slot-scope="scope">
                  {{scope.row.maleSteps || scope.row.manStepNum || 0}}
                </template>
              </el-table-column>

              <el-table-column
                v-if="lesson.type == 3"
                align="center"
                class-name="tableData_cell" width="250"
                label="女生平均运动步数(步)">
                <template slot-scope="scope">
                  {{scope.row.femaleSteps || scope.row.girlStepNum || 0}}
                </template>
              </el-table-column>

            </el-table>
          </template>
        </div>
        <div class="bottomC" v-show="!isStats">
          <div class="print">
            <el-button @click="exportAction" type="primary" size="small">导出</el-button>
            <el-button @click="printAction" type="primary" size="small">打印</el-button>
          </div>
        </div>
        <div class="change_type tj">
          <el-button :type="btnStyT" size="small" @click="dataShow(true)">图表统计</el-button>
        </div>
        <div class="change_type sj">
          <el-button :type="btnStyD" size="small" @click="dataShow(false)">数据详情</el-button>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import requestYapi from "@/utils/requestyAPI";
import Vue from "vue";
import echarts from "echarts";
import Print from "@/utils/print";
import { BASE_API } from "../../../../config/prod.env";
import axios from "axios";
import { getToken } from "@/utils/auth";

Vue.use(Print);

export default {
  name: "classStats",
  data() {
    return {
      leftName:'',
      typeStatus:'',
      fromData: {},
      title: "",
      schoolId: "",
      schoolName: "",
      gradeName: "",
      className: "",
      schoolTypeName: "",
      iconTitle: "",
      schoolClassId: "",
      routerModel: 2,
      // oldData: {},
      gradeOptions: [],
      tableData: [],
      checkedChart: [],
      chartArr: [],
      visible: false,
      isClass:false,
      lesson: {
        dictSchoolTypeGradeId: "",
        startTime: { value: "" },
        endTime: { value: "" },
        dictGradeId: "",
        status:'1',
        type: "1",
        radio: "",
        label: "平均运动时长"
      },
    
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      counts: {
        title: ""
      },
      // 图表1 图表2
      leftChart: "",
      rightChart: "",
      isStats: true,
      btnStyT: "primary",
      btnStyD: "",
      filters: [],
      screen: {}
    };
  },
  methods: {
    cellClick(row, column, cell, event) {
      // console.log(row,column,cell,event)
      if(row.classType == '行政班'){
        this.getFromData();
      }else if(row.classType == '兴趣班'){
        this.getInterestClass();
      }

      if(row.gradeName && row.gradeName.indexOf('年')>=0){
        this.gradeName =row.gradeName;
        this.lesson.dictGradeId = row.dictGradeId;
        this.lesson.dictSchoolTypeGradeId = row.dictSchoolTypeGradeId;
        this.getFromData();
      }
     
      if (row.schoolClassName && row.schoolClassName.indexOf('班')>=0 || row.name && row.name.indexOf('班')>=0) {
        this.schoolClassId=row.schoolClassId;
        this.$router.push({
          path: "classStudentList",
          query: {
            startTime: this.lesson.startTime.value,
            endTime: this.lesson.endTime.value,
            type: this.lesson.type,
            schoolClassId: this.schoolClassId || row.classId,
            typeStatus:this.typeStatus,
            gradeName: this.gradeName || '',
            className: row.name || this.className || ''
          }
        });
      }
    
    },
    getGradeId() {
      // 获取年级
      request.get("api/auth/v1/school/grade").then(res => {
        // let allArr = [{ gradeId: 0, gradeName: '全部' }];
        // this.gradeOptions = allArr.concat(res.data);
        this.gradeOptions = res.data;
      });
    },
    changeGrade() {
      // 遍历获取dictSchoolTypeGradeId
      if (this.lesson.dictGradeId === "") {
        this.lesson.dictSchoolTypeGradeId = "";
        this.gradeName = "全部";
      } else {
        for (var i = 0; i < this.gradeOptions.length; i++) {
          if (this.gradeOptions[i].gradeId === this.lesson.dictGradeId) {
            this.lesson.dictSchoolTypeGradeId = this.gradeOptions[i].id;
            this.gradeName = this.gradeOptions[i].gradeName;
          }
        }
      }
    },
    search(index, row) {
      if (!this.lesson.startTime.value || !this.lesson.endTime.value) {
        this.$message.error("请选择日期范围进行查询");
        return;
      }
      let dateBoolean = this.parseDate(
        this.lesson.startTime.value,
        this.lesson.endTime.value
      );
      if (!dateBoolean) return;
      if(this.lesson.dictGradeId != ''){
        this.getFromData();
      }else{
        this.getType();
      }
    },
    getType(){
      this.leftName = '全校'
      let params = {
        startTime: this.lesson.startTime.value,
        endTime: this.lesson.endTime.value
      };
      request.get('/api/auth/v1/course/statistics/school',{params}).then(res => {
        this.typeStatus = '';
        this.isClass = false;

        this.counts.title = res.data.school.name;
        // console.log('res',res);
          this.fromData = res.data;
          this.getScreen();
          let rightData = parseFromData(this);
          this.title =
            this.lesson.startTime.value +
            "至" +
            this.lesson.endTime.value +
            this.counts.title +
            "全部学生" +
            this.lesson.label +
            "统计";
          this.tableData = rightData.tableData;
          // console.log('type',this.tableData)
          this.iconTitle = rightData.iconTitle;
          createdLeftCharts(this);
          createdRigthCharts(this, rightData);
      });
    },
    getInterestClass(){ 
      this.leftName = '兴趣班';
      this.typeStatus = '';
      let params = {
        startTime: this.lesson.startTime.value,
        endTime: this.lesson.endTime.value
      };
      request.get('/api/auth/v1/course/statistics/interestClass',{params}).then(res => {
        this.isClass = true;
        this.typeStatus = 'interestClass'
         
          this.fromData = res.data;
          console.log(res);
          this.getScreen();
          let rightData = parseFromData(this);
          this.title =
            this.lesson.startTime.value +
            "至" +
            this.lesson.endTime.value +
            this.counts.title +
            "兴趣班学生" +
            this.lesson.label +
            "统计";
          this.tableData = rightData.tableData;
          // console.log('getInterestClass',this.tableData)
          this.iconTitle = rightData.iconTitle;
          createdLeftCharts(this);
          createdRigthCharts(this, rightData);
      });
    },
    getFromData() {
      let api, params;
      this.typeStatus = ''
      if (this.lesson.dictGradeId !== "") {
        this.leftName = ''
        this.isClass = true;
        api = "/api/auth/v1/course/statistics/schoolClass";
        params = {
          dictSchoolTypeGradeId: this.lesson.dictSchoolTypeGradeId,
          dictGradeId: this.lesson.dictGradeId,
          startTime: this.lesson.startTime.value,
          endTime: this.lesson.endTime.value
        };
      } else {
        this.leftName = '行政班'
        this.isClass = false;
        this.gradeName = "";
        this.className = "";
        this.lesson.dictGradeId = "";
        api = "/api/auth/v1/course/statistics/grade";
        params = {
          startTime: this.lesson.startTime.value,
          endTime: this.lesson.endTime.value
        };
      }
      request
        .get(api, {
          params
        })
        .then(res => {
          this.typeStatus = ''
          if (!this.isClass) {
            this.counts.title = res.data.schoolArea.name;
          }
          this.fromData = res.data;
          this.getScreen();
          let rightData = parseFromData(this);
          this.title =
            this.lesson.startTime.value +
            "至" +
            this.lesson.endTime.value +
            this.counts.title + this.leftName +
            this.gradeName +
            this.className +
            "学生" +
            this.lesson.label +
            "统计";
          this.tableData = rightData.tableData;
          // console.log('getFromData',this.tableData)
          this.iconTitle = rightData.iconTitle;
          createdLeftCharts(this);
          createdRigthCharts(this, rightData);
        });
    },
    formatterValue(row, column, cellValue, index) {
      let value = cellValue || 0;
      return value;
    },
    screenChange() {
      let rightData = parseFromData(this);
      this.tableData = rightData.tableData;
      // console.log('rightData',rightData);
      createdRigthCharts(this, rightData);
    },
    getScreen() {
      let rightData =
        this.fromData.stsSchool ||
        this.fromData.stsClass ||
        this.fromData.statisticsCalorieExpendBeanList ||
        this.fromData.sportTimeCalorieExpendStepNumSchoolClassBeanList;
      this.screen = {};
      rightData.forEach(item => {
        if(item.classType){
          if(item.classType == 1){
            item.classType = '行政班'
          }else{
            item.classType = '兴趣班'
          }
        }
        let name = item.gradeName || item.schoolClassName || item.name || item.classType;
        if(name == undefined){
          name = '乞丐班';
        }
        // console.log('name',name);
        this.screen[name] = { isSelect: "true", name: name };
        // console.log(this.screen);
      });
    },
    // 跳转到班级学生详情
    goClassStudentList(row) {
      this.schoolClassId = row.schoolClassId;
      if (
        row.sportTime == null &&
        row.stepNum == null &&
        row.calorieExpendValue == null
      ) {
        // console.log("没有数据");
      } else {
        this.$router.push({
          path: "classStudentList",
          query: {
            startTime: this.lesson.startTime.value,
            endTime: this.lesson.endTime.value,
            schoolClassId: this.schoolClassId,
            type: this.lesson.type,
            gradeName: this.gradeName,
            className: this.className
          }
        });
      }
    },

    // 日期选择
    changRadio(value) {
      this.lesson.endTime.value = this.getDay(0);
      switch (value) {
        case "1":
          this.lesson.startTime.value = this.getDay(-14);
          break;
        case "2":
          this.lesson.startTime.value = this.getDay(-30);
          break;
        case "3":
          this.lesson.startTime.value = this.getDay(-90);
          break;
        case "4":
          this.lesson.startTime.value = this.getDay(-7);
      }
    },
    getDay(day) {
      var today = new Date();
      var num = today.getTime();
      var targetday_milliseconds = 86400000 * day + num;
      today.setTime(targetday_milliseconds); // 注意，这行是关键代码
      var tYear = today.getFullYear();
      var tMonth = today.getMonth();
      var tDate = today.getDate();
      tMonth = this.doHandleMonth(tMonth + 1);
      tDate = this.doHandleMonth(tDate);
      return tYear + "-" + tMonth + "-" + tDate;
    },
    doHandleMonth(month) {
      var m = month;
      if (month.toString().length == 1) {
        m = "0" + month;
      }
      return m;
    },
    changeDate(value, type) {
      this.lesson.radio = "";
      if (type == "startTime") {
        if (this.lesson.endTime.value) {
          if (
            new Date(Date.parse(value)) >
            new Date(Date.parse(this.lesson.endTime.value))
          ) {
            this.$message.error("开始日期不能大于结束日期");
            this.lesson.startTime.value = this.lesson.endTime.value;
          }
        }
      } else {
        if (this.lesson.startTime.value) {
          if (
            new Date(Date.parse(this.lesson.startTime.value)) >
            new Date(Date.parse(value))
          ) {
            this.$message.error("开始日期不能大于结束日期");
            this.lesson.endTime.value = this.lesson.startTime.value;
          }
        }
      }
    },
    // 验证是否同一学年
    parseDate(startDate, endDate) {
      let vm = this;
      if (Date.parse(startDate) - Date.parse(endDate) > 0) {
        vm.$message.error("查询的开始日期不能大于结束日期");
        return;
      }
      let boundaryDate = startDate.split("-")[0] + "-09-01"; // 2018-09-01        // 大于当年的8月1号，那么就是下个学年
      if (Date.parse(startDate) - Date.parse(boundaryDate) >= 0) {
        // 如果开始时间大于 或者等于 2018-09-01
        let boundaryDate_end = Number(startDate.split("-")[0]) + 1; // 2019
        let boundaryDate_end1 = Number(startDate.split("-")[0]) + 1; // 2019
        boundaryDate_end = boundaryDate_end + "-08-31"; // 2019-08-31
        if (Date.parse(endDate) - Date.parse(boundaryDate_end) > 0) {
          vm.$message.error(
            "查询时候不能跨学年查询,结束日期不能大于" +
              boundaryDate_end1 +
              "年8月31日."
          );
          return false;
        }
      } else {
        // 如果开始时间小于2018-09-01
        let boundaryDate_end = Number(startDate.split("-")[0]) + "-08-31"; // 2018-08-31
        if (Date.parse(endDate) - Date.parse(boundaryDate_end) > 0) {
          vm.$message.error(
            "查询时候不能跨学年查询,结束日期不能大于" +
              startDate.split("-")[0] +
              "年8月31日。"
          );
          return false;
        }
      }
      return true;
    },
    // 路由跳转
    modelRouter() {
      this.$router.push("/lessonManagemnt");
      this.routerModel = "2";
    },

    resetForm() {
      // 重置
      this.lesson.dictSchoolTypeGradeId = "";
      this.lesson.radio = "";
      this.lesson.dictGradeId = "";
      this.typeStatus = '';
      this.isClass = false;
      this.changRadio("4");
    },
    dataShow(flag) {
      this.isStats = flag;
      if (flag === true) {
        this.btnStyT = "primary";
        this.btnStyD = "";
      } else {
        this.btnStyT = "";
        this.btnStyD = "primary";
      }
    },

    // 打印
    printAction() {
      this.$print(this.$refs.printarea);
    },
    // 导出
    exportAction() {
      const schoolYearStart = this.$route.query.schoolYearStart;
      const schoolYearEnd = this.$route.query.schoolYearEnd;
      let api1 = "/api/auth/v1/course/statistics/grade/export"; // 全部年级
      let api2 = "/api/auth/v1/course/statistics/schoolClass/extport"; // 时长卡路里步数（全部班级）
      let instance = axios.create({
        baseURL: process.env.BASE_API,
        timeout: 1000,
        headers: {
          Authorization: getToken()
        },
        responseType: "blob"
      });
      let params = {};
      let api;
      if (this.lesson.dictSchoolTypeGradeId) {
        api = api2;
        params = {
          dictSchoolTypeGradeId: this.lesson.dictSchoolTypeGradeId,
          schoolId: this.schoolId,
          startTime: this.lesson.startTime.value,
          endTime: this.lesson.endTime.value
        };
      } else {
        api = api1;
        params = {
          schoolId: this.schoolId,
          startTime: this.lesson.startTime.value,
          endTime: this.lesson.endTime.value
        };
      }
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
          link.download = that.counts.title + "课堂统计详情.xls";
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
    }
  },
  mounted() {
    this.leftChart = echarts.init(this.$refs.leftChart);
    this.rightChart = echarts.init(this.$refs.rightChart);
    this.changRadio("4"); // 当前日期
    this.getGradeId(); // 全部年级
    // this.lesson.dictGradeId = "";
    // this.getFromData(); // 全部年级的数据
    this.typeStatus = '';
    this.isClass = false;
    this.getType();
  }
};
function parseFromData(vm) {
  let fromData = {
    girlData: [],
    manData: [],
    allData: [],
    tableData: [],
    yName: "",
    xName: [],
    iconTitle: ""
  };
  let rightData =
    //兴趣班
    vm.fromData.stsSchool ||
    vm.fromData.stsClass || 
    vm.fromData.statisticsCalorieExpendBeanList ||
    vm.fromData.sportTimeCalorieExpendStepNumSchoolClassBeanList;
  vm.filters = [];
 
  // console.log('rightData',rightData);
  rightData.forEach(item => {
    // console.log('item',item);
    //兴趣班
    let name = item.gradeName || item.schoolClassName || item.classType || item.name || '乞丐班';
    // console.log('2345',name);
    let screen = vm.screen[name];
    if (screen.isSelect == "true") {
      fromData.tableData.push(item);
      //兴趣班
      fromData.xName.push(item.gradeName || item.schoolClassName || item.classType || item.name || '乞丐班');
      switch (vm.lesson.type) {
        case "1":
          vm.lesson.label = "平均运动时长";
          fromData.girlData.push(item.girlSportTime || item.femaleDuration || 0);
          fromData.manData.push(item.manSportTime || item.maleDuration || 0);
          fromData.allData.push(item.sportTime || item.duration || 0);
          fromData.yName = "时长（min）";
          fromData.iconTitle =
            "统计说明：\n" +
            "所选区域学生平均运动时长=全部单个学生平均运动时长总和/学生数\n" +
            "单个学生平均运动时长=单个学生运动总时长/单个学生参加的体育课堂数";
          break;
        case "2":
          vm.lesson.label = "平均运动消耗";
          fromData.girlData.push(item.girlCalorieExpendValue || item.femaleCal || 0);
          fromData.manData.push(item.manCalorieExpendValue || item.maleCal || 0);
          fromData.allData.push(item.calorieExpendValue || item.cal || 0);
          fromData.yName = "消耗（大卡）";
          fromData.iconTitle =
            "统计说明：\n" +
            "所选区域学生平均运动消耗=全部单个学生平均运动消耗总和/学生数\n" +
            "单个学生平均运动消耗=单个学生运动总消耗/单个学生参加的体育课堂数";
          break;
        case "3":
          vm.lesson.label = "平均运动步数";
          fromData.girlData.push(item.girlStepNum || item.femaleSteps || 0);
          fromData.manData.push(item.manStepNum || item.maleSteps || 0);
          fromData.allData.push(item.stepNum || item.steps || 0);
          fromData.yName = "步数（步）";
          fromData.iconTitle =
            "统计说明：\n" +
            "所选区域学生平均运动步数=全部单个学生平均运动步数总和/学生数\n" +
            "单个学生平均运动步数=单个学生运动总步数/单个学生参加的体育课堂数";
          break;
      }
    }
  });
  return fromData;
}
function createdLeftCharts(vm) {
  let xNama = "",
    gridData = [],
    manData = [],
    allData = [],
    yName;
  if (vm.leftName.length) {
    xNama = vm.leftName;
  } else {
    xNama = vm.gradeOptions.find(item => {
      return item.gradeId == vm.lesson.dictGradeId;
    }).gradeName;
  }
  let leftData =
    vm.fromData.sts || 
    vm.fromData.stsBean ||
    vm.fromData.statisticsDataSchoolClassBeanList ||
    vm.fromData.statisticsCalorieExpendSchoolBean ||
    vm.fromData.statisticsCalorieExpendGradeBean;

    // console.log('leftData',leftData);
    
  switch (vm.lesson.type) {
    case "1":
      gridData = parseNum(leftData.girlSportTime, 1) || parseNum(leftData.femaleDuration, 1) || 0;
      manData = parseNum(leftData.manSportTime, 1) || parseNum(leftData.maleDuration, 1) || 0;
      allData = parseNum(leftData.sportTime, 1) || parseNum(leftData.duration, 1) ||  0;
      yName = "时长（min）";
      break;
    case "2":
      gridData = parseNum(leftData.girlCalorieExpendValue, 1) || parseNum(leftData.femaleCal, 1) || 0;
      manData = parseNum(leftData.manCalorieExpendValue, 1) || parseNum(leftData.maleCal, 1) || 0;
      allData = parseNum(leftData.calorieExpendValue, 1) || parseNum(leftData.cal, 1) || 0;
      yName = "消耗（大卡）";
      break;
    case "3":
      gridData = leftData.girlStepNum || leftData.femaleSteps || 0;
      manData = leftData.manStepNum || leftData.maleSteps || 0;
      allData = leftData.stepNum || leftData.steps || 0;
      yName = "步数（步）";
      break;
  }
  let option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
      }
      // formatter: '{c}'
    },
    grid: {
      left: "10%",
      right: "10%",
      bottom: "10%",
      containLabel: true
    },
    xAxis: {
      data: [xNama]
    },
    yAxis: {
      name: yName, // 需要修改
      type: "value"
    },
    series: [
      {
        name: "女生",
        type: "bar",
        // barWidth : 30, // 柱图宽度
        barMaxWidth: 30, // 最大宽度
        stack: "sex",
        itemStyle: {
          normal: {
            color: "#fff42f"
          }
        },
        label: {
          normal: {
            show: true,
            position: "inside",
            textStyle: {
              color: "#000000"
            },
            formatter: function(params) {
              let value = params.value;
              if (value == 0) {
                value = "";
              }
              return value;
            }
          }
        },
        data: [gridData]
      },
      {
        name: "男生",
        type: "bar",
        // barWidth : 30, // 柱图宽度
        barMaxWidth: 30, // 最大宽度
        stack: "sex",
        itemStyle: {
          normal: {
            color: "rgb(46, 137, 230)"
          }
        },
        label: {
          normal: {
            show: true,
            position: "inside",
            textStyle: {
              color: "#000000"
            },
            formatter: function(params) {
              let value = params.value;
              if (value == 0) {
                value = "";
              }
              return value;
            }
          }
        },
        data: [manData]
      },
      {
        name: "平均值",
        type: "bar",
        stack: "sex",
        label: {
          normal: {
            show: true,
            position: "insideBottom",
            formatter: function(params) {
              let value = params.value;
              if (value == 0) {
                value = "";
              }
              return value;
            },
            textBorderWidth: 2,
            textStyle: {
              color: "#000000"
            }
          }
        },
        itemStyle: {
          normal: {
            color: "rgba(128, 128, 128, 0)"
          }
        },
        data: [allData]
      }
    ]
  };
  vm.leftChart.setOption(option, true);
  vm.leftChart.off("click"); // 防止重复绑定
  vm.leftChart.on("click", function(params) {
    // console.log(params);
    if(params.name == '全校'){
      return;
    }
    if(params.name == '行政班' || params.name == '兴趣班'){
      vm.getType();
    }else{
        vm.lesson.dictGradeId = "";
        vm.getFromData();
    }
  });
}
function parseNum(value, index) {
  if (value % 1 > 0) {
    value = value.toFixed(index);
  }
  return Number(value);
}

function createdRigthCharts(vm, data) {
  // console.log('data',data)
  let endValue=100;
  if(data.tableData.length>7){
     endValue = 7/data.tableData.length*100;
  }
  let option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    dataZoom: [
      {
        type: "inside",
        xAxisIndex: [0],
        start: 0,
        end: endValue
      },
      {
        show: true,
        height: 17,
        type: "slider",
        bottom: "0px",
        xAxisIndex: [0],
        start: 0,
        end: 100,
        backgroundColor: "#EEEEEE",
        fillerColor: "#84BEF9",
        borderColor: "#fff",
        showDetail: false,
        showDataShadow: false
      }
    ],
    
    grid: {
      left: "10%",
      right: "10%",
      bottom: "10%",
      containLabel: true
    },
    legend: {
      data: ["男生", "女生"]
    },
    xAxis: {
      data: data.xName
    },
    yAxis: {
      type: "value",
      name: data.yName // 需要修改
    },
    series: [
      {
        name: "女生",
        type: "bar",
        barMaxWidth: 30, // 最大宽度
        stack: "sex",
        itemStyle: {
          normal: {
            color: "#fff42f"
          }
        },
        label: {
          normal: {
            show: true,
            position: "inside",
            textStyle: {
              color: "#000000"
            },
            formatter: function(params) {
              let value = Math.floor(params.value * 10) / 10;
              if (value == 0) {
                value = "";
              }

              return value;
            }
          }
        },
        data: data.girlData
      },
      {
        name: "男生",
        type: "bar",
        barMaxWidth: 30, // 最大宽度
        stack: "sex",
        itemStyle: {
          normal: {
            color: "rgb(46, 137, 230)"
          }
        },
        label: {
          normal: {
            show: true,
            position: "inside",
            textStyle: {
              color: "#000000"
            },
            formatter: function(params) {
              let value = Math.floor(params.value * 10) / 10;
              if (value == 0) {
                value = "";
              }
              return value;
            }
          }
        },
        data: data.manData
      },
      {
        name: "平均",
        type: "bar",
        barMaxWidth: 30, // 最大宽度
        stack: "sex",
        label: {
          normal: {
            show: true,
            position: "insideBottom",
            formatter: function(params) {
              let value = Math.floor(params.value * 10) / 10;
              if (value == 0) {
                value = "";
              }
              return value;
            },
            textBorderWidth: 2,
            textStyle: {
              color: "#000000"
            }
          }
        },
        itemStyle: {
          normal: {
            color: "rgba(128, 128, 128, 0)"
          }
        },
        data: data.allData
      }
    ]
  };

  vm.rightChart.setOption(option, true);
  vm.rightChart.off("click"); // 防止重复绑定
  vm.rightChart.on("click", function(params) {
    let str = params.name;
    if (vm.isClass) {
      let classId;
      // 到班级这一层后，继续点击会发生跳转
      vm.tableData.filter(items => {
        if (items.schoolClassName == params.name || items.name == params.name) {
          vm.schoolClassId = items.schoolClassId;
          if(items.classId){
            classId = items.classId
          }else{
            return items.schoolClassId;
          }
        }
      });
     
      // console.log(params,vm.tableData);
      vm.$router.push({
        path: "classStudentList",
        query: {
          startTime: vm.lesson.startTime.value,
          endTime: vm.lesson.endTime.value,
          type: vm.lesson.type,
          schoolClassId: vm.schoolClassId || classId,
          typeStatus:vm.typeStatus,
          gradeName: vm.gradeName || '',
          className: params.name || vm.className || ''
        }
      });
    } else {
      if(params.name == '行政班'){
        vm.lesson.dictGradeId = "";
      }
      if(params.name == '行政班' || params.name.indexOf('年')>=0){
        // // 年级
        if(params.name.indexOf('年')>=0){
          let gradeData = vm.tableData.find(item => {
            return item.gradeName == params.name;
          });
          vm.gradeName = params.name;
          vm.lesson.dictGradeId = gradeData.dictGradeId;
          vm.lesson.dictSchoolTypeGradeId = gradeData.dictSchoolTypeGradeId;
        }
        vm.getFromData();
      }else{
        vm.typeStatus = '';
        vm.getInterestClass();
      }

    }
  });
}
</script>

<style scoped>
.list {
  position: relative;
  margin-top: 10px;
}

.text_center {
  text-align: center;
}

.color_b {
  color: #4d66f9;
}

.change_type.tj {
  position: absolute;
  right: 28px;
  top: 35px;
}

.change_type.sj {
  position: absolute;
  right: 28px;
  top: 74px;
}

.table {
  margin-bottom: 50px;
  position: relative;
}

.bottomC {
  text-align: right;
  width: 90%;
  position: absolute;
  right: 28px;
  bottom: 5px;
}

.point {
  color: #1e9fff;
  cursor: pointer;
}

.changeGroup {
  margin-bottom: 10px;
}

.changeGroup .el-checkbox {
  margin-left: 0px !important;
  margin-right: 25px;
  margin-bottom: 10px;
}

.popover-chartbtn {
  text-align: center;
  margin-bottom: 0px;
}

.chartsBtn {
  position: absolute;
  right: 60px;
  bottom: 44px;
  z-index: 100;
}

.shuoming {
  display: inline-block;
  width: 18px;
  height: 18px;
  background: #c8cace;
  line-height: 18px;
  font-size: 14px;
  color: white;
  border-radius: 12px;
  vertical-align: middle;
  cursor: pointer;
}

.shaixuan {
  position: absolute;
  left: 1070px;
  bottom: 20px;
}
.shaixuan1 {
  position: absolute;
  left: 155px;
  top: 87px;
  z-index: 1000;
}
.chartsBtn1 {
  background-color: #84bef9;
  color: #fff !important;
  width: 69px;
  border-radius: 13px;
  border-color: #84bef9;
}
</style>
<style lang="scss">
td.tableData_cell {
  .cell {
    color: #1e9fff;
    cursor: pointer;
  }
}
</style>
