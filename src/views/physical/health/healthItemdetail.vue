<template>

  <div class="physical-content">
    <section ref="printarea">
      <el-row class="stu-name">
        <el-col :span="24">学生信息</el-col>
      </el-row>

      <el-row class="stu-name-value">
        <el-col :span="24">{{healthItem.name}}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="7"><div class="icon_div"><img class="icon_style" :src="image_sex"></div>性别:
          <span v-if='healthItem.sex=="1"'>男</span>
          <span v-else-if='healthItem.sex=="2"'>女</span>
        </el-col>
        <el-col :span="7"><div class="icon_div"><img class="icon_style" :src="image_year"></div>年龄：{{healthItem.age}}</el-col>
        <el-col :span="10"><div class="icon_div"><img class="icon_style" :src="image_id"></div>身份证：{{healthItem.identityNo}}</el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="7"><div class="icon_div"><img class="icon_style" :src="image_ban"></div>班级：{{healthItem.dictGrade}}{{healthItem.schoolClassName}}</el-col>
        <el-col :span="7"><div class="icon_div"><img class="icon_style" :src="image_xueji"></div>学籍状态：
          <span v-if='healthItem.studentStatus=="1"'>在读</span>
          <span v-else-if='healthItem.studentStatus=="2"'>不在读</span>
        </el-col>
        <el-col :span="10"><div class="icon_div"><img class="icon_style" :src="image_xuejihao"></div>学籍号： {{healthItem.registerNumber}}</el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="7"><div class="icon_div"><img class="icon_style" :src="image_bangding"></div>家长绑定状态：
          <span v-if='healthItem.parentBindingStatus=="1"'>绑定</span>
          <span v-else-if='healthItem.parentBindingStatus=="0"'>未绑定</span>
        </el-col>
        <el-col :span="13"><div class="icon_div"><img class="icon_style" :src="image_bangding_phone"></div>绑定手机：{{healthItem.parentsTel}}</el-col>
      </el-row>

      <hr style="border:0.5px solid #C1DAFB;"/>

      <el-row class="time">
        <el-col :span="24">体检时间: {{healthItem.healthExamTime}}
          <hr style="border:1px solid #C1DAFB;"/></el-col>
      </el-row>

      <el-collapse v-model="activeNames" @change="handleChange" class="custom">
        <el-collapse-item class="collapse" v-for="(ins,index) in healthItem.healthExaminationItemCategoryResponseBeanList" :key="index" :name="index">
          <template slot="title">
            <span class="collapse-title-left">{{ins.name}}</span><span class="collapse-title-right">
              异常项:
              <span v-if="ins.exceptionItem" style="color: #9C4F59;">{{ins.exceptionItem}}</span>
              <span v-else="ins.exceptionItem">无</span>
            </span>
          </template>
          <table border="1" cellpadding="3" id="printTable" class="table">
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
    </section>

    <el-row class="btn-div">
      <el-col :span="24">
        <el-button type="primary" class="save-btn" @click="exportAction" >导出</el-button>
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
  import axios from 'axios'
  import { Message } from 'element-ui'
  import { getToken } from '@/utils/auth'

  // 图片资源
  import image_sex from '@/assets/imgs/icon_sex.png'
  import image_year from '@/assets/imgs/icon_year.png'
  import image_id from '@/assets/imgs/icon_id.png'
  import image_ban from '@/assets/imgs/icon_ban.png'
  import image_xueji from '@/assets/imgs/icon_xueji.png'
  import image_xuejihao from '@/assets/imgs/icon_xuejihao.png'
  import image_bangding from '@/assets/imgs/icon_bangding.png'
  import image_bangding_phone from '@/assets/imgs/icon_bangding_phone.png'

  Vue.use(Print) // 注册

  export default {
    data() {
      return {
        image_sex,
        image_year,
        image_id,
        image_ban,
        image_xueji,
        image_xuejihao,
        image_bangding,
        image_bangding_phone,
        activeNames: [],
        healthItem: {},
        tableHeaderArray: ['项目', '结果', '参考范围', '单位'],
        getLevelName: getLevelName,
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
        }
      }
    },
    name: 'healthItemDetail',
    methods: {
      handleChange(val) {
      },
      // 接口网络请求体测详情
      detailRequest() {
        var healthItem = {
          id: this.$route.query.id
        }
        this.$store.dispatch('GetHealthItemDetail', healthItem).then(response => {
          var time = response.data.healthExamTime.replace('T', ' ')
          // console.log(time)
          var b = formatDate(time, 'yyyy-MM-dd')
          // console.log(b)
          this.healthItem = response.data
          this.healthItem.healthExamTime = b
        })
      },
      // 打印
      printAction() {
        for (var i = 0; i < this.healthItem.healthExaminationItemCategoryResponseBeanList.length; i++) {
          this.activeNames.push(i)
        }
        var that = this
        var t
        clearTimeout(t)
        t = setTimeout(function() {
          that.$print(that.$refs.printarea)
        }, 500)
      },
      // 导出
      exportAction() {
        let instance = axios.create({
          baseURL: process.env.BASE_API,
          timeout: 10000,
          // headers: {
          //   'Authorization': getToken()
          // }
        })
        var that = this
        var testItemId = this.$route.query.id
        instance.get('/api/auth/v1/physical/health/export/' + testItemId).then(function(response) {
          if (response.data.status === undefined) {
            instance = axios.create({
              baseURL: process.env.BASE_API,
              timeout: 10000,
              headers: {
                'Authorization': getToken()
              },
              responseType: 'blob'
            })
            instance.get('/api/auth/v1/physical/health/export/' + testItemId).then(function(response) {
              var blob = new Blob([response.data], {
                type: 'application/vnd.ms-excel'
              })
              var link = document.createElement('a')
              link.href = window.URL.createObjectURL(blob)
              link.download = that.healthItem.name + '体检详情-导出.xls'
              link.click()
            }).catch(function(error) {
              console.log(error)
            })
          } else {
            if (response.data.status.code === 500) {
              Message({
                message: response.data.status.msg,
                type: 'error',
                duration: 2 * 1000
              })
            }
          }
        }).catch(function(error) {
          console.log(error)
        })
      }
    },
    mounted: function() {
      this.detailRequest()
    }
  }
</script>
