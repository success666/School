<template>
  <div class="teachers-content teachers-content-edit">

    <el-form :model="teacherModel" ref="teacherForm" label-width="100px" class="demo-ruleForm">


      <el-row class="stu-name">
        <el-col :span="24">
          <span v-if="isAddPage==true">添加师资详情</span>
          <span v-else>编辑师资详情</span>
        </el-col>
      </el-row>

      <el-row style="margin-top: 30px;">
        <el-col :span="24">
          <div class="info-title"><img class="icon_style" :src="img_teacher_file_title_tag"> <span style="margin-left: 10px;">个人信息</span></div>
        </el-col>
      </el-row>

      <el-row style="margin-top: 30px;">
        <el-col style="width: 130px">头像：</el-col>
        <el-col :span="18">
          <div class="logo-div">
          <a v-if="teacherModel.logoUrl != ''" @click="removeLogo" class="remove-logo"><i class="el-icon-close" style="font-size: 25px;position: absolute;margin-left: 80px;margin-top: 5px"></i></a>
          <el-upload
            class="avatar-uploader"
            ref="logoUpload"
            :show-file-list="false"
            :action="ossHost"
            :data="ossParams"
            :on-change="handleChangeBylogo"
            :auto-upload='false'
            :before-upload="beforeUploadByLogo">
            <div v-if="teacherModel.logoUrl != ''" class="reupload">重新上传</div>
            <img v-if="isAddPage==true" :src="(teacherModel.logoUrl != '')?teacherModel.logoUrl:icon_teacher_add" class="avatar">
            <img v-if="isAddPage!=true && teacherModel.logoUrl != ''" :src="(teacherModel.logoUrl != '')?teacherModel.logoUrl:img_teacher_file_default_head" class="avatar">
            <img v-else-if="(isAddPage!=true && teacherModel.logoUrl == '')" :src="(teacherModel.logoUrl != '')?teacherModel.logoUrl:icon_teacher_add" class="avatar">
          </el-upload>
          </div>
          <div class="teacher-item-right-label"><img class="icon_style" :src="icon_teacher_file_tip"> <span style="margin-left: 10px;">免冠1寸相片，图片格式：<span class="font-red">JPG、PNG、BMP、JPEG；</span>图片大小不超过<span class="font-red">200KB</span></span></div>
        </el-col>
      </el-row>

      <el-row>
        <el-form-item label="姓名：" label-width="130px" prop="name" :rules="[{ required: true, message: '姓名不能为空' }]">
          <el-input style="width: 200px;" class="text-input" v-model="teacherModel.name"></el-input>
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item label="性别：" label-width="130px" prop="sex" :rules="[{ required: true, message: '请选择性别' }]">
          <el-radio v-model="teacherModel.sex" :label=1>男</el-radio>
          <el-radio v-model="teacherModel.sex" :label=2>女</el-radio>
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item label="出生日期：" label-width="130px" prop="birthdate" :rules="[{ required: true, message: '请选择出生日期' }]">
          <el-date-picker type="date" placeholder="请选择日期" v-model="teacherModel.birthdate" style="width: 200px;" :picker-options="pickerDate"></el-date-picker>
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item label="籍贯：" label-width="130px">
          <el-select v-model="teacherModel.nativePlaceProvinceId" placeholder="请选择省" @change="nativePlaceProvinceChange">
            <el-option
              v-for="item in nativePlaceProvinceOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>

          <el-select v-model="teacherModel.nativePlaceCityId" placeholder="请选择市" style="margin-left: 30px;">
            <el-option
              v-for="item in nativePlaceCityOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item label="学历：" label-width="130px" prop="educationDegreeId" :rules="[{ required: true, message: '请选择学历' }]">
          <el-radio v-for="ins in educationDegreeOptions" :key="ins.id" v-model="teacherModel.educationDegreeId" :label=ins.id>{{ins.name}}</el-radio>
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item prop="workExperience" label="工作经验：" label-width="130px" :rules="[{ required: true, message: '请选择工作经验' }]">
          <el-select v-model="teacherModel.workExperience" placeholder="请选择年份">
            <el-option
              v-for="item in workExperienceOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item label="联系电话：" label-width="130px" prop="tel" :rules="[{ required: true, message: '联系电话不能为空' },{validator: isInteger,trigger: 'blur' }]">
          <el-input style="width: 200px;" class="text-input" v-model="teacherModel.tel"></el-input>
        </el-form-item>
      </el-row>

      <el-row style="margin-top: 30px;">
        <el-col :span="24">
          <div class="info-title"><img class="icon_style" :src="img_teacher_file_title_tag"> <span style="margin-left: 10px;">工作信息</span></div>
        </el-col>
      </el-row>

      <el-row style="margin-top: 30px;">
        <el-form-item label="学年：" label-width="130px" prop="schoolYear" :rules="[{ required: true, message: '请选择学年' }]">
          <el-select v-model="teacherModel.schoolYear" placeholder="请选择学年">
            <el-option
              v-for="item in xuenian"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item label="岗位：" label-width="130px" prop="post" :rules="[{ required: true, message: '请选择岗位' }]">
          <el-radio v-model="teacherModel.post" :label=1>体育教师</el-radio>
          <el-radio v-model="teacherModel.post" :label=2>校医</el-radio>
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item label="职称：" label-width="130px" prop="teacherProfessionalTitleId" :rules="[{ required: true, message: '请选择职称' }]">
          <el-radio v-for="ins in teacherProfessionalTitleOptions" :key="ins.id" v-model="teacherModel.teacherProfessionalTitleId" :label=ins.id>{{ins.name}}</el-radio>
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item label="在职状态：" label-width="130px" prop="status" :rules="[{ required: true, message: '请选择在职状态' }]">
          <el-radio v-model="teacherModel.status" :label=1>在职</el-radio>
          <el-radio v-model="teacherModel.status" :label=2>离职</el-radio>
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item label="入职时间：" label-width="130px" prop="entryDate"  :rules="[{ required: true, message: '请选择入职时间' }]">
          <el-date-picker type="date" placeholder="请选择日期" v-model="teacherModel.entryDate" style="width: 200px;" :picker-options="pickerDate"></el-date-picker>
        </el-form-item>
      </el-row>

      <el-row style="margin-top: 30px;margin-bottom: 20px;">
        <el-col :span="24">
          <div class="info-title"><img class="icon_style" :src="img_teacher_file_title_tag"> <span style="margin-left: 10px;">荣誉与成就</span></div>
        </el-col>
      </el-row>

      <el-row style="line-height: 50px;" v-for="(ins,index) in teacherModel.teacherHonorReqBeanArr" :key="ins.id">
        <el-col style="width: 130px"><div style="line-height: 40px;"><span v-if="index==0">荣誉：</span>&nbsp</div></el-col>
        <el-col :span="18">
          <div class="">
            <el-select v-model="ins.dictHonourDegreeId" placeholder="请选择比赛等级">
              <el-option
                v-for="item in honourDegreeOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-input style="width: 400px;margin-left: 10px;" class="text-input" v-model="ins.matchName" placeholder="请填写"></el-input>
            <el-select style="margin-left: 10px;" v-model="ins.dictHonourId" placeholder="请选择比赛名次">
              <el-option
                v-for="item in honourOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <img class="icon_style" style="margin-left: 20px;" :src="index==0?icon_teacher_file_add:icon_teacher_file_minus" @click="addHonor(index)">
          </div>
        </el-col>
      </el-row>
      <div style="margin-bottom: 20px;"></div>
      <el-row style="line-height: 50px;" v-for="(ins,index) in teacherModel.teacherTreatiseReqBeanArr" :key="index">
        <el-col style="width: 130px"><div style="line-height: 40px;"><span v-if="index==0">论文/优秀教案：</span>&nbsp</div></el-col>
        <el-col style="width: 90%;">
          <div class="">
            <el-input style="width: 400px;float: left;" class="text-input" v-model="ins.name" placeholder="请填写"></el-input>
            <span class="fileName" style="float: left;margin-right: 10px;">&nbsp;&nbsp;&nbsp;{{ins.opusUrl | getFileName}}
              <a class="removeLwIcon" @click="removeLw(index)"><i style="margin-left: 5px;" class="font-red el-icon-error"></i></a>
            </span>
            <el-upload
              :disabled="(uploadingByLWIndex != null)"
              class="upload-demo"
              :ref="'lwUpload'+index"
              :show-file-list="false"
              :action="ossHost"
              :data="ossParams"
              :on-change="handleChangeByLW"
              :auto-upload="false"
              :before-upload="beforeUploadByLW"
              style="float: left;">
              <el-button size="small" :disabled="uploadingByLWIndex!=null" :loading="index==uploadingByLWIndex" type="primary" @click="lwUploadSubmit(index,'lwUpload'+index)">上传附件</el-button>
            </el-upload>
            <img class="icon_style" style="margin-left: 20px;" :src="icon_teacher_file_tip">
            <span style="margin-left: 5px;">文件格式：.DOC/.PDF/.ZIP/.7Z/.TXT</span>
            <span style="margin-left: 5px;">不超过</span><span class="font-red">50M</span>
            <img class="icon_style" style="margin-left: 20px;" :src="index==0?icon_teacher_file_add:icon_teacher_file_minus" @click="addLunwen(index)">
          </div>
        </el-col>
      </el-row>

      <el-row class="btn-div">
        <el-col :span="24">
          <el-button @click="back" >取消</el-button>
          <el-button type="primary" @click="onSubmit('teacherForm')" class="save-btn">保存</el-button>
        </el-col>
      </el-row>

    </el-form>

  </div>
</template>
axios
<script>
  import { Message } from 'element-ui'
  import { getSchoolYear } from '@/utils/index'
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
  import icon_teacher_add from '@/assets/imgs/icon_teacher_add.png'

  export default {
    filters: {
      getFileName(fileUrl) {
        var str = fileUrl
        str = str.substring(str.lastIndexOf('/') + 1)
        return str
      }
    },
    name: 'TeacherDetail',
    data() {
      return {
        pickerDate: {
          disabledDate: (time) => {
            var date = new Date()
            return time.getTime() > date
          }
        },
        ossParams: {
          success_action_status: 200
        },
        ossHost: '',
        filesList: [],
        // 默认为添加教师页面
        isAddPage: false,
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
        icon_teacher_add: icon_teacher_add,
        isInteger: isInteger,
        // 正在上传的论文
        uploadByReadyByLWIndex: null,
        uploadingByLWIndex: null,
        // 教师数据容器
        teacherModel: {
          birthdate: '', // 姓名
          educationDegreeId: '', // 学历ID
          entryDate: '', // 入职时间
          logoUrl: '', // 头像图片url
          name: '', // 用户昵称
          nativePlaceCityId: '', // 贯籍所在市ID
          nativePlaceProvinceId: '', // 贯籍所在省ID
          post: '', // 岗位
          schoolYear: '', // 学年
          sex: '', // 性别
          status: '', // 在职状态
          teacherHonorReqBeanArr: [ // 荣誉列表
            // {
            //   dictHonourDegreeId: '', // 荣誉等级ID
            //   dictHonourId: '', // 荣誉ID
            //   matchName: '' // 赛事名称
            // }
          ],
          teacherProfessionalTitleId: '', // 教师职称
          teacherTreatiseReqBeanArr: [ // 教师论文/优秀教案详情
            // {
            //   name: '', // 论文名称
            //   opusUrl: '' // 附件URL
            // }
          ],
          tel: '', // 电话
          workExperience: '' // 工作经验
        },
        nativePlaceCityTemp: {
          label: '',
          id: ''
        }, // 贯籍所在市临时容器
        nativePlaceProvinceTemp: {
          label: '',
          id: ''
        }, // 贯籍所在省临事容器
        workExperienceOptions: [],
        xuenian: [],
        educationDegreeOptions: [],
        nativePlaceProvinceOptions: [],
        nativePlaceCityOptions: [],
        teacherProfessionalTitleOptions: [],
        honourDegreeOptions: [],
        honourOptions: []
      }
    },
    methods: {
      // 添加或者删除荣誉
      addHonor(index) {
        if (index === 0) {
          console.log('增加')
          this.teacherModel.teacherHonorReqBeanArr.push({
            dictHonourDegreeId: '', // 荣誉等级ID
            dictHonourId: '', // 荣誉ID
            matchName: ' ' // 赛事名称
          })
          console.log(this.teacherModel.teacherHonorReqBeanArr)
        } else {
          console.log('删除' + index)
          this.teacherModel.teacherHonorReqBeanArr.splice(index, 1)
        }
      },
      // 添加或者删除论文
      addLunwen(index) {
        if (index === 0) {
          console.log('增加')
          this.teacherModel.teacherTreatiseReqBeanArr.push({
            name: '', // 论文名称
            opusUrl: '' // 附件URL
          })
        } else {
          console.log('删除' + index)
          this.teacherModel.teacherTreatiseReqBeanArr.splice(index, 1)
        }
      },
      // 获取全部省
      getChinaArea() {
        this.$store.dispatch('getChinaArea', 0).then(response => {
          console.log(response)
          this.nativePlaceProvinceOptions = response.data
        })
      },
      // 获取市
      nativePlaceProvinceChange() {
        var code = ''
        var that = this
        this.nativePlaceProvinceOptions.forEach(function(ins, index) {
          if (ins.id === that.teacherModel.nativePlaceProvinceId) {
            code = ins.code
            return
          }
        })
        console.log('===' + code)
        this.$store.dispatch('getChinaArea', code).then(response => {
          console.log(response)
          this.nativePlaceCityOptions = response.data
          this.teacherModel.nativePlaceCityId = this.nativePlaceCityOptions[0].id
        })
      },
      // 获取学历
      getEducationDegree() {
        this.$store.dispatch('getEducationDegree').then(response => {
          this.educationDegreeOptions = response.data
        })
      },
      // 教师资格
      getTeacherProfessionalTitle() {
        this.$store.dispatch('getTeacherProfessionalTitle').then(response => {
          this.teacherProfessionalTitleOptions = response.data
        })
      },
      // 获取荣誉下拉框数据
      getHonour() {
        this.$store.dispatch('getHonourDegree').then(response => {
          this.honourDegreeOptions = response.data
        })
        this.$store.dispatch('getHonour').then(response => {
          this.honourOptions = response.data
        })
      },
      // 保存按钮响应事件
      onSubmit(teacherForm) {
        this.$refs[teacherForm].validate((valid) => {
          if (valid) {
            if (this.isAddPage) {
              this.requestAddTeacher()
            } else {
              this.requestTeacherEdit(this.$route.query.teacherId)
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      // 请求添加师资接口
      requestAddTeacher() {
        this.$store.dispatch('AddTeacher', this.teacherModel).then(response => {
          Message({
            message: '添加成功',
            type: 'success',
            duration: 2 * 1000
          })
          this.$router.push({
            name:"TeacherList",
            params:{
              schoolYear:this.teacherModel.schoolYear,
              type:"update"
            }
          })
        })
      },
      // 请求编辑师资接口
      requestTeacherEdit() {
        console.log(this.teacherModel)
        this.teacherModel.id = this.$route.query.teacherId
        this.$store.dispatch('TeacherEdit', this.teacherModel).then(response => {
          Message({
            message: '编辑成功',
            type: 'success',
            duration: 2 * 1000
          })
          this.$router.push({
            name:"TeacherList",
            params:{
              schoolYear:this.teacherModel.schoolYear,
              type:"update"
            }
          })
        })
      },
      // 返回上一个页面
      back() {
        this.$router.back()
      },
      // 请求师资详情接口
      requestTeacherDetail(id) {
        this.$store.dispatch('TeacherDetail', id).then(response => {
          console.log(response)
          // this.teacherModel = response.data
          this.teacherModel.birthdate = response.data.birthdate
          this.teacherModel.educationDegreeId = response.data.educationDegreeId
          this.teacherModel.entryDate = response.data.entryDate
          this.teacherModel.logoUrl = response.data.logoUrl
          this.teacherModel.name = response.data.name
          this.teacherModel.post = response.data.post
          this.teacherModel.sex = response.data.sex
          this.teacherModel.status = response.data.status
          this.teacherModel.teacherProfessionalTitleId = response.data.teacherProfessionalTitleId
          this.teacherModel.tel = response.data.tel
          this.teacherModel.workExperience = response.data.workExperience
          this.teacherModel.nativePlaceProvinceId = response.data.nativePlaceProvinceId
          this.teacherModel.nativePlaceCityId = response.data.nativePlaceCityId

          var that = this
          this.$store.dispatch('getChinaArea', 0).then(response => {
            console.log(response)
            this.nativePlaceProvinceOptions = response.data

            this.nativePlaceProvinceOptions.forEach(function(ins, index) {
              if (ins.id === that.teacherModel.nativePlaceProvinceId) {
                that.$store.dispatch('getChinaArea', ins.code).then(response => {
                  console.log(response)
                  that.nativePlaceCityOptions = response.data
                })
                return
              }
            })
          })



          this.teacherModel.schoolYear = response.data.schoolYearStart + '-' + response.data.schoolYearEnd
          if (response.data.teacherHonorDtlList === null) {
            var honour = {
              dictHonourDegreeId: '', // 荣誉等级ID
              dictHonourId: '', // 荣誉ID
              matchName: '' // 赛事名称
            }
            this.teacherModel.teacherHonorReqBeanArr.push(honour)
          } else {
            for (var i = 0; i < response.data.teacherHonorDtlList.length; i++) {
              honour = {
                dictHonourDegreeId: '', // 荣誉等级ID
                dictHonourId: '', // 荣誉ID
                matchName: '' // 赛事名称
              }
              var temp = response.data.teacherHonorDtlList[i]
              honour.dictHonourDegreeId = temp.honourDegreeId
              honour.dictHonourId = temp.honourId
              honour.matchName = temp.matchName
              this.teacherModel.teacherHonorReqBeanArr.push(honour)
            }
          }

          if (response.data.teacherTreatiseDtlList === null) {
            var teacherDtl = {
              name: '', // 论文名称
              opusUrl: '' // 附件URL
            }
            this.teacherModel.teacherTreatiseReqBeanArr.push(teacherDtl)
          } else {
            for (i = 0; i < response.data.teacherTreatiseDtlList.length; i++) {
              temp = response.data.teacherTreatiseDtlList[i]
              this.teacherModel.teacherTreatiseReqBeanArr.push({
                name: temp.name, // 论文名称
                opusUrl: temp.opusUrl // 附件URL
              })
            }
          }
        })
      },
      // 上传头像之前调用
      beforeUploadByLogo(file) {
        let name = file.name
        const lastIndex = name.lastIndexOf('\\')
        if (lastIndex !== -1) {
          name = name.substr(lastIndex + 1)
        }
        this.ossParams.key += `/${new Date().getTime()}.${name.split('.').pop()}`
        console.log(this.ossParams)
        // 校验文件类型和大小
        const isCorrect = (file.type === 'image/jpeg') || (file.type === 'image/png') || (file.type === 'image/bmp') || (file.type === 'image/jpeg')
        const isLt200K = file.size / 1024 < 200
        if (!isCorrect) {
          this.$message.error('请上传正确的格式图片')
        }
        if (!isLt200K) {
          this.$message.error('上传的图片不得超过200KB')
        }
        return isCorrect && isLt200K
      },
      // 上传论文之前调用
      beforeUploadByLW(file) {
        let name = file.name
        console.log(file.name)
        const lastIndex = name.lastIndexOf('\\')
        if (lastIndex !== -1) {
          name = name.substr(lastIndex + 1)
        }
        // this.ossParams.key += `/${new Date().getTime()}.${name.split('.').pop()}`
        this.ossParams.key += '/' + file.name
        console.log(this.ossParams)

        // 校验文件类型和大小
        var filextension = name.substring(name.lastIndexOf('.'), name.length)
        filextension = filextension.toLowerCase()
        console.log(filextension)
        const isCorrect = (filextension === '.doc') || (filextension === '.pdf') || (filextension === '.zip') || (filextension === '.7z') || (filextension === '.txt')
        const isLt50M = file.size / 1024 / 1024 < 50
        if (!isCorrect) {
          this.$message.error('请上传正确的文件格式')
        }
        if (!isLt50M) {
          this.$message.error('上传的附件大小不超过50M')
        }
        if ((isCorrect && isLt50M) === false) {
          this.uploadingByLWIndex = null
          this.uploadByReadyByLWIndex = null
        }
        return isCorrect && isLt50M
      },
      // 获取OSS配置, 1为师资头像，2为论文
      getOssUrl(type) {
        if (type === 1) {
          this.ossParams = {
            success_action_status: 200
          }
          this.$store.dispatch('getOssPolicyByLogo').then(response => {
            console.log(response)
            this.ossParams.key = response.data.dir
            this.ossParams.policy = response.data.policy
            this.ossParams.signature = response.data.signature
            this.ossParams.OSSAccessKeyId = response.data.accessId
            this.ossHost = response.data.host
            // 等待获取到OSS信息再调用上传
            var that = this
            setTimeout(function() {
              that.$refs.logoUpload.submit()
            }, 100)
            // this.$refs.logoUpload.submit()
          })
        } else {
          this.ossParams = {
            success_action_status: 200
          }
          this.$store.dispatch('ossPolicyByTreatise').then(response => {
            console.log(response)
            this.ossParams.key = response.data.dir
            this.ossParams.policy = response.data.policy
            this.ossParams.signature = response.data.signature
            this.ossParams.OSSAccessKeyId = response.data.accessId
            this.ossHost = response.data.host
            // 等待获取到OSS信息再调用上传
            var refname = 'lwUpload' + this.uploadingByLWIndex
            var that = this
            setTimeout(function() {
              that.$refs[refname][0].submit()
            }, 100)
          })
        }
      },
      handleChangeBylogo(file, fileList) {
        console.log(' ======== ')
        console.log(file)
        if (file.status !== 'ready') {
          this.filesList = fileList.slice(-1)
        } else {
          // 已选文件，等待上传，先获取oss
          this.getOssUrl(1)
        }
        if (file.status === 'success') {
          this.teacherModel.logoUrl = `${this.ossHost}/${this.ossParams.key}`
        }
      },
      handleChangeByLW(file, fileList) {
        console.log(' ======== ')
        console.log(file)
        if (file.status !== 'ready') {
          this.filesList = fileList.slice(-1)
        } else {
          // 已选文件，等待上传，先获取oss
          this.getOssUrl(2)
          this.uploadingByLWIndex = this.uploadByReadyByLWIndex
        }
        if (file.status === 'success') {
          // this.teacherModel.logoUrl = `${this.ossHost}/${this.ossParams.key}`
          console.log('上传完成')
          Message({
            message: '上传成功',
            type: 'success',
            duration: 2 * 1000
          })
          // this.teacherModel.teacherTreatiseReqBeanArr[this.uploadingByLWIndex].filename = file.name
          this.teacherModel.teacherTreatiseReqBeanArr[this.uploadingByLWIndex].opusUrl = `${this.ossHost}/${this.ossParams.key}`

          this.uploadByReadyByLWIndex = null
          this.uploadingByLWIndex = null
        }
      },
      lwUploadSubmit(uploadLwIndex, refName) {
        this.uploadByReadyByLWIndex = uploadLwIndex
        console.log(this.uploadByReadyByLWIndex)
        console.log(this.uploadingByLWIndex)
      },
      removeLogo() {
        this.teacherModel.logoUrl = ''
      },
      removeLw(index) {
        this.teacherModel.teacherTreatiseReqBeanArr[index].opusUrl = ''
      }
    },
    mounted: function() {
      this.getChinaArea()
      this.getEducationDegree()
      this.getTeacherProfessionalTitle()
      this.getHonour()

      console.log(this.$route.query.teacherId)
      if (this.$route.query.teacherId === null) {
        this.isAddPage = true
        var honour = {
          dictHonourDegreeId: '', // 荣誉等级ID
          dictHonourId: '', // 荣誉ID
          matchName: '' // 赛事名称
        }
        this.teacherModel.teacherHonorReqBeanArr.push(honour)
        var teacherDtl = {
          name: '', // 论文名称
          opusUrl: '' // 附件URL
        }
        this.teacherModel.teacherTreatiseReqBeanArr.push(teacherDtl)
      }

      // 判断是否为编辑师资
      if (!this.isAddPage) {
        this.requestTeacherDetail(this.$route.query.teacherId)
      }
    },
    created() {
      this.xuenian = getSchoolYear()
      for (var i = 1; i <= 30; i++) {
        var temp = {
          label: i + '年',
          value: i
        }
        this.workExperienceOptions.push(temp)
      }
    }
  }

  // 验证是否整数
  export function isInteger(rule, value, callback) {
    if (value !== '') {
      if (!Number(value)) {
        callback(new Error('请输入正确的号码！'))
      } else {
        const re = /^[0-9]*[1-9][0-9]*$/
        const rsCheck = re.test(value)
        if (!rsCheck) {
          callback(new Error('请输入正确的号码！'))
        } else {
          callback()
        }
      }
    }
  }

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .teachers-content {
    background-color: white;
    border-radius: 10px;
    padding: 30px;
    color: #525252;
  }

  .user-name {
    color: #2B73F4;
    font-size: 30px;
    position: absolute;
    top: 40px;
    left: 130px;
  }

  .teacher-title {
    border-style: solid;
    border-width: 2px;
    border-color: black;
    margin: 10px;
    margin-left: 0px;
    margin-right: 50px;
    height: 100px;
    width: 100px;
    float: left;
  }

  .info-title {
    font-size: 18px;
    font-weight: bold;
  }

  .icon_div {
    float:left;
    margin-right: 10px;
    width:30px;
    text-align: center
  }
  .icon_style {
    vertical-align:middle;
    margin-top: -2px;
  }

  .font-red {
    color: #F64E74;
  }

  .teacher-item {
    height: 120px;
  }

  .teacher-item-right-avatar {
    height: 100px;
    width: 100px;
  }

  .teacher-item-right-label {
    line-height: 70px;
  }

  .teacher-item-el-form-item {
    margin-left: -100px;
  }

  .teacher-upload-btn {
    line-height: 30px;
    border-radius: 15px;
    border-color: #337DF0;
    color: #337DF0;
    margin-left: 10px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 110px;
    height: 110px;
    line-height: 110px;
    text-align: center;
  }
  .avatar {
    width: 110px;
    height: 110px;
    display: block;
  }
  .logo-div .avatar-uploader .reupload {
    position: absolute;
    margin-top: 40px;
    margin-left: 15px;
    background-color: red;
    width: 80px;
    font-size: 15px;
    color: white;
    line-height: 30px;
    display: none;
  }
  .logo-div:hover .avatar-uploader .reupload{
    position: absolute;
    margin-top: 40px;
    margin-left: 15px;
    background-color: rgba(0,0,0,0.6);
    width: 80px;
    font-size: 15px;
    color: white;
    line-height: 30px;
    display: block;
    border-radius: 10px;
  }

  .logo-div {
    width: 110px;
  }

  .logo-div .remove-logo {
    display: none;
  }

  .logo-div:hover .remove-logo {
    display: block;
  }

  .fileName .removeLwIcon{
    display: none;
  }

  .fileName:hover .removeLwIcon{
    display: inline;
  }

</style>
