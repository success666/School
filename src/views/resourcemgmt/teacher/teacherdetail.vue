<template>
  <div class="teachers-content">
    <section ref="printarea">
      <el-row>
        <el-col :span="24">
          <div>
            <img :src="(teacherModel.logoUrl != '')?teacherModel.logoUrl:img_teacher_file_default_head"
                 class="avatar"/>
          </div>
          <span class="user-name">{{teacherModel.name}}</span>
          <span style="font-size: 10px;position: absolute;top: 84px;left: 134px;">{{teacherModel.nativePlaceProvinceName}}{{teacherModel.nativePlaceCityName}}</span>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <div class="teacher-title" style="overflow: hidden;white-space:normal;
           word-break:break-all;
           word-wrap:break-word; ">
            <img style="position: absolute;" width="100px" :src="img_teacher_file_bg1"/>
            <div class="educationDegreeName">{{teacherModel.educationDegreeName}}</div>
          </div>
          <div class="teacher-title" style="overflow: hidden;white-space:normal;
           word-break:break-all;
           word-wrap:break-word; ">
            <img style="position: absolute;" width="100px" :src="img_teacher_file_bg2"/>
            <div class="educationDegreeName" :style="((teacherModel.teacherProfessionalTitleName!=null) && (teacherModel.teacherProfessionalTitleName.length>=5))?'margin-top:10px':''">{{teacherModel.teacherProfessionalTitleName}}</div>
          </div>
          <div class="teacher-title" style="overflow: hidden;white-space:normal;
           word-break:break-all;
           word-wrap:break-word; ">
            <img style="position: absolute;" width="100px" :src="img_teacher_file_bg3"/>
            <div class="educationDegreeName">{{teacherModel.workExperience}}年经验</div>
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <div class="info-title"><img class="icon_style" :src="img_teacher_file_title_tag"> <span style="margin-left: 10px;">个人信息</span></div>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="line-height: 50px;margin-left: 20px;">
        <el-col style="width: 150px"><img class="icon_style" style="margin-right: 10px;" :src="image_sex">性别:
          <span v-if='teacherModel.sex=="1"'>男</span>
          <span v-else-if='teacherModel.sex=="2"'>女</span>
        </el-col>
        <el-col style="width: 260px"><img class="icon_style" style="margin-right: 10px;" :src="icon_teacher_file_year">出生日期：{{teacherModel.birthdate | formatDate2}}</el-col>
        <el-col style="width: 200px"><img class="icon_style" style="margin-right: 10px;" :src="icon_teacher_file_call">{{teacherModel.tel}}</el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <div class="info-title"><img class="icon_style" :src="img_teacher_file_title_tag"> <span style="margin-left: 10px;">工作信息</span></div>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="line-height: 50px;">
        <span style="margin-left: 45px;">学年度： {{teacherModel.schoolYearStart}}-{{teacherModel.schoolYearEnd}}</span>
        <span style="margin-left: 40px;">岗位：
          <span v-if='teacherModel.post=="1"'>体育教师</span>
          <span v-else-if='teacherModel.post=="2"'>校医</span>
        </span>
        <span style="margin-left: 40px;">在职状态：
          <span v-if='teacherModel.status=="1"'>在职</span>
          <span v-else-if='teacherModel.status=="2"'>离职</span>
        </span>
        <span style="margin-left: 40px;">入职时间： {{teacherModel.entryDate | formatDate}}</span>
      </el-row>

      <el-row>
        <el-col :span="24">
          <div class="info-title"><img class="icon_style" :src="img_teacher_file_title_tag"> <span style="margin-left: 10px;">荣誉与成就</span></div>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="line-height: 20px;">
        <span style="margin-left: 23px;font-size: 10px;color: #0071E0">●</span><span style="margin-left: 10px;">荣誉：</span>
      </el-row>

      <el-row v-for="(ins,index) in teacherModel.teacherHonorDtlList" :gutter="20" style="line-height: 15px;" :key="ins.key">
        <span style="margin-left: 45px;">{{ins.matchName}}({{ins.honourDegreeName}})</span>
      </el-row>

      <el-row :gutter="20" style="line-height: 20px;">
        <span style="margin-left: 23px;font-size: 10px;color: #0071E0">●</span><span style="margin-left: 10px;">论文 / 优秀教案：</span>
      </el-row>

      <el-row v-for="(ins,index) in teacherModel.teacherTreatiseDtlList" :gutter="20" style="line-height: 15px;" :key="ins.id">
        <span style="margin-left: 45px;">{{ins.name}}</span>
        <img class="icon_style" style="margin-left: 30px" :src="icon_teacher_file_accessory">
        <a v-if="ins.opusUrl!=''" :href="ins.opusUrl" style="margin-left: 10px;color:#0071E0">{{ins.opusUrl | getFileName}}</a>
      </el-row>

    </section>

    <el-row class="btn-div">
      <el-col :span="24">
        <el-button type="primary" @click='exportDetail' >导出</el-button>
        <el-button type="primary" @click="print">打印</el-button>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import { formatDate } from '@/utils/index'
  import { getToken } from '@/utils/auth'
  import axios from 'axios'
  import { Message } from 'element-ui'
  import '@/views/resourcemgmt/teacher/teacher.scss'

  // 图片资源
  import image_sex from '@/assets/imgs/icon_sex.png'
  import img_teacher_file_default_head from '@/assets/imgs/img_teacher_file_default_head.png'
  import img_teacher_file_title_tag from '@/assets/imgs/img_teacher_file_title_tag.png'
  import icon_teacher_file_accessory from '@/assets/imgs/icon_teacher_file_accessory.png'
  import icon_teacher_file_add from '@/assets/imgs/icon_teacher_file_add.png'
  import icon_teacher_file_call from '@/assets/imgs/icon_teacher_file_call.png'
  import icon_teacher_file_minus from '@/assets/imgs/icon_teacher_file_minus.png'
  import icon_teacher_file_sex from '@/assets/imgs/icon_teacher_file_sex.png'
  import icon_teacher_file_tip from '@/assets/imgs/icon_teacher_file_tip.png'
  import icon_teacher_file_year from '@/assets/imgs/icon_teacher_file_year.png'
  import img_teacher_file_bg1 from '@/assets/imgs/img_teacher_file_bg1.png'
  import img_teacher_file_bg2 from '@/assets/imgs/img_teacher_file_bg2.png'
  import img_teacher_file_bg3 from '@/assets/imgs/img_teacher_file_bg3.png'

  export default {
    name: 'TeacherDetail',
    filters: {
      formatDate(time) {
        var date = new Date(time)
        return formatDate(date, 'yyyy/MM/dd')
      },
      formatDate2(time) {
        var date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd')
      },
      getFileName(fileUrl) {
        var str = fileUrl
        str = str.substring(str.lastIndexOf('/') + 1)
        return str
      }
    },
    data() {
      return {
        image_sex: image_sex,
        img_teacher_file_title_tag: img_teacher_file_title_tag,
        img_teacher_file_default_head: img_teacher_file_default_head,
        icon_teacher_file_accessory: icon_teacher_file_accessory,
        icon_teacher_file_add: icon_teacher_file_add,
        icon_teacher_file_call: icon_teacher_file_call,
        icon_teacher_file_minus: icon_teacher_file_minus,
        icon_teacher_file_sex: icon_teacher_file_sex,
        icon_teacher_file_tip: icon_teacher_file_tip,
        icon_teacher_file_year: icon_teacher_file_year,
        img_teacher_file_bg1: img_teacher_file_bg1,
        img_teacher_file_bg2: img_teacher_file_bg2,
        img_teacher_file_bg3: img_teacher_file_bg3,
        teacherModel: {
          birthdate: '', // 出生日期
          educationDegreeId: '1', // 学历ID
          entryDate: '', // 入职时间
          logoUrl: '', // 头像图片url
          name: '', // 用户昵称
          nativePlaceCityId: '', // 贯籍所在市ID
          nativePlaceProvinceId: '', // 贯籍所在省ID
          post: '1', // 岗位
          schoolYear: '', // 学年
          sex: '1', // 性别
          status: '1', // 在职状态
          teacherHonorReqBeanArr: [ // 荣誉列表
            {
              dictHonourDegreeId: '', // 荣誉等级ID
              dictHonourId: '', // 荣誉ID
              matchName: '' // 赛事名称
            }
          ],
          teacherProfessionalTitleId: '', // 教师职称
          teacherTreatiseReqBeanArr: [ // 教师论文/优秀教案详情
            {
              name: '', // 论文名称
              opusUrl: '' // 附件URL
            }
          ],
          tel: '', // 电话
          workExperience: '' // 工作经验
        }
      }
    },
    methods: {
      // 请求师资详情接口
      requestTeacherDetail() {
        this.$store.dispatch('TeacherDetail', this.$route.query.teacherId).then(response => {
          // console.log(response)
          this.teacherModel = response.data
        })
      },
      // 导出
      exportDetail() {
        // console.log('导出师资详情')
        var instance = axios.create({
          baseURL: process.env.BASE_API,
          timeout: 10000,
          headers: {
            'Authorization': getToken()
          }
        })
        var that = this
        instance.get('/api/auth/v1/teacher/stats/exportDtl?schoolYear=' + this.teacherModel.schoolYearStart + '-' + this.teacherModel.schoolYearEnd + '&name=' + this.teacherModel.name).then(function(response) {
          if (response.data.status === undefined) {
            instance = axios.create({
              baseURL: process.env.BASE_API,
              timeout: 10000,
              headers: {
                'Authorization': getToken()
              },
              responseType: 'blob'
            })
            instance.get('/api/auth/v1/teacher/stats/exportDtl?schoolYear=' + that.teacherModel.schoolYearStart + '-' + that.teacherModel.schoolYearEnd + '&name=' + that.teacherModel.name).then(function(response) {
              var blob = new Blob([response.data], {
                type: 'application/vnd.ms-excel'
              })
              var link = document.createElement('a')
              link.href = window.URL.createObjectURL(blob)
              link.download = '体育师资详情.xls'
              link.click()
            }).catch(function(error) {
              console.log(error)
            })
          } else {
            if (response.data.status.code === "500") {
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
      },
      // 打印
      print() {
        this.$print(this.$refs.printarea)
      }
    },
    mounted: function() {
      this.requestTeacherDetail()
    }
  }

</script>

<style rel="stylesheet/scss" lang="scss" scoped>

  .avatar {
    margin-top: 5px;
    width: 100px;
    height: 100px;
    /*border-style: solid;*/
    /*border-width: 2px;*/
    /*border-color: #007FEC;*/
    /*border-radius: 5px;*/
  }

  .user-name {
    color: #2B73F4;
    font-size: 30px;
    position: absolute;
    top: 40px;
    left: 130px;
  }

  .teacher-title {
    margin: 10px;
    margin-left: 0px;
    margin-right: 50px;
    height: 105px;
    width: 100px;
    float: left;

    display: -moz-box;/*兼容Firefox*/
    display: -webkit-box;/*兼容FSafari、Chrome*/

    -moz-box-align: center;/*兼容Firefox*/
    -webkit-box-align: center;/*兼容FSafari、Chrome */

    -moz-box-pack: center;/*兼容Firefox*/
    -webkit-box-pack: center;/*兼容FSafari、Chrome */
  }

  .educationDegreeName {
    text-align: center;
    font-weight: bold;
    font-size: 21px;
    color: black;
  }


</style>
