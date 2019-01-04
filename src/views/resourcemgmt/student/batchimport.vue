<template>
  <div class="content">
    <div style="font-weight: bold; margin: 15px 0px 30px 35px">{{title}}-{{title2}}</div>
    <el-form :inline="true" :model="student" ref="student" :rules="rules" label-width="100px" :label-position="labelPosition">
      <el-row>
        <el-form-item prop="schoolYear" label="学年：">
          <el-select v-model="student.schoolYear" placeholder="请选择" size="mini" :disabled="disabledFlag"
                     @change="schoolYearChange">
            <el-option
              v-for="item in schoolYearOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-row>

      <!--<el-row v-if="classType==2">-->
        <!--<el-form-item prop="interestId" label="兴趣班级：">-->
          <!--<el-select v-model="student.interestId" placeholder="请选择" size="mini" :disabled="disabledFlag">-->
            <!--<el-option-->
              <!--v-for="item in interestOptions"-->
              <!--:key="item.id"-->
              <!--:label="item.name"-->
              <!--:value="item.id">-->
            <!--</el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
      <!--</el-row>-->
      <el-form-item label="提示：">
          <span class="tips">第一步，下载学生信息模板，用下载的模板填写学生基本信息；</span> <a @click="downloadTemplate" style="color: dodgerblue;text-decoration: underline">下载模板</a>
          <br>
          <span class="tips">第二步，点击导入按钮上传已填写完毕的信息模板即可；</span>
      </el-form-item>

      <el-row style="text-align: center;margin-left: 370px">
        <el-col :span="3">
          <el-button @click="goback" size="mini">返回</el-button>
        </el-col>
        <el-col :span="3">
          <el-upload :disabled="disabledFlag"
                     v-model="student.files"
                     class="upload-demo"
                     :action=url
                     name="file"
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
      </el-row>

      <div style="margin: 0 auto;width: 310px;">
        <div style="position: relative; width: 280px;" v-show="showProgress">
          <div v-if="res.importState==1" class="progressdiv bgcg">✔</div>
          <div v-else-if="res.importState==2" class="progressdiv bgcy">！</div>
          <div v-else-if="res.importState>2 || prostarts==0" class="progressdiv bgcr">×</div>
          <el-progress v-else :percentage="progressing" :text-inside="true" :stroke-width="45" class="progress" :show-text="false"></el-progress>
        </div>
      </div>
      <div v-show="showProgress" style="text-align: center; padding: 20px 100px"
           class="progress-inner-color-red">
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
import { getToken } from "@/utils/auth";
import request from '@/utils/request'
import requestYapi from "@/utils/requestyAPI";
import { isHavePermissions } from "@/utils/auth";
// 图片资源
import icIng from "@/assets/imgs/icon_uploading.png";
import icTick from "@/assets/imgs/icon_tick.png";
import icErr from "@/assets/imgs/icon_err.png";
import { getSchoolYear } from "@/utils/index";

export default {
  data() {
    return {
      classType: '1',
      title: '批量导入班级',
      title2: '行政班',
      interestOptions: [],
      prostarts: '',
      res: {
        // 上传服务器不成功数量
        failureNum: 0,
        importMsg: '', // 返回的提示语
        importState: '', // 上传状态 0 失败  1 成功
        successNum: 0, // 成功的数量
        url: '' // 失败的下载链接
      },
      // 检查新增班级权限
      addClassPower: false,
      // 上传中图标
      icIng: icIng,
      // 上传成功图标
      icTick: icTick,
      // 上传失败图标
      icErr: icErr,
      // 上传状态图标
      statusIcon: "",
      // 服务器前缀
      baseApi: process.env.BASE_API,
      // 上传地址
      url: "",
      // 文件上传中时，表单不能编辑
      disabledFlag: false,
      // 判断是否做表单校验
      valFlag: true,
      // 上传服务器成功数量（含校验不成功）
      uploadNum: 0,
      // 上传结果显示（进度条左边数字）
      resultDisplay: 0,
      // 是否显示进度条状态
      showProgress: false,
      // 进度多少
      progressing: 0,
      // 上传总数量
      totalNum: 0,
      // 上传失败原因
      failReason: "",
      // 进度条文本颜色
      progressTextColor: "progress-inner-color",
      // 整个表单的label对齐方式
      labelPosition: "right",
      rules: {
        schoolYear: [
          { required: true, message: '请选择学年', trigger: 'change' }
        ],
        // interestId: [
        //   { required: true, message: '请选择兴趣班级', trigger: 'change' }
        // ]
      },
      schoolYearOptions: [],
      student: {
        schoolYear: "",
        gradeId: "",
        // classId: "",
        interestId: "",
        files: [],
        tips: ""
      },
      fileList1: [],
      p_data: {
        schoolYearStart: "",
        schoolYearEnd: "",
        classType: '',
        // interestId: ''
      },
      headers: {
        Authorization: getToken()
      },
      classOptions1: []
    };
  },
  mounted() {
    this.classType = this.$route.query.type;
    var usertoken = getToken();
    // console.info(' =============> usertoken ' + usertoken)
    this.headers.Authorized = usertoken;
    // 获取学年
    this.schoolYearOptions = getSchoolYear();
    // this.student.schoolYear = this.schoolYearOptions[this.schoolYearOptions.length - 1].value;
    this.student.schoolYear = this.schoolYearOptions[0].value;
    var list = this.student.schoolYear.split("-");
    this.p_data.schoolYearStart = list[0];
    this.p_data.schoolYearEnd = list[1];
    this.p_data.classType = this.classType;
    if (this.classType == 2) {
      // 获取兴趣班
      this.getInterestClass();
      this.title2 = '兴趣班';
    } else {
      this.title2 = '行政班';
    }
    // 拼接上传地址
    // this.url = this.baseApi + "/api/auth/v1/student/importExcel";
    this.url = this.baseApi + "/api/auth/v2/student/import";
    // this.url = 'http://yapi.xiaotitong.com/mock/35/api/auth/v2/student/import';
    // 初始化上传状态图标
    this.statusIcon = this.icIng;
    this.addClassPower = isHavePermissions("addSchoolClass");
  },
  methods: {
    // 获取兴趣班列表
    getInterestClass() {
      let schoolYear = this.student.schoolYear;
      let params = {
        schoolYearStart: schoolYear.split("-")[0],
        schoolYearEnd: schoolYear.split("-")[1]
      };
      request.get("/api/auth/v1/interest-class",{ // 获取兴趣班列表
      // requestYapi.get("/mock/35/api/auth/v1/interest-class",{ // 获取兴趣班列表
        params
      }).then(res => {
        this.interestOptions = res.data;
      });
      // this.p_data.interestId = this.student.interestId;
    },
    goback() {
      // history.go(-1)
      console.info(
        " >> _this.$route.query.backUrl " + this.$route.query.backUrl
      );
      this.$router.push(this.$route.query.backUrl);
    },
    // 下载模版  传type分别对应不同的下载模板
    downloadTemplate() {
      var data = {};
      data.type = this.$route.query.type;
      if (data.type == 1) {
        request.get('/api/auth/v2/student/downTemplate').then(res => {
          // console.info(111,res.data);
          window.location.href = res.data;
        })
      } else if (data.type == 2) {
        request.get('/api/auth/v1/interest-class/student/downTemplate').then(res => {
          // console.info(222,res.data);
          window.location.href = res.data;
        })
      }
      // this.$store.dispatch("StudentTemplate", data).then(res => {
      //   console.info(JSON.stringify(res));
      //   window.location.href = res;
      // });
    },
    // 学年选择后，判断是否需要重新获取班级
    schoolYearChange() {
      if (this.classType==2){
        this.getInterestClass();
      }
      var list = this.student.schoolYear.split("-");
      this.p_data.schoolYearStart = list[0];
      this.p_data.schoolYearEnd = list[1];
      this.p_data.classType = this.classType;
    },
    handleChange(file, fileList) {
      var _this = this;
      // 只要点击了上传按钮，就需要等上传完成才能再次编辑表单
      _this.disabledFlag = true;
      if (_this.valFlag) {
        this.$refs.student.validate(valid => {
          // 检验必填项
          if (valid) {
            // console.info(_this.p_data)
            // 计算上传成功／失败数，且组织失败原因
            _this.countAndFormatData(file, fileList);
          } else {
            // 更新valFlag 为 false，当用户不点击确认按钮，就不继续验证
            _this.valFlag = false;
            this.$confirm("请完成必填选项!").then((_this.valFlag = true));
            // 如果在表单校验不通过之前已选择文件，则先将所有数据还原设置
            _this.resetProgress();
            return false;
          }
        });
      }
    },
    // 重置上传状态
    resetProgress() {
      var _this = this;
      // 如果在表单校验不通过之前已选择文件，则先将所有数据还原设置
      _this.$refs.upload.clearFiles();
      console.info(" >>>>> clear files ");
      // 初始化上传状态图标
      _this.statusIcon = _this.icIng;
      // 上传失败数量
      _this.failNum = 0;
      // 上传成功且校验成功数量
      _this.successNum = 0;
      // 上传服务器成功数量（含校验不成功）
      _this.uploadNum = 0;
      // 输入框编辑状态
      _this.disabledFlag = false;
      // 进度条左边上传状态
      // _this.uploadStatus = "上传中...";
      // 进度条右边上传结果
      // _this.uploadResult = "已上传: ";
      // 上传结果显示（进度条左边数字）
      _this.resultDisplay = 0;
      // 是否显示进度条状态
      _this.showProgress = false;
      // 进度多少
      _this.progressing = 0;
      // 上传总数量
      _this.totalNum = 0;
      // 上传失败原因
      _this.failReason = "";
      // 进度条文本颜色
      _this.progressTextColor = "progress-inner-color";
      // 文件选择数量
      _this.fileSize = 0;
    },
    // 计算上传成功／失败数，且组织失败原因
    countAndFormatData(file, fileList) {
      if (file.response) {
        setTimeout(() => {
          this.prostarts = file.response.data.importState;
          if (file.response.data.importState == 0) {
            console.log('异常')
          } else if (file.response.data.importState == 1) {
            console.log('成功');
          } else if (file.response.data.importState == 2) {
            console.log('存在导入失败记录')
          } else if (file.response.data.importState == 3) {
            console.log('文件格式异常')
          } else if (file.response.data.importState == 4) {
            console.log('文件为空')
          }
        }, 800);
        // 更新显示结果
        this.showResult(file, fileList)
      }
    },
    // 更新显示数据
    showResult(file, fileList) {
      var _this = this;
      // 延时更新进度条
      setTimeout(function() {
        // 更新进度条为可见，且更新其进度
        const respon = file.response.data;
        _this.res.failureNum = respon.failureNum;
        _this.res.importMsg = respon.importMsg;
        _this.res.importState = respon.importState;
        _this.res.successNum = respon.successNum;
        _this.res.url = respon.url;
        _this.showProgress = true;
        _this.progressing = Math.round(_this.uploadNum / _this.fileSize * 100);
        _this.resultDisplay = _this.successNum;
        // _this.uploadResult = '已上传: ';
        // console.info(' fileList >>>>> ' + JSON.stringify(fileList));
        // _this.totalNum = ' /' + fileList.length
        _this.totalNum = " /" + _this.fileSize;
        // 上传成功，跳转列表
        if (_this.res.importState == 1) {
          setTimeout(() => {
            _this.$router.push({
              // name: this.$route.query.backUrl,
              path: 'studentSearchList',
              params: {
                schoolYear: _this.student.schoolYear,
                type: "update"
              }
            })
          }, 1000)
        }
        _this.disabledFlag = false
      }, 500);
    },
    // 检查文件大小
    isLessThan1M(file) {
      const isLt1M = Math.ceil(file.size / 1024 / 1024) <= 1;
      console.info(
        " >>> file " +
          file.name +
          " > size less than 1MB > " +
          isLt1M +
          " > size: " +
          file.size +
          " response： " +
          JSON.stringify(file.response)
      );
      return isLt1M;
    }
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

.el-select {
  width: 120px;
}

.icon_style {
  padding-right: 3px;
}
.el-form-item {
  vertical-align: middle;
}
.addclass {
  color: #84bef9;
  height: 42px;
  line-height: 42px;
  width: 200px;
  cursor: pointer;
  vertical-align: middle;
  display: inline-block;
  margin-bottom: 22px;
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
<style lang="scss">
.dialog-addclass {
  .el-form-item {
    width: 49%;
    display: inline-block;
    .el-form-item__content {
      padding-left: 0px;
    }
  }
  .el-row {
    text-align: center;
  }
  .el-select {
    width: 195px;
  }
}
</style>
