<template>
  <div class="healthStats">
    <div class="healthStats_search">
      <el-row class="search_row">
        <el-col :span="6">
          <span class="search_label">年级：</span>
          <el-select class="search_value" v-model="search.gradeId.value" placeholder="请选择年级" @change="getClass" size="mini" style="width: 150px;">
                <el-option
                  v-for="item in search.gradeId.data"
                  :key="item.gradeId"
                  :label="item.gradeName"
                  :value="item.gradeId">
                </el-option>
          </el-select>
        </el-col>

        <el-col :span="6">
          <span class="search_label">学生：</span>
          <el-input class="search_value" v-model="search.studentInfo.value" placeholder="输入学生身份证号/护照号/学籍号" size="mini">
          </el-input>
        </el-col>
      </el-row>
      <el-row class="search_row">
        <el-col :span="6" style="width:65px;">
          <span class="search_label">指标：</span>
        </el-col>
        <el-col :span="5"   v-if="!moreSearch">
          <span class="search_label1">综合体质：</span>
          <el-select class="search_value1" v-model="search.testItemLevel.value" placeholder="请选择" size="mini" style="width: 120px;">
                <el-option
                  v-for="item in search.testItemLevel.data"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
          </el-select>
        </el-col>
        <el-col :span="5" v-if="moreSearch">
          <span class="search_label1">体重：</span>
          <el-select class="search_value1" v-model="search.bodyMassIndexLevel.value" placeholder="请选择"  size="mini">
                <el-option
                  v-for="item in search.bodyMassIndexLevel.data"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
          </el-select>
        </el-col>
        <span class="search_more" @click="showMore" v-show="!moreSearch">更多<i class="el-icon-arrow-down"></i></span>
        <span class="search_more" @click="hideMore" v-show="moreSearch">隐藏<i class="el-icon-arrow-up"></i></span>
      </el-row>
      <el-row class="search_row" style="padding-left:30px" v-if="moreSearch">
        <el-col :span="6" >
          <span class="search_label2">50米跑：</span>
          <el-select class="search_value2" v-model="search.fiftyMeterRunLevel.value" placeholder="请选择"  size="mini">
                <el-option
                  v-for="item in search.fiftyMeterRunLevel.data"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
          </el-select>
        </el-col>
        <el-col :span="6" >
          <span class="search_label2">50x8往返跑：</span>
          <el-select class="search_value2" v-model="search.fiftyByEightShuttleRunLevel.value" placeholder="请选择"  size="mini">
                <el-option
                  v-for="item in search.fiftyByEightShuttleRunLevel.data"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
          </el-select>
        </el-col>
        <el-col :span="6" >
          <span class="search_label2">800米跑：</span>
          <el-select class="search_value2" v-model="search.eightHundredMeterRunLevel.value" placeholder="请选择"  size="mini">
                <el-option
                  v-for="item in search.eightHundredMeterRunLevel.data"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
          </el-select>
        </el-col>
        <el-col :span="6" >
          <span class="search_label2">1000米跑：</span>
          <el-select class="search_value2" v-model="search.oneThousandMeterRunLevel.value" placeholder="请选择"  size="mini">
                <el-option
                  v-for="item in search.oneThousandMeterRunLevel.data"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="search_row" style="padding-left:30px" v-if="moreSearch">
        <el-col :span="6" >
          <span class="search_label2">一分钟跳绳：</span>
          <el-select class="search_value2" v-model="search.oneMinuteRopeSkippingLevel.value" placeholder="请选择"  size="mini">
                <el-option
                  v-for="item in search.oneMinuteRopeSkippingLevel.data"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
          </el-select>
        </el-col>
        <el-col :span="6" >
          <span class="search_label2">一分钟仰卧起坐：</span>
          <el-select class="search_value2" v-model="search.oneMinuteAbdominalCurlLevel.value" placeholder="请选择"  size="mini">
                <el-option
                  v-for="item in search.oneMinuteAbdominalCurlLevel.data"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
          </el-select>
        </el-col>
        <el-col :span="6" >
          <span class="search_label2">引体向上：</span>
          <el-select class="search_value2" v-model="search.upwardsLevel.value" placeholder="请选择"  size="mini">
                <el-option
                  v-for="item in search.upwardsLevel.data"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
          </el-select>
        </el-col>
        <el-col :span="6" >
          <span class="search_label2">坐位体前屈：</span>
          <el-select class="search_value2" v-model="search.sittingAndFlexionLevel.value" placeholder="请选择"  size="mini">
                <el-option
                  v-for="item in search.sittingAndFlexionLevel.data"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="search_row" style="padding-left:30px" v-if="moreSearch">
        <el-col :span="6" >
          <span class="search_label2">肺活量：</span>
          <el-select class="search_value2" v-model="search.lungCapacityLevel.value" placeholder="请选择"  size="mini">
                <el-option
                  v-for="item in search.lungCapacityLevel.data"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
          </el-select>
        </el-col>
        <el-col :span="6" >
          <span class="search_label2">视力：</span>
          <el-select class="search_value2" v-model="search.eyeEyesightLevel.value" placeholder="请选择"  size="mini">
                <el-option
                  v-for="item in search.eyeEyesightLevel.data"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
          </el-select>
        </el-col>
        <el-col :span="6" >
          <span class="search_label2">立定跳远：</span>
          <el-select class="search_value2" v-model="search.standingLongJumpLevel.value" placeholder="请选择"  size="mini">
                <el-option
                  v-for="item in search.standingLongJumpLevel.data"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="search_row" style="padding-left:30px" v-if="moreSearch">
        <el-col :span="6" >
          <span class="search_label2">脊柱侧弯：</span>
          <el-select class="search_value2" v-model="search.torsoTiltAngleLevel.value" placeholder="请选择"  size="mini">
                <el-option
                  v-for="item in search.torsoTiltAngleLevel.data"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="search_row">
        <el-col :span="12">
          <span class="search_label">学年度：</span>
          <el-select class="search_value" v-model="search.schoolYearArr.value" placeholder="请选择"  size="mini" multiple>
                <el-option
                  v-for="item in search.schoolYearArr.data"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
          </el-select>
        </el-col>
        <el-col :span="12" class="search_btn">
          <el-button size="mini" type="primary" @click="getFormData">查询</el-button>
          <el-button size="mini" type="primary" @click="clear">重置</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="healthContent">
      <h3 class="title-top">{{titleName}}
        <el-popover class="titlemessage"
            placement="right"
            width="280"
            trigger="click">
            <div class="titlemessage">
              <div>{{shuoming}}</div>
              <div>统计标准参考《国家学生体质健康标准（2014年修订）》</div>
            </div>
            <span slot="reference" class="shuoming">?</span>
          </el-popover>
      </h3>
      <div class="health_btn">
        <el-button :type="btncharts" class="health_charts"  @click="changeForm('charts')">统计报表</el-button>
        <el-button :type="btntable" class="health_table_btn" @click="changeForm('table')">数据详情</el-button>
      </div>
      <div class="charts" v-show="formType=='charts'">
        <div id="leftCharts"></div>
        <div id="rightCharts"></div>
      </div>
      <div class="healthStats_table" v-show="formType=='table'">
        <el-table :data="tableData.data"
                  style="width: 100%" @row-click="rowClick">
          <el-table-column
              label="区域"
              align="center">
               <template slot-scope="scope">
                  <span v-if="!showDown">{{ scope.row.gradeName }}</span>
                  <template v-else>
                    <span v-if="scope.row.gradeName=='全部'">{{ scope.row.gradeName }}</span>
                    <el-dropdown v-else trigger="click" @command="command($event,scope.row)">
                        <span class="el-dropdown-link">
                            {{ scope.row.gradeName }}<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="(item,index) in tableData.column" :key="index" :command="item.label">
                              {{item.label}}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                  </template>

               </template>
          </el-table-column>
          <el-table-column v-for="(item,index) in tableData.column" :key="index"
              :prop="item.fieldName" :label="item.label" align="center" :formatter="formatter">
          </el-table-column>
        </el-table>
      </div>
    </div>

  </div>
</template>

<script>
import echarts from "echarts";
import request from "@/utils/request";
import {
  TESTITEMLEVEL,
  TESTITEMLEVEL1,
  BODYMASSINDEXLEVEL,
  FIFTYMETERRUNLEVEL,
  EYEEYES,
  TORSOTILT,
  HEALTHCHART,
  HEALTHSER
} from "@/utils/comData";
import { getSchoolYear } from "@/utils/index";

export default {
  name: "healthStats",
  created() {},
  data() {
    return {
      physicalModel: "1",
      moreSearch: false,
      search: {
        gradeId: { value: 0, data: [] },
        dictClassId: { value: "", data: [] },
        studentInfo: { value: "" },
        testItemLevel: {
          value: 0,
          data: TESTITEMLEVEL1,
          name: "综合体质",
          fieldName: "healthTestScore"
        },
        bodyMassIndexLevel: {
          value: "",
          data: BODYMASSINDEXLEVEL,
          name: "体重",
          fieldName: "bodyMassIndexScore"
        },
        fiftyMeterRunLevel: {
          value: "",
          data: FIFTYMETERRUNLEVEL,
          name: "50米跑",
          fieldName: "fiftyMeterRunScore"
        },
        fiftyByEightShuttleRunLevel: {
          value: "",
          data: FIFTYMETERRUNLEVEL,
          name: "50x8往返跑",
          fieldName: "fiftyByEightShuttleRunScore"
        },
        eightHundredMeterRunLevel: {
          value: "",
          data: FIFTYMETERRUNLEVEL,
          name: "800米跑",
          fieldName: "eightHundredMeterRunScore"
        },
        oneThousandMeterRunLevel: {
          value: "",
          data: FIFTYMETERRUNLEVEL,
          name: "1000米跑",
          fieldName: "oneThousandMeterRunScore"
        },
        oneMinuteRopeSkippingLevel: {
          value: "",
          data: FIFTYMETERRUNLEVEL,
          name: "一分钟跳绳",
          fieldName: "oneMinuteRopeSkippingScore"
        },
        oneMinuteAbdominalCurlLevel: {
          value: "",
          data: FIFTYMETERRUNLEVEL,
          name: "一分钟仰卧起坐",
          fieldName: "oneMinuteAbdominalCurlScore"
        },
        upwardsLevel: {
          value: "",
          data: FIFTYMETERRUNLEVEL,
          name: "引体向上",
          fieldName: "upwardsScore"
        },
        standingLongJumpLevel: {
          value: "",
          data: FIFTYMETERRUNLEVEL,
          name: "立定跳远",
          fieldName: "standingLongJumpScore"
        },
        sittingAndFlexionLevel: {
          value: "",
          data: FIFTYMETERRUNLEVEL,
          name: "坐位体前屈",
          fieldName: "sittingAndFlexionScore"
        },
        lungCapacityLevel: {
          value: "",
          data: FIFTYMETERRUNLEVEL,
          name: "肺活量",
          fieldName: "lungCapacityScore"
        },
        eyeEyesightLevel: {
          value: "",
          data: EYEEYES,
          name: "视力",
          fieldName: "eyeEyesightLevel"
        },
        torsoTiltAngleLevel: {
          value: "",
          data: TORSOTILT,
          name: "脊柱侧弯",
          fieldName: "torsoTiltAngleLevel"
        },
        schoolYearArr: { value: [], data: getSchoolYear() }
      },
      titleName: "",
      titleData: {
        posProvinceName: "",
        posCityName: "",
        posDistrictName: "",
        schoolName: "",
        schoolTypeName: "",
        schoolYear: "",
        className: ""
      },
      formType: "charts",
      tableData: {
        data: [],
        column: []
      },
      showDown: false,
      btncharts: "primary",
      btntable: "",
      shuoming: ""
    };
  },
  methods: {
    phyRouter() {
      if (this.physicalModel === "1") {
        this.$router.push("/healthStats");
      } else if (this.physicalModel === "2") {
        this.$router.push("/physicalManageSecondary1");
      } else if (this.physicalModel === "3") {
        this.$router.push("/healthList");
      }
    },
    clear() {
      for (let name in this.search) {
        if (name == "schoolYearArr") {
          this.search[name].value = [
            this.search[name].data[0].value
          ]; 
        } else {
          this.search[name].value = "";
        }
      }
      this.search.gradeId.value = 0;
      if (!this.moreSearch) {
        this.search.testItemLevel.value = 0;
      }
    },
    showMore() {
      this.search.testItemLevel.value = "";
      this.moreSearch = true;
    },
    hideMore() {
      const searchField = [
        "bodyMassIndexLevel",
        "fiftyMeterRunLevel",
        "fiftyByEightShuttleRunLevel",
        "eightHundredMeterRunLevel",
        "oneThousandMeterRunLevel",
        "oneMinuteRopeSkippingLevel",
        "oneMinuteAbdominalCurlLevel",
        "upwardsLevel",
        "sittingAndFlexionLevel",
        "lungCapacityLevel",
        "eyeEyesightLevel",
        "torsoTiltAngleLevel"
      ];
      for (let i = 0; i < searchField.length; i++) {
        this.search[searchField[i]].value = "";
      }
      this.search.testItemLevel.value = 0;
      this.moreSearch = false;
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
    getFormData: getFormData,
    getClass(value) {
      this.search.dictClassId.value = "";
      if (value == 0) return;
      var data = {};
      data.schoolTypeGradeId = this.search.gradeId.value;
      var list = this.search.schoolYearArr.data[
        this.search.schoolYearArr.data.length - 1
      ].value.split("-");
      if (list.length > 0) {
        data.schoolYearStart = list[0];
        data.schoolYearEnd = list[1];
      }
      this.$store.dispatch("GetClass", data).then(response => {
        this.search.dictClassId.data = response.data;
      });
    },
    rowClick(row) {
      if (!this.showDown) {
        this.search.gradeId.value = row.gradeId;
        this.getFormData();
      }
    },
    command(value, row) {
      changePage(this, row, value);
    },
    formatter(row, column, cellValue, index) {
      return cellValue + "%";
    }
  },
  beforeRouteLeave(to, from, next) {
    if (
      to.name == "healthStats" ||
      to.name == "TestItemList" ||
      to.name == "HealthList" ||
      to.name == "studentHealthStatsList"
    ) {
      // 设置下一个路由的 meta
      to.meta.keepAlive = true; // B 跳转到 A 时，让 A 缓存，即不刷新
    } else {
      to.meta.keepAlive = false;
    }
    next();
  },
  mounted() {
    this.$store.dispatch("GetGrade").then(res => {
      let allArr = [{ gradeId: 0, gradeName: "全部" }];
      this.search.gradeId.data = allArr.concat(res.data);
    });
    this.search.schoolYearArr.value = [
      this.search.schoolYearArr.data[0]
        .value
    ];
    this.getFormData();
  }
};
function getFormData() {
  let param = {};
  if (this.search.studentInfo.value != "") {
    if (this.search.schoolYearArr.value.length > 1) {
      this.$message.error("只能选择一个学年进行学生信息查询");
      return;
    }
    param.identityNo = this.search.studentInfo.value;
    let schoolYear = this.search.schoolYearArr.value[0];
    param.schoolYearStart = schoolYear.split("-")[0];
    param.schoolYearEnd = schoolYear.split("-")[1];
    request
      .get("/api/auth/v1/physical/testItem/recordId", {
        params: param
      })
      .then(res => {
        if (res.data == null) {
          this.$message.error(
            "查询不到身份证号/护照号/学籍号为：" +
              this.search.studentInfo.value +
              "的学生信息"
          );
          return;
        }
        this.$router.push({
          path: "/testItemDetail",
          query: {
            id: res.data
          }
        });
      });
    return;
  }
  for (let name in this.search) {
    if (name != "schoolYearArr") {
      if (name == "dictClassId" || name == "studentInfo" || name == "gradeId") {
        if (this.search[name].value != "") {
          param[name] = this.search[name].value;
        }
      } else {
        if (isRealNum(this.search[name].value)) {
          param[name] = this.search[name].value;
        }
      }
    }
  }
  for (let i = 0; i < this.search.schoolYearArr.value.length; i++) {
    let schoolName = "schoolYearArr[" + i + "]";
    param[schoolName] = this.search.schoolYearArr.value[i];
  }
  let api = "";
  if (this.search.gradeId.value == 0) {
    api = "/api/auth/v1/physical/testItem/schoolGrade/stats";
    this.showDown = false;
  } else {
    this.showDown = true;
    api = "api/auth/v1/physical/testItem/gradeClass/stats";
  }
  request
    .get(api, {
      params: param
    })
    .then(res => {
      if (!this.showDown) {
        for (let name in this.titleData) {
          if (typeof res.data[0][name] != "undefined") {
            this.titleData[name] = res.data[0][name];
          }
        }
      }
      if (this.search.schoolYearArr.value.length > 1) {
        this.titleData.schoolYear = this.search.schoolYearArr.data[
          this.search.schoolYearArr.data.length - 1
        ].value;
      }
      if (this.search.gradeId.value == 0) {
        this.titleData.className = "";
      } else {
        for (let i = 0; i < this.search.gradeId.data.length; i++) {
          if (
            this.search.gradeId.value == this.search.gradeId.data[i].gradeId
          ) {
            this.titleData.className = this.search.gradeId.data[i].gradeName;
            break;
          }
        }
      }
      let chartsName = setTitleName(this);
      if (typeof res.data == "undefined" || res.data == null) {
        this.tableData.data = [];
        this.tableData.column = [];
        createdRightChart(this, [], [], [], chartsName);
        createdLeftChart(this, [], "nocharts", chartsName);
        this.$message.error("查询失败，没任何体侧数据");
        return;
      }
      if (res.data.length > 0 && res.data[0].phyStatsList == null) {
        this.tableData.data = [];
        this.tableData.column = [];
        createdLeftChart(this, [], "nocharts", chartsName);
        createdRightChart(this, [], [], [], chartsName);
        this.$message.error("查询失败，没任何体侧数据");
        return;
      }
      let data = parseData(res, this);
      this.tableData.data = data.tableData;
      this.tableData.column = data.column;
      createdLeftChart(this, data.leftSeries, "charts", chartsName);
      createdRightChart(
        this,
        data.legendData,
        data.xData,
        data.rightSeries,
        chartsName
      );
    });
}
function setTitleName(vm) {
  let titleName = "",
    schoolYear = "",
    searchName = {},
    index = 0,
    chartsName = "";
  if (!vm.moreSearch) {
    if (vm.search.testItemLevel.value) {
      vm.search.testItemLevel.data.forEach(item => {
        if (vm.search.testItemLevel.value == item.id) {
          titleName = "综合体质" + item.label + "率";
          chartsName = item.label + "率";
        }
      });
      switch (vm.search.testItemLevel.value) {
        case 1:
          vm.shuoming =
            "优秀率 = 成绩优秀（成绩≥90分）的人数/体质测试总人数×100%";
          break;
        case 2:
          vm.shuoming =
            "良好率 = 成绩良好（80分≤成绩＜90分）的人数/体质测试总人数×100%";
          break;
        case 3:
          vm.shuoming =
            "及格率 = 成绩及格（60分≤成绩＜80分）的人数/体质测试总人数×100%";
          break;
        case 4:
          vm.shuoming =
            "不及格率 = 成绩不及格（成绩＜60分）的人数/体质测试总人数×100%";
          break;
        case 5:
          vm.shuoming =
            "优良率 = 成绩良好以上（成绩>=80分）的人数/体质测试总人数×100%";
          break;
      }
    } else {
      titleName = "综合体质合格率";
      chartsName = "合格率";
      vm.shuoming = "合格率 = 成绩合格（成绩≥60分）的人数/体质测试总人数×100%";
    }
  } else {
    for (let name in vm.search) {
      let item = vm.search[name];
      if (typeof item.name != "undefined") {
        let isNumber = isRealNum(item.value);
        if (isNumber) {
          searchName = item;
          index++;
        }
      }
    }
    if (index == 0) {
      titleName = "综合体质合格率";
      chartsName = "合格率";
      vm.shuoming = "合格率 = 成绩合格（成绩≥60分）的人数/体质测试总人数×100%";
    } else if (index == 1) {
      searchName.data.forEach(element => {
        if (searchName.value == element.id) {
          titleName = searchName.name + element.label + "率";
          chartsName = element.label + "率";
        }
      });
      switch (searchName.name) {
        case "体重":
          switch (searchName.value) {
            case 5:
              vm.shuoming =
                "正常率 = BMI指数处于正常范围的人数/体测总人数×100%";
              break;
            case 7:
              vm.shuoming =
                "低体重率 = BMI指数处于低体重范围的人数/体测总人数×100%";
              break;
            case 8:
              vm.shuoming = "BMI指数处于超重范围的人数/体测总人数×100%";
              break;
            case 9:
              vm.shuoming = "BMI指数处于肥胖范围的人数/体测总人数×100%";
              break;
          }
          break;
        case "视力":
          switch (searchName.value) {
            case 10:
              vm.shuoming =
                "视力正常率 = 视力处于正常范围（左眼和右眼裸眼视力均≥5.0）的人数/体测总人数×100%";
              break;
            case 11:
              vm.shuoming =
                "轻度近视率 = 视力处于轻度近视范围（左眼或右眼裸眼视力≥4.9<5.0）的人数/体测总人数×100%";
              break;
            case 12:
              vm.shuoming =
                "中度近视率 = 视力处于中度近视范围（左眼或右眼裸眼视力>4.5<4.9）的人数/体测总人数×100%";
              break;
            case 13:
              vm.shuoming =
                "重度近视率 = 视力处于重度近视范围（左眼或右眼裸眼视力≤4.5）的人数/体测总人数×100%";
              break;
          }
          break;
        case "脊柱侧弯":
          switch (searchName.value) {
            case 14:
              vm.shuoming =
                "阴性率 = 躯干倾斜角处于阴性范围（躯干倾斜角≤ 3°）的人数/体测总人数×100%";
              break;
            case 15:
              vm.shuoming =
                "阳性率 = 躯干倾斜角处于阳性范围（躯干倾斜角≥3°＜7°）的人数/体测总人数×100%";
              break;
            case 16:
              vm.shuoming =
                "强阳性率 = 躯干倾斜角处于强阳性范围（躯干倾斜角≥7°）的人数/体测总人数×100%";
              break;
          }
          break;
        default:
          switch (searchName.value) {
            case 0:
              vm.shuoming =
                "合格率 = 成绩合格（成绩≥60分）的人数/体质测试总人数×100%";
              break;
            case 1:
              vm.shuoming =
                "优秀率 = 成绩优秀（成绩≥90分）的人数/体质测试总人数×100%";
              break;
            case 2:
              vm.shuoming =
                "良好率 = 成绩良好（80分≤成绩＜90分）的人数/体质测试总人数×100%";
              break;
            case 3:
              vm.shuoming =
                "及格率 = 成绩及格（60分≤成绩＜80分）的人数/体质测试总人数×100%";
              break;
            case 4:
              vm.shuoming =
                "不及格率 = 成绩不及格（成绩＜60分）的人数/体质测试总人数×100%";
              break;
          }
          break;
      }
    } else {
      titleName = "符合筛选条件的比率";
      chartsName = "比率";
      vm.shuoming = "比率 = 符合筛选条件的人数/体测总人数×100%";
    }
  }
  if (vm.search.schoolYearArr.value.length > 1) {
    schoolYear = "多学年";
  } else {
    schoolYear = vm.titleData.schoolYear + "学年";
  }
  vm.titleName =
    schoolYear + vm.titleData.schoolName + vm.titleData.className + titleName;
  return chartsName;
}
function isRealNum(val) {
  // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除
  if (val === "" || val == null) {
    return false;
  }
  if (!isNaN(val)) {
    return true;
  } else {
    return false;
  }
}

function parseData(res, vm) {
  let data = res.data;
  let column = [],
    xData = [],
    legendData = [],
    rightSeries = [],
    leftSeries = [],
    tabelObj = { 全部: [] },
    dataObj = {
      gradeName: "",
      classId: "",
      schoolTypeGradeId: "",
      gradeId: ""
    };
  data.forEach(item => {
    let phyStatsList = item.phyStatsList;
    phyStatsList.forEach(item1 => {
      if (vm.showDown) {
        if (xData.indexOf(item1.schoolClassName) < 0) {
          xData.push(item1.schoolClassName);
        }
        if (!tabelObj[item1.schoolClassName]) {
          tabelObj[item1.schoolClassName] = [];
        }
      } else {
        if (xData.indexOf(item1.schoolGradeName) < 0) {
          xData.push(item1.schoolGradeName);
        }
        if (!tabelObj[item1.schoolGradeName]) {
          tabelObj[item1.schoolGradeName] = [];
        }
      }
    });
  });
  for (let i = 0; i < data.length; i++) {
    let gradeData = data[i];
    dataObj[gradeData.schoolYear] = "";
    //解释表格数据
    column.push({
      fieldName: gradeData.schoolYear,
      label: gradeData.schoolYear
    });
    //解释左边柱状图数据
    let leftRowData = JSON.parse(JSON.stringify(HEALTHSER));
    leftRowData.name = gradeData.schoolYear;
    let item = {};
    if (gradeData.avgPercent == null) {
      leftRowData.data = [0];
      item[gradeData.schoolYear] = 0;
      tabelObj["全部"].push(item);
    } else {
      leftRowData.data = [gradeData.avgPercent.toFixed(2)];
      item[gradeData.schoolYear] = gradeData.avgPercent;
      tabelObj["全部"].push(item);
    }
    leftSeries.push(leftRowData);
    //解释右边柱状图数据
    legendData.push(gradeData.schoolYear);
    let rightRowData = JSON.parse(JSON.stringify(HEALTHSER));
    rightRowData.name = gradeData.schoolYear;
    for (let j = 0; j < gradeData.phyStatsList.length; j++) {
      item = {
        classId: gradeData.phyStatsList[j].classId,
        schoolTypeGradeId: gradeData.phyStatsList[j].schoolTypeGradeId,
        gradeId: gradeData.phyStatsList[j].gradeId
      };
      if (gradeData.phyStatsList[j].currentPercent == null) {
        //rightRowData.data.push(0);
        gradeData.phyStatsList[j].value = 0;
        item[gradeData.schoolYear] = 0;
        if (vm.showDown) {
          tabelObj[gradeData.phyStatsList[j].schoolClassName].push(item);
        } else {
          tabelObj[gradeData.phyStatsList[j].schoolGradeName].push(item);
        }
      } else {
        gradeData.phyStatsList[j].value =
          gradeData.phyStatsList[j].currentPercent;
        //  rightRowData.data.push(gradeData.phyStatsList[j].currentPercent)
        item[gradeData.schoolYear] = gradeData.phyStatsList[j].currentPercent;
        if (vm.showDown) {
          tabelObj[gradeData.phyStatsList[j].schoolClassName].push(item);
        } else {
          tabelObj[gradeData.phyStatsList[j].schoolGradeName].push(item);
        }
      }
      rightRowData.data.push(gradeData.phyStatsList[j]);
    }
    rightSeries.push(rightRowData);
  }
  let tableData = [];
  for (let name in tabelObj) {
    let rowObj = JSON.parse(JSON.stringify(dataObj));
    rowObj.gradeName = name;
    let item1 = tabelObj[name];
    for (let a = 0; a < item1.length; a++) {
      for (let name2 in item1[a]) {
        if (typeof rowObj[name2] != "undefined") {
          rowObj[name2] = item1[a][name2];
        }
      }
    }
    tableData.push(rowObj);
  }
  return {
    column: column,
    leftSeries: leftSeries,
    legendData: legendData,
    xData: xData,
    rightSeries: rightSeries,
    tableData: tableData
  };
}
function createdLeftChart(vm, series, type, chartsName) {
  // console.log("123");
  let leftChartsDom = echarts.init(document.getElementById("leftCharts"));
  let option = JSON.parse(JSON.stringify(HEALTHCHART));
  option.yAxis.name = chartsName;
  option.grid = {
    left: "14%",
    right: "10%",
    bottom: "80",
    containLabel: true
  };

  if (type == "nocharts") {
    option.xAxis.data = [];
  } else {
    if (!vm.showDown) {
      option.xAxis.data = ["全校"];
    } else {
      for (let i = 0; i < vm.search.gradeId.data.length; i++) {
        if (vm.search.gradeId.value == vm.search.gradeId.data[i].gradeId) {
          option.xAxis.data = [vm.search.gradeId.data[i].gradeName];
          break;
        }
      }
    }
  }
  let numberSeries = series.length;
  let changeformatterstr = false,
    formatterstr = "";
  if (series.length > 0) {
    if (numberSeries > 1) {
      formatterstr = "{b}<br />";
      changeformatterstr = true;
    }
    for (let i = 0; i < numberSeries; i++) {
      series[i].stack = series[i].name;
      if (changeformatterstr) {
        formatterstr += "{a" + i + "}:{c" + i + "}%<br />";
      }
      let line = {
        name: series[i].name,
        stack: series[i].name,
        type: "bar",
        label: {
          normal: {
            show: true,
            position: "insideBottom",
            textBorderWidth: 2,
            textStyle: {
              color: "#0b0b0c"
            },
            formatter: "{c}%"
          }
        },
        itemStyle: {
          normal: {
            color: "rgba(128, 128, 128, 0)"
          }
        },
        data: series[i].data
      };
      series.push(line);
    }
  }
  if (numberSeries > 1) {
    option.tooltip.formatter = formatterstr;
  }
  option.series = series;
  leftChartsDom.setOption(option, true);
}
function createdRightChart(vm, legendData, xData, series, chartsName) {
  let option = JSON.parse(JSON.stringify(HEALTHCHART));
  option.yAxis.name = chartsName;
  let rightChartsDom = echarts.init(document.getElementById("rightCharts"));
  let endValue=100;
  let xLength=vm.search.schoolYearArr.value.length*xData.length;
  console.log(xLength);
  if(xLength>9){
    endValue=9/xLength*100
  }
  option.dataZoom = [
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
  ];
  option.grid = {
    left: "4%",
    right: "5%",
    bottom: "80",
    containLabel: true
  };
  option.xAxis.data = xData;
  option.legend.data = legendData;
  let numberSeries = series.length;
  let changeformatterstr = false,
    formatterstr = "";
  if (series.length > 0) {
    if (numberSeries > 1) {
      formatterstr = "{b}<br />";
      changeformatterstr = true;
    }
    for (let i = 0; i < numberSeries; i++) {
      series[i].stack = series[i].name;
      if (changeformatterstr) {
        formatterstr += "{a" + i + "}:{c" + i + "}%<br />";
      }
      let line = {
        name: series[i].name,
        type: "bar",
        stack: series[i].name,
        label: {
          normal: {
            show: true,
            position: "insideBottom",
            textBorderWidth: 2,
            textStyle: {
              color: "#0b0b0c"
            },
            formatter: "{c}%"
          }
        },
        itemStyle: {
          normal: {
            color: "rgba(128, 128, 128, 0)"
          }
        },
        data: series[i].data
      };
      series.push(line);
    }
  }
  if (numberSeries > 1) {
    option.tooltip.formatter = formatterstr;
  }
  option.series = series;
  rightChartsDom.setOption(option, true);
  rightChartsDom.off("click"); // 防止重复绑定
  rightChartsDom.on("click", function(params) {
    if (vm.showDown) {
      changePage(vm, params.data, params.seriesName);
    } else {
      vm.search.gradeId.value = params.data.gradeId;
      vm.getFormData();
    }
  });
}
function changePage(vm, data, schoolYear) {
  let className = data.schoolClassName ? data.schoolClassName : data.gradeName;
  let searchField = [],
    dataArr = [];
  for (name in vm.search) {
    if (name != "schoolYearArr" && name != "gradeId" && name != "studentInfo") {
      let item = vm.search[name];
      let isNumber = isRealNum(item.value);
      if (isNumber) {
        searchField.push({
          label: item.name,
          value: item.value,
          searchName: name,
          fieldName: item.fieldName
        });
        dataArr = item.data;
      }
    }
  }
  let titleName =
    schoolYear +
    "学年" +
    vm.titleData.schoolName +
    "(" +
    vm.titleData.className +
    className;
  if (searchField.length == 1) {
    titleName += ")" + searchField[0].label;
    dataArr.forEach(item => {
      if (item.id == searchField[0].value) {
        titleName += item.label + "的学生成绩";
      }
    });
  } else {
    titleName += ")符合筛选条件的学生成绩";
  }

  let params = {
    gradeId: data.gradeId,
    classId: data.classId,
    schoolYear: schoolYear,
    titleName: titleName,
    searchField: searchField,
    type:"update"
  };
  vm.$router.push({
    name: "studentHealthStatsList",
    params: params
  });
}
</script>

<style lang="scss" scoped>
.healthStats {
  .healthStats_search {
    background-color: white;
    border-radius: 10px;
    padding: 15px 10px;
    position: relative;
    margin-bottom: 10px;
    .search_row {
      font-size: 0px;
      margin-bottom: 15px;
      .el-col {
        height: 30px;
        line-height: 30px;
      }
      .search_label {
        display: inline-block;
        font-size: 14px;
        margin-right: 5px;
        width: 60px;
        text-align: right;
      }
      .search_value {
        width: calc(100% - 65px);
      }
      .search_label1 {
        display: inline-block;
        font-size: 14px;
        margin-right: 5px;
        width: 80px;
        text-align: right;
      }
      .search_value1 {
        width: calc(100% - 85px);
      }
      .search_label2 {
        display: inline-block;
        font-size: 14px;
        margin-right: 5px;
        width: 115px;
        text-align: right;
      }
      .search_value2 {
        width: calc(100% - 120px);
      }
      .search_btn {
        text-align: right;
      }
      .search_more {
        font-size: 14px;
        line-height: 30px;
        display: block;
        width: 60px;
        text-align: center;
        cursor: pointer;
        float: right;
        color: #2e89e6;
      }
    }
  }

  .healthContent {
    background-color: #ffffff;
    border-radius: 8px;
    padding: 15px;
    position: relative;
    min-height: 600px;
    h3 {
      text-align: center;
      line-height: 32px;
    }
    .health_btn {
      position: absolute;
      top: 70px;
      right: 20px;
      z-index: 1000;
      .el-button {
        display: block;
        margin: 0px;
      }
      .health_charts {
        margin-bottom: 10px;
      }
    }
    .charts {
      width: 1000px;
      margin: auto;
      margin-top: 50px;
      padding-left: 25px;
      #leftCharts {
        width: 250px;
        height: 500px;
        display: inline-block;
      }

      #rightCharts {
        width: 700px;
        height: 500px;
        display: inline-block;
      }
    }
    .healthStats_table {
      margin: 80px 15px 0px 15px;
    }
  }
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
.healthStats {
  .search_value {
    .el-select__tags {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>


