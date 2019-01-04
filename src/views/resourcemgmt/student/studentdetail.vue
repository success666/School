<template>
  <div class="physical-content">
    <section ref="printarea">
      <el-row class="stu-name">
        <el-col :span="24">学生信息</el-col>
      </el-row>

      <el-row class="stu-name-value">
        <el-col :span="24">{{student.basicInfo.name}}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6"><div class="icon_div"><img class="icon_style" :src="image_sex"></div>性别:
          <span v-if='student.basicInfo.sex=="1"'>男</span>
          <span v-else-if='student.basicInfo.sex=="2"'>女</span>
        </el-col>
        <el-col :span="6"><div class="icon_div"><img class="icon_style" :src="image_year"></div>年龄：{{student.basicInfo.age}}</el-col>
        <el-col :span="6"><div class="icon_div"><img class="icon_style" :src="image_id"></div>身份证：{{student.basicInfo.identityNo}}</el-col>
        <el-col :span="6"><div class="icon_div"><img class="icon_style" :src="image_ban"></div>班级：{{student.basicInfo.dictGradeClassName}}</el-col>

      </el-row>

      <el-row :gutter="20">
        <el-col :span="6"><div class="icon_div"><img class="icon_style" :src="image_xueji"></div>学籍状态：
          <span v-if='student.basicInfo.studentStatus=="1"'>在读</span>
          <span v-else-if='student.basicInfo.studentStatus=="2"'>不在读</span>
        </el-col>
        <el-col :span="6"><div class="icon_div"><img class="icon_style" :src="image_xuejihao"></div>学籍号： {{student.basicInfo.registerNumber}}</el-col>
        <el-col :span="6"><div class="icon_div"><img class="icon_style" :src="image_bangding"></div>绑定状态：
          <span v-if='student.basicInfo.bindingStatus=="1"'>绑定</span>
          <span v-else-if='student.basicInfo.bindingStatus=="0"'>未绑定</span>
        </el-col>
        <el-col :span="6"><div class="icon_div"><img class="icon_style" :src="image_bangding_phone"></div>绑定手机：{{student.basicInfo.bindingTel}}</el-col>
      </el-row>

      <hr style="border:0.5px solid #C1DAFB;"/>
      <el-row>
        <el-col style="text-align: center">
          <el-radio-group v-model="physicalModel" style="margin-bottom: 15px;" @change="changeModel">
            <el-radio-button label="1" >体测报告</el-radio-button>
            <el-radio-button label="2" >体检报告</el-radio-button>
          </el-radio-group>
        </el-col>
      </el-row>
      <div v-if="show">
        <el-row class="time">
          <el-col :span="24">体测时间: {{student.phyTestItemDtl.healthTestTime}}
            <hr style="border:1px solid #C1DAFB;"/></el-col>
        </el-row>

        <el-row class="score">
          <el-col :span="24"><img class="icon_style" style="margin-right: 15px;" :src="image_tice_score">体测成绩 ：<span style="color: #79B6F8;">{{student.phyTestItemDtl.healthTestScore}}分</span></el-col>
        </el-row>
        <hr style="border:0.5px solid #C1DAFB;"/>

        <el-row class="assessment">
          <el-col class="left" :span="2">体测评估:</el-col>
          <el-col class="right" :span="22">{{student.phyTestItemDtl.healthTestAssessment}}</el-col>
        </el-row>

        <el-collapse v-model="activeNames" @change="handleChange" class="custom">
          <el-collapse-item class="collapse" v-for="(ins,index) in student.phyTestItemDtl.physicalTestItemCategoryResponseBeanList" :key="index" :name="index">
            <template slot="title">
              <span class="collapse-title-left">{{ins.categoryName}}</span><span class="collapse-title-right">
              异常项:
              <span v-if="ins.exceptionTerm" style="color: #9C4F59;">{{ins.exceptionTerm}}</span>
              <span v-else="ins.exceptionTerm">无</span>
            </span>
            </template>

            <table border="1" cellpadding="3" id="printTable1" class="table">
              <tbody>
              <tr>
                <th v-for="(ins,index) in tableHeaderTestItem">{{ins}}</th>
              </tr>
              <tr v-for="obj of ins.physicalTestItemListResponseBeanList">
                <td style="width: 20%">
                  <span v-if="obj.name != null && obj.name != ''">{{obj.name}}</span>
                  <span v-else>-</span>
                </td>
                <td style="width: 20%">
                  <span :class="(obj.resultInclination==2||obj.resultInclination==3)?'physical-unnormal':''" v-if="obj.result != null && obj.result != ''">{{obj.result}}
                    <span v-if="obj.resultInclination==2">↑</span>
                    <span v-else-if="obj.resultInclination==3">↓</span>
                  </span>
                  <span v-else>-</span>
                </td>
                <td style="width: 20%">
                  <span v-if="obj.referenceRange != null && obj.referenceRange != ''">{{obj.referenceRange}}</span>
                  <span v-else>-</span>
                </td>
                <td style="width: 20%">
                  <span v-if="obj.unit != null && obj.unit != ''">{{obj.unit}}</span>
                  <span v-else>-</span>
                </td>
                <td style="width: 20%">
                  <span v-if="obj.level != null && obj.level != ''">{{getLevelName(obj.level)}}</span>
                  <span v-else>-</span>
                </td>
              </tr>
              </tbody>
            </table>

          </el-collapse-item>
        </el-collapse>
      </div>
      <div v-if="!show">
        <el-row class="time">
          <el-col :span="24">
            体检时间: {{student.phyHealthExamDtl.healthExamTime}}
            <hr style="border:1px solid #C1DAFB;"/></el-col>
        </el-row>

        <el-collapse v-model="activeNames" @change="handleChange" class="custom">
          <el-collapse-item class="collapse" v-for="(ins,index) in student.phyHealthExamDtl.healthExaminationItemCategoryResponseBeanList" :key="index" :name="index">
            <template slot="title">
              <span class="collapse-title-left">{{ins.name}}</span><span class="collapse-title-right">
            异常项:
            <span v-if="ins.exceptionItem" style="color: #9C4F59;">{{ins.exceptionItem}}</span>
            <span v-else="ins.exceptionItem">无</span>
          </span>
            </template>
            <!--<div v-for="obj of ins.healthExaminationItemResponseBeanList">-->
            <!--{{obj.name}} - {{obj.value}}-->
            <!--</div>-->
            <table border="1" cellpadding="3" id="printTable2" class="table">
              <tbody>
              <tr>
                <th v-for="(ins,index) in tableHeaderArray">{{ins}}</th>
              </tr>
              <tr v-for="obj of ins.healthExaminationItemResponseBeanList">
                <td style="width: 25%">
                  <span v-if="obj.name != null && obj.name != ''">{{obj.name}}</span>
                  <span v-else>-</span>
                </td>
                <td style="width: 25%">
                  <div v-if="obj.value==null||obj.value==''">-</div>
                  <div v-else>
                    <!-- 属于正常/异常项 -->
                    <div v-if="normalAndAbnormalType[obj.code]">
                      <span class="physical-unnormal" v-if="obj.value==0">异常</span>
                      <span v-else-if="obj.value==1">正常</span>
                    </div>
                    <!-- 属于阴性/阳性异常项 -->
                    <div v-else-if="negativeAndPositiveType[obj.code]">
                      <span v-if="obj.value==1">阴性</span>
                      <span class="physical-unnormal" v-else-if="obj.value==2">阳性</span>
                    </div>
                    <!-- 属于是/否 -->
                    <div v-else-if="yesAndNoType[obj.code]">
                      <span v-if="obj.value==0">否</span>
                      <span v-else-if="obj.value==1">是</span>
                    </div>
                    <!-- 属于数值 -->
                    <div v-else>
                    <span v-if="obj.value != null && obj.value != ''" :class="(obj.valueStatus==2||obj.valueStatus==3||obj.valueStatus==4)?'physical-unnormal':''">{{obj.value}}
                    <span v-if="obj.valueStatus==3">↑</span>
                        <span v-else-if="obj.valueStatus==4">↓</span>
                    </span>
                    </div>
                  </div>
                </td>
                <td style="width: 25%">
                  <span v-if="obj.resultRang != null && obj.resultRang != ''">{{obj.resultRang}}</span>
                  <span v-else>-</span>
                </td>
                <td style="width: 25%">
                  <span v-if="obj.unit != null && obj.unit != ''">{{obj.unit}}</span>
                  <span v-else>-</span>
                </td>
              </tr>
              </tbody>
            </table>
          </el-collapse-item>
        </el-collapse>
      </div>
    </section>

    <el-row class="btn-div">
      <el-col :span="24">
        <el-button type="primary" class="save-btn" @click="studentExport" >导出</el-button>
        <el-button type="primary" class="save-btn" @click="printAction">打印</el-button>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import Vue from 'vue'
  import '@/styles/common.scss'
  import '@/views/physical/physical.scss'
  import Print from '@/utils/print'
  import { formatDate } from '@/utils/index'
  import { getLevelName } from '@/views/physical/index.js'
  import { getToken } from '@/utils/auth'
  import axios from 'axios'
  // 图片资源
  import image_sex from '@/assets/imgs/icon_sex.png'
  import image_year from '@/assets/imgs/icon_year.png'
  import image_id from '@/assets/imgs/icon_id.png'
  import image_ban from '@/assets/imgs/icon_ban.png'
  import image_xueji from '@/assets/imgs/icon_xueji.png'
  import image_xuejihao from '@/assets/imgs/icon_xuejihao.png'
  import image_bangding from '@/assets/imgs/icon_bangding.png'
  import image_bangding_phone from '@/assets/imgs/icon_bangding_phone.png'
  import image_tice_score from '@/assets/imgs/icon_tice_score.png'

  Vue.use(Print) // 注册

  export default { name: 'StudentDetail',
    data() {
      return {
        student: { basicInfo: {}, phyTestItemDtl: {}, phyHealthExamDtl: {}},
        physicalModel: '1',
        show: true,
        image_sex,
        image_year,
        image_id,
        image_ban,
        image_xueji,
        image_xuejihao,
        image_bangding,
        image_bangding_phone,
        image_tice_score,
        activeNames: [],
        tableHeaderArray: ['项目', '结果', '参考范围', '单位'],
        tableHeaderTestItem: ['项目', '结果', '参考范围', '单位', '等级'],
        // 正常/异常显示项
        normalAndAbnormalType: {
          heart: true,
          lung: true,
          liver: true,
          spleen: true,
          head: true,
          neck: true,
          lymphNode: true,
          thyroidGland: true,
          thoracic: true,
          spine: true,
          limbs: true,
          abdomen: true,
          skin: true,
          mammaryGland: true,
          genital: true,
          ear: true,
          nose: true,
          colorVision: true,
          tonsil: true,
          chestXray: true
        },
        // 阴性/阳性显示项
        negativeAndPositiveType: {
          trachoma: true,
          conjunctivitis: true,
          periodontalDisease: true,
          flatFeet: true
        },
        // 是/否显示项
        yesAndNoType: {
          firstSpermatorrhea: true,
          firstMenarche: true
        },
        getLevelName: getLevelName
      }
    },
    methods: {
      studentExport() {
        var url = ''
        var fileName = ''
        if (this.physicalModel === '2') {
          fileName = '学生体检报告.xls'
          url = '/api/auth/v1/student/health/export/'
        } else {
          url = '/api/auth/v1/student/testItem/export/'
          fileName = '学生体测报告.xls'
        }
        var instance = axios.create({
          baseURL: process.env.BASE_API,
          timeout: 1000,
          headers: {
            'Authorization': getToken()
          },
          responseType: 'blob'
        })
        instance.get(url + this.student.id + '?schoolClassId=' + this.student.schoolClassId).then(function(response) {
          var blob = new Blob([response.data], {
            type: 'application/vnd.ms-excel'
          })
          var link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = fileName
          link.click()
        }).catch(function(error) {
          if (error.response) {
            // 存在请求，但是服务器的返回一个状态码
            console.log(error.response)
          } else {
            // 一些错误是在设置请求时触发的
            console.log('Error', error.message)
          }
          console.log(error.config)
        })
      },
      changeModel() {
        if (this.physicalModel === '1') {
          this.show = true
        } else {
          this.show = false
        }
      },
      handleChange(val) {
      },
      // 接口网络请求体测详情
      detailRequest() {
        var param = {
          id: this.$route.query.id,
          schoolClassId: this.$route.query.schoolClassId
        }
        this.$store.dispatch('GetStudentDetail', param).then(response => {
          this.student = response.data;
          if (response.data == null) {
            this.$message({
              showClose: true,
              message: '该学生还没有导入体侧数据！',
              type: 'error'
            });
            this.$router.go(-1);
          }
          if (this.student && this.student.basicInfo) {
            if (this.student.basicInfo.bindingTel) {
              this.student.basicInfo.bindingTel = this.student.basicInfo.bindingTel.replace(',', '/')
            }
            if (this.student.phyTestItemDtl) {
              this.student.phyTestItemDtl.healthTestTime = formatDate(this.student.phyTestItemDtl.healthTestTime, 'yyyy-MM-dd')
            } else {
              this.student.phyTestItemDtl = {
                physicalTestItemCategoryResponseBeanList: [
                  {
                    categoryName: '身体形态'
                  },
                  {
                    categoryName: '身体素质'
                  },
                  {
                    categoryName: '脊柱形态'
                  },
                  {
                    categoryName: '身体机能'
                  }
                ],
                healthTestTime: '',
                healthTestAssessment: ''
              }
            }
            if (this.student.phyHealthExamDtl) {
              this.student.phyHealthExamDtl.healthExamTime = formatDate(this.student.phyHealthExamDtl.healthExamTime, 'yyyy-MM-dd')
            } else {
              this.student.phyHealthExamDtl = {
                healthExaminationItemCategoryResponseBeanList: [
                  {
                    name: '身体形态'
                  },
                  {
                    name: '身体机能'
                  },
                  {
                    name: '内科'
                  },
                  {
                    name: '外科'
                  },
                  {
                    name: '眼科'
                  },
                  {
                    name: '五官'
                  },
                  {
                    name: '口腔'
                  },
                  {
                    name: '检验'
                  },
                  {
                    name: '其它'
                  }
                ],
                healthExamTime: ''
              }
            }
          }
          // console.log(this.student.basicInfo)
          this.student.id = this.$route.query.id
          this.student.schoolClassId = this.$route.query.schoolClassId
        })
      },
      // 打印
      printAction() {
        if (this.physicalModel === '1') {
          for (var i = 0; i < this.student.phyTestItemDtl.physicalTestItemCategoryResponseBeanList.length; i++) {
            this.activeNames.push(i)
          }
        } else {
          for (var j = 0; j < this.student.phyHealthExamDtl.healthExaminationItemCategoryResponseBeanList.length; j++) {
            this.activeNames.push(j)
          }
        }
        var that = this;
        var t;
        clearTimeout(t);
        t = setTimeout(function() {
          that.$print(that.$refs.printarea)
        }, 500)
      }
    },
    created() {
      this.detailRequest()
    }
  }
</script>

<style scoped>

</style>
