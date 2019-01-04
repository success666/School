<template>
    <div>
      <div class="list">
        <p class="charts_title">{{startTime}}至{{endTime}}{{name}}体育课堂{{xm}}</p>
        <div id="charts" ref="mychart" style="width: 90%;height:400px;"></div>
      </div>
    </div>
</template>

<script>
  import request from '@/utils/request'
  import requestYapi from "@/utils/requestyAPI";
  import echarts from 'echarts'

  export default {
    name: 'sportStats',
    data() {
      return {
        startTime: '',
        endTime: '',
        type: '',
        name: '',
        schoolClassId: '',
        studentId: '',
        xm: '平均运动时长',
        resData: [],
        myChart: '',
        option: {
          xAxis: {
            type: 'category',
            name: '日期',
            data: []
          },
          yAxis: {
            name: '运动消耗（大卡）',
            type: 'value'
          },
          series: [{
            type: 'line',
            data: []
          }
          ]
        }
      }
    },
    methods: {
      drawLine() { // echarts
        // 基于准备好的dom，初始化echarts实例
        let dom = this.$refs.mychart;
        let option = this.option;
        this.myChart = echarts.init(dom);
        this.myChart.setOption(option)
      },
      start(a){
        let api,params;
        if(this.$route.query.typeStatus == 'interestClass'){
          api = "/api/auth/v1/course/statistics/interestClass/student/" + this.$route.query.studentId
          params = {
            startTime: this.startTime,
            endTime: this.endTime,
            type:this.$route.query.type,
            classId:this.$route.query.schoolClassId
          }
        }else{
          api = '/api/auth/v1/course/statistics/studentDetailed'
          params = {
            studentId: this.studentId,
            schoolClassId: this.schoolClassId,
            startTime: this.startTime,
            endTime: this.endTime
          }
        }
        request.get(api,{params}).then((res) => {
          // console.log(res);
          this.resData = res.data.charts || res.data;
          // console.log(this.resData);
          let seriesData1 = [];
          let seriesData2 = [];
          let seriesData3 = [];
          for (var i in this.resData) {
            this.option.xAxis.data.push(this.resData[i].date || this.resData[i].node);
            seriesData1[i] = this.resData[i].calorieExpendValue || this.resData[i].value;
            seriesData2[i] = this.resData[i].sportTime || this.resData[i].value;
            seriesData3[i] = this.resData[i].stepNum || this.resData[i].value;
          }
          // console.log('first', this.option.xAxis.data);
            // console.log(seriesData1);
            // console.log(seriesData2);
            // console.log(seriesData3);
          if (this.type==1) { // 时长
            this.option.series[0].data = seriesData2;
            this.option.yAxis.name = '运动时长(min)';
            this.xm = '平均运动时长'
          } else if (this.type==2) { // 卡路里
            this.option.series[0].data = seriesData1;
            this.option.yAxis.name = '运动消耗(大卡)';
            this.xm = '平均运动消耗'
          } else { // 步数
            this.option.series[0].data = seriesData3;
            this.option.yAxis.name = '运动步数(步)';
            this.xm = '平均运动步数'
          }
          this.drawLine();
        });
      }
    },
    watch: {
      $route(to, from) {
        // console.log(to);
        if (to.name == "sportStats") {
          const a = this.$route.query.rowId;
          this.startTime = this.$route.query.startTime;
          this.endTime = this.$route.query.endTime;
          this.type = this.$route.query.type;
          this.schoolClassId = this.$route.query.schoolClassId;
          this.studentId = this.$route.query.studentId;
          this.name = this.$route.query.name;
          this.start(this.type);
        }
      }
    },
    mounted() {
      const a = this.$route.query.rowId;
      this.startTime = this.$route.query.startTime;
      this.endTime = this.$route.query.endTime;
      this.type = this.$route.query.type;
      this.schoolClassId = this.$route.query.schoolClassId;
      this.studentId = this.$route.query.studentId;
      this.name = this.$route.query.name;
      this.start(this.type);
    }
  }
</script>

<style scoped>
  .charts_title{
    text-align: center;
    font-size: 24px;
    font-weight: 600;
    line-height: 30px;
  }
  .list{
    min-height: 500px;
  }
</style>
