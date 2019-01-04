<template>
  <div
    class="content"
    v-loading="loading"
    element-loading-text="请稍后"
    element-loading-spinner="el-icon-loading"
  >
    <el-row>
      <el-col>
        <div class="title-top">{{lesson.gradeName}}{{lesson.className}}{{lesson.date}}班级课堂表现</div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">上课时间：{{lesson.time}}</el-col>
      <el-col :span="5">上课人数：{{lesson.studentCount}}</el-col>
      <!--<el-col :span="10" v-if="lesson.leaveStudentArr.length<=5">-->
      <!--请假：{{lesson.leaveStudent ? lesson.leaveStudent : 0}}-->
      <!--</el-col>-->
      <!--<el-col v-else :span="10">-->
      <el-col :span="10">
        <el-popover
          placement="top-start"
          title="请假名单："
          width="200"
          trigger="hover"
          :content="lesson.leaveStudent"
        >
          <div slot="reference">
            请假：{{lesson.leaveStudentCount}}人
            <!--<template v-for="(item,index) in lesson.leaveStudentArr">-->
            <!--<span :key="index" v-if="index<5">{{item.name}}、</span>-->
            <!--<span :key="index" v-if="index==5">{{item.name}}</span>-->
            <!--</template>-->
          </div>
        </el-popover>
      </el-col>
    </el-row>
    <el-row>
      <el-col>课堂内容：{{lesson.content}}</el-col>
    </el-row>
    <div class="line"></div>
    <div style="width: 100%;text-align: center">
      <el-radio-group
        v-model="category"
        @change="changeReport"
        style="margin-bottom: 30px;margin-top: 30px"
      >
        <el-radio-button label="1">运动强度</el-radio-button>
        <el-radio-button label="2">运动量</el-radio-button>
        <!--<el-radio-button label="3">运动项目</el-radio-button>-->
      </el-radio-group>
    </div>
    <div v-if="intensityShow" class="tab">
      <el-row>
        <el-col :span="12">
          <!--<div id="intensityPie">-->
          <!--</div>-->
          <classReportPieChart :chartId="intensityPieId" ref="classReportPieChart"></classReportPieChart>
        </el-col>
        <el-col :span="12" style="position: relative;">
          <!--<div id="intensityLine">-->
          <!--</div>-->
          <classReportLineChart :chartId="intensityLineId" ref="classReportLineChart"></classReportLineChart>
          <el-row style="position: absolute;bottom: 20px;left: 35%">
            <el-col :span="12" style="text-align: center;padding-right: 20px;">
              <span style="font-size: 20px;">{{lastaverageHeartRate || 0}}bpm</span>
              <br>上堂课平均心率
            </el-col>
            <el-col :span="12" style="text-align: center;padding-left: 20px;">
              <span style="font-size: 20px;">{{allCourseAverageHeartRate}}bpm</span>
              <br>全部课平均心率
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <div>
        <span class="tab-title">全班运动强度列表</span>
        <el-table
          :data="intensityList"
          style="width: 100%"
          :default-sort="{prop: 'studentNo', order: 'ascending'}"
          :header-cell-style="headerStyle"
          :cell-style="cellStyle"
          @row-click="personalReport"
        >
          <el-table-column prop="studentNo" label="学号" sortable></el-table-column>
          <el-table-column prop="studentName" label="姓名" sortable></el-table-column>
          <el-table-column prop="sex" label="性别" sortable></el-table-column>
          <el-table-column prop="averageHeartRate" label="平均心率" sortable></el-table-column>
          <el-table-column prop="maxHeartRate" label="最高心率" sortable></el-table-column>
          <el-table-column prop="minHeartRate" label="最低心率" sortable></el-table-column>
        </el-table>
        <div>
          <div v-show="!isShowAllIntensity" class="table-footer font-color">
            <a @click="showAllIntensity">展开全部
              <i style="margin-left: 5px;" class="el-icon-arrow-down"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div v-if="exerciseShow" class="tab">
      <el-row>
        <el-col :span="12">
          <span class="tab-title">运动时长</span>
          <el-table
            :data="exercise.sportTimeRank"
            style="width: 90%"
            :header-cell-style="headerStyle"
            :cell-style="cellStyle"
          >
            <el-table-column label="名次">
              <template slot-scope="scope">{{scope.$index + 1}}</template>
            </el-table-column>
            <el-table-column label="姓名" prop="studentName"></el-table-column>
            <el-table-column label="运动时长（分）" prop="sportTime" :formatter="formatterValue"></el-table-column>
          </el-table>
        </el-col>
        <el-col :span="12" class="avgDiv">本堂课平均运动时长：
          <span class="large">{{exercise.averageSportTime}}</span>min
          <br>上堂课平均运动时长：
          <span class="large">{{exercise.lastAverageSportTime}}</span>min
          <br>全部课平均运动时长：
          <span class="large">{{exercise.allCourseAverageSportTime}}</span>min
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <span class="tab-title">运动步数</span>
          <el-table
            :data="exercise.stepNumRank"
            style="width: 90%"
            :header-cell-style="headerStyle"
            :cell-style="cellStyle"
          >
            <el-table-column label="名次">
              <template slot-scope="scope">{{scope.$index + 1}}</template>
            </el-table-column>
            <el-table-column label="姓名" prop="studentName"></el-table-column>
            <el-table-column label="运动步数（步）" prop="stepNum"></el-table-column>
          </el-table>
        </el-col>
        <el-col :span="12" class="avgDiv">本堂课平均运动步数：
          <span class="large">{{exercise.averageStepNum }}</span>步
          <br>上堂课平均运动步数：
          <span class="large">{{exercise.lastAverageStepNum }}</span>步
          <br>全部课平均运动步数：
          <span class="large">{{exercise.allCourseAverageStepNum }}</span>步
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <span class="tab-title">运动消耗</span>
          <!--<div id="calorieExpendLine"></div>-->
          <classReportLineChart :chartId="calorieExpendLineId" ref="classReportLineChart"></classReportLineChart>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-table
            :data="exercise.calorieExpendRank"
            style="width: 90%"
            :header-cell-style="headerStyle"
            :cell-style="cellStyle"
          >
            <el-table-column label="名次">
              <template slot-scope="scope">{{scope.$index + 1}}</template>
            </el-table-column>
            <el-table-column label="姓名" prop="studentName"></el-table-column>
            <el-table-column label="运动消耗（大卡）" prop="calorieExpend" :formatter="formatterValue"></el-table-column>
          </el-table>
        </el-col>
        <el-col :span="12" class="avgDiv">本堂课平均运动消耗：
          <span class="large">{{exercise.averageCalorieExpend | numFilters}}</span>大卡
          <br>上堂课平均运动消耗：
          <span class="large">{{exercise.lastAverageCalorieExpend | numFilters}}</span>大卡
          <br>全部课平均运动消耗：
          <span class="large">{{exercise.allCourseAverageCalorieExpend | numFilters}}</span>大卡
        </el-col>
      </el-row>
      <div>
        <span class="tab-title">全班运动量列表</span>
        <el-table
          :data="exercise.list"
          style="width: 100%"
          :default-sort="{prop: 'studentNo', order: 'ascending'}"
          :header-cell-style="headerStyle"
          :cell-style="cellStyle"
          @row-click="personalReport"
        >
          <el-table-column prop="studentNo" label="学号" sortable></el-table-column>
          <el-table-column prop="studentName" label="姓名" sortable></el-table-column>
          <el-table-column prop="sex" label="性别" sortable :formatter="formatterSex"></el-table-column>
          <el-table-column prop="sportTime" label="运动时长(分)" :formatter="formatterValue" sortable></el-table-column>
          <el-table-column prop="stepNum" label="运动步数（步）" sortable></el-table-column>
          <el-table-column
            prop="calorieExpend"
            label="运动消耗（大卡）"
            :formatter="formatterValue"
            sortable
          ></el-table-column>
        </el-table>
        <div>
          <div v-show="exerciseShowTable" class="table-footer font-color">
            <a @click="exerciseList">展开全部
              <i style="margin-left: 5px;" class="el-icon-arrow-down"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div v-if="skipShow" class="tab">
      <el-row>
        <el-col>
          <div style="float:left;line-height: 30px;margin-left: 10px;">
            <img :src="icon_teacher_file_tip">
            说明： 达标值是通过
            <span class="font-color">《国家学生体质健康标准（2014年修订）》</span>一分钟跳绳评分标准推算出的达标建议值。
          </div>
        </el-col>
      </el-row>
      <div v-for="(item, index) in skip" :key="index">
        <el-row style="margin-top: 30px;">
          <el-col :span="24" class>
            <div class="title-div">
              <div>第{{item.index}}次</div>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" style="padding-left: 20px">跳绳时长：{{item.testTime}} 秒</el-col>
          <el-col :span="5">开始时间：{{item.startTime}}</el-col>
          <el-col :span="13">平均次数：{{item.averageCount}} 次</el-col>
        </el-row>
        <el-row>
          <el-col :span="11" style="padding-left: 20px">男生达标：
            <span class="blue_letter">{{item.manReachStandardCount}}人</span>
            （达标次数：{{item.manStandardCount}}次）
          </el-col>
          <el-col :span="13">女生达标：
            <span class="blue_letter">{{item.girlReachStandardCount}}人</span>
            （达标次数：{{item.girlStandardCount}}次）
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-table
              :data="item.courseTestRankingList"
              style="width: 100%"
              :header-cell-style="headerStyle"
              :cell-style="cellStyle"
              @row-click="personalReportSkip"
            >
              <el-table-column label="排名">
                <template slot-scope="scope">
                  <span v-if="(scope.$index + 1) < 10">0{{scope.$index + 1}}</span>
                  <span v-if="(scope.$index + 1) >= 10">{{scope.$index + 1}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="姓名" sortable></el-table-column>
              <el-table-column prop="sex" label="性别" sortable></el-table-column>
              <el-table-column prop="studentNo" label="学号" sortable></el-table-column>
              <el-table-column prop="skipCounts" label="跳绳次数" sortable></el-table-column>
              <el-table-column prop="interruptCount" label="中断次数" sortable></el-table-column>
            </el-table>
            <div>
              <div v-show="!item.showAll" class="table-footer font-color">
                <a @click="showAllSkip(index)">展开全部
                  <i style="margin-left: 5px;" class="el-icon-arrow-down"></i>
                </a>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate, formatMinute } from "@/utils/index";
import ClassReportLineChart from "@/components/Chart/ClassReportLineChart";
import ClassReportPieChart from "@/components/Chart/ClassReportPieChart";
import icon_teacher_file_tip from "@/assets/imgs/icon_teacher_file_tip.png";

export default {
  name: "LessonLPerformance",
  components: {
    classReportLineChart: ClassReportLineChart,
    classReportPieChart: ClassReportPieChart
  },
  data() {
    return {
      exerciseShowTable: false,
      loading: true,
      icon_teacher_file_tip: icon_teacher_file_tip,
      headerStyle: {
        textAlign: "center",
        color: "#525252",
        backgroundColor: "#F9F9F9"
      }, // 表格头部样式
      cellStyle: { textAlign: "center", cursor: "pointer" }, // 表格单元格样式
      isShowAllIntensity: false,
      intensityShow: true,
      exerciseShow: false,
      skipShow: false,
      category: 1,
      lesson: {
        content:'',
        time:'',
        studentCount:'',
        leaveStudentCount:'',
        courseId: 0,
        sort: 1,
        courseNo: "",
        leaveStudentList: "",
        leaveStudentArr: []
      },
      intensityPieList: [],
      intensityPieDataList: [],
      lastaverageHeartRate: 0,
      allCourseAverageHeartRate: 0,
      intensityLineId: "intensityLine", // 运动强度折线图ID
      calorieExpendLineId: "calorieExpendLine", // 运动量折线图ID
      intensityPieId: "intensityPie", // 运动强度环形图ID
      skipPieId1: "skipPie1", // 跳绳测试第一次环形图ID
      skipPieId2: "skipPie2", // 跳绳测试第二次环形图ID
      intensityLineXList: [],
      intensityLineDataList: [],
      intensityList: [],
      intensityHideList: [],
      insideColor: [],
      outsideColor: [],
      exercise: {
        averageStepNum: 0,
        averageSportTime: 0,
        averageCalorieExpend: 0,
        maxStepNum: 0,
        maxSportTime: 0,
        maxCalorieExpend: 0,
        lastMaxStepNum: 0,
        lastMaxSportTime: 0,
        lastMaxCalorieExpend: 0,
        lastAverageStepNum: 0,
        lastAverageSportTime: 0,
        lastAverageCalorieExpend: 0,
        allCourseAverageStepNum: 0,
        allCourseAverageCalorieExpend: 0,
        allCourseAverageSportTime: 0,
        lineXList: [],
        lineDataList: [],
        sportTimeRank: [],
        stepNumRank: [],
        calorieExpendRank: [],
        list: [],
        hideList: []
      },
      skip: [
        {
          skipList: [],
          hideList: [],
          showAll: false
        }
      ],
      getDoIntensityRequest: false,
      getDoExerciseRequest: false
    };
  },
  filters: {
    numFilters(value) {
      const re = /^[0-9]*[1-9][0-9]*$/;
      const rsCheck = re.test(value);
      if (!rsCheck) {
        return Number(value).toFixed(1);
      } else {
        return value;
      }
    }
  },
  methods: {
    changeReport() {
      var that = this;
      switch (this.category) {
        case "1":
          this.doIntensityRequest();
          this.intensityShow = true;
          this.exerciseShow = false;
          this.skipShow = false;
          break;
        case "2":
          this.doExerciseRequest();
          this.intensityShow = false;
          this.exerciseShow = true;
          this.skipShow = false;
          break;
        case "3":
          this.intensityShow = false;
          this.exerciseShow = false;
          this.skipShow = true;
          setTimeout(function() {
            that.doSkipRequest();
          }, 100);
          break;
        default:
          this.doIntensityRequest();
          this.intensityShow = true;
          this.exerciseShow = false;
          this.skipShow = false;
      }
    },
    // 个人报告
    personalReport(row, event, column) {
      this.$router.push({
        path: "/persionalReport",
        query: {
          courseId: this.lesson.courseId,
          studentId: row.studentId
        }
      });
    },
    personalReportSkip(row, event, column) {
      this.$router.push({
        path: "/persionalReport",
        query: {
          courseId: this.lesson.courseId,
          studentId: row.id
        }
      });
    },
    formatterValue(row, column, cellValue, index) {
      return cellValue.toFixed(1);
    },
    formatterSex(row, column, cellValue, index) {
      let value = "男";
      if (cellValue == 2) {
        value = "女";
      }
      return value;
    },
    exerciseList() {
      this.exercise.list = this.exercise.list.concat(this.exercise.hideList);
      this.exerciseShowTable = false;
    },
    doExerciseRequest() {
      if (this.getDoExerciseRequest) {
        this.expendLineInit();
        return;
      }
      this.getDoExerciseRequest = true;
      this.lesson.courseId = this.$route.query.courseId;
      this.loading = true;
      this.$store
        .dispatch("SchoolClassExerciseVolume", {
          courseId: this.lesson.courseId,
          sort: 1
        })
        .then(response => {
          // this.exercise = response.dat
          this.loading = false;
          this.exercise.averageSportTime = response.data.averageSportTime.toFixed(
            1
          );
          this.exercise.maxSportTime = response.data.maxSportTime.toFixed(1);
          this.exercise.lastMaxSportTime = response.data.lastMaxSportTime.toFixed(
            1
          );
          this.exercise.lastAverageSportTime = response.data.lastAverageSportTime.toFixed(
            1
          );
          this.exercise.allCourseAverageSportTime = response.data.allCourseAverageSportTime.toFixed(
            1
          );
          this.exercise.averageStepNum = response.data.averageStepNum;
          this.exercise.averageCalorieExpend =
            response.data.averageCalorieExpend;
          this.exercise.maxStepNum = response.data.maxStepNum;
          this.exercise.maxCalorieExpend = response.data.maxCalorieExpend;
          this.exercise.lastMaxStepNum = response.data.lastMaxStepNum;
          this.exercise.lastMaxCalorieExpend =
            response.data.lastMaxCalorieExpend;
          this.exercise.lastAverageStepNum = response.data.lastAverageStepNum;
          this.exercise.lastAverageCalorieExpend =
            response.data.lastAverageCalorieExpend;
          this.exercise.allCourseAverageStepNum =
            response.data.allCourseAverageStepNum;
          this.exercise.allCourseAverageCalorieExpend =
            response.data.allCourseAverageCalorieExpend;
          let tableArr = response.data.studentInfo;
          if (tableArr.length > 5) {
            this.exerciseShowTable = true;
            this.exercise.list = tableArr.slice(0, 5);
            this.exercise.hideList = tableArr.slice(5);
          } else {
            this.exerciseShowTable = false;
            this.exercise.list = tableArr;
          }
          response.data.classCourseCalorieExpendList.forEach((val, index) => {
            this.exercise.lineXList.push(val.node);
            this.exercise.lineDataList.push({
              value: val.value,
              symbolSize: 4
            });
          });
          //运动时长
          let sportTimeRank = JSON.parse(JSON.stringify(tableArr));
          sportTimeRank.sort((a, b) => {
            return b.sportTime - a.sportTime;
          });
          this.exercise.sportTimeRank = sportTimeRank.slice(0, 5);
          //运动步数
          let stepNumRank = JSON.parse(JSON.stringify(tableArr));
          stepNumRank.sort((a, b) => {
            return b.stepNum - a.stepNum;
          });
          this.exercise.stepNumRank = stepNumRank.slice(0, 5);
          //运动消耗
          let calorieExpendRank = JSON.parse(JSON.stringify(tableArr));
          calorieExpendRank.sort((a, b) => {
            return b.calorieExpend - a.calorieExpend;
          });
          this.exercise.calorieExpendRank = calorieExpendRank.slice(0, 5);
          this.expendLineInit();
        })
        .catch(err => {
          // console.log(err);
        });
      // this.exercise.sportTimeRank
      // this.exercise.stepNumRank
      //this.exercise.calorieExpendRank
    },
    expendLineInit() {
      var params = {
        id: "calorieExpendLine",
        title: "",
        xUnit: "时间(min)",
        yUnit: "运动消耗(大卡)",
        yMax: 600,
        avgName: "平均消耗",
        xLine: this.exercise.lineXList,
        data: this.exercise.lineDataList,
        backgroundColor: "#fff"
      };
      let vm = this;
      setTimeout(function() {
        vm.$refs.classReportLineChart.chartInit(params);
      }, 1000);
    },
    showAllIntensity() {
      if (!this.isShowAllIntensity) {
        this.isShowAllIntensity = true;
        if (this.intensityHideList.length > 0) {
          this.intensityList = this.intensityList.concat(
            this.intensityHideList
          );
        }
      }
    },
    showAllSkip(index) {
      if (!this.skip[index].showAll) {
        this.skip[index].showAll = true;
        this.$set(this.skip, index, this.skip[index]);
        if (this.skip[index].hideList.length > 0) {
          this.skip[index].courseTestRankingList = this.skip[
            index
          ].courseTestRankingList.concat(this.skip[index].hideList);
        }
      }
    },
    doIntensityRequest() {
      if (this.getDoIntensityRequest) {
        this.drawCharts();
        return;
      }
      this.getDoIntensityRequest = true;
      this.loading = true;
      this.lesson.courseId = this.$route.query.courseId;
      this.$store
        .dispatch("CourseStudentInfo", {
          courseId: this.lesson.courseId,
          sort: 1
        })
        .then(response => {
          if(response.status.code == '0'){
            this.lesson.studentCount = response.data.studentCount;
            this.lesson.gradeName = response.data.gradeName;
            this.lesson.className = response.data.className;
            this.lesson.leaveStudentCount = response.data.leaveStudentCount;
            if (response.data.courseType === 1) {
              this.lesson.content = "为技能学习为主";
            } else {
              this.lesson.content = "为技能锻炼为主";
            }
            this.lesson.date = formatDate(
              response.data.courseStartTime,
              "yyyy/MM/dd"
            );
            this.lesson.time =
              formatDate(response.data.courseStartTime, "hh:mm") +
              "-" +
              formatDate(response.data.courseEndTime, "hh:mm");
            this.lesson.leaveStudent = "";
            this.lesson.leaveStudentArr = response.data.leaveStudentList;
            response.data.leaveStudentList.forEach((val, index) => {
              this.lesson.leaveStudent += val.name + "、";
            });
            this.lesson.leaveStudent = this.lesson.leaveStudent.substr(
              0,
              this.lesson.leaveStudent.length - 1
            );
          }else{
            this.$message.error(response.status.msg);
          }
        });
      this.$store
        .dispatch("HeartRateReport", {
          courseId: this.lesson.courseId,
          sort: 1
        })
        .then(response => {
          this.intensityPieDataList = [];
          this.intensityPieList = [];
          if (response.data.oneGradeHeartRateValue !== 0) {
            this.intensityPieDataList.push({
              value: response.data.oneGradeHeartRateValue,
              name: "160以上"
            });
            this.intensityPieList.push({
              value: response.data.oneGradeHeartRateValue
            });
            this.insideColor.push("#FE7F5D");
            this.outsideColor.push("#FE714B");
          }
          if (response.data.twoGradeHeartRateNo !== 0) {
            this.intensityPieDataList.push({
              value: response.data.twoGradeHeartRateNo,
              name: "140-160"
            });
            this.intensityPieList.push({
              value: response.data.twoGradeHeartRateNo
            });
            this.insideColor.push("#FED75D");
            this.outsideColor.push("#FED24B");
          }
          if (response.data.threedGradeHeartRateNo !== 0) {
            this.intensityPieDataList.push({
              value: response.data.threedGradeHeartRateNo,
              name: "120-140"
            });
            this.intensityPieList.push({
              value: response.data.threedGradeHeartRateNo
            });
            this.insideColor.push("#44D748");
            this.outsideColor.push("#2FD233");
          }
          if (response.data.fourGradeHeartRateNo !== 0) {
            this.intensityPieDataList.push({
              value: response.data.fourGradeHeartRateNo,
              name: "120以下"
            });
            this.intensityPieList.push({
              value: response.data.fourGradeHeartRateNo
            });
            this.insideColor.push("#71A7FF");
            this.outsideColor.push("#619DFF");
          }
          // this.intensityPieDataList=[
          //   { value: 7, name: "120-140" },{ value: 15, name: "120以下" }
          // ]
          this.intensityLineXList = [];
          this.intensityLineDataList = [];
          response.data.classCourseDataList.forEach((val, index) => {
            this.intensityLineXList.push(val.node);
            this.intensityLineDataList.push({
              value: val.value,
              symbolSize: 4
            });
          });
          this.lesson.courseNo = response.data.courseNo;
          if (response.data.studentCourseHeartRateList.length > 5) {
            this.isShowAllIntensity = false;
          } else {
            this.isShowAllIntensity = true;
          }
          this.intensityList = response.data.studentCourseHeartRateList.slice(
            0,
            5
          );
          this.intensityHideList = response.data.studentCourseHeartRateList.slice(
            5
          );
          this.lastaverageHeartRate = response.data.lastaverageHeartRate || 0;
          this.allCourseAverageHeartRate =
            response.data.allCourseAverageHeartRate;
          this.drawCharts();
        })
        .catch(err => {
          // console.log(err);
        });
    },
    doSkipRequest() {
      this.loading = true;
      this.$store
        .dispatch("Skip", { courseId: this.lesson.courseId })
        .then(response => {
          this.loading = false;
          this.skip = response.data;
          this.skip.forEach((item, index) => {
            if (item.courseTestRankingList.length > 5) {
              this.$set(item, "showAll", false);
            } else {
              this.$set(item, "showAll", true);
            }
            item.startTime = formatDate(item.startTime, "hh:mm");
            switch (index) {
              case 0:
                item.index = "一";
                break;
              case 1:
                item.index = "二";
                break;
              case 2:
                item.index = "三";
                break;
              case 3:
                item.index = "四";
                break;
              case 4:
                item.index = "五";
                break;
              case 5:
                item.index = "六";
                break;
              case 6:
                item.index = "七";
                break;
              case 7:
                item.index = "八";
                break;
              case 8:
                item.index = "九";
                break;
              case 9:
                item.index = "十";
                break;
            }
            item.courseTestRankingList.forEach((v, i) => {
              if (v.sex === 1) {
                v.sex = "男";
              } else {
                v.sex = "女";
              }
            });
            var list = item.courseTestRankingList;
            item.courseTestRankingList = list.slice(0, 5);
            // item.hideList = list.slice(0, 4)
            item.hideList = list.slice(5);
          });
        });
    },
    drawCharts() {
      this.loading = false;
      // 绘制环形图表
      var param = {
        id: this.intensityPieId,
        courseNo: this.lesson.courseNo,
        data: this.intensityPieDataList,
        labelData: this.intensityPieList,
        backgroundColor: "#F9F9F9",
        insideColor: this.insideColor,
        outsideColor: this.outsideColor
      };
      // 绘制折线图
      var params = {
        id: this.intensityLineId,
        title: "全班运动强度趋势图",
        xUnit: "时间(min)",
        yUnit: "心率(bpm)",
        yMax: 200,
        avgName: "平均心率",
        xLine: this.intensityLineXList,
        data: this.intensityLineDataList,
        backgroundColor: "#F9F9F9"
      };
      let vm = this;
      setTimeout(function() {
        vm.$refs.classReportPieChart.chartInit(param);
        vm.$refs.classReportLineChart.chartInit(params);
      }, 1000);
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name == "LessonList") {
      to.meta.keepAlive = true;
    } else {
      to.meta.keepAlive = false;
    }
    next();
  },
  mounted() {
    this.doIntensityRequest();
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.title,
.tab-title {
  width: 100%;
  height: 30px;
  line-height: 30px;
  font-size: 20px;
  text-align: left;
  margin-bottom: 20px;
}

.title {
  font-weight: bold;
}

.line {
  width: 100%;
  border: 1px solid #eaf4ff;
  height: 1px;
}

.tab {
}

#intensityPie {
  height: 450px;
  /*margin-right: 20px;*/
}

#intensityLine {
  height: 450px;
  margin-left: 20px;
}

#skipPie1,
#skipPie2 {
  height: 450px;
}

#calorieExpendLine {
  height: 450px;
  width: 65%;
}

.font-color {
  color: #006cee;
}

.table-footer {
  line-height: 50px;
  text-align: center;
}
.avgDiv {
  padding-top: 50px;
  font-size: 16px;
  line-height: 35px;
}
.avgDiv .large {
  font-size: 30px;
}

.title-div {
  height: 40px;
  width: 160px;
  background: url("../../../assets/imgs/img_thd_title_bg.png");
  background-size: cover;
  color: white;
  font-size: 24px;
  padding: 8px;
  padding-left: 48px;
}

.blue_letter {
  color: #4088f1;
}
</style>
