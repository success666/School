<template>
    <div class="addteachplan">
      <!--<h2>新增教案</h2>-->
      <div class="list">
        <el-form :inline="true" :model="formData" class="">
          <el-row>
            <el-col>
              <el-form-item label="年级">
                <el-select v-model="formData.gradeId" placeholder="请选择年级" @change="getClass" size="mini" style="width: 100px;">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="一年级" value="1"></el-option>
                  <el-option label="二年级" value="2"></el-option>
                  <el-option label="三年级" value="3"></el-option>
                  <el-option
                  v-for="item in gradeOptions"
                  :key="item.gradeId"
                  :label="item.gradeName"
                  :value="item.gradeId">
                  </el-option>
                </el-select>
                <el-select v-model="formData.classId" placeholder="请选择班级" size="mini" style="width: 100px;">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="1班" value="1"></el-option>
                  <el-option label="2班" value="2"></el-option>
                  <el-option label="3班" value="3"></el-option>
                  <el-option
                  v-for="item in classOptions"
                  :key="item.dictClassId"
                  :label="item.dictClassName"
                  :value="item.dictClassId">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="学生人数">
                <el-input v-model="formData.studentCount" placeholder="请输入" size="mini" style="width: 80px;"></el-input>
              </el-form-item>

              <el-form-item label="上课时间">
                <el-input v-model="formData.lessonTime" placeholder="请选择" size="mini"></el-input>
              </el-form-item>

              <el-form-item label="授课老师">
                <el-select v-model="formData.teacherId" placeholder="请选择" size="mini" style="width: 100px;">
                  <el-option
                    v-for="item in teacherlistOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <!--教学内容-->
              <div>
                <el-row>
                  <!--教学内容-->
                  <el-col :span="8">
                    <div class="table-content">
                      <div class="sub-title">教学内容</div>
                      <div class="text-box">
                        <el-input
                          type="textarea"
                          :rows="4"
                          placeholder="请输入教学内容"
                          v-model="formData.textarea1">
                        </el-input>
                      </div>
                    </div>
                  </el-col>
                  <!--教学目标-->
                  <el-col :span="8">
                    <div class="table-content">
                      <div class="sub-title">教学目标</div>
                      <div class="text-box">
                        <el-input
                          type="textarea"
                          :rows="4"
                          placeholder="请输入教学内容"
                          v-model="formData.textarea2">
                        </el-input>
                      </div>
                    </div>
                  </el-col>
                  <!--场地器材-->
                  <el-col :span="8">
                    <div class="table-content">
                      <div class="sub-title">场地器材</div>
                      <div class="text-box">
                        <el-input
                          type="textarea"
                          :rows="4"
                          placeholder="请输入教学内容"
                          v-model="formData.textarea3">
                        </el-input>
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </div>
              <div>
                <el-row>
                  <!--重点难点-->
                  <el-col>
                    <div class="table-content">
                      <div class="sub-title">重点难点</div>
                      <div class="text-box">
                        <el-input
                          type="textarea"
                          :rows="4"
                          placeholder="请输入教学内容"
                          v-model="formData.textarea1">
                        </el-input>
                      </div>
                    </div>
                  </el-col>

                </el-row>
              </div>
              <br>
              <el-form-item label="教学内容与过程">
                <el-button type="primary" @click="teachingModel = true" class="btn" size="mini">新增</el-button>
              </el-form-item>
              <br>

              <!--教学过程、有则显示，无则隐藏-->
              <el-collapse v-if="true">
                <el-collapse-item v-for="(item, index) in teachingData" :key="index" :name="index">
                  <template slot="title">
                    <span class="data-title">
                      {{item.title}}
                    </span>
                    <span class="data-titlename">
                      {{item.titleName}}
                    </span>
                    <span class="btn-fr">
                      <!--<el-button type="text" size="mini">编辑</el-button>-->
                      <el-button type="text" @click="editTeachingsSeps(item.id)" class="btn" size="mini"><i class="el-icon-edit-outline"></i>编辑</el-button>
                      <el-button type="text" @click="deleteTeachingSeps(item.id)" class="btn color-red" size="mini"><i class="el-icon-close"></i>删除</el-button>
                    </span>
                  </template>
                  <div v-text="item.content"></div>
                  <div><span>强度：{{item.strength}}</span></div>
                  <div><span>时长（分钟）：{{item.duration}}</span></div>

                </el-collapse-item>
              </el-collapse>

              <br>
              <div style="text-align: center;">
                <el-button @click="" class="btn" size="mini">取消</el-button>
                <el-button type="primary" @click="" class="btn" size="mini">保存</el-button>
                <!--是否设为模板-->
                <el-checkbox v-model="formData.isModule" style="margin-left: 10px;">同时设为模板</el-checkbox>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <!--选择教学模板-->
      <el-dialog
        title="选择教学模板"
        :visible.sync="teachingModel"
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
          <el-button @click="teachingModel = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="teachingModel = false" size="mini">确 定</el-button>
        </span>
      </el-dialog>

    </div>
</template>

<script>
  import request from "@/utils/request";

  export default {
    name: "addteachplan",
    data() {
      return {
        formData: {
          studentCount: '',
          gradeId: '',
          classId: '',
          lessonTime: '',
          teacherId: '',
          textarea1: '',
          textarea2: '',
          textarea3: '',
          textarea4: '',
          isModule: false
        },
        teachingData: [
          {
            title: '教学1',
            titleName: '准备运动',
            strength: '低',
            duration: '5',
            content: '与现实生活一致\n' +
            '在界面中一致' +
            '与现实生活一致\n' +
            '在界面中一致与现实生活一致\n' +
            '在界面中一致与现实生活一致\n' +
            '在界面中一致'
          },
          {
            title: '教学2',
            titleName: '开始运动',
            strength: '中',
            duration: '35',
            content: '与现实生活一致\n' +
            '在界面中一致' +
            '与现实生活一致\n' +
            '在界面中一致与现实生活一致\n' +
            '在界面中一致与现实生活一致\n' +
            '在界面中一致'
          }
        ],
        teacherlistOption: [],
        gradeOptions: [],
        classOptions: [],
        teachingModel: false
      }
    },
    methods: {
      getClass() {
        console.log('年级获取班级')
      },
      editTeachingsSeps(id) {
        this.$route({
          path: 'editTeachingsSeps',
          query: {
            id: id
          }
        })
      },
      deleteTeachingSeps(id) {
        request.delete(''+id).then((res) => {
        //
        })
      }
    }
  }
</script>

<style scoped>
  .table-content{
    border: 1px solid #d7d7d7;
    min-height: 36px;
    margin-top: 15px;
  }
  .sub-title{
    text-align: center;
    line-height: 35px;
    font-weight: 600;
    background-color: #f8f8f8;
    border-bottom: 1px solid #d7d7d7;
  }
  .text-box {
    padding: 20px;
  }
  .textarea-content{
    width: 100%;
  }
  .model-box {
    border: 1px solid #9e9e9e;
  }
  .btn-fr{
    float: right;
    margin-right: 20px;
  }
  .data-title {
    padding: 11px 20px;
    background-color: #6a9fdd;
  }
  .data-titlename {
    margin-left: 10px;
  }
  .color-red{
    color: #ff4d4d;
  }
</style>
<style>
  .addteachplan .el-textarea .el-textarea__inner {
    background-color: #f7f7f7;
  }
  .addteachplan .el-textarea .el-textarea__inner:hover {
    background-color: #ffffff;
  }
  .addteachplan .el-textarea .el-textarea__inner:focus {
    background-color: #ffffff;
  }
  .addteachplan .el-collapse-item__header {
    background-color: #dbd9d9!important;
  }
</style>
