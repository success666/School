<template>
  <div class="homeworkStats">
    <el-radio-group v-model="routerModel" @change="modelRouter" style="margin-bottom: 30px;">
      <el-radio-button label="1">作业管理</el-radio-button>
      <el-radio-button label="2">作业统计</el-radio-button>
    </el-radio-group>
    <div class="search">
      <el-row>
        <el-col :span="4">
          <span class="searchTitle1">班级类型</span>
          <el-select
            class="searchValue1"
            v-model="search.classType.value"
            placeholder="请选择类型"
            size="mini"
          >
            <el-option
              v-for="item in classTypeOptions"
              :key="item.type"
              :label="item.name"
              :value="item.type"
            ></el-option>
          </el-select>
        </el-col>
        <!-- <el-col :span="4">
          <span class="searchTitle">年级</span>
          <el-select
            class="searchValue"
            v-model="search.gradeId.value"
            placeholder="请选择"
            size="mini"
            style="width: 120px"
          >
            <el-option
              v-for="item in search.gradeId.data"
              :key="item.gradeId"
              :label="item.gradeName"
              :value="item.gradeId"
            ></el-option>
          </el-select>
        </el-col>-->
        <el-col :span="5">
          <span class="searchTitle">日期</span>
          <el-date-picker
            class="searchValue"
            v-model="search.startDateStr.value"
            type="date"
            size="mini"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            @change="changeDate($event,'startDateStr')"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-col>
        <el-col :span="5">
          <span class="searchTitle">至</span>
          <el-date-picker
            class="searchValue"
            v-model="search.endDateStr.value"
            type="date"
            size="mini"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            @change="changeDate($event,'endDateStr')"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-col>
        <el-col :span="7" class="searchRadio">
          <el-radio-group v-model="longTime" @change="changRadio">
            <el-radio label="1">近两周</el-radio>
            <el-radio label="2">近一个月</el-radio>
            <el-radio label="3">近三个月</el-radio>
          </el-radio-group>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" size="mini" @click="searchData">查询</el-button>
          <el-button type="primary" size="mini" @click="clear">重置</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="homeworkContent" v-loading="loading" element-loading-text="拼命加载中">
      <div ref="printarea">
        <h3 class="title-top">
          {{titleName}}
          <el-popover class="titlemessage" placement="right" width="280" trigger="click">
            <div>
              <div>统计说明：</div>
              <div>作业完成率=完成作业数/作业总数</div>
              <div>作业未完成率=外完成作业数/作业总数</div>
            </div>
            <span slot="reference" class="shuoming">?</span>
          </el-popover>
        </h3>
        <div class="homework_btn">
          <el-button :type="btncharts" class="homework_charts" @click="changeForm('charts')">统计报表</el-button>
          <el-button :type="btntable" class="homework_table_btn" @click="changeForm('table')">数据详情</el-button>
        </div>
        <div class="charts" v-show="formType=='charts'">
          <el-popover placement="right" width="400" trigger="click">
            <el-checkbox-group
              v-model="checkedChart"
              refs="changeGroup"
              class="changeGroup"
              @change="changeChart"
            >
              <el-checkbox v-for="item in chartArr" :label="item" :key="item">{{item}}</el-checkbox>
            </el-checkbox-group>
            <el-button class="chartsBtn" slot="reference" type="primary" size="mini">筛选</el-button>
          </el-popover>
          <div id="leftCharts"></div>
          <div id="rightCharts"></div>
        </div>
        <div class="homework_table" v-show="formType=='table'">
          <el-popover placement="right" width="400" trigger="click" class="table_popover">
            <el-checkbox-group
              v-model="checkedChart"
              refs="changeGroup"
              class="changeGroup"
              @change="changeChart"
            >
              <el-checkbox v-for="item in chartArr" :label="item" :key="item">{{item}}</el-checkbox>
            </el-checkbox-group>
            <el-button class="chartsBtn" slot="reference" type="primary" size="mini">筛选</el-button>
          </el-popover>
          <el-table :data="tableData" @row-click="rowClick" style="width: 100%">
            <el-table-column prop="name" label="区域" align="center" width="155px"></el-table-column>
            <el-table-column prop="homeworkAllCount" label="作业数量（份）" align="center"></el-table-column>
            <el-table-column prop="finishCount" label="完成作业（份）" align="center"></el-table-column>
            <el-table-column prop="nonFinishCount" label="未完成作业(份)" align="center"></el-table-column>
            <el-table-column
              prop="finishRate"
              label="作业完成率"
              align="center"
              :formatter="formatterNumber"
            ></el-table-column>
          </el-table>
        </div>
      </div>
      <el-row v-if="formType=='table'">
        <el-col :span="24" style="text-align: center;margin-top:20px;">
          <el-button @click="exportData" type="primary" size="mini">导出</el-button>
          <el-button @click="printAction" type="primary" size="mini">打印</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import echarts from "echarts";
import request from "@/utils/request";
import requestYapi from "@/utils/requestyAPI";
import Print from "@/utils/print";
import { BASE_API } from "../../../../config/prod.env";
import axios from "axios";
import { getToken, isHavePermissions } from "@/utils/auth";
export default {
  name: "HomeworkStats",
  data() {
    return {
      isGrade:false,
      loading:true,
      routerModel: "2",
      search: {
        classType: { value: 0 },
        gradeId: { value: "", data: [] },
        startDateStr: { value: "" },
        endDateStr: { value: "" }
      },
      classTypeOptions: [{ type: 0, name: "全部" }],
      longTime: "",
      leftCharts: "",
      rightCharts: "",
      formType: "charts",
      tableData: [],
      formData: {},
      allData: [],
      titleName: "",
      rightOption: {},
      checkedChart: [],
      chartArr: [],
      visible: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      btncharts: "primary",
      btntable: ""
    };
  },
  methods: {
    modelRouter() {
      this.routerModel = "2";
      this.$router.push("homeworkList");
    },
    clear() {
      for (let name in this.search) {
        this.search[name].value = "";
      }
      this.longTime = "";
      this.search.gradeId.value = 0;
      this.search.endDateStr.value = getDay(0);
      //获取前两周的数据
      this.search.startDateStr.value = getDay(-6);
    },
    changeForm(type) {
      this.formType = type;
      if (type == "charts") {
        this.btncharts = "primary";
        this.btntable = "";
      } else {
        this.btntable = "primary";
        this.btncharts = "";
      }
    },
    rowClick(row) {
      if (row.isTotal || row.homeworkAllCount == 0) return;
      this.changeRouter(row, row.name);
    },
    formatterNumber(row, column, cellValue, index) {
      cellValue = cellValue * 100;
      return cellValue.toFixed(2) + "%";
    },
    getFormData: getFormData,
    getGradeId: getGradeId,
    changRadio: changRadio,
    searchData: searchData,
    changeChart: changeChart,
    printAction: printAction,
    exportData: exportData,
    changeDate: changeDate,
    getTitle: getTitle,
    changeRouter: changeRouter
  },

  mounted() {
    this.leftCharts = echarts.init(document.getElementById("leftCharts"));
    this.rightCharts = echarts.init(document.getElementById("rightCharts"));

    //获取年级,默认为全部
    this.getGradeId();
    this.search.gradeId.value = 0;
    //默认获取最近两周的数据；
    //获取当天的数据
    this.search.endDateStr.value = getDay(0);
    //获取前两周的数据
    this.search.startDateStr.value = getDay(-6);
    let params = {
      startDateStr: getDay(-6),
      endDateStr: getDay(0)
    };
    this.getFormData(params);
    getClassTypeOptions(this);
  }
};
function getClassTypeOptions(vm) {
  request.get("/api/auth/v1/school/class/type").then(res => {
    vm.classTypeOptions = vm.classTypeOptions.concat(res.data);
  });
}
function toHomeWorkStudentList(row, vm) {
  vm.$store.dispatch("setHomeworkStatsStudent", {
    row: row,
    formData: vm.formData,
    search: vm.search,
    gradeName: vm.gradeName
  });
}

function getDay(day) {
  var today = new Date();
  var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
  today.setTime(targetday_milliseconds); //注意，这行是关键代码
  var tYear = today.getFullYear();
  var tMonth = today.getMonth();
  var tDate = today.getDate();
  tMonth = doHandleMonth(tMonth + 1);
  tDate = doHandleMonth(tDate);
  return tYear + "-" + tMonth + "-" + tDate;
}
function changeDate(value, type) {
  this.longTime = "";
  if (type == "startDateStr") {
    if (this.search.endDateStr.value) {
      if (
        new Date(Date.parse(value)) >
        new Date(Date.parse(this.search.endDateStr.value))
      ) {
        this.$message.error("开始日期不能大于结束日期");
        this.search.startDateStr.value = this.search.endDateStr.value;
      }
    }
  } else {
    if (this.search.startDateStr.value) {
      if (
        new Date(Date.parse(this.search.startDateStr.value)) >
        new Date(Date.parse(value))
      ) {
        this.$message.error("开始日期不能大于结束日期");
        this.search.endDateStr.value = this.search.startDateStr.value;
      }
    }
  }
}
function doHandleMonth(month) {
  var m = month;
  if (month.toString().length == 1) {
    m = "0" + month;
  }
  return m;
}
function getGradeId() {
  request.get("api/auth/v1/school/grade").then(res => {
    let allArr = [{ gradeId: 0, gradeName: "全部" }];
    this.search.gradeId.data = allArr.concat(res.data);
  });
}
function changRadio(value) {
  this.search.endDateStr.value = getDay(0);
  switch (value) {
    case "1":
      this.search.startDateStr.value = getDay(-14);
      break;
    case "2":
      this.search.startDateStr.value = getDay(-30);
      break;
    case "3":
      this.search.startDateStr.value = getDay(-90);
      break;
  }
}
function searchData() {
  if (!this.search.startDateStr.value || !this.search.endDateStr.value) {
    this.$message.error("请选择日期范围进行查询");
    return;
  }
  let params = {};
  params.startDateStr = this.search.startDateStr.value;
  params.endDateStr = this.search.endDateStr.value;
  params.isSchool = true;
  if (this.search.classType.value == 0) {
    this.getFormData(params);
  } else {
    this.getFormData(params, { isSchool: true });
  }
}
function getFormData(params, typeData) {
  let api;
  if (this.search.classType.value == 0) {
    api = "api/auth/v1/homework/statistics/all-class-type";
  } else if (this.search.classType.value == 1) {
    if (typeData.isSchool) {
      api = "/api/auth/v1/homework/statistics/school";
    } else {
      api = "/api/auth/v1/homework/statistics/grade";
    }
  } else {
    api = "api/auth/v1/homework/statistics/all-interest-class";
  }
  this.loading=true;
  request.get(api, { params }).then(res => {
    this.loading=false;
    if (this.search.classType.value == 0) {
      this.allData = res.data.classTypeList;
      this.formData.schoolName = res.data.schoolName;
      this.getTitle(res.data.schoolName + "全部");
    } else if (this.search.classType.value == 1) {
      this.allData = res.data.homeworkStatisticsSchoolDetailsList || res.data;
      if (typeData.isSchool) {
        this.getTitle(this.formData.schoolName + "行政班");
      } else {
        this.getTitle(this.formData.schoolName + typeData.name);
      }
    } else {
      this.allData = res.data;
      this.getTitle(this.formData.schoolName + "兴趣班");
    }
    parseFormData(this);
  });
}
function parseFormData(vm) {
  vm.chartArr = JSON.parse(getChartArr(vm.allData, vm.search.gradeId.value));

  vm.checkedChart = JSON.parse(
    getChartArr(vm.allData, vm.search.gradeId.value)
  );
  let parseData = parseDataFun(
    vm.allData,
    vm.checkedChart,
    vm.search.gradeId.value
  );
  vm.tableData = parseData.tablearr;
  creatRightEcharts(vm, parseData);
  creatLeftEcharts(
    vm,
    parseData.leftDataFinish,
    parseData.leftDataNonFinish,
    parseData.leftDataAll
  );
}
function changeChart() {
  let parseData = parseDataFun(
    this.allData,
    this.checkedChart,
    this.search.gradeId.value
  );
  this.tableData = parseData.tablearr;
  creatRightEcharts(this, parseData);
  creatLeftEcharts(
    this,
    parseData.leftDataFinish,
    parseData.leftDataNonFinish,
    parseData.leftDataAll
  );
}
function getChartArr(data, gradeId) {
  let chartArr = [];
  for (let i = 0; i < data.length; i++) {
    let item = data[i];
    let itemName = item.gradeName || item.className || item.name;
    chartArr.push(itemName);
  }
  return JSON.stringify(chartArr);
}
function getTitle(schoolName) {
  this.titleName =
    this.search.startDateStr.value +
    "至" +
    this.search.endDateStr.value +
    schoolName +
    "学生作业统计";
}
function parseDate(startDate, endDate, vm) {
  if (Date.parse(startDate) - Date.parse(endDate) > 0) {
    vm.$message.error("查询的开始日期不能大于结束日期");
    return;
  }
  let boundaryDate = startDate.split("-")[0] + "-09-01";
  // 大于当年的9月1号，那么就是下个学年
  if (Date.parse(startDate) - Date.parse(boundaryDate) >= 0) {
    let boundaryDate_end = Number(startDate.split("-")[0]) + 1;
    let boundaryDate_end1 = Number(startDate.split("-")[0]) + 1;
    boundaryDate_end = boundaryDate_end + "-08-31";
    if (Date.parse(endDate) - Date.parse(boundaryDate_end) > 0) {
      vm.$message.error(
        "查询时候不能跨学年查询,结束日期不能大于" +
          boundaryDate_end1 +
          "年8月31日"
      );
      return false;
    }
  } else {
    let boundaryDate_end = Number(startDate.split("-")[0]) + "-08-31";
    if (Date.parse(endDate) - Date.parse(boundaryDate_end) > 0) {
      vm.$message.error(
        "查询时候不能跨学年查询,结束日期不能大于" +
          startDate.split("-")[0] +
          "年8月31日"
      );
      return false;
    }
  }
  return true;
}
function parseDataFun(data, chartArr, gradeId) {
  let leftDataAll = 0,
    leftDataFinish = 0,
    leftDataNonFinish = 0,
    rightDataFinish = [],
    rightDataNonFinish = [],
    rightDataAll = [],
    xAxisName = [];
  let tableArr = [];
  data.forEach(item => {
    let xName = item.gradeName || item.className || item.name;
    item.name = xName;
    if (chartArr.indexOf(xName) >= 0) {
      xAxisName.push(xName);
      let finishCount = item.finishCount,
        nonFinishCount = item.nonFinishCount,
        allCount = item.finishCount + item.nonFinishCount;
      leftDataAll += allCount;
      leftDataFinish += finishCount;
      leftDataNonFinish += nonFinishCount;
      rightDataFinish.push({
        value: finishCount == 0 ? "" : finishCount,
        schoolTypeGradeId: item.schoolTypeGradeId,
        gradeId: item.gradeId,
        classType: item.classType,
        schoolClassId: item.schoolClassId,
        id: item.id
      });
      rightDataNonFinish.push({
        value: nonFinishCount == 0 ? "" : nonFinishCount,
        schoolTypeGradeId: item.schoolTypeGradeId,
        gradeId: item.gradeId,
        classType: item.classType,
        schoolClassId: item.schoolClassId,
        id: item.id
      });
      rightDataAll.push({
        value: allCount == 0 ? "" : allCount,
        schoolTypeGradeId: item.schoolTypeGradeId,
        gradeId: item.gradeId,
        classType: item.classType,
        schoolClassId: item.schoolClassId,
        id: item.id
      });
      tableArr.push(item);
    }
  });
  if (leftDataFinish != 0 || leftDataNonFinish != 0) {
    tableArr = [
      {
        finishCount: leftDataFinish,
        finishRate: leftDataFinish / leftDataAll,
        name: "全部",
        homeworkAllCount: leftDataAll,
        nonFinishCount: leftDataNonFinish,
        isTotal: true
      }
    ].concat(tableArr);
  }
  leftDataFinish = leftDataFinish == 0 ? "" : leftDataFinish;
  leftDataAll = leftDataAll == 0 ? "" : leftDataAll;
  leftDataNonFinish = leftDataNonFinish == 0 ? "" : leftDataNonFinish;
  let parseData = {
    leftDataAll: leftDataAll,
    leftDataFinish: leftDataFinish,
    leftDataNonFinish: leftDataNonFinish,
    rightDataFinish: rightDataFinish,
    rightDataNonFinish: rightDataNonFinish,
    rightDataAll: rightDataAll,
    xAxisName: xAxisName,
    tablearr: tableArr
  };
  return parseData;
}
function creatLeftEcharts(vm, leftDataFinish, leftDataNonFinish, leftDataAll) {
  let xAxisName = "";
  for (let i = 0; i < vm.search.gradeId.data.length; i++) {
    let item = vm.search.gradeId.data[i];
    if (vm.search.gradeId.value == item.gradeId) {
      xAxisName = item.gradeName;
    }
  }
  if (vm.search.classType.value == 0) {
    xAxisName = "全校";
  }else {
    if(vm.isGrade){
      xAxisName=vm.gradeName;
    }else{
      vm.classTypeOptions.forEach(item=>{
        if(vm.search.classType.value==item.type){
            xAxisName=item.name;
        }
      })
    }
  }
  let option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    grid: {
      left: "20%"
    },
    xAxis: {
      type: "category",
      data: [xAxisName]
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: "{value}"
      },
      name: "作业：份"
    },
    series: [
      {
        name: "已完成",
        data: [leftDataFinish],
        type: "bar",
        stack: "one",
        label: {
          normal: {
            show: true,
            textStyle: {
              color: "#0b0b0c"
            },
            textBorderWidth: 2
          }
        },
        barWidth: 20, //柱图宽度
        itemStyle: {
          normal: {
            color: "#107fbf"
          }
        }
      },
      {
        name: "未完成",
        data: [leftDataNonFinish],
        type: "bar",
        stack: "one",
        label: {
          normal: {
            show: true,
            textStyle: {
              color: "#0b0b0c"
            },
            textBorderWidth: 2
          }
        },
        itemStyle: {
          normal: {
            color: "#e4e423"
          }
        }
      },
      {
        name: "总合计",
        type: "line",
        label: {
          normal: {
            offset: ["50", "80"],
            show: true,
            position: "insideBottom",
            formatter: "{c}",
            textStyle: {
              color: "red"
            }
          }
        },
        label: {
          normal: {
            show: true,
            position: "insideBottom",
            textBorderWidth: 2,
            textStyle: {
              color: "#0b0b0c"
            }
          }
        },
        itemStyle: {
          normal: {
            color: "rgba(128, 128, 128, 0)"
          }
        },
        data: [leftDataAll]
      }
    ]
  };
  vm.leftCharts.setOption(option, true);
}
function creatRightEcharts(vm, data) {
  let endValue=100;
  if(data.rightDataFinish.length>7){
     endValue = 7/data.rightDataFinish.length*100;
  }
  let option = {
    legend: {
      data: ["已完成", "未完成"]
    },
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
    xAxis: {
      type: "category",
      data: data.xAxisName
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: "{value}"
      },
      name: "作业：份"
    },
    series: [
      {
        name: "已完成",
        data: data.rightDataFinish,
        type: "bar",
        stack: "one",
        label: {
          normal: {
            show: true,
            textStyle: {
              color: "#0b0b0c"
            },
            textBorderWidth: 2
          },
          formatter: "{b}\n{c}%"
        },
        barWidth: 20, //柱图宽度
        itemStyle: {
          normal: {
            color: "#107fbf"
          }
        }
      },
      {
        name: "未完成",
        data: data.rightDataNonFinish,
        type: "bar",
        stack: "one",
        label: {
          normal: {
            show: true,
            textStyle: {
              color: "#0b0b0c"
            },
            textBorderWidth: 2
          }
        },
        itemStyle: {
          normal: {
            color: "#e4e423"
          }
        }
      },
      {
        name: "总合计",
        type: "line",
        label: {
          normal: {
            show: true,
            position: "insideBottom",
            textBorderWidth: 2,
            textStyle: {
              color: "#0b0b0c"
            }
          }
        },
        itemStyle: {
          normal: {
            color: "rgba(128, 128, 128, 0)"
          }
        },
        data: data.rightDataAll
      }
    ]
  };
  vm.rightCharts.setOption(option, true);

  vm.rightCharts.off("click"); // 防止重复绑定
  vm.rightCharts.on("click", function(params) {
    vm.changeRouter(params.data, params.name);
  });
}
function changeRouter(data, name) {
  let searchData = {},
    typeData = {},
    titleName;
  searchData.startDateStr = this.search.startDateStr.value;
  searchData.endDateStr = this.search.endDateStr.value;
  this.isGrade=false;
  if (this.search.classType.value == 0) {
    this.search.classType.value = data.classType;
    typeData.isSchool = true;
  } else if (this.search.classType.value == 1) {
    if (data.gradeId && data.schoolTypeGradeId) {
      searchData.gradeId = data.gradeId;
      searchData.schoolTypeGradeId = data.schoolTypeGradeId;
      typeData.name = name;
      this.isGrade=true;
      this.gradeName=name;
    } else {
      titleName = this.titleName.split("学生作业统计")[0];
      this.$router.push({
        name: "Studentliststats",
        params: {
          titleName: titleName + name + "学生作业统计",
          startDateStr: this.search.startDateStr.value,
          endDateStr: this.search.endDateStr.value,
          schoolClassId: data.schoolClassId,
          classType: this.search.classType.value
        }
      });
      return;
    }
  } else {
    titleName = this.titleName.replace("兴趣班", name);
    this.$router.push({
      name: "Studentliststats",
      params: {
        titleName: titleName,
        startDateStr: this.search.startDateStr.value,
        endDateStr: this.search.endDateStr.value,
        id: data.id,
        classType: this.search.classType.value
      }
    });
    return;
  }
  this.getFormData(searchData, typeData);
}
function printAction() {
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
}
function exportData() {
  let api = "";
  let startDateStr = this.search.startDateStr.value;
  let endDateStr = this.search.endDateStr.value.split("-")[1];
  let params = {
    startDateStr: startDateStr,
    endDateStr: endDateStr
  };
  if (this.search.gradeId.value == 0) {
    api = "/api/auth/v1/homework/statistics/school/export";
  } else {
    api = "/api/auth/v1/homework/statistics/grade/export";
    for (let i = 0; i < this.allData.length; i++) {
      let item = this.allData[i];
      if (item.gradeId == this.search.gradeId.value) {
        params.schoolTypeGradeId = item.schoolTypeGradeId;
        break;
      }
    }
    params.gradeId = this.search.gradeId.value;
  }
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
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.search {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 18px 15px;
  margin-bottom: 10px;
  font-size: 0px;
  .searchTitle {
    display: inline-block;
    width: 40px;
    line-height: 27px;
    font-size: 14px;
    margin-right: 5px;
    vertical-align: middle;
    text-align: right;
  }

  .searchTitle1 {
    display: inline-block;
    width: 80px;
    line-height: 27px;
    font-size: 14px;
    margin-right: 5px;
    vertical-align: middle;
    text-align: right;
  }
  .searchValue {
    width: calc(100% - 45px);
    vertical-align: middle;
  }
  .searchValue1 {
    width: calc(100% - 85px);
    vertical-align: middle;
  }
  .searchRadio {
    .el-radio {
      line-height: 28px;
      margin-left: 15px;
    }
  }
}
.homeworkContent {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 15px;
  position: relative;
  min-height: 600px;
  h3 {
    text-align: center;
    line-height: 32px;
  }
  .homework_btn {
    position: absolute;
    top: 70px;
    right: 20px;
    z-index: 1000;
    .el-button {
      display: block;
      margin: 0px;
    }
    .homework_charts {
      margin-bottom: 10px;
    }
  }
  .charts {
    width: 990px;
    margin: auto;
    margin-top: 50px;
    padding-left: 25px;
    position: relative;
    #leftCharts {
      width: 200px;
      height: 500px;
      display: inline-block;
    }

    #rightCharts {
      width: 700px;
      height: 500px;
      display: inline-block;
    }
    .chartsBtn {
      position: absolute;
      right: 50px;
      bottom: 20px;
      z-index: 100000000;
    }
  }
  .homework_table {
    width: 767px;
    margin: auto;
    margin-top: 50px;
    position: relative;
    .table_popover {
      position: absolute;
      top: 11px;
      z-index: 100000;
      left: 96px;
    }
  }
}
.changeGroup {
  margin-bottom: 10px;
  .el-checkbox {
    margin-left: 0px !important;
    margin-right: 25px;
    margin-bottom: 10px;
  }
}
.popover-chartbtn {
  text-align: center;
  margin-bottom: 0px;
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
.el-popper {
  width: 300px !important;
}
</style>
<style lang="scss">
.homeworkStats {
  .el-table {
    td {
      border-bottom: 1px solid #ebeef5 !important;
    }
  }
}
</style>


