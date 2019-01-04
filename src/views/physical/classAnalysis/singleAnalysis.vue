<template>
  <!--<div>-->
    <div class="list">
      <el-row class="title">
        <el-col :span="24" class="title-top">{{gradeName}}{{className}}{{studentCount}}人</el-col>
      </el-row>
      <div>{{singleName}}分析</div>
      <hr>
      <!--饼图-->
      <div class="top">
        <div class="center-mid">
          <span v-if="studentType == 1">男生数量</span>
          <span v-else-if="studentType == 2">女生数量</span>
          <span v-else>全班人数</span>
          <br>
          {{studentTypeCount}}人
        </div>
        <div id="pie" class="percentPie" style="width: 600px;height:300px;">

        </div>
      </div>
      <div class="sec sec01" v-if="numb==2">
        <div class="item-card" v-for="(item, index) in data2" :key="index">
          <div class="sec-left" :class="{'sec-left-r': item.isFocus}">
            <div class="center">
              {{item.itemDetailName}}<br>
              <span v-if="item.isFocus">(重点关注)</span>
            </div>
          </div>
          <div class="sec-right" ref="secRight">
            <span class="name-list"
                  :class="{'name-list-red': item.isFocus}"
                  v-for="obj in item.studentList"
                  @click="goStudentDetail(obj.identityNo, obj.schoolYearStart, obj.schoolYearEnd)"
            >{{obj.studentName}}</span>

          </div>
        </div>
      </div>

      <div class="sec sec02" v-if="numb==1">
        <div style="width: 1000px">
          <div class="score100 clearfix">
            <p class="score-all"> 分数 </p>
            <span class="score">100分</span>
            <span class="line"></span>
          </div>
          <div class="sec-item clearfix" v-for="(item, index) in scoreIntervalStudentList" :key="index">
            <div class="item-left clearfix">
              <span v-if="item.minScoreInterval==50" class="color_red">重点提升</span>
              <span v-if="item.minScoreInterval==50" class="color_red1"><span></span><span></span><span></span></span>
              <span class="scoreOther">{{item.minScoreInterval}}分</span>
              <span class="line" :class="{ 'line-top' : index == 0}"></span>
            </div>
            <div class="item-right clearfix">
              <div class="fl" :class="item.minScoreInterval < 60 ? 'progress-red' : 'progress'" :style="{width:item.studentCount*5 +'px'}"></div>
              <div class="count fl">{{item.studentCount}} 人</div>
              <div class="student-list fl" :ref="'spredall'+index">
                <span class="name-list"
                      :class="{'name-list-red': item.minScoreInterval<60 && item.minScoreInterval>49}"
                      v-for="(obj, ind) in item.scoreIntervalStudentList"
                      :key="ind"
                      @click="goStudentDetail(obj.identityNo, obj.schoolYearStart, obj.schoolYearEnd)"
                >{{obj.studentName}}</span>
                <span v-if="item.scoreIntervalStudentList.length>7" class="spred" :ref="'spred'+index" @click="spredAll(index)">查看全部</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="text-center" v-if="numb==1">
        <el-button @click="showfifty">{{btnText}}</el-button>
      </div>
    </div>
  <!--</div>-->
</template>

<script>
  import echarts from 'echarts'
  import $ from 'jquery'
  import request from '@/utils/request'

  export default {
    name: 'singleAnalysis',
    data() {
      return {
        gradeName: '',
        className: '',
        studentCount: '',
        singleName: '',
        schoolClassId: '',
        singleItemName: '',
        numb: '',
        btnText: '查看更多',
        oldData: {},
        // spred: '查看全部',
        statisticsCount: {},
        statisticsCount2: [],
        scoreIntervalStudentList: {},
        levelClassifyStudentList: {},
        data2: {},
        studentTypeCount: '',
        studentType: ''
      }
    },
    methods: {
      showfifty() {
        // console.log('Object.keys(this.oldData).length', Object.keys(this.oldData).length);
        if (Object.keys(this.oldData).length === 0) {
          // console.log('1，为空');
          this.oldData = this.scoreIntervalStudentList;
          let newData = {};
          newData = this.scoreIntervalStudentList.slice(0, 5);
          this.scoreIntervalStudentList = newData;
          this.btnText = '查看更多';
        } else {
          if (Object.keys(this.scoreIntervalStudentList).length === 5) {
            // console.log('10，不为空');
            this.scoreIntervalStudentList = this.oldData;
            this.btnText = '隐藏更多';
          } else {
            let newData = {};
            newData = this.scoreIntervalStudentList.slice(0, 5);
            this.scoreIntervalStudentList = newData;
            this.btnText = '查看更多';
          }
        }
        // console.log(this.scoreDetailList);
      },
      goStudentDetail(identityNo, schoolYearStart, schoolYearEnd) {
        // console.log("1111");
        request.get('/api/auth/v1/physical/testItem/recordId', {
          params: {
            identityNo: identityNo,
            schoolYearStart: schoolYearStart,
            schoolYearEnd: schoolYearEnd
          }
        }).then(res => {
          let id = res.data;
          this.$router.push({
            path: '/testItemDetail',
            query: {
              id: id
            }
          })
        })
      },
      setEchart() {
        // 绘制图表--饼图
        echarts.init(document.getElementById('pie')).setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          series: {
            name: '整体分析',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                formatter: '{b|{b}：}{c} \n {per|{d}%}  ',
                shadowBlur: 3,
                shadowOffsetX: 2,
                shadowOffsetY: 2,
                shadowColor: '#999',
                padding: [0, 7],
                // show: false,
                // position: 'center',
                rich: {
                  b: {
                    fontSize: 16,
                    lineHeight: 33
                  },
                  per: {
                    padding: [2, 4],
                    align: 'center'
                  }
                }
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              }
            },
            data: [
              { name: '优秀', value: this.statisticsCount.excellentCount || null, itemStyle: { color: '#367cf3' }},
              { name: '良好', value: this.statisticsCount.goodCount || null, itemStyle: { color: '#3bd3f3' }},
              { name: '及格', value: this.statisticsCount.qualifiedCount || null, itemStyle: { color: '#ffd836' }},
              { name: '不及格', value: this.statisticsCount.unQualifiedCount || null, itemStyle: { color: '#f35a7c' }},
              { name: '缺测', value: this.statisticsCount.lackCount || null, itemStyle: { color: '#b0b0b1' }}
            ]
          }
        });
      },
      setEchart2() {
        // 绘制图表--饼图
        echarts.init(document.getElementById('pie')).setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          // color: ['red', 'green','yellow','blueviolet','gray'],
          series: {
            name: '整体分析',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                formatter: '{b|{b}：}{c} \n {per|{d}%}  ',
                shadowBlur: 3,
                shadowOffsetX: 2,
                shadowOffsetY: 2,
                shadowColor: '#999',
                padding: [0, 7],
                // show: false,
                // position: 'center',
                rich: {
                  b: {
                    fontSize: 16,
                    lineHeight: 33
                  },
                  per: {
                    padding: [2, 4],
                    align: 'center'
                  }
                }
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              }
            },
            data: this.statisticsCount2
          }
        });
      },
      getData() { // 体质-班级分析-单项特殊分析
        request.get('/api/auth/v1/physical/classAnalysis/singleItemAnalysis', {
          params: {
            schoolClassId: this.schoolClassId, // 班级id
            singleItemName: this.singleItemName, // 体测项目名key
            gradeName: this.gradeName
          }
        }).then(res => {
          // console.log(this.numb, res);
          this.statisticsCount = res.data.statisticsCount;
          this.scoreIntervalStudentList = res.data.scoreIntervalStudentList;
          this.studentType = res.data.studentType;
          this.studentTypeCount = res.data.studentTypeCount;
          this.setEchart();
          this.showfifty();
        }).catch(err => {
          // console.log('error', err);
        })
      },
      getData2() {
        request.get('/api/auth/v1/physical/classAnalysis/specialAnalysis', {
          params: {
            schoolClassId: this.schoolClassId, // 班级id
            singleItemName: this.singleItemName, // 体测项目名key
            gradeName: this.gradeName
          }
        }).then(res => {
          // console.log(this.numb, res);
          this.statisticsCount2 = res.data.statisticsCount;
          this.levelClassifyStudentList = res.data.levelClassifyStudentList;
          this.data2 = res.data.levelClassifyStudentList;
          this.setEchart2();
        }).catch(err => {
          // console.log('getData2 error', err);
        })
      },
      spredAll(index) {
        let name = 'spredall' + index;
        let name1 = 'spred' + index;
        var hei = this.$refs[name][0].clientHeight;
        if (hei == 40) {
          this.$refs[name1][0].innerText = '收起';
          this.$refs[name][0].style.height = 'auto';
        } else {
          this.$refs[name1][0].innerText = '查看全部';
          this.$refs[name][0].style.height = '40px';
        }
      }
    },
    mounted() {
      this.schoolClassId = this.$route.query.schoolClassId;
      this.singleItemName = this.$route.query.itemKey;
      this.schoolName = this.$route.query.schoolName;
      this.studentCount = this.$route.query.studentCount;
      this.studentTypeCount = this.$route.query.studentCount;
      this.gradeName = this.$route.query.gradeName;
      this.className = this.$route.query.className;
      this.singleName = this.$route.query.itemName;
      this.numb = this.$route.query.no;
      // console.log('mounted', this.numb, this.singleItemName, this.studentCount, this.gradeName, this.className, this.singleName);
      if (this.numb == 1) {
        this.getData();
      } else if (this.numb == 2) {
        this.getData2();
      }
    }
  }
</script>

<style lang="scss" scoped>
  .title{
    text-align: center;
    font-weight: 600;
    line-height: 40px;
    font-size: 20px;
  }
  .top{
    width: 100%;
    position: relative;
  }
  .center-mid{
    position: absolute;
    left: 50%;
    text-align: center;
    top: 135px;
    margin-left: -34px;
  }
  .percentPie{
    margin: 15px auto;
  }

  .sec01{
    .item-card {
      display: flex;
      width: 1100px;
      min-height: 65px;
      border: 1px dashed #fffdf5;
      border-radius: 8px;
      margin: 10px auto;
      /*display: flex;*/
      .sec-left {
        float: left;
        background-color: #4c9ef0;
        color: #fffdf5;
        text-align: center;
        width: 200px;
        box-sizing: border-box;
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
        position: relative;
        .center {
          width: 100%;
          height: 20px;
          position: absolute;
          top: 50%;
          margin-top: -10px;
        }
      }
      .sec-left-r {
        background-color: #fc5862;
        .center {
          height: 40px;
          margin-top: -15px;
          span {
            font-size: 13px;
          }
        }
      }
      .sec-right {
        float: left;
        width: 900px;
        padding: 10px 20px;
        border: 1px solid #f3f1ec;
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
        box-sizing: border-box;
        .name-list{
          display: inline-block;
          padding: 5px;
          margin: 5px;
          font-size: 14px;
          background-color: #f3f1ec;
          border-radius: 3px;
          cursor: pointer;
        }
        .name-list-red {
          background-color: #ff342f;
          color: #ffffff;
          cursor: pointer;
          font-size: 14px;
        }
      }
    }
  }
  .sec02 {
    width: 1100px;
    margin: 50px auto;
    /*position: absolute;*/
    display: flex;
    .score100 {
      margin-left: 70px;
      margin-top: 10px;
      .score-all{
        margin-left: 35px;
      }
      .score {
        font-size: 14px;
      }
    }
    .sec-item {
      display: flex;
      width: 1030px;
      position: relative;
      .item-left {
        position: relative;
        width: 120px;
        display: inline-block;
        text-align: right;
        box-sizing: border-box;
        border-right: 1px solid #000000;
        .color_red {
          color: #ff342f;
          width: 20px;
          height: 65px;
          font-size: 14px;
          display: inline-block;
          font-weight: 600;
          position: absolute;
          top: -5px;
          left: -10px;
        }
        .color_red1 {
          color: #ff342f;
          width: 50px;
          height: 14px;
          font-size: 18px;
          display: inline-block;
          position: absolute;
          top: 20px;
          left: 15px;
          span{
            display: inline-block;
            width: 14px;
            height: 14px;
            border-top: 7px solid #fff;
            border-left: 7px solid #FF490B;
            border-bottom: 7px solid #fff;
          }
          span:first-child {
            border-left: 7px solid #ff9b41;
          }
          span:last-child {
            border-left: 7px solid #ff261c;
          }
        }
        .scoreOther{
          /*margin-top: 10px;*/
          font-size: 14px;
          vertical-align: bottom;
          display: inline-block;
        }
        .line{
          display: inline-block;
          width: 10px;
          height: 100%;
          min-height: 50px;
          box-sizing: border-box;
          border-bottom: 1px solid #000000;
          /*border-top: 1px solid #000000;*/
        }
        .line-top {
          width: 10px;
          border-top: 1px solid #000000;
        }
      }
      .sec-center02 {

      }
      .item-right{
        width: 870px;
        display: inline-block;
        .progress {
          max-width: 200px;
          height: 30px;
          margin-top: 10px;
          margin-right: 10px;
          background-color: #ffe341;
        }
        .progress-red {
          max-width: 200px;
          height: 30px;
          margin-top: 10px;
          margin-right: 10px;
          background-color: #ff342f;
        }
        .count{
          margin: 15px 10px 0 5px;
        }
        .student-list{
          margin-top: 5px;
          width: 630px;
          overflow: hidden;
          height: 40px;
          .spred{
            color: #1e9fff;
            cursor:pointer;
            position: absolute;
            right: 20px;
            top: 20px;
          }
          .name-list{
            display: inline-block;
            padding: 5px;
            margin: 5px;
            width: 79px;
            font-size: 14px;
            text-align: center;
            background-color: #f3f1ec;
            border-radius: 3px;
            cursor: pointer;
          }
          .name-list-red {
            background-color: #ff342f;
            color: #ffffff;
            cursor: pointer;
          }
        }
      }
    }
   }
  .text-center{
    width: 100%;
    text-align: center;
  }
  .color_red {
    color: #ff342f;
    width: 20px;
    height: 65px;
    font-size: 14px;
    display: inline-block;
  }
  .fr{
    float: right;
  }
  .fl{
    float: left;
  }
</style>
