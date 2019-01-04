<template>
  <div class="content font">
    <el-row>
      <el-col>
        <div class="title">
          {{personalReportData.gradeName}}&nbsp;{{personalReportData.className}}&nbsp;{{personalReportData.studentName}}&nbsp;{{personalReportData.startTime | formatDate}} 班级课堂表现
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <span>学号：{{personalReportData.studentNo}}</span>
        <span style="margin-left: 100px;">性别：
          <span v-if='personalReportData.studentSex=="1"'>男</span>
          <span v-else-if='personalReportData.studentSex=="2"'>女</span>
        </span>
        <span style="margin-left: 100px;">上课时间：{{personalReportData.startTime | formatDate2}} - {{personalReportData.endTime | formatDate2}}</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        消耗排名：<span class="font-color">{{personalReportData.beatRatio}}%</span>
      </el-col>
    </el-row>
    <div class="line"></div>

    <!--  运动时长  -->
    <el-row style="margin-top: 30px;">
      <el-col :span="24" class="">
        <div class="title-div">
          <div>运动强度</div>
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="13">
        <!--<div class="chart" id="homeChart" style="height: 350px;width: 100%;"></div>-->
        <classReportLineChart :chartId="timeLineId" ref="classReportLineChart" style="height: 400px;width: 100%;"></classReportLineChart>
      </el-col>
      <el-col :span="10">
        <div style="padding-top: 80px;">
          <div style="float: left;width: 28px;margin-top: 5px;"><img :src="icon_teacher_file_tip"/></div>
          <div style="float: left;width: 400px;line-height: 28px;">{{explainTostrength}}</div>
        </div>
      </el-col>
    </el-row>

    <!--  运动量  -->
    <el-row>
      <el-col :span="24" class="">
        <div class="title-div2">
          <div>运动量</div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="13">
        <!--<div class="chart" id="PhysicalActivityChart" style="height: 350px;width: 100%;"></div>-->
        <classReportLineChart :chartId="physicalActivityLineId" ref="classReportLineChart" style="height: 400px;width: 100%;"></classReportLineChart>
      </el-col>
      <el-col :span="10">
        <div style="padding-top: 200px;">
          <div style="float: left;width: 28px;margin-top: 5px;"><img :src="icon_teacher_file_tip"/></div>
          <div style="float: left;width: 400px;line-height: 28px;">{{explainToexpend}}</div>

        </div>
      </el-col>
    </el-row>

    <el-row style="text-align: left;">
      <el-row class="chartsNumber">

        <el-col :span="7">
          <div style="height: 200px;">
            <div class="label-div">
              <span class="font-color">·</span> 运动时长
            </div>
            <div class="label-div2">
              <div class="no">NO.{{personCourseExerciseVolumeData.sportTimeRanking}}</div>
              <div class="value"><span style="font-size: 22px;">{{personCourseExerciseVolumeData.currentStudentSportTime| formatNum}}</span>min</div>
            </div>
            <div class="label-div2-bottom">
              <div style="float: left;width: 50%;height: 50px;text-align: center;border-right: 1px #DDDDDD solid;">
                <div style="line-height: 35px;">{{personCourseExerciseVolumeData.maxSportTime| formatNum}}</div>
                <div style="line-height: 10px;font-size: 8px;">全班最高</div>
              </div>
              <div style="float: left;width: 50%;height: 50px;text-align: center">
                <div style="line-height: 35px;">{{personCourseExerciseVolumeData.averageSportTime| formatNum}}</div>
                <div style="line-height: 10px;font-size: 8px;">全班平均</div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="7">

          <div style="height: 200px;">
            <div class="label-div">
              <span class="font-color">·</span> 运动步数
            </div>
            <div class="label-div2">
              <div class="no">NO.{{personCourseExerciseVolumeData.stepNumRanking}}</div>
              <div class="value"><span style="font-size: 22px;">{{personCourseExerciseVolumeData.currentStudentStepNum| formatNum}}</span>步</div>
            </div>
            <div class="label-div2-bottom">
              <div style="float: left;width: 50%;height: 50px;text-align: center;border-right: 1px #DDDDDD solid;">
                <div style="line-height: 35px;">{{personCourseExerciseVolumeData.maxStepNum| formatNum}}</div>
                <div style="line-height: 10px;font-size: 8px;">全班最高</div>
              </div>
              <div style="float: left;width: 50%;height: 50px;text-align: center">
                <div style="line-height: 35px;">{{personCourseExerciseVolumeData.averageStepNum| formatNum}}</div>
                <div style="line-height: 10px;font-size: 8px;">全班平均</div>
              </div>
            </div>
          </div>

        </el-col>
        <el-col :span="6">

          <div style="height: 200px;">
            <div class="label-div">
              <span class="font-color">·</span> 运动消耗
            </div>
            <div class="label-div2">
              <div class="no">NO.{{personCourseExerciseVolumeData.calorieExpendRanking}}</div>
              <div class="value"><span style="font-size: 22px;">{{personCourseExerciseVolumeData.currentStudentCalorieExpend| formatNum}}</span>大卡</div>
            </div>
            <div class="label-div2-bottom">
              <div style="float: left;width: 50%;height: 50px;text-align: center;border-right: 1px #DDDDDD solid;">
                <div style="line-height: 35px;">{{personCourseExerciseVolumeData.maxCalorieExpend| formatNum}}</div>
                <div style="line-height: 10px;font-size: 8px;">全班最高</div>
              </div>
              <div style="float: left;width: 50%;height: 50px;text-align: center">
                <div style="line-height: 35px;">{{personCourseExerciseVolumeData.averageCalorieExpend| formatNum}}</div>
                <div style="line-height: 10px;font-size: 8px;">全班平均</div>
              </div>
            </div>
          </div>

        </el-col>
      </el-row>
    </el-row>

    <!--  跳绳测试
    <el-row style="margin-top: 30px;">
      <el-col :span="24" class="">
        <div style="float: left" class="title-div">
          <div>跳绳测试</div>
        </div>
        <div style="float:left;line-height: 30px;margin-left: 50px;"><img :src="icon_teacher_file_tip"/>
          说明： 达标值是通过<span class="font-color">《国家学生体质健康标准（2014年修订）》</span>一分钟跳绳评分标准推算出的达标建议值。
        </div>

      </el-col>
    </el-row>


    <div v-for="(ins,index) in persionSkipData">
      <el-row style="margin-top: 40px;">
        <el-col :span="24">
          <div style="font-size: 18px;font-weight: bold;">第{{index+1}}次测试
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4">跳绳时长： {{ins.skipTime}}秒</el-col>
        <el-col :span="4">跳绳时间： {{ins.courseTestStartTime | formatDate2}}</el-col>
        <el-col :span="4">达标值： {{ins.reachStandardCount}}次</el-col>
      </el-row>
      <el-row>
        <el-col :span="4">跳绳次数： <span class="font-color">{{ins.skipCounts}}次</span></el-col>
        <el-col :span="4">中断次数： <span class="font-color">{{ins.interruptCount}}次</span></el-col>
        <el-col :span="4">班级排名： <span class="font-color">NO.{{ins.ranking}}</span></el-col>
      </el-row>

      <el-row>
        <el-col :span="2">
          &nbsp;
        </el-col>
        <el-col :span="10">
          <jumpRopeChart :chartId="skipLeftChartIds[index]" ref="jumpRopeChart"></jumpRopeChart>
        </el-col>
        <el-col :span="2">
          &nbsp;
        </el-col>
        <el-col :span="10">
          <jumpRopeLineChart :chartId="skipRightChartIds[index]" ref="jumpRopeLineChart"></jumpRopeLineChart>
        </el-col>
      </el-row>
    </div>-->

  </div>
</template>

<script>
  // 图片资源
  import icon_teacher_file_tip from '@/assets/imgs/icon_teacher_file_tip.png'

  import JumpRopeChart from '@/components/Chart/JumpRopeChart'
  import JumpRopeLineChart from '@/components/Chart/JumpRopeLineChart'
  import ClassReportLineChart from '@/components/Chart/ClassReportLineChart'
  import { formatDate } from '@/utils/index'

  export default {
    name: 'PersionalReport',
    filters: {
      formatDate(time) {
        var date = new Date(time)
        return formatDate(date, 'yyyy/MM/dd')
      },
      formatDate2(time) {
        var date = new Date(time)
        return formatDate(date, 'hh:mm')
      },
      formatNum(value){
        if(value){
          let value1=value.toString();
          if(value1.indexOf(".")>=0&&value1.indexOf(".")+2<value1.length-1){
            value=value.tofixed(2);
          }
        }
        return value
      }
    },
    components: {
      jumpRopeChart: JumpRopeChart,
      jumpRopeLineChart: JumpRopeLineChart,
      classReportLineChart: ClassReportLineChart
    },
    data() {
      return {
        icon_teacher_file_tip: icon_teacher_file_tip,
        // 运动时长折线图id
        timeLineId: 'timeLineId',
        // 运动量折线图id
        physicalActivityLineId: 'physicalActivityChart',
        skipLeftChartIds: [],
        skipRightChartIds: [],
        // 个人报告数据容器
        personalReportData: {},
        // 运动量数据容器
        personCourseExerciseVolumeData: {},
        // 运动强度数据容器
        personalReportHeartRateData: {},
        // 跳绳数据容器
        persionSkipData: [],
        explainTostrength: '说明：运动心率，即人体在运动时保持的心率状态，是一种简单有效的，间接评价运动强度的方式。对20岁以下的青少年儿童来说，120-160bpm是普通锻炼者较为合适和有效的运动心率范围，也称为运动的靶心率。只有将心率保持在靶心率范围中,才能保证有运动强度，达到理想的运动效果。',
        explainToexpend: ''
      }
    },
    methods: {
      getPersionalReport(obj) {
        var params = {
          courseId: obj.courseId,
          studentId: obj.studentId
        }
        this.$store.dispatch('personalReport', params).then(response => {

          this.personalReportData = response.data
          this.personalReportData.beatRatio=(this.personalReportData.beatRatio*100).toFixed(0);
        })
      },
      // 获取运动量
      getPersonCourseExerciseVolume(obj) {
        var params = {
          courseId: obj.courseId,
          studentId: obj.studentId
        }
        this.$store.dispatch('personCourseExerciseVolume', params).then(response => {
          this.personCourseExerciseVolumeData = response.data
          // 组装数据
          var xData = []
          var yData = []
          for (var i = 0; i < this.personCourseExerciseVolumeData.classCourseSudentCalorieExpendList.length; i++) {
            xData.push(this.personCourseExerciseVolumeData.classCourseSudentCalorieExpendList[i].node)
            yData.push(this.personCourseExerciseVolumeData.classCourseSudentCalorieExpendList[i].value)
          }
          var maxY = Math.max.apply(Math, yData)
          // 运动量图表实例化
          var paramsTime = {
            id: this.physicalActivityLineId,
            title: '',
            xUnit: '时间(min)',
            yUnit: '运动消耗(大卡)',
            yMax: (parseInt(maxY / 100) + 1) * 100,
            avgName: '平均消耗',
            xLine: xData,
            data: yData,
            backgroundColor: '#ffffff'
          }
          let expend=this.personCourseExerciseVolumeData.currentStudentCalorieExpend>this.personCourseExerciseVolumeData.averageCalorieExpend?"高于":"低于";
          this.explainToexpend="说明：本堂课全部平均消耗为"+this.personCourseExerciseVolumeData.averageCalorieExpend+"大卡，该生"+
          expend+"平均水平，积极参与课堂运动，将有利于身心健康。"
          let vm=this;
          setTimeout(function(){
            vm.$refs.classReportLineChart.chartInit(paramsTime)
          },1000)

        })
      },
      // 获取心率
      getPersonalReportHeartRate(obj) {
        var params = {
          courseId: obj.courseId,
          studentId: obj.studentId
        }
        this.$store.dispatch('personalReportHeartRate', params).then(response => {
          this.personalReportHeartRateData = response.data
          // 组装数据
          var xData = []
          var yData = []
          for (var i = 0; i < this.personalReportHeartRateData.length; i++) {
            xData.push(this.personalReportHeartRateData[i].node)
            yData.push(this.personalReportHeartRateData[i].value)
          }
          // 运动时长图表实例化
          var paramsTime = {
            id: this.timeLineId,
            title: '',
            xUnit: '时间(min)',
            yUnit: '心率(bpm)',
            yMax: 200,
            avgName: '平均心率',
            xLine: xData,
            data: yData,
            backgroundColor: '#ffffff'
          }
          let vm=this;
          setTimeout(function(){
            vm.$refs.classReportLineChart.chartInit(paramsTime)
          },1000)

        })
      },
      // 获取跳绳数据
      getPersonalSkip(obj) {
        var params = {
          courseId: obj.courseId,
          studentId: obj.studentId
        }
        this.$store.dispatch('getPersonalSkip', params).then(response => {
          this.persionSkipData = response.data
          var skipXData = []
          var skipLeftChartDatas = []
          var skipRightChartDatas = []
          for (var i = 0; i < this.persionSkipData.length; i++) {
            this.skipLeftChartIds.push('SkipLeftChartId' + i)
            this.skipRightChartIds.push('SkipRightChartId' + i)
            var xData = []
            var yLeftData = []
            var yRightData = []
            for (var j = 0; j < this.persionSkipData[i].skipLineChartList.length; j++) {
              var obj = this.persionSkipData[i].skipLineChartList[j]
              xData.push(obj.node)
              yLeftData.push(obj.skipCounts)
              yRightData.push(obj.interruptCounts)
            }
            skipXData.push(xData)
            skipLeftChartDatas.push(yLeftData)
            skipRightChartDatas.push(yRightData)
          }
          /*
          var that = this
          setTimeout(function() {
            for (i = 0; i < that.persionSkipData.length; i++) {
              // 初始化跳绳左边图表
              that.$refs.jumpRopeChart[i].chartInit(that.skipLeftChartIds[i], skipXData[i], skipLeftChartDatas[i])
              // 初始化跳绳右边图表
              that.$refs.jumpRopeLineChart[i].chartInit(that.skipRightChartIds[i], skipXData[i], skipRightChartDatas[i])
            }
          }, 1000)*/
        })
      }
    },
    mounted() {
      var courseId = this.$route.query.courseId
      var studentId = this.$route.query.studentId
      var params = {
        courseId: courseId,
        studentId: studentId
      }
      this.getPersionalReport(params)
      this.getPersonCourseExerciseVolume(params)
      this.getPersonalReportHeartRate(params)

      this.getPersonalSkip(params)

      // // 初始化第一次跳绳测试左边图表
      // this.$refs.jumpRopeChart.chartInit(this.skipLeftChartIds[0], ['15', '30', '45', '60', '175'], [58, 48, 52, 38, 31])
      //
      // // 初始化第二次跳绳测试左边图表
      // this.$refs.jumpRopeChart.chartInit(this.chartLeft2Id, ['15', '30', '45', '60', '75'], [58, 48, 52, 38, 31])
      //
      // // 初始化第一次跳绳测试左边图表
      // this.$refs.jumpRopeLineChart.chartInit(this.chartRight1Id, ['15', '30', '45', '60', '175'], [58, 48, 52, 38, 31])
      //
      // // 初始化第二次跳绳测试右边图表
      // this.$refs.jumpRopeLineChart.chartInit(this.chartRight2Id, ['115', '30', '45', '60', '175'], [58, 48, 52, 38, 31])
    }
  }
</script>

<style scoped>
  .title {
    width: 100%;
    height: 30px;
    line-height: 30px;
    font-size: 24px;
    font-weight: bold;
    text-align: left;
    margin-bottom: 20px;
  }

  .line {
    width: 100%;
    border: 1px solid #EAF4FF;
    height: 1px;
  }

  .font-color {
    color: #4088F1;
  }

  .right {
    line-height: 60px;
    text-align: center;
  }

  .font-big {
    font-size: 30px;
  }

  .title-div {
    height: 31px;
    width: 104px;
    background: url('../../../assets/imgs/img_thd_title_bg.png');
    color: white;
    font-size: 15px;
    padding: 8px;
    padding-left: 28px;
  }

  .title-div2 {
    height: 30px;
    width: 104px;
    background: url('../../../assets/imgs/img_thd_title_bg2.png');
    color: white;
    font-size: 15px;
    padding-left: 35px;
    padding-top: 8px;
  }

  .title-div {
    height: 30px;
    width: 104px;
    background: url('../../../assets/imgs/img_thd_title_bg.png');
    color: white;
    font-size: 15px;
    padding: 8px;
    padding-left: 28px;
  }

  .label-div {
    height: 33px;
    width: 97px;
    background: url('../../../assets/imgs/img_little_title_bg.png');
    padding-left: 5px;
    line-height: 33px;
    position: absolute;
  }

  .label-div2 {
    height: 116px;
    width: 130px;
    background: url('../../../assets/imgs/img_data_show_bg.png');
    padding-left: 5px;
    line-height: 33px;
    position: absolute;
    top: 15px;
    margin-left: 92px;
  }

  .label-div2 .no {
    height: 30px;
    width: 100px;
    text-align: center;
    margin-left: 10px;
    margin-top: 25px;
    font-size: 23px;
    color: #4088F1;
  }

  .label-div2 .value {
    height: 30px;
    width: 130px;
    text-align: center;
    margin-top: 5px;
  }

  .label-div2-bottom {
    height: 60px;
    width: 200px;
    position: absolute;
    margin-top: 135px;
    margin-left: 58px;
  }
  .chartsNumber{
    padding-left: 50px;
  }

</style>
