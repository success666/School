<template>
  <div class="content">
    <div style="font-weight: bold; margin: 15px 0px 30px 35px">导入器材</div>
    <el-form
      :model="equipment"
      ref="equipment"
      :rules="rules"
      label-width="100px"
      class
      :label-position="labelPosition"
    >
      <el-form-item
        prop="schoolYear"
        :rules="{required: true, message: '请选择学年', trigger: 'blur'}"
        label="学年："
      >
        <el-select
          v-model="equipment.schoolYear"
          placeholder="请选择"
          size="mini"
          :disabled="disabledFlag"
          @change="schoolYearChange"
        >
          <el-option
            v-for="item in schoolYearOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="提示：" v-model="equipment.tips">
        <span class="tips">第一步，下载器材信息模板，用下载的模板填写场地基本信息；</span>
        <a @click="downloadTemplate" style="color: dodgerblue;text-decoration: underline">下载模板</a>
        <br>
        <span class="tips">第二步，点击导入按钮上传已填写完毕的信息模板即可；</span>
      </el-form-item>

      <el-row style="text-align: center;margin-left: 370px">
        <el-col :span="3">
          <el-button @click="goback" size="mini">返回</el-button>
        </el-col>
        <el-col :span="3">
          <el-upload
            :disabled="disabledFlag"
            v-model="equipment.files"
            class="upload-demo"
            :action="url"
            name="files"
            :file-list="fileList1"
            :auto-upload="true"
            :show-file-list="false"
            :on-change="handleChange"
            :data="p_data"
            :headers="headers"
            :multiple="true"
            accept=".xls, .xlsx"
            ref="upload"
          >
            <el-button type="primary" size="mini" :disabled="disabledFlag" @click="resetProgress">导入</el-button>
          </el-upload>
        </el-col>
      </el-row>

      <div style="margin-left: 410px">
        <div style="position: relative; width: 280px;" v-show="showProgress">
          <el-progress
            :percentage="progressing"
            :text-inside="true"
            :stroke-width="45"
            class="progress"
            :show-text="false"
          ></el-progress>
          <div
            style="left: 10px; bottom: 14px"
            class="progress-inner-text"
            :class="progressTextColor"
          >
            <img class="icon_style" :src="statusIcon">
            {{uploadStatus}}
          </div>
          <div
            style="right: 40px; bottom: 14px; padding-right: 12px;"
            class="progress-inner-text"
            :class="progressTextColor"
          >{{uploadResult}}</div>
          <div
            style="right: 20px; bottom: 14px; padding-right: 12px; font-weight: bold; font-size: 16px"
            class="progress-inner-text"
            :class="progressTextColor"
          >{{resultDisplay}}</div>
          <div
            style="right: 10px; bottom: 8px"
            class="progress-inner-text"
            :class="progressTextColor"
          >{{totalNum}}</div>
        </div>
      </div>
      <div
        v-show="showProgress"
        v-if="failReason !== ''"
        style="text-align: center; padding: 20px 100px"
        class="progress-inner-color-red"
      >
        <p v-html="failReason"></p>
      </div>
    </el-form>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
// 图片资源
import icIng from "@/assets/imgs/icon_uploading.png";
import icTick from "@/assets/imgs/icon_tick.png";
import icErr from "@/assets/imgs/icon_err.png";
import { getSchoolYear } from "@/utils/index";

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
      statusIcon: "",
      // 服务器前缀
      baseApi: process.env.BASE_API,
      // 上传地址
      url: "",
      // 文件上传中时，表单不能编辑
      disabledFlag: false,
      // 判断是否做表单校验
      valFlag: true,
      // 进度条左边上传状态
      uploadStatus: "上传中...",
      // 进度条右边上传结果
      uploadResult: "已上传: ",
      // 上传成功且校验成功数量
      successNum: 0,
      // 上传失败数量
      failNum: 0,
      // 文件选择数量
      fileSize: 0,
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
      rules: {},
      schoolYearOptions: [],
      equipment: {
        schoolYear: "",
        files: [],
        tips: ""
      },
      fileList1: [],
      p_data: {
        schoolYearStart: "",
        schoolYearEnd: ""
      },
      headers: {
        Authorization: getToken()
      }
    };
  },
  mounted() {
    var usertoken = getToken();
    // console.info(' =============> usertoken ' + usertoken)
    this.headers.Authorized = usertoken;
    // 获取学年
    this.schoolYearOptions = getSchoolYear();
    // 拼接上传地址
    this.url =
      this.baseApi + "/api/auth/v1/equipment/saveSchoolEquipmentFromExcel";
    // 初始化上传状态图标
    this.statusIcon = this.icIng;
  },
  methods: {
    goback() {
      history.go(-1);
    },
    // 下载模版
    downloadTemplate() {
      this.$store.dispatch("EquipmentTemplate").then(res => {
        console.info(JSON.stringify(res));
        window.location.href = res;
      });
    },
    schoolYearChange() {
      var data = {};
      var list = this.equipment.schoolYear.split("-");
      if (list.length > 0) {
        data.schoolYearStart = list[0];
        data.schoolYearEnd = list[1];
        this.p_data.schoolYearStart = list[0];
        this.p_data.schoolYearEnd = list[1];
      }
    },
    handleChange(file, fileList) {
      // console.info('change file ---- ' + this.url)
      // console.info(file)
      // console.info(' >> file status ' + file.status + file.percentage + ' size > ' + fileList.length)
      var _this = this;
      // 只要点击了上传按钮，就需要等上传完成才能再次编辑表单
      _this.disabledFlag = true;
      if (_this.valFlag) {
        this.$refs.equipment.validate(valid => {
          // 检验必填项
          if (valid) {
            // console.info(_this.p_data)
            // 计算上传成功／失败数，且组织失败原因
            _this.countAndFormatData(file, fileList);
          } else {
            // 更新valFlag 为 false，当用户不点击确认按钮，就不继续验证
            _this.valFlag = false;
            this.$confirm("请完成必填/选项!").then((_this.valFlag = true));
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
      _this.uploadStatus = "上传中...";
      // 进度条右边上传结果
      _this.uploadResult = "已上传: ";
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
      if (fileList.length > 0) {
        var _this = this;
        // console.info(file.response)
        // 统计上传成功和失败的数量
        if (file.status === "ready") {
          console.info(
            " file response ----" +
              file.name +
              " -- file status --- " +
              file.status
          );
          _this.fileSize = _this.fileSize + 1;
        }
        // 检查文件大小,超过限制，直接提示上传失败
        if (!_this.isLessThan1M(file) && file.status === "ready") {
          // _this.$refs.upload.abort()
          _this.failNum = _this.failNum + 1; // 组织导入上传失败原因
          _this.failReason =
            _this.failReason +
            _this.failNum +
            ". " +
            file.name +
            ": 文件不能大于1MB" +
            " <br/> <br/> ";
        } else if (
          _this.isLessThan1M(file) &&
          file.status === "success" &&
          file.response.status.code === 0
        ) {
          // 上传服务器成功且校验成功
          _this.successNum = _this.successNum + 1;
          _this.uploadNum = _this.uploadNum + 1;
        } else if (_this.isLessThan1M(file) && file.status === "fail") {
          // 上传服务器失败
          _this.failNum = _this.failNum + 1; // 组织导入上传失败原因
          _this.failReason =
            _this.failReason +
            _this.failNum +
            ". " +
            file.name +
            ": 上传失败" +
            " <br/> <br/> ";
        } else if (
          _this.isLessThan1M(file) &&
          file.status === "success" &&
          file.response.status.code !== 0
        ) {
          // 上传服务器成功，但校验不成功
          _this.failNum = _this.failNum + 1;
          _this.uploadNum = _this.uploadNum + 1;
          // 组织导入上传失败原因
          if (
            file.response.status.msg !== null &&
            file.response.status.msg !== ""
          ) {
            _this.failReason =
              _this.failReason +
              _this.failNum +
              ". " +
              file.name +
              ": " +
              file.response.status.msg +
              " <br/> <br/> ";
          } else {
            _this.failReason =
              _this.failReason +
              _this.failNum +
              ". " +
              file.name +
              ": 校验不通过" +
              " <br/> <br/> ";
          }
        }
        // 更新显示结果
        this.showResult(file, fileList);
      }
    },
    // 更新显示数据
    showResult(file, fileList) {
      var _this = this;
      // 延时更新进度条
      setTimeout(function() {
        // 更新进度条为可见，且更新其进度
        _this.showProgress = true;
        _this.progressing = Math.round(
          (_this.uploadNum / _this.fileSize) * 100
        );
        _this.resultDisplay = _this.successNum;
        _this.uploadResult = "已上传: ";
        console.info(" fileList >>>>> " + JSON.stringify(fileList));
        // _this.totalNum = ' /' + fileList.length
        _this.totalNum = " /" + _this.fileSize;
        // 将最终结果显示界面
        if (_this.successNum + _this.failNum === _this.fileSize) {
          if (_this.failNum === 0) {
            _this.uploadStatus = "上传成功";
            // 更新上传状态图标
            _this.statusIcon = _this.icTick;
            // 进度条文本颜色
            _this.progressTextColor = "progress-inner-color";
            // 上传成功，跳转列表
            setTimeout(() => {
              _this.$router.push({
                name: "EquipmentList",
                params: {
                  type: "update",
                  date: _this.equipment.date
                }
              });
            }, 1000);
          } else {
            _this.uploadStatus = "上传失败";
            // 更新上传状态图标
            _this.statusIcon = _this.icErr;
            _this.uploadResult = "失败数: ";
            _this.resultDisplay = _this.failNum;
            // 进度条文本颜色
            _this.progressTextColor = "progress-inner-color-red";
          }
          _this.disabledFlag = false;
        }

        console.info(
          " > fileList.length  > " +
            fileList.length +
            " > fileSize " +
            _this.fileSize +
            " >> filename " +
            file.name +
            " >> success " +
            _this.successNum +
            " fail > " +
            _this.failNum +
            " fail reason > " +
            _this.failReason
        );
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
};
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
</style>
