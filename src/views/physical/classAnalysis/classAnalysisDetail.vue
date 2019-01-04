<template>
    <div class="dv">
      <div class="search-form">
        <el-form :inline="true" :model="formData" class="">
          <el-row>
            <el-col>
              <el-form-item label="学年：">
                <el-select v-model="formData.schoolYear" placeholder="请选择" size="mini" @change="schoolYearChange" style="width: 130px;">
                  <el-option
                    v-for="item in schoolYearOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value.toString()">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="班级：">
                <el-select v-model="formData.gradeId" placeholder="请选择" @change="getClass" size="mini" style="width: 120px">
                  <el-option
                    v-for="item in gradeOptions"
                    :key="item.gradeId"
                    :label="item.gradeName"
                    :value="item.gradeId.toString()">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="">
                <el-select v-model="formData.classId" placeholder="请选择" size="mini" style="width: 120px">
                  <el-option
                    v-for="item in classOptions"
                    :key="item.dictClassId"
                    :label="item.dictClassName"
                    :value="item.id.toString()">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="search(formData)" class="btn" size="mini">查询</el-button>
                <el-button type="primary" @click="reset(formData)" class="btn" size="mini">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div class="list">
        <el-row class="title-top">
          <el-col :span="24">{{gradeName}}{{className}}({{studentCount}}人)</el-col>
        </el-row>
        <section class="sec">
          <div class="16">班级综合体质分析</div>
          <div>
            <el-row>
              <el-col :span="8">
                <div id="pieDiagram1" class="percentPie" style="height:180px;width:150px;"></div>
              </el-col>
              <el-col :span="8">
                <div id="pieDiagram2" class="percentPie" style="height:180px;width:150px;"></div>
              </el-col>
              <el-col :span="8">
                <div id="pieDiagram3" class="percentPie" style="height:180px;width:150px;"></div>
              </el-col>
            </el-row>
            <div class="emphasis">
              <div class="sec-left" v-bind:style="{height: emphasisHeight}">
                <div class="center">重点推荐</div>
              </div>
              <div class="sec-right" ref="mustValue">
                <div class="top">
                  <span class="title">重点练：</span>
                  <div class="list-box">
                    <span class="list-item" v-for="item in keynotePracticeList"
                          @click="goSingleAnalysis(item.keynotePracticeItemKey, item.keynotePracticeItemName ,1)">{{item.keynotePracticeItemName}}</span>
                  </div>
                </div>
                <div class="bottom">
                  <span class="title">重点提升：</span>
                  <div class="list-box">
                    <span class="student-list" v-for="item in keynotePromoteList" @click="goStudentDetail(item.identityNo, item.schoolYearStart, item.schoolYearEnd)">{{item.studentName}}</span>
                  </div>

                </div>
              </div>
            </div>
            <div class="tag">
              <span class="color_red">*</span><span>“重点练”的项目为班级整体弱项，建议老师加大该项目的练习力度，有助于提升班级整体合格率。</span><br>
              <span class="color_red">*</span><span>“重点提升”里的学生综合体质成绩较为接近合格线，建议老师重点指导，稍加锻炼便可达到合格，能较快提升班级的整体合格率。</span>
            </div>
          </div>
        </section>
        <section class="sec sec2" v-if="studentCount>0">
          <div class="border-bottom">整体分析</div>

          <div>
            <!--饼图-->
            <div class="top">
              <div class="center-mid">全班人数 <br>{{studentCount}}人</div>
              <div id="pie" class="percentPie" style="width: 600px;height:300px;"></div>
            </div>
            <br>
            <!--柱状图-->
            <div class="bottom">
              <div class="sec02">
                <div style="width: 1000px">
                  <div class="score100 clearfix">
                    <p class="score-all"> 分数 </p>
                    <span class="score">100</span>
                    <span class="line"></span>
                  </div>
                  <div class="sec-item clearfix" v-for="(item, index) in scoreDetailList" :key="index">
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
                              @click="goStudentDetail(obj.identityNo, obj.schoolYearStart, obj.schoolYearEnd)">{{obj.studentName}}</span>
                        <span v-if="item.scoreIntervalStudentList.length>7" class="spred" :ref="'spred'+index" @click="spredAll(index)">查看全部</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="text-center">
                <el-button @click="showfifty">{{btnText}}</el-button>
              </div>
            </div>

          </div>

        </section>
        <section class="sec sec3" v-if="studentCount>0">
          <div class="border-bottom">单项分析</div>
          <div>
            <div class="top">
              <!--表格，单项运动-->
              <template>
                <el-select class="sel-table" v-model="selValue" placeholder="请选择" @change="getData3">
                  <el-option
                    v-for="item in selOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-table
                  :data="tableData1"
                  stripe
                  border
                  style="width: 99%">
                  <el-table-column
                    prop="sportItemName"
                    align="center"
                    label="单项"
                    width="220">
                    <template slot-scope="scope">
                      <span class="bgi-t" :class="scope.row.sportItemKey"></span>
                      <span class="color_red ver-m" v-if="scope.row.isKeynotePracticeItem">*{{scope.row.sportItemName}}(重点练)</span>
                      <span v-else>{{scope.row.sportItemName}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="percentageRate"
                    label=""
                    align="center"
                    width="120"
                    :formatter="formatterPercent"
                    >
                  </el-table-column>

                  <el-table-column
                    prop="studentCount"
                    align="center"
                    label="人数"
                    width="100">
                  </el-table-column>
                  <el-table-column
                    prop="address"
                    align="center"
                    label="重点关注">
                    <template slot-scope="scope">
                      <span class="name-list-blue"
                            v-for="item in scope.row.studentList"
                            @click="goStudentDetail(item.identityNo, item.schoolYearStart, item.schoolYearEnd)">{{item.studentName}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="address"
                    align="center"
                    label="操作"
                    width="100">
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        @click="goSingleAnalysis(scope.row.sportItemKey, scope.row.sportItemName ,1)">
                        详情
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </div>
            <div class="bottom">
              <!--合并行的表格  视力，体重，脊柱侧弯-->
              <template>
                <el-table
                  :data="tableData6"
                  border
                  stripe
                  :span-method="objectSpanMethod"
                  style="width: 99%; margin-top: 20px">
                  <el-table-column
                    prop="itemName"
                    label="单项"
                    align="center"
                    width="180">
                    <template slot-scope="scope">
                      <span class="bgi" :class="scope.row.itemKey"></span>
                      <span>{{scope.row.itemName}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="itemDetailName"
                    align="center"
                    width="160"
                    label="">
                    <template slot-scope="scope">
                      <span v-if="scope.row.isFocus" class="color_red">*{{scope.row.itemDetailName}}(重点关注)</span>
                      <span v-else>{{scope.row.itemDetailName}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="studentCount"
                    align="center"
                    width="100"
                    label="人数">
                  </el-table-column>
                  <el-table-column
                    prop="studentList"
                    align="center"
                    label="重点关注">
                    <template slot-scope="scope">
                      <span class="name-list-blue"
                            v-for="(item,index) in scope.row.studentList"
                            :key="index"
                            @click="goStudentDetail(item.identityNo, item.schoolYearStart, item.schoolYearEnd)">{{item.studentName}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="handle"
                    align="center"
                    label="操作"
                    width="100">
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        @click="goSingleAnalysis(scope.row.itemKey, scope.row.itemName, 2)">
                        详情
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </div>
          </div>
        </section>
        <!--<div class="title-top color_red" v-if="studentCount==0">该班级无学生暂无数据</div>-->
      </div>
    </div>
</template>

<script>
  import { getSchoolYear } from '@/utils/index'
  import echarts from 'echarts'
  import { PercentPie } from '@/utils/percentPie'
  import request from '@/utils/request'
  export default {
    name: 'classAnalysis',
    data() {
      return {
        title: '',
        gradeId: '',
        schoolClassId: '',
        schoolYearOptions: '',
        gradeOptions: '',
        classOptions: '',
        schoolName: '',
        gradeName: '',
        className: '',
        studentCount: '',
        lackCount: '',
        scoreDetailList: {},
        btnText: '查看更多',
        oldData: {},
        // classStudentCount: '',
        keynotePracticeList: [], // 推荐两个重点练的运动项目
        emphasisHeight: '100px',
        keynotePromoteList: [], // 成绩在50-60的学生
        excellentRate: '', // 优秀率
        qualifiedRate: '', // 合格率
        classAverage: '', // 班级平均成绩
        allData: [],
        tableData1: [],
        keynotePracticeItemKeys: '',
        selOptions: [
          {
            value: '1',
            label: '优秀率'
          }, {
            value: '2',
            label: '良好率'
          }, {
            value: '3',
            label: '及格率'
          }, {
            value: '4',
            label: '不及格率'
          }
        ],
        selValue: '4',
        formData: {
          schoolYear: '',
          gradeId: '',
          classId: ''
        },
        //  table
        tableData6: [],
        column_row_offset: {
          itemName: [3, 3, 3],
          itemDetailName: [1, 1, 1, 1, 1, 1, 1, 1, 1],
          studentCount: [1, 1, 1, 1, 1, 1, 1, 1, 1],
          studentList: [1, 1, 1, 1, 1, 1, 1, 1, 1],
          handle: [3, 3, 3]
        },
        now_col_row_num: {},
        now_col_offset: {}
      }
    },
    methods: {
      showfifty() {
        if (Object.keys(this.oldData).length === 0) {
          // console.log('1，为空');
          this.oldData = this.scoreDetailList;
          let newData = {};
          newData = this.scoreDetailList.slice(0, 5);
          this.scoreDetailList = newData;
          this.btnText = '查看更多';
        } else {
          if (Object.keys(this.scoreDetailList).length === 5) {
            // console.log('10，不为空');
            this.scoreDetailList = this.oldData;
            this.btnText = '隐藏更多';
          } else {
            let newData = {};
            newData = this.scoreDetailList.slice(0, 5);
            this.scoreDetailList = newData;
            this.btnText = '查看更多';
          }
        }
        // console.log(this.scoreDetailList);
      },
      search() {
        if (this.formData.gradeId == '' || this.formData.classId == '') {
          this.$message({
            message: '请先选择班级',
            type: 'warning'
          });
        } else {
          this.gradeId = this.formData.gradeId;
          this.schoolClassId = this.formData.classId;
          this.getData();
          this.getData2();
        }
      },
      goSingleAnalysis(e, name, no) {
        this.$router.push({
          path: 'singleAnalysis',
          query: {
            schoolClassId: this.schoolClassId,
            studentCount: this.studentCount,
            itemKey: e,
            itemName: name,
            no: no,
            schoolName: this.schoolName,
            gradeName: this.gradeName,
            className: this.className
          }
        });
      },
      goStudentDetail(identityNo, schoolYearStart, schoolYearEnd) {
        request.get('/api/auth/v1/physical/testItem/recordId',{
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
              id: id,
              type:"已关联"
            }
          })
        })
      },
      reset() {
        this.formData.schoolYear = '',
        this.schoolYearOptions = getSchoolYear();
        if (!this.formData.schoolYear) {
          // this.formData.schoolYear = this.schoolYearOptions[this.schoolYearOptions.length - 1].value
          this.formData.schoolYear = this.schoolYearOptions[0].value
        }
        this.formData.gradeId = '',
        this.formData.classId = '',
        this.classOptions = []
      },
      schoolYearChange() {
        this.formData.classId = '';
        if (this.formData.gradeId !== '') {
          this.getClass()
        }
      },
      getGrade() {
        this.$store.dispatch('GetGrade').then(response => {
          this.gradeOptions = response.data;
          this.formData.classId = this.$route.query.classId;
          this.getClassOption();
        })
      },
      getClass() {
        this.formData.classId = '';
        this.getClassOption()
      },
      getClassOption() {
        var data = {};
        for (let i = 0; i < this.gradeOptions.length; i++) {
          if (this.formData.gradeId == this.gradeOptions[i].gradeId) {
            data.schoolTypeGradeId = this.gradeOptions[i].id
          }
        }
        var list = this.formData.schoolYear.split('-');
        if (list.length > 0) {
          data.schoolYearStart = list[0];
          data.schoolYearEnd = list[1]
        }
        this.$store.dispatch('GetClass', data).then(response => {
          if (response.data) {
            this.classOptions = response.data
          } else {
            this.classOptions = []
          }
        })
      },
      getData() {
        request.get('/api/auth/v1/physical/classAnalysis/comprehensive', {
          params: {
            gradeId: this.gradeId,
            schoolClassId: this.schoolClassId
          }
        }).then((res) => {
          // console.log('1',res);
          this.studentCount = res.data.studentCount;
          this.gradeName = res.data.gradeName;
          this.className = res.data.className;
          this.keynotePracticeList = res.data.keynotePracticeList;
          this.keynotePromoteList = res.data.keynotePromoteList;
          let vm=this;
          setTimeout(function(){
            vm.emphasisHeight=vm.$refs.mustValue.offsetHeight+"px";
          },1000);
          this.excellentRate = res.data.excellentRate*100;
          // console.log(this.excellentRate);
          this.qualifiedRate = res.data.qualifiedRate*100;
          // console.log(this.qualifiedRate);
          this.classAverage = res.data.classAverage;
          if (res.data.keynotePracticeList.length===2) {
            this.keynotePracticeItemKeys = res.data.keynotePracticeList[0].keynotePracticeItemKey+","+res.data.keynotePracticeList[1].keynotePracticeItemKey
          } else if (res.data.keynotePracticeList.length===1) {
            this.keynotePracticeItemKeys = res.data.keynotePracticeList[0].keynotePracticeItemKey
          } else {
            this.keynotePracticeItemKeys = null;
          }
          this.setPie();
          if (res.data.studentCount==0) {
            this.$message.error('该班级无学生暂无数据!');
          } else {
            this.getData2();
          }
        })
      },
      getData2() {
        this.scoreDetailList = [];
        request.get('/api/auth/v1/physical/classAnalysis/holistic', {
          params: {
            schoolClassId: this.schoolClassId
          }
        }).then((res) => {
          // console.log('2',res);
          this.scoreDetailList = [];
          this.scoreDetailList = res.data.scoreDetailList;
          // let excellentRate = res.data.excellentRate*100; // 优秀率
          let excellentCount = res.data.excellentCount; // 优秀人数
          // let goodRate = res.data.goodRate*100; // 良好率
          let goodCount = res.data.goodCount; // 良好人数
          // let qualifiedRate = res.data.qualifiedRate*100; // 合格率
          let qualifiedCount = res.data.qualifiedCount; // 合格人数
          // let unQualifiedRate = res.data.unQualifiedRate*100; // 不合格率
          let unQualifiedCount = res.data.unQualifiedCount; // 不合格人数
          let lackCount = res.data.lackCount; // 缺测人数
          this.lackCount = res.data.lackCount;
          // 整体分析的图
          let option = {
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
              data: []
            }
          };
          option.series.data = [];
          if (excellentCount !== 0) {
            option.series.data.push({ name: '优秀', value: excellentCount, itemStyle: { color: '#367cf3' }})
          }
          if (goodCount !== 0) {
            option.series.data.push({ name: '良好', value: goodCount, itemStyle: { color: '#3bd3f3' }})
          }
          if (qualifiedCount !== 0) {
            option.series.data.push({ name: '及格', value: qualifiedCount, itemStyle: { color: '#ffd836' }})
          }
          if (unQualifiedCount !== 0) {
            option.series.data.push({ name: '不及格', value: unQualifiedCount, itemStyle: { color: '#f35a7c' }})
          }
          if (lackCount !== 0) {
            option.series.data.push({ name: '缺测', value: lackCount, itemStyle: { color: '#b0b0b1' }})
          }
          // console.log(option.series.data);
          // 绘制图表--饼图
          echarts.init(document.getElementById('pie')).setOption(option);
          this.showfifty();
          this.getData3();
          this.getData4();
        })
      },
      getData3() {
        request.get('api/auth/v1/physical/classAnalysis/singleUpper', {
          params: {
            gradeId: this.gradeId,
            schoolClassId: this.schoolClassId,
            classStudentCount: this.studentCount - this.lackCount, // ---quece
            type: this.selValue,
            keynotePracticeItemKeys: this.keynotePracticeItemKeys
          }
        }).then((res) => {
          // console.log('3', res);
          this.tableData1 = [];
          this.tableData1 = res.data;
        }).catch(err => {
          // console.log('error',err)
        })
      },
      formatterPercent(row, column, cellValue, index){
        return (cellValue*100).toFixed(0)+"%";
      },
      getData4() {
        request.get('/api/auth/v1/physical/classAnalysis/singleUnder', {
          params: {
            schoolClassId: this.schoolClassId
          }
        }).then((res) => {
          // console.log('4', res);
          this.tableData6 = [];

          this.column_row_offset = {
            itemName: [3, 3, 3],
            itemDetailName: [1, 1, 1, 1, 1, 1, 1, 1, 1],
            studentCount: [1, 1, 1, 1, 1, 1, 1, 1, 1],
            studentList: [1, 1, 1, 1, 1, 1, 1, 1, 1],
            handle: [3, 3, 3]
          };
          this.now_col_row_num = {};
          this.now_col_offset = {};
          this.tableData6 = res.data;
        }).catch(err => {
          // console.log('error',err)
        })
      },
      setPie() {
        var option1 = {
          value: this.excellentRate.toFixed(0),
          name: '优良率',
          title: '  优良率',
          backgroundColor: null,
          color: ['#da861f', '#f3f1ec'],
          fontSize: 16,
          domEle: document.getElementById('pieDiagram1')
        };
        let percentPie1 = new PercentPie(option1);
        percentPie1.init();
        var option2 = {
          value: this.qualifiedRate.toFixed(0), // 百分比,必填
          name: '合格率', // 必填
          title: '  合格率',
          backgroundColor: null,
          color: ['#48dad6', '#f3f1ec'],
          fontSize: 16,
          domEle: document.getElementById('pieDiagram2')
        };
        let percentPie2 = new PercentPie(option2);
        percentPie2.init();
        var option3 = {
          value: this.classAverage, // 百分比,必填
          name: '平均成绩', // 必填
          title: '班级平均成绩',
          backgroundColor: null,
          color: ['#4391da', '#f3f1ec'],
          fontSize: 16,
          unit: '分',
          domEle: document.getElementById('pieDiagram3')
        };
        let percentPie3 = new PercentPie(option3);
        percentPie3.init();
      },
      setEcharts() {
        // 整体分析的图
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
              { name: '优秀', value: 12 },
              { name: '良好', value: 23 },
              { name: '及格', value: 19 },
              { name: '不及格', value: 1 }
            ]
          }
        });
        // 绘制图表--柱状图
        echarts.init(document.getElementById('bar')).setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },

          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              show: false,
              type: 'value'
            }
          ],
          yAxis: [
            {
              type: 'category',
              axisTick: { show: false },
              data: ['40分以下', '41-50分', '51-60分', '61-70分', '71-80分', '81-90分', '91-100分']
            }
          ],
          series: [
            {
              name: '利润',
              type: 'bar',
              barMaxWidth: 25, // 最大宽度
              label: {
                normal: {
                  show: true,
                  position: 'inside'
                }
              },
              data: [5, 12, 15, 8, 6, 4, 2]
            }
          ]
        });
      },
      // 合并行表格
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (!this.now_col_row_num[column.property]) {
          this.now_col_row_num[column.property] = Object.assign([], this.column_row_offset[column.property]);
          let a = this.now_col_row_num[column.property].shift();
          this.now_col_offset[column.property] = a;
          return {
            rowspan: a,
            colspan: 1
          }
        } else if (rowIndex >= this.now_col_offset[column.property]) {
          let a = this.now_col_row_num[column.property].shift();
          this.now_col_offset[column.property] += a;
          return {
            rowspan: a,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
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
      this.gradeId = this.$route.query.gradeId;
      this.schoolName = this.$route.query.schoolName;
      this.gradeName = this.$route.query.gradeName;
      this.className = this.$route.query.className;
      this.className = this.$route.query.className;
      this.schoolYearOptions = getSchoolYear();
      this.formData.schoolYear = this.$route.query.schoolYear;
      this.getGrade();
      this.formData.gradeId = this.$route.query.gradeId1;

      this.getData();
      // this.setEcharts();
    }
  }

</script>

<style lang="scss" scoped>
  .title-top{
    text-align: center;
    font-weight: 500;
    line-height: 40px;
    font-size: 20px;
  }
  .weight16 {
    line-height: 35px;
    font-size: 16px;
    font-weight: 600;
    border-bottom: 1px solid #b0b0b1;
  }
  .sec{
    width: 98%;
    min-width: 1000px;
    margin: 20px 1%;
    border-radius: 8px;
    min-height: 120px;
    font-size: 14px;
    .border-bottom {
      line-height: 35px;
      border-bottom: 1px solid #b0b0b1;
      font-size: 16px;
      font-weight: 600;
    }
    .percentPie{
      margin: 15px auto;
    }
    .emphasis{
      border: 1px solid #fc5862;
      border-radius: 8px;
      box-sizing: border-box;
      font-size: 0;
      overflow: auto;
      margin: 10px 1%;
      width: 98%;
      min-width: 1000px;
      display: flex;
      .sec-left{
        width: 40px;
        margin-left: -1px;
        margin-right: 15px;
        text-align: center;
        height: 100%;
        min-height: 120px;
        color: #ffffff;
        background-color: #fc5862;
        padding: 20px 0;
        display: inline-block;
        box-sizing: border-box;
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
        .center{
          padding: 10px;
          font-size: 16px;
        }
      }
      .sec-right{
        width: 95%;
        min-width: 940px;
        display: inline-block;
        margin-left: auto;
        box-sizing: border-box;
        font-size: 14px;
        overflow: inherit;
        vertical-align: middle;

        .top {
          .title {
            display: inline-block;
            width: 80px;
            margin-top: 20px;
            line-height: 35px;
            font-size: 14px;
            text-align: left;
          }
          .list-box {
            width: 500px;
            margin: 0 auto;
            display: inline-block;
            .list-item{
              width: 160px;
              display: inline-block;
              height: 35px;
              line-height: 35px;
              margin-top: 20px;
              border-radius: 5px;
              text-align: center;
              background-color: #f3f1ec;
              margin-right: 15px;
              color: #ff5b52;
              cursor: pointer;
            }
          }

        }
        .bottom {
          position: relative;
          .title{
            display: inline-block;
            width: 80px;
            margin-top: 20px;
            font-size: 14px;
            text-align: left;
            position: absolute;
            top: 10px;
          }
          .list-box {
            width: 87%;
            margin: 0 auto;
            display: inline-block;
            position: absolute;
            left: 80px;
            .student-list{
              display: inline-block;
              width: 80px;
              text-align: center;
              background-color: #f3f1ec;
              margin-right: 15px;
              color: #ff5b52;
              height: 35px;
              line-height: 35px;
              margin-top: 20px;
              border-radius: 5px;
            }
          }
        }
      }
    }
    .tag{
      font-size: 14px;
      line-height: 25px;
      .color_red {
        color: #ff2e2e;
      }
    }
  }
  .color_red {
    color: #ff2e2e;
  }
  .ver-m{
    vertical-align: middle;
  }
  .sec2, .sec3{
    position: relative;
    width: 98%;
    min-width: 1000px;
    margin: 20px 1%;
    border-radius: 8px;
    min-height: 120px;
    .border-bottom {
      line-height: 35px; border-bottom: 1px solid #b0b0b1
    }
  }
  .sec2 {
    .top {
      height: 300px;
      .center-mid{
        position: absolute;
        left: 50%;
        text-align: center;
        top: 190px;
        margin-left: -34px;
      }
      .percentPie{
        margin: 15px auto;
      }
    }
    .bottom {
      min-height: 350px;
      .sec02 {
        min-width: 1000px;
        margin: 10px auto;
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
            width: 120px;
            display: inline-block;
            text-align: right;
            box-sizing: border-box;
            border-right: 1px solid #000000;

            position: relative;
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
            margin-top: 10px;
            .progress {
              max-width: 200px;
              height: 30px;
              margin-top: 3px;
              margin-right: 10px;
              background-color: #ffe341;
            }
            .progress-red {
              max-width: 200px;
              height: 30px;
              margin-top: 3px;
              margin-right: 10px;
              background-color: #ff342f;
            }
            .count{
              margin: 10px 10px 0 5px;
            }
            .student-list{
              /*margin-top: 5px;*/
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
                text-align: center;
                background-color: #f3f1ec;
                border-radius: 3px;
                cursor: pointer;
              }
              .name-list-red {
                background-color: #ff342f;
                color: #ffffff;
              }
            }
          }
        }

      }
    }
  }
  .sec3 {
    .bottom{
      margin-top: 30px;
    }
    .sel-table {
      position: absolute;
      z-index: 101;
      width: 118px;
      left: 195px;
      top: 38px;
    }
  }
  .name-list{
    display: inline-block;
    padding: 5px;
    margin: 5px;
    background-color: #f3f1ec;
    border-radius: 3px;
  }
  .name-list-blue{
    display: inline-block;
    padding: 5px;
    margin: 5px;
    color: #1e9fff;
    cursor: pointer;
  }
  .name-list-red {
    background-color: #ff342f;
    color: #ffffff;
    cursor: pointer;
  }
  .fr{
    float: right;
  }
  .fl{
    float: left;
  }
  .text-center{
    text-align: center;
  }
  .bgi-t {
    display: inline-block;
    min-width: 25px;
    max-width: 40px;
    min-height: 28px;
    max-height: 40px;
    background-repeat: no-repeat;
    background-position: center;
  }
  .bgi {
    display: block;
    min-width: 20px;
    /*max-width: 40px;*/
    min-height: 25px;
    max-height: 40px;
    background-repeat: no-repeat;
    background-position: center;
  }
  .vision {
    background-image: url(../../../assets/imgs/classAnalysis/icon_eyesight.png);
  }
  .weight {
    background-image: url(../../../assets/imgs/classAnalysis/icon_weight.png);
  }
  .scoliosis {
    background-image: url(../../../assets/imgs/classAnalysis/icon_spine.png);
  }
  .oneMinuteRopeSkipping {
    background-image: url(../../../assets/imgs/classAnalysis/icon_jump_rope.png);
  }
  .sittingAndFlexion {
    background-image: url(../../../assets/imgs/classAnalysis/icon_sit_and_reach.png);
  }
  .fiftyMeterRun {
    background-image: url(../../../assets/imgs/classAnalysis/icon_50_run.png);
  }
  .oneMinuteRopeSkipping {
    background-image: url(../../../assets/imgs/classAnalysis/icon_jump_rope.png);
  }
  .oneMinuteAbdominalCurl {
    background-image: url(../../../assets/imgs/classAnalysis/icon_sit_up.png);
  }
  .fiftyByEightShuttleRun {
    background-image: url(../../../assets/imgs/classAnalysis/icon_50x8_run.png);
  }
  .standingLongJump {
    background-image: url(../../../assets/imgs/classAnalysis/icon_jump_far.png);
  }
  .upwards {
    background-image: url(../../../assets/imgs/classAnalysis/icon_pull_up.png);
  }
  .oneThousandMeterRun {
    background-image: url(../../../assets/imgs/classAnalysis/icon_1000_run.png);
  }
  .eightHundredMeterRun {
    background-image: url(../../../assets/imgs/classAnalysis/icon_800_run.png);
  }
  .lungCapacity {
    background-image: url(../../../assets/imgs/classAnalysis/icon_vital_capacity.png);
  }

</style>
