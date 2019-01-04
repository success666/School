<template>
  <div>
    <div class="list">
      <div class="title">
        <span class="titleName">编辑教学过程</span>
        <el-button round @click="chooseTeachingModel" class="fl">选择教学模板</el-button>
      </div>
      <div>
        <el-form ref="form" :model="formData">
          <el-form-item label="教学过程">
            <el-input
              type="textarea"
              :rows="3"
              placeholder="请输入内容"
              v-model="formData.name"></el-input>
          </el-form-item>

          <el-form-item label="教学内容与目标">
            <el-input
              type="textarea"
              :rows="3"
              placeholder="请输入内容"
              v-model="formData.region"></el-input>
          </el-form-item>

          <!--ue富文本编辑器-->
          <el-form-item label="教学组织与方法">
            <el-input v-model="formData.type"></el-input>
          </el-form-item>

          <el-form-item label="强度" style="display: inline-block;width: 200px;">
            <el-select v-model="formData.strength" size="mini" placeholder="请选择强度" style="width: 130px;">
              <el-option label="低" value="1"></el-option>
              <el-option label="中" value="2"></el-option>
              <el-option label="高" value="3"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="时长（分钟）" style="display: inline-block;width: 250px;">
            <el-input v-model="formData.duration" size="mini" placeholder="请输入时长" style="width: 130px;"></el-input>
          </el-form-item>

          <el-form-item style="text-align: center;margin: 20px 0;">
            <el-button @click="" class="btn" size="mini">取消</el-button>
            <el-button type="primary" @click="" class="btn" size="mini">保存</el-button>
            <!--是否设为模板-->
            <el-checkbox v-model="formData.isModule" style="margin-left: 10px;">同时设为模板</el-checkbox>
          </el-form-item>




        </el-form>
      </div>
    </div>
    <!--选择教学模板-->
    <el-dialog
      title="选择教学模板"
      :visible.sync="formData.isModule"
      width="60%">
      <div>
        <el-row class="model-box">
          <el-col :span="6">
            <div class="sub-title">选择大纲</div>
            <div class="text-box">
              <p>占字符占字符占字符</p>
              <p>占字符占字符占字符</p>
              <p>占字符占字符占字符</p>
              <p>占字符占字符占字符</p>
              <p>占字符占字符占字符</p>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="sub-title">选择计划</div>
            <div class="text-box">
              <p>占字符占字符占字符</p>
              <p>占字符占字符占字符</p>
              <p>占字符占字符占字符</p>
              <p>占字符占字符占字符</p>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="sub-title">选择内容</div>
            <div class="text-box">
              <p>占字符占字符</p>
              <p>占字符占字符占字符</p>
              <p>占字符占字符占字符</p>
              <p>占字符占字符占字符</p>
              <p>占字符占字符占字符</p>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="sub-title">选择模块</div>
            <div class="text-box">
              <p>占字符占字符占字符</p>
              <p>占字符占字符占字符</p>
              <p>占字符占字符占字符</p>
              <p>占字符占字符占字符</p>
            </div>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="formData.isModule = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="formData.isModule = false" size="mini">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "editTeachingsSeps",
    data() {
      return {
        formData: {
          name: '',
          region: '',
          type: '',
          strength: '',
          duration: '', // 时长
          isModule: false, // 是否设为模板
        },

      }
    },
    methods: {
      chooseTeachingModel() {
        //
      }
    }
  }
</script>

<style scoped>
  .titleName {
    font-size: 18px;
    font-weight: 600;
    line-height: 40px;
  }
 .fl{
   float: right;
 }
</style>
