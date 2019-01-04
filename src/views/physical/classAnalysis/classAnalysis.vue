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
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="班级：">
                <el-select v-model="formData.gradeId" placeholder="请选择" @change="getClass" size="mini" style="width: 120px">
                  <el-option
                    v-for="item in gradeOptions"
                    :key="item.gradeId"
                    :label="item.gradeName"
                    :value="item.gradeId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="">
                <el-select v-model="formData.classId" placeholder="请选择" size="mini" style="width: 120px">
                  <el-option
                    v-for="item in classOptions"
                    :key="item.dictClassId"
                    :label="item.dictClassName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>

              <span style="float:right">
                <el-form-item>
                  <el-button type="primary" @click="search(formData)" class="btn" size="mini">查询</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="reset(formData)" class="btn" size="mini">重置</el-button>
                </el-form-item>
              </span>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div v-if="starts==true" class="list">
        <el-row class="title">
          <el-col :span="24" class="title-top">{{schoolName}}综合体质分析</el-col>
        </el-row>

        <div class="tabstarget">
          <el-tabs v-model="activeName" @tab-click="handleClick" class="sec sec0" type="border-card">
            <el-tab-pane v-for="(item, index) in summaryDetailList" :key="index" :label="item.gradeName" :name="item.gradeName" :class="'sec'+index">
                <div  class="sec-right">
                  <div v-for="item2 in item.summaryDetailByClassList" class="card" @click="toDetail(item2.schoolClassId, item2.className, item.gradeId, item.gradeName)" :key="item2.id">
                    <div class="card-box">
                    <div class="class-name"> -- {{item2.className}} -- </div>
                    <div class="fl w50">
                      <div class="card-left">{{(item2.excellentRate * 100).toFixed(0)}}%</div>
                      <div class="card-box-bottom">优良率</div>
                    </div>
                    <div class="fl w50">
                      <div class="card-right">{{(item2.qualifiedRate * 100).toFixed(0)}}%</div>
                      <div class="card-box-bottom">合格率</div>
                    </div>
                  </div>
                  </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>


      </div>
      <div v-else class="list">
        <el-row class="text-center">
          <el-col :span="24">该学年无数据</el-col>
        </el-row>
      </div>
    </div>
</template>

<script>
  import { getSchoolYear } from '@/utils/index'
  import request from '@/utils/request'

  export default {
    name: 'classAnalysis',
    data() {
      return {
        activeName: '',
        title: '',
        starts: true,
        schoolYearOptions: '',
        gradeOptions: '',
        classOptions: '',
        schoolName: '',
        summaryDetailList: [],
        allData: [],
        formData: {
          schoolYear: '',
          gradeId: '',
          classId: '',
          schoolYearStart: '',
          schoolYearEnd: ''
        },
        thatHeight: ''
      }
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },
      search() {
        this.getData();
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
          this.gradeOptions = response.data
        })
      },
      getClass() {
        this.formData.classId = '';
        this.getClassOption()
      },
      getClassOption() {
        var data = {}
        for (let i = 0; i < this.gradeOptions.length; i++) {
          if (this.formData.gradeId == this.gradeOptions[i].gradeId) {
            data.schoolTypeGradeId = this.gradeOptions[i].id
          }
        }
        var list = this.formData.schoolYear.split('-');
        if (list.length > 0) {
          data.schoolYearStart = list[0]
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
        this.formData.schoolYearStart = this.formData.schoolYear.slice(0, 4);
        this.formData.schoolYearEnd = this.formData.schoolYear.slice(5, 9);
        request.get('/api/auth/v1/physical/classAnalysis/summary', {
          params: {
            schoolYearStart: this.formData.schoolYearStart,
            schoolYearEnd: this.formData.schoolYearEnd,
            schoolId: this.formData.schoolId || null,
            gradeId: this.formData.gradeId || null,
            schoolClassId: this.formData.classId || null
          }
        }).then(res => {
          // console.log(res);
          if (res.data.summaryDetailList.length === 0) {
            this.starts = false;
          } else {
            this.starts = true;
            this.schoolName = res.data.schoolName;
            this.summaryDetailList = res.data.summaryDetailList;
            this.activeName = res.data.summaryDetailList[0].gradeName;
          }
        })
      },
      toDetail(schoolClassId, className, gradeId, gradeName) {
        this.$router.push({
          name: 'classAnalysisDetail',
          query: {
            schoolClassId: schoolClassId,
            gradeId: gradeId+'',
            schoolName: this.schoolName,
            gradeName: gradeName,
            className: className,
            schoolYear: this.formData.schoolYear,
            classId: this.formData.classId+'',
            gradeId1: this.formData.gradeId+'',
          }
        });
      }
    },
    mounted() {
      this.schoolYearOptions = getSchoolYear();
      if (!this.formData.schoolYear) {
        // this.formData.schoolYear = this.schoolYearOptions[this.schoolYearOptions.length - 1].value
        this.formData.schoolYear = this.schoolYearOptions[0].value
      }
      this.getGrade();
      this.getData();
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

  .sec{
    width: 98%;
    min-width: 1000px;
    background-color: #fff;
    margin: 28px 1%;
    border-radius: 8px;
    .sec-right{
      min-width: 950px;
      height: auto;
      width: 100%;
      background:#E8ECF0;
      display: inline-block;
      box-sizing: border-box;
      /*padding: 10px 10px 10px 10px;*/
      .card {
        display: inline-block;
        width: 16%;
        margin: 10px 15px 10px 15px;
        .card-box{
          background-color: #ffffff;
          color: #000000;
          border-radius: 5px;
          text-align: center;
          width: 100%;
          min-width: 170px;
          height: 100px;
          box-sizing: border-box;
          padding: 10px 20px;
          cursor: pointer;
          .class-name{
            font-size: 14px;
          }
          .card-left {
            color: #ff8936;
          }
          .card-right {
            color: #39ff97;
          }
          .card-box-bottom{
            margin-top: 10px;
            font-size: 12px;
          }
        }
      }
    }
  }

  .sec.sec0 .sec-left{
    background-color: #1e9fff;
  }
  .sec.sec1 .sec-left{
    background-color: #2bcfee;
  }
  .sec.sec2 .sec-left{
    background-color: #ff8936;
  }
  .sec.sec3 .sec-left{
    background-color: #8f67ff;
  }
  .sec.sec4 .sec-left{
    background-color: #df64ff;
  }
  .sec.sec5 .sec-left{
    background-color: #ff6b62;
  }
  .sec.sec6 .sec-left{
    background-color: #e1e061;
  }
  .sec.sec7 .sec-left{
    background-color: #82ff50;
  }
  .sec.sec8 .sec-left{
    background-color: #42ffd1;
  }

  .fl{
    float: left;
  }
  .w50{
    width: 50%;
    margin-top: 5px;
    font-size: 22px;
    text-align: center;
  }
  .text-center{
    text-align: center;
    margin: 10px 0;
  }
</style>
<style lang="scss">
  .tabstarget{
    .el-tabs__nav{
        width: 100%!important;
        background:#2E89E6;
        .el-tabs__item{
          color: #fff!important;
          width: 11.11111%;
          text-align: center;
        }
        .is-active{
          color: #2E89E6!important;
        }
      }
  }
</style>
