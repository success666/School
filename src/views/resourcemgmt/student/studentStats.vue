<template>
  <div>
    <el-radio-group v-model="studentModel" style="margin-bottom: 10px;" @change="changeModel">
      <el-radio-button label="1">学生管理</el-radio-button>
      <el-radio-button label="2">班级管理</el-radio-button>
      <el-radio-button label="3">学生统计</el-radio-button>
    </el-radio-group>
    <div class="search-form">
      <el-form :inline="true" :model="student" ref="student" class="">
        <el-row>
          <el-col>
            <el-form-item label="学年">
              <el-select v-model="student.schoolYear" placeholder="请选择" size="mini">
                <el-option v-for="item in schoolYearOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="年级">
              <!--<el-select v-model="student.gradeId" placeholder="请选择" @change="getClass" size="mini">-->
              <el-select v-model="student.gradeId" placeholder="请选择" size="mini" @change="getClass(student.gradeId)">
                <el-option v-for="item in gradeOptions" :key="item.gradeId" :label="item.gradeName" :value="item.gradeId">
                </el-option>
              </el-select>
            </el-form-item>
            <!--<el-form-item label="班级">-->
            <!--<el-select v-model="student.classId" placeholder="请选择" @change="getClassList" size="mini">-->
            <!--<el-option-->
            <!--v-for="item in classOptions"-->
            <!--:key="item.id"-->
            <!--:label="item.className"-->
            <!--:value="item.id">-->
            <!--</el-option>-->
            <!--</el-select>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="学生姓名">-->
            <!--<el-input v-model="student.name" placeholder="请输入" class="text-input"></el-input>-->
            <!--</el-form-item>-->
            <el-form-item>
              <el-button type="primary" @click="search(student)" class="btn" size="mini">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="resetForm(student)" class="btn" size="mini">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="list">
      <section>
        <div v-show="isStats" class="aa">
          <h2 class="charts_title title-top">{{titleTop}}
            <el-popover class="titlemessage" placement="right" width="320" trigger="click">
              <div class="titlemessage">
                <div>{{iconTitle}}</div>
              </div>
              <span slot="reference" class="shuoming">?</span>
            </el-popover>
          </h2>

          <p class="text_center">
            总人数：<span class="color_b">{{counts.headcount}}</span> &nbsp;&nbsp;&nbsp;
            男生：<span class="color_b">{{counts.MaleCount}} </span> &nbsp;&nbsp;
            女生：<span class="color_b">{{counts.FemaleCount}}</span>
          </p>
          <div id="charts" ref="mychart" style="width: 90%;margin-left: 5%;height:400px;"></div>
        </div>
        <div class="table" v-show="!isStats" ref="printarea">
          <h2 class="charts_title title-top">{{titleTop}}
            <el-popover class="titlemessage" placement="right" width="320" trigger="click">
              <div class="titlemessage">
                <div>{{iconTitle}}</div>
              </div>
              <span slot="reference" class="shuoming">?</span>
            </el-popover>
          </h2>
          <template>
            <el-table :data="tableData" stripe style="width: 1000px;margin:0 auto;" @cell-click="cellClick">
              <el-table-column prop="className" align="center" v-if="isGrade" label="班级" class-name="tableData_cell">
              </el-table-column>
              <el-table-column prop="gradeName" align="center" v-else label="年级" class-name="tableData_cell">
              </el-table-column>
              <el-table-column prop="headcount" align="center" label="总人数（人）">
                <template slot-scope="scope">
                  <span>{{scope.row.studentFemaleCount + scope.row.studentMaleCount}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="studentMaleCount" align="center" label="男生数量（人）">
                <template slot-scope="scope">
                  <span>{{scope.row.studentMaleCount || 0}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="studentFemaleCount" align="center" label="女生数量（人）">
                <template slot-scope="scope">
                  <span>{{scope.row.studentFemaleCount || 0}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="baiFenBi" align="center" label="男女比例（男：女）">
                <template slot-scope="scope">
                  <span v-text="baiFenBi(scope.row.studentMaleCount, scope.row.studentFemaleCount)"></span>
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
import { getSchoolYear } from "@/utils/index";
import Vue from "vue";
import echarts from "echarts";
import Print from "@/utils/print";
// import { BASE_API } from "../../../../config/prod.env";
import axios from "axios";
import { getToken } from "@/utils/auth";

Vue.use(Print); // 注册

export default {
  name: "studentStatus",
  data() {
    return {
      titleTop: "",
      schoolId: "",
      schoolName: "",
      gradeName: "",
      className: "",
      schoolTypeName: "",
      showClass: false,
      iconTitle: "本学年所选区域的学生数量总和",
      student: {
        schoolYear: "",
        gradeId: "",
        classId: ""
      },
      counts: {
        headcount: "",
        FemaleCount: "", // 女
        MaleCount: "" // 男
      },
      isGrade:false,
      schoolYearOptions: [],
      gradeOptions: [],
      classOptions: [],
      // myChart实例
      myChart: {},
      studentModel: 3,
      isStats: true,
      btnStyT: "primary",
      btnStyD: "",
      title: "",
      tableData: []
    };
  },
  methods: {
    getClass(e) {
      let that = this;
      this.gradeOptions.forEach(function(item) {
        if (item.gradeId == e) {
          that.gradeName = item.gradeName;
        }
      });
    },
    getGradeId() {
      // 获取年级
      request.get("api/auth/v1/school/grade").then(res => {
        let allArr = [{ gradeId: 0, gradeName: "全部" }];
        this.gradeOptions = allArr.concat(res.data);
      });
    },
    search() {
      this.getFromData();
      // this.setEcharts();
    },
    baiFenBi(a, b) {
      var c;
      var d = a + b;
      if (a > 0 && b > 0) {
        c =
          ((a / d) * 100).toFixed(0) + "%：" + ((b / d) * 100).toFixed(0) + "%";
      } else if (b > 0) {
        c = "100%：0%";
      } else if (a > 0) {
        c = "0%：100%";
      } else {
        c = "0%:0%";
      }
      return c;
    },
    resetForm(formName) {
      // this.$refs[formName].resetFields();
      // this.student.schoolYear = this.schoolYearOptions[this.schoolYearOptions.length - 1].value;
      this.student.schoolYear = this.schoolYearOptions[0].value;
      // this.student.schoolYear = '';
      this.student.gradeId = "";
    },
    changeModel() {
      switch (this.studentModel) {
        case "1":
          this.$router.push("/studentManagement/studentSearchList");
          break;
        case "2":
          this.$router.push("/studentManagement/classList");
          break;
      }
      this.studentModel = "3";
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
    cellClick(row, column, cell, event) {
      if (column.property != "className" && column.property != "gradeName")
        return;
      if (column.property == "gradeName") {
        this.student.gradeId = row.dictSchoolTypeGradeId;
        this.gradeName = row.gradeName;
        this.getFromData();
      }else{
        this.classId=row.id,
        this.className=row.className;
        this.handleView();
      }
    },
    handleView(row) {
      this.$router.push({
        path: "/studentManagement/studentList",
        query: {
          schoolYear: this.student.schoolYear,
          gradeId: this.student.gradeId,
          title: this.schoolName,
          classId: this.classId,
          gradeName: this.gradeName,
          className: this.className,
          student: this.student
        }
      });
    },

    // 打印
    printAction() {
      this.$print(this.$refs.printarea);
    },
    // 导出
    exportAction() {
      const schoolYearStart = this.$route.query.schoolYearStart;
      const schoolYearEnd = this.$route.query.schoolYearEnd;
      let api1 = "/api/auth/v1/resourceMgmt/student/stats/class/export"; //
      let api2 = "/api/auth/v1/resourceMgmt/student/stats/grade/export"; //
      let api3 = "/api/auth/v1/resourceMgmt/student/stats/school/export"; //
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
      if (this.student.classId) {
        api = api1;
        params = {
          schoolYear: this.student.schoolYear,
          gradeId: this.student.gradeId,
          classId: this.student.classId
        };
      } else {
        if (this.student.gradeId) {
          api = api2;
          params = {
            schoolYear: this.student.schoolYear,
            gradeId: this.student.gradeId
          };
        } else {
          api = api3;
          params = {
            schoolYear: this.student.schoolYear
          };
        }
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
          link.download = that.title + "课堂统计详情.xls";
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
    getFromData: getFromData
  },
  mounted() {
    let dom = this.$refs.mychart;
    this.myChart = echarts.init(dom);
    this.schoolYearOptions = getSchoolYear();
    if (!this.student.schoolYear) {
      this.student.schoolYear = this.schoolYearOptions[0].value;
    }
    this.getFromData();
    this.getGradeId();
  }
};
function getFromData() {
  let api, params;
  if (this.student.gradeId) {
    this.isGrade = true;
    api = "/api/auth/v1/resourceMgmt/student/stats/grade";
    params = {
      schoolYear: this.student.schoolYear,
      schoolId: this.schoolId,
      gradeId: this.student.gradeId
    };
  } else {
    this.isGrade = false;
    api = "/api/auth/v1/resourceMgmt/student/stats/school";
    params = {
      schoolYear: this.student.schoolYear,
      schoolId: this.schoolId || ""
    };
  }
  request
    .get(api, {
      params
    })
    .then(res => {
      let fromData;
      if (this.isGrade) {
        this.tableData = res.data;
        fromData = res.data;
        this.titleTop = this.student.schoolYear+'学年'+this.schoolName+this.gradeName+"学生统计";
      } else {
        this.schoolName = res.data.schoolName; // 学校名
        this.schoolId = res.data.schoolId; // 学校id
        this.tableData = res.data.stuStatsSchoolDtlList;
        fromData = res.data.stuStatsSchoolDtlList;
          this.titleTop = this.student.schoolYear+'学年'+this.schoolName+'学生统计';
      }
      fromData = parseFromData(fromData);
      this.counts = fromData.counts;
      createdCharts(fromData.chartsData, this);
    });
}
function parseFromData(fromData) {
  let counts = { headcount: 0, MaleCount: 0, FemaleCount: 0 },
    chartsData = { manData: [], grilData: [], allData: [], xData: [] };
  fromData.forEach(item => {
    counts.MaleCount += Number(item.studentMaleCount) || 0;
    counts.FemaleCount += Number(item.studentFemaleCount) || 0;
    chartsData.manData.push({
      value: Number(item.studentMaleCount) || 0,
      id: item.dictSchoolTypeGradeId || item.id
    });
    chartsData.grilData.push({
      value: Number(item.studentFemaleCount) || 0,
      id: item.dictSchoolTypeGradeId || item.id
    });
    chartsData.allData.push(
      (Number(item.studentFemaleCount) || 0) +
        (Number(item.studentMaleCount) || 0)
    );
    chartsData.xData.push(item.gradeName || item.className);
  });
  counts.headcount = counts.MaleCount + counts.FemaleCount;
  return { counts, chartsData };
}
function createdCharts(data, vm) {
  let xName = "年级";
  if (vm.isGrade) {
    xName = "班级";
  }
  let option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    legend: {
      data: ["男生", "女生"]
    },
    xAxis: {
      // type : 'category',
      name: xName,
      data: data.xData
    },
    yAxis: {
      name: "单位：人",
      type: "value"
    },
    series: [
      {
        name: "男生",
        type: "bar",
        barMaxWidth: 30, // 最大宽度
        stack: "sex",
        itemStyle: {
          normal: {
            color: "#1E90FF"
          },
          // 鼠标悬停时：
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          }
        },
        label: {
          normal: {
            show: true,
            position: "inside",
            formatter: function(params) {
              let value = params.value;
              if (value == 0) {
                value = "";
              }
              return value;
            },
            textStyle: {
              color: "#000000"
            }
          }
        },
        data: data.manData
      },
      {
        name: "女生",
        type: "bar",
        barMaxWidth: 30, // 最大宽度
        stack: "sex",
        itemStyle: {
          normal: {
            color: "#FFFF00"
          },
          // 鼠标悬停时：
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          }
        },
        label: {
          normal: {
            show: true,
            position: "inside",
            formatter: function(params) {
              let value = params.value;
              if (value == 0) {
                value = "";
              }
              return value;
            },
            textStyle: {
              color: "#000000"
            }
          }
        },
        data: data.grilData
      },
      {
        name: "总计",
        type: "bar",
        barMaxWidth: 30, // 最大宽度
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
        data: data.allData
      }
    ]
  };
  vm.myChart.setOption(option, true);
  vm.myChart.off("click"); // 防止重复绑定
  vm.myChart.on("click", function(params) {
    var str = params.name;
    if (vm.isGrade) {
      vm.className = params.name;
      vm.classId = params.data.id;
      vm.handleView();
    } else {
      vm.student.gradeId = params.data.id;
      vm.gradeName = params.name;
      vm.getFromData();
    }
  });
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.charts_title {
  line-height: 30px;
  text-align: center;
  color: #333;
  font-weight: 600;
  margin: 20px 0 50px;
}
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
  top: 65px;
}
.change_type.sj {
  position: absolute;
  right: 28px;
  top: 105px;
}
.table {
  margin-bottom: 50px;
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
</style>
<style lang="scss">
td.tableData_cell {
  .cell {
    color: #1e9fff;
    cursor: pointer;
  }
}
</style>

