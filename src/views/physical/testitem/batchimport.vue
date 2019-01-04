<template>
  <div class="content">
    <div style="font-weight: bold; margin: 15px 0px 30px 35px">批量导入</div>
    <el-form :model="testItem" ref="testItem" :rules="rules" label-width="100px" class="" :label-position="labelPosition">
      <el-form-item prop="schoolYear" :rules="{required: true, message: '请选择学年', trigger: 'blur'}" label="学年：">
        <el-col :span="4">
          <el-select v-model="testItem.schoolYear" placeholder="请选择" size="mini" :disabled="disabledFlag"
                     @change="schoolYearChange">
            <el-option
              v-for="item in schoolYearOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <!--<el-form-item required label="年级：">-->
        <!--<el-col :span="3">-->
          <!--<el-form-item prop="gradeId" :rules="{required: true, message: '请选择年级', trigger: 'blur'}">-->
            <!--<el-select v-model="testItem.gradeId" placeholder="请选择" prop="grade" size="mini" :disabled="disabledFlag" @change="getClass">-->
              <!--<el-option-->
                <!--v-for="item in gradeOptions"-->
                <!--:key="item.gradeId"-->
                <!--:label="item.gradeName"-->
                <!--:value="item.gradeId">-->
              <!--</el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
        <!--<el-col :span="8">-->
          <!--<el-form-item prop="classId" :rules="{required: true, message: '请选择班级', trigger: 'blur'}" label="班级：">-->
            <!--<el-select v-model="testItem.classId" placeholder="请选择" prop="class" size="mini" :disabled="disabledFlag"-->
                       <!--@change="getClassName">-->
              <!--<el-option-->
                <!--v-for="item in classOptions"-->
                <!--:key="item.dictClassId"-->
                <!--:label="item.dictClassName"-->
                <!--:value="item.dictClassId">-->
              <!--</el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
      <!--</el-form-item>-->

      <el-form-item label="提示：" v-model="testItem.tips">
        <el-col :span="20">
          <span class="tips">第一步，下载体测信息模板，用下载的模板填写体测基本信息；</span>
          <a @click="downloadTemplate" style="color: dodgerblue;text-decoration: underline">下载模板</a>
          <br>
          <span class="tips">第二步，点击导入按钮上传已填写完毕的信息模板即可；</span>
        </el-col>

      </el-form-item>

      <el-form-item style="text-align: center;margin-left: 370px">
        <el-col :span="3">
          <el-button @click="goback" size="mini">返回</el-button>
        </el-col>
        <el-col :span="3">
          <el-upload :disabled="disabledFlag"
                     v-model="testItem.files"
                     class="upload-demo"
                     :action=url
                     name="files"
                     :file-list="fileList1"
                     :auto-upload="true"
                     :show-file-list="false"
                     :on-change="handleChange"
                     :data="p_data"
                     :headers="headers"
                     :multiple="true"
                     accept=".xls, .xlsx"
                     ref="upload">
            <el-button type="primary" size="mini" :disabled="disabledFlag" @click="resetProgress">导入</el-button>
          </el-upload>
        </el-col>
      </el-form-item>

      <div style="margin: 0 auto;width: 310px;">
        <div style="position: relative; width: 280px;" v-show="showProgress">
          <div v-if="res.importState==1" class="progressdiv bgcg">✔</div>
          <div v-else-if="res.importState==2" class="progressdiv bgcy">！</div>
          <div v-else-if="res.importState>2 || prostarts==0" class="progressdiv bgcr">×</div>
          <el-progress v-else :percentage="progressing" :text-inside="true" :stroke-width="45" class="progress"
                       :color=progressColor
                       :status="prostatus"
                       :show-text="false"></el-progress>
        </div>
      </div>
      <div v-show="showProgress" style="text-align: center; padding: 20px 100px"
           class="progress-inner-color-red">
        <!--<p v-if="res.importState==0" style="text-align:center;color: red;">{{res.importMsg}}</p>-->
        <p v-if="res.importState==0" style="text-align:center;color: red;">系统出现错误，请联系系统管理员！</p>
        <p v-if="res.importState==1" style="text-align:center;color: green;">全部导入成功{{res.successNum}}条</p>
        <p v-if="res.importState==2" style="text-align:center;color: #1f2d3d;">成功{{res.successNum}}条，失败{{res.failureNum}}条！</p>
        <p v-if="res.importState==3" style="text-align:center;color: #FF0000;">文件格式异常</p>
        <p v-if="res.importState==4" style="text-align:center;color: #FF0000;">文件为空</p>
        <p v-show="res.url!==null"><a :href="res.url" download="" style="text-align:center;color: #4139ff;text-decoration:underline;">下载失败文件</a></p>
      </div>
    </el-form>

  </div>
</template>

<script>
  import { getToken } from '@/utils/auth'
  // 图片资源
  import icIng from '@/assets/imgs/icon_uploading.png'
  import icTick from '@/assets/imgs/icon_tick.png'
  import icErr from '@/assets/imgs/icon_err.png'
  import { getSchoolYear } from '@/utils/index'

  export default {
    data() {
      return {
        // 上传中图标
        icIng: icIng,
        // 上传成功图标
        icTick: icTick,
        // 上传失败图标
        icErr: icErr,
        // 上传状态图标
        statusIcon: '',
        // 服务器前缀
        baseApi: process.env.BASE_API,
        // 上传地址
        url: '',
        // 文件上传中时，表单不能编辑
        disabledFlag: false,
        // 判断是否做表单校验
        valFlag: true,
        // 进度条左边上传状态
        // uploadStatus: '上传中...',
        // 进度条右边上传结果
        // uploadResult: '已上传: ',
        // 上传成功且校验成功数量
        // successNum: 0,
        // 上传失败数量
        // failNum: 0,
        // 文件选择数量
        // fileSize: 0,
        // 上传服务器成功数量（含校验不成功）
        uploadNum: 0,
        // 上传返回的response.data
        res: {
          // 上传服务器不成功数量
          failureNum: 0,
          importMsg: '', // 返回的提示语
          importState: '', // 上传状态 0 失败  1 成功
          successNum: 0, // 成功的数量
          url: '' // 失败的下载链接
        },
        // 上传结果显示（进度条左边数字）
        // resultDisplay: 0,
        // 是否显示进度条状态
        showProgress: false,
        // 进度条颜色
        progressColor: '',
        prostatus: '',
        prostarts: '',
        // 进度多少
        progressing: 0,
        // 上传总数量
        // totalNum: 0,
        // 上传失败原因
        failReason: '',
        // 进度条文本颜色
        progressTextColor: 'progress-inner-color',
        // 整个表单的label对齐方式
        labelPosition: 'right',
        rules: {},
        schoolYearOptions: [],
        gradeOptions: [],
        classOptions: [],
        testItem: {
          schoolYear: '',
          gradeId: '',
          classId: '',
          files: [],
          tips: ''
        },
        fileList1: [], // 上传的文件夹列表
        p_data: { // 上传时附带的额外参数
          schoolYear: '',
          userId: '',
          // schoolYearStart: '',
          // schoolYearEnd: '',
          // gradeId: '',
          // schoolGradeName: '',
          // classId: '',
          // schoolClassName: ''
        },
        headers: { // 设置上传请求头部
          Authorization: getToken()
        }
      }
    },
    mounted() {
      var usertoken = getToken()
      // console.info(' =============> usertoken ' + usertoken)
      this.headers.Authorized = usertoken
      // 获取userId
      var user = JSON.parse(window.localStorage.getItem('ydl_user'))
      this.p_data.userId = user.userId
      // console.info(' =============> userId ' + this.p_data.userId)
      // 获取学年
      this.schoolYearOptions = getSchoolYear()
      // 获取年级
      // this.getGrade()
      // 拼接上传地址
      this.url = this.baseApi + '/api/auth/v1/physical/testItem/batchUpload';
      // 初始化上传状态图标
      this.statusIcon = this.icIng
    },
    methods: {
      goback() {
        history.go(-1)
      },
      // 下载模版
      downloadTemplate() {
        this.$store.dispatch('TestItemTemplate').then(res => {
          // console.info(JSON.stringify(res))
          window.location.href = res;
        })
      },
      // 学年选择后，判断是否需要重新获取班级
      schoolYearChange() {
        this.p_data.schoolYear = this.testItem.schoolYear
        // this.testItem.classId = ''
        // if (this.testItem.gradeId !== '') {
        //   this.getClass()
        // }
      },
      // 上传
      handleChange(file, fileList) {
        var _this = this
        // 只要点击了上传按钮，就需要等上传完成才能再次编辑表单
        _this.disabledFlag = true
        if (_this.valFlag) {
          this.$refs.testItem.validate((valid) => {
            // 检验必填项
            if (valid) {
              // console.info(_this.p_data)
              // 计算上传成功／失败数，且组织失败原因
              _this.countAndFormatData(file, fileList)
            } else {
              // 更新valFlag 为 false，当用户不点击确认按钮，就不继续验证
              _this.valFlag = false
              this.$confirm('请完成必填/选项!').then(
                _this.valFlag = true
              )
              // 如果在表单校验不通过之前已选择文件，则先将所有数据还原设置
              _this.resetProgress()
              return false
            }
          })
        }
      },
      // 计算上传成功／失败数，且组织失败原因
      countAndFormatData(file, fileList) {
        if (file.response) {
          setTimeout(() => {
            this.prostarts = file.response.data.importState;
            if (file.response.data.importState == 0) {
              console.log('异常')
              this.progressColor = '#ff5b51';
              // this.prostatus = 'exception';
            } else if (file.response.data.importState == 1) {
              console.log('成功');
              // this.progressColor = '#ffe341';
              // this.prostatus = '#ffe341';
            } else if (file.response.data.importState == 2) {
              console.log('存在导入失败记录')
              this.progressColor = '#ffe341';
              // this.prostatus = exception;
              // this.progressing = 100;
            } else if (file.response.data.importState == 3) {
              console.log('文件格式异常')
              this.progressColor = '#fd151b';
              // this.prostatus = 'exception';
            } else if (file.response.data.importState == 4) {
              console.log('文件为空')
              this.progressColor = '#ff2e2e';
              // this.prostatus = 'exception';
            }
          }, 800);
          // 更新显示结果
          this.showResult(file, fileList)
        }
      },
      // 更新显示数据
      showResult(file, fileList) {
        console.log(file, fileList);
        var _this = this;
        // 延时更新进度条
        setTimeout(() => {
          // 更新进度条为可见，且更新其进度
          const respon = file.response;
          _this.res.failureNum = respon.data.failureNum;
          _this.res.importMsg = respon.data.importMsg;
          _this.res.importState = respon.data.importState;
          _this.res.successNum = respon.data.successNum;
          _this.res.url = respon.data.url;
          _this.showProgress = true
          _this.progressing = Math.round(_this.uploadNum / _this.fileSize * 100)
          _this.resultDisplay = _this.successNum
          _this.uploadResult = '已上传: '
          console.info(' fileList >>>>> ' + JSON.stringify(fileList))
          // _this.totalNum = ' /' + fileList.length
          _this.totalNum = ' /' + _this.fileSize
          // 上传成功，跳转列表
          if (_this.res.importState == 1) {
            setTimeout(function() {
              _this.$router.push({
                name: 'TestItemList',
                params: {
                  schoolYear: _this.testItem.schoolYear,
                  type: "update"
                }
              })
            }, 1000)
          }
          _this.disabledFlag = false
          // }
        }, 500)
      },
      // 重置上传状态 点击导入按钮时触发
      resetProgress() {
        var _this = this
        // 如果在表单校验不通过之前已选择文件，则先将所有数据还原设置
        _this.$refs.upload.clearFiles()
        // console.info(' >>>>> clear files ')
        // 初始化上传状态图标
        _this.statusIcon = _this.icIng
        // 上传失败数量
        _this.failNum = 0
        // 上传成功且校验成功数量
        _this.successNum = 0
        // 上传服务器成功数量（含校验不成功）
        _this.uploadNum = 0
        // 上传服务器不成功数量
        _this.failureNum = 0
        // 输入框编辑状态
        _this.disabledFlag = false
        // 进度条左边上传状态
        _this.uploadStatus = '上传中...'
        // 进度条右边上传结果
        _this.uploadResult = '已上传: '
        // 上传结果显示（进度条左边数字）
        _this.resultDisplay = 0
        // 是否显示进度条状态
        _this.showProgress = false
        // 进度多少
        _this.progressing = 0
        // 上传总数量
        _this.totalNum = 0
        // 上传失败原因
        _this.failReason = ''
        // 进度条文本颜色
        _this.progressTextColor = 'progress-inner-color'
        // 文件选择数量
        _this.fileSize = 0
      },
      // 检查文件大小
      isLessThan1M(file) {
        const isLt1M = Math.ceil(file.size / 1024 / 1024) <= 1
        console.info(' >>> file ' + file.name + ' > size less than 1MB > ' + isLt1M + ' > size: ' + file.size + ' response： ' + JSON.stringify(file.response))
        return isLt1M
      }

      // 获取年级
      // getGrade() {
      //   this.$store.dispatch('GetGrade').then(response => {
      //     this.gradeOptions = response.data
      //   })
      // },
      // 获取班级，同时获取年级label
      // getClass(value) {
      //   this.testItem.classId = ''
      //   var data = {}
      //   for (let i = 0; i < this.gradeOptions.length; i++) {
      //     if (this.testItem.gradeId == this.gradeOptions[i].gradeId) {
      //       data.schoolTypeGradeId = this.gradeOptions[i].id;
      //     }
      //   }
      //   var list = this.testItem.schoolYear.split('-')
      //   if (list.length > 0) {
      //     data.schoolYearStart = list[0]
      //     data.schoolYearEnd = list[1]
      //     this.p_data.schoolYearStart = list[0]
      //     this.p_data.schoolYearEnd = list[1]
      //   }
      //   this.$store.dispatch('GetClass', data).then(response => {
      //     this.classOptions = response.data
      //   })
      //   let obj = {}
      //   obj = this.gradeOptions.find((item) => {
      //     return item.gradeId === value
      //   })
      //   this.p_data.schoolGradeName = obj.gradeName
      //   this.p_data.gradeId = this.testItem.gradeId
      // },
      // 获取班级label
      // getClassName(value) {
      //   let obj = {}
      //   obj = this.classOptions.find((item) => {
      //     return item.dictClassId === value
      //   })
      //   this.p_data.schoolClassName = obj.dictClassName
      //   this.p_data.classId = this.testItem.classId
      //   // console.log(this.p_data)
      // },
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .content {
    margin-top: 30px;
    width: 100%;
    background-color: white;
    padding: 10px;
    border-radius: 8px;
  }
  .el-select{
    width: 120px;
  }

  .icon_style{
    padding-right: 3px;
  }
  .progressdiv{
    width: 280px;
    height: 45px;
    font-size: 32px;
    border-radius: 30px;
    text-align: center;
    line-height: 45px;
    color: #fff;
  }
  .bgcy{
    background-color: #ffd522;
  }
  .bgcr{
    background-color: #fa510e;
  }
  .bgcg{
    background-color: #61ff21;
  }
</style>
