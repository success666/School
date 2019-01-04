<template>

  <div class="personalHomeWordEditForm-content">

    <el-row>
      <el-col :span="24">
        <div class="info-title"><span>编辑作业</span>
        </div>
      </el-col>
    </el-row>

    <el-row style="text-align: left;padding-left: 10px;">
      <div style="margin-bottom: 10px;">已选<span class="font-color" style="margin-left: 5px;margin-right: 5px;">{{data.length}}</span>人</div>
      <div style="border-style: solid;border-color: #F8F8F8;border-width: 2px;width: 50%;">
        <el-table :header-cell-style="{textAlign:'center', color:'#525252', fontSize:'16px', backgroundColor: '#F8F8F8'}"
                  :cell-style="{textAlign:'center'}"
          :data="tableData" style="width: 100%">
          <el-table-column prop="studentNo" label="学号">
          </el-table-column>
          <el-table-column prop="name" label="姓名">
          </el-table-column>
          <el-table-column prop="sex" label="性别" :formatter="formatter">
          </el-table-column>
          <el-table-column prop="disease" label="疾病">
            <template slot-scope="scope">
              <span v-if='scope.disease==null||scope.disease==""'>无</span>
              <span v-else>scope.disease</span>
            </template>
          </el-table-column>
        </el-table>
        <div>
          <div class="table-footer font-color">
            <a @click="showAll">
              {{showText}}
              <i style="margin-left: 5px;" v-show="!isShowAll" class="el-icon-arrow-down"></i>
              <i style="margin-left: 5px;" v-show="isShowAll" class="el-icon-arrow-up"></i>
            </a>
          </div>
        </div>
      </div>
    </el-row>

    <div class="bgc-fixed" v-show="isShowAll" @click="showAll">
      <div class="table-fixed">
        <p >
          <span style="margin: 10px;display: inline-block">已选
            <span class="font-color" style="margin-left: 5px;margin-right: 5px;">{{data.length}}</span>人
          </span>
          <i style="margin: 10px;float: right;" v-show="isShowAll" class="el-icon-circle-close-outline"></i>
        </p>

        <el-table :header-cell-style="{textAlign:'center', color:'#525252', fontSize:'16px', backgroundColor: '#F8F8F8'}"
                  :cell-style="{textAlign:'center'}"
                  height="485"
                  :data="tableData"
        style="width: 95%;height:485px;margin: 0 auto;">
          <el-table-column prop="studentNo" label="学号">
          </el-table-column>
          <el-table-column prop="name" label="姓名">
          </el-table-column>
          <el-table-column prop="sex" label="性别" :formatter="formatter">
          </el-table-column>
          <el-table-column prop="disease" label="疾病">
            <template slot-scope="scope">
              <span v-if='scope.disease==null||scope.disease==""'>无</span>
              <span v-else>scope.disease</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-row style="margin-top: 40px;">
      <el-col :span="24">
        <div style="font-weight: bold"><span class="font-color">|</span>&nbsp;&nbsp;作业详情
        </div>
      </el-col>
    </el-row>


      <!--<div style="margin-left: 15px;" v-for="(ins, index) in homeworkStudentLibList" :key="index">-->
        <!--<el-form :model="ins" :ref="ins" :rules="rules" label-width="100px" class="demo-ruleForm">-->
          <!--<el-row>-->
            <!--<el-col :span="24">-->
              <!--<div class="font-color">-->
                <!--<a  @click="showHomeworkLibDetailDialog(ins.id)"><span style="text-decoration: underline;">{{ins.name}}:</span> </a>-->
              <!--</div>-->
            <!--</el-col>-->
          <!--</el-row>-->
          <!--<el-row>-->
            <!--<el-col :span="24">-->
              <!--<el-row>-->
                <!--<el-form-item style="float: left;padding-right: 20px;border-right: 2px #f5f5f5 solid" label-width="0" prop="exerciseGroupNo">-->
                  <!--<el-input class="input-edit text-input" v-model.number="ins.exerciseGroupNo" controls-position="right"></el-input>-->
                  <!--组-->
                <!--</el-form-item>-->

                <!--<el-form-item style="float: left;padding-left: 20px;" label-width="0" prop="groupTime">-->
                  <!--每组-->
                  <!--<el-input class="input-edit text-input" v-model.number="ins.groupTime" controls-position="right"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-select style="width: 100px;" v-model="ins.groupTimeUnit" placeholder="请选择">-->
                  <!--<el-option-->
                    <!--v-for="item in unit"-->
                    <!--:key="item.label"-->
                    <!--:label="item.label"-->
                    <!--:value="item.value">-->
                  <!--</el-option>-->
                <!--</el-select>-->
                <!--<span class="hand" @click="deleHomeworkLib(index)"><i class="el-icon-delete"></i></span>-->
              <!--</el-row>-->
            <!--</el-col>-->
          <!--</el-row>-->
        <!--</el-form>-->
      <!--</div>-->

      <div style="margin-left: 15px;">
        <el-form ref="homeworkStudentLibList" label-width="100px" class="demo-ruleForm">
          <div v-for="(ins, index) in homeworkStudentLibList" :key="index">
            <el-row>
              <div class="font-color">
                <a @click="showHomeworkLibDetailDialog(ins.id)"><span style="text-decoration: underline;">{{ins.name}}:</span> </a>
              </div>
            </el-row>
            <el-row>
              <!--<el-form-item style="float: left;padding-right: 20px;border-right: 2px #f5f5f5 solid" label-width="0" prop="exerciseGroupNo">-->
              <el-form-item style="float: left;padding-right: 20px;border-right: 2px #f5f5f5 solid" label-width="0">
                <el-input class="input-edit text-input" v-model.number="ins.exerciseGroupNo" controls-position="right" @blur="validateNum(ins.exerciseGroupNo, index)"></el-input>
                组
                <br>
                <span style="width: 80px;color: red;" v-if="items[index].flag">请输入1-127之间的整数！</span>
              </el-form-item>
              <!--<el-form-item style="float: left;padding-left: 20px;" label-width="0" prop="groupTime">-->
              <el-form-item style="float: left;padding-left: 20px;" label-width="0">
                每组
                <el-input class="input-edit text-input" v-model.number="ins.groupTime" controls-position="right" @blur="validateNum2(ins.groupTime, index)"></el-input>
                <br>
                <span style="width: 80px;color: red;" v-if="items[index].flag2">请输入1-127之间的整数！</span>
              </el-form-item>
              <el-select style="width: 100px;" v-model="ins.groupTimeUnit" placeholder="请选择">
                <el-option
                  v-for="item in unit"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <span class="hand" @click="deleHomeworkLib(index)"><i class="el-icon-delete"></i></span>
            </el-row>
          </div>
        </el-form>
      </div>
      <div class="font-color" style="margin-left: 15px;">
        <a @click="showAddHomeworkLib()"><i class="el-icon-plus"></i>&nbsp;&nbsp;增加锻炼项目</a>
      </div>

      <el-row style="margin-top: 40px;">
        <el-col :span="24" class="">
          <div style="font-weight: bold">作业说明</div>
          <el-input style="padding: 10px;width: 50%"
            type="textarea"
                    :rows="8"
            placeholder="请输入作业说明"
            v-model="desc">
          </el-input>
        </el-col>
      </el-row>

      <el-row>
        <el-col style="text-align: center;">
            <el-button @click="back">取消</el-button>
            <el-button type="primary" @click="saveBtnAction">保存</el-button>
        </el-col>
      </el-row>

    <addHomeworkLib ref="addHomeworkLib"></addHomeworkLib>
    <homeworkLibDialog ref="homeworkLibDialog"></homeworkLibDialog>
  </div>

</template>

<script>
import Vue from "vue";
import image_sex from "@/assets/imgs/icon_sex.png";
import VideoPlayer from "vue-video-player";
import HomeworkLibDialog from "@/components/Dialog/HomeworkLibDetailDialog";
import AddHomeworkLib from "@/components/Dialog/AddHomeworkLib";

require("video.js/dist/video-js.css");
require("vue-video-player/src/custom-theme.css");

Vue.use(VideoPlayer);

export default {
  name: "PersonalHomeWordEditForm",
  components: {
    homeworkLibDialog: HomeworkLibDialog,
    addHomeworkLib: AddHomeworkLib
  },
  data() {
    return {
      items: [],
      // 名单最大列表数(收缩的时候)
      maxNum: 2,
      // 上个页面传过来的数据
      data: {},
      // 完整名单显示标记
      isShowAll: false,
      showText: '查看完整名单',
      show: true,
      image_sex: image_sex,
      // 作业详情列表
      homeworkStudentLibList: [],
      // 上一个页面传过来的学生列表
      list: [],
      // 上一个页面传过来的查询数据
      homework: [],
      desc: '',
      tableData: [],
      unit: [
        {
          label: "次",
          value: 1
        },
        {
          label: "秒",
          value: 2
        },
        {
          label: "分",
          value: 3
        }
      ],
      fromUrl: ''
    }
  },
  methods: {
    back() {
      this.$router.push(this.fromUrl);
    },
    validateNum(value, indexs) {
      if (value == '') {
        this.$set(this.items[indexs], 'flag', true)
      }
      if (!Number.isInteger(value)) {
        this.$set(this.items[indexs], 'flag', true)
      } else {
        if (value < 1) {
          this.$set(this.items[indexs], 'flag', true)
        } else if (value > 127) {
          this.$set(this.items[indexs], 'flag', true)
        } else {
          this.$set(this.items[indexs], 'flag', false)
        }
      }
    },
    validateNum2(value, indexs) {
      if (value == '') {
        this.$set(this.items[indexs], 'flag2', true)
      }
      if (!Number.isInteger(value)) {
        this.$set(this.items[indexs], 'flag2', true)
      } else {
        if (value < 1) {
          this.$set(this.items[indexs], 'flag2', true)
        } else if (value > 127) {
          this.$set(this.items[indexs], 'flag2', true)
        } else {
          this.$set(this.items[indexs], 'flag2', false)
        }
      }
    },
    // 名单展开全部
    showAll() {
      if (this.isShowAll == false) {
        this.isShowAll = true;
        this.showText = '收起完整名单';
        for (var i = this.maxNum; i < this.data.length; i++) {
          // this.tableData = [];
          this.tableData.push(this.data[i].student);
        }
      } else {
        this.isShowAll = false;
        this.showText = '查看完整名单';
        this.tableData = this.tableData.slice(0,2)
      }
    },
    // 弹出作业库详情
    showHomeworkLibDetailDialog(id) {
      this.$refs.homeworkLibDialog.showDialog(id);
    },
    // 弹出添加动作点
    showAddHomeworkLib() {
      this.$refs.addHomeworkLib.show()
    },
    // 添加锻炼项目
    completeAddHomeworkLib(data) {
      // 判断添加的锻炼项目是否与已存在的锻炼项目重复
      var that = this;
      // that.homeworkStudentLibList = []
      data.forEach(function(i, index) {
        that.homeworkStudentLibList.push(i);
        that.homeworkStudentLibList.forEach((v, i) => {
          var value = { 'value': v.name, flag: false, flag2: false };
          that.items.push(value)
        })
      })
    },
    // 删除锻炼项目
    deleHomeworkLib(index) {
      var that = this;
      that.homeworkStudentLibList.splice(index, 1);
      this.items.splice(index, 1)
    },
    // 保存
    saveBtnAction() {
      var that = this;
      var valid = true;
      this.items.forEach((v, i) => {
        if (v.flag) {
          valid = false;
          return
        }
      });
      if (valid) {
        // 如果只有一个学生
        if (this.data.length === 1) {
          this.list.forEach(function(i, index) {
            if (that.data[0].student.id === i.student.id) {
              that.list[index].recommendHomeworkList =
                that.homeworkStudentLibList;
              that.list[index].student.homeworkExplain = that.desc;
            }
          });
        } else if (this.data.length >= 2) {
          // 有作业详情数据才会执行以下操作
          for (var dataIndex = 0; dataIndex < this.data.length; dataIndex++) {
            this.list.forEach(function(i, index) {
              if (that.data[dataIndex].student.id === i.student.id) {
                that.list[index].recommendHomeworkList =
                  that.homeworkStudentLibList;
                that.list[index].student.homeworkExplain = that.desc;
              }
            });
          }
        }

        this.$message({
          message: "修改成功",
          type: "success"
        });
        this.$router.push(this.fromUrl);
      } else {
        this.$message({
          message: '您有输入错误，请检查后重新提交',
          type: 'warning'
        });
        return false;
      }
    },
    formatter(row, column, cellValue, index) {
      let value = "";
      switch (cellValue) {
        case 1:
        case "1":
          value = "男";
          break;
        case 2:
        case "2":
          value = "女";
          break;
      }
      return value;
    }
  },
  mounted() {
    // console.log(this.$route);
  },
  beforeRouteEnter(to, from, next) {
    // console.log(from.path);
    next(vm => {
      vm.fromUrl = from.path;
    });
  },
  beforeRouteLeave(to, from, next) {
    // console.log("存储处理.");
    this.homework.schoolClassId = this.homework.schoolClassId + "";
    var data = {
      data: this.data,
      list: this.list,
      homework: this.homework,
      desc: this.desc
    };
    if (to.name === "AddHomework" || to.name === "EditHomework") {
      var condition = JSON.stringify(data);
      localStorage.setItem("addHomeworkCondition", condition);
    } else {
      localStorage.removeItem("addHomeworkCondition");
    }
    next();
  },
  created() {
    var condition = localStorage.getItem("addHomeworkCondition");
    if (condition != null) {
      var data = JSON.parse(condition);
      this.data = data.data;
      this.homework = data.homework;
      this.list = data.list;
      var that = this;
      if (this.data.length === 1) {
        this.desc = this.data[0].student.homeworkExplain;
      } else {
        this.desc = "";
      }
      this.data.forEach(function(i, index) {
        if (that.tableData.length >= that.maxNum) {
          return;
        }
        that.tableData.push(i.student);
      });
      // 当编辑作业只有一个学生的时候，作业详情显示该学生的推荐作业
      if (this.data.length === 1) {
        this.homeworkStudentLibList = this.data[0].recommendHomeworkList;
        // console.log(111, this.homeworkStudentLibList);
        this.homeworkStudentLibList.forEach((v, i) => {
          var value = { 'value': v.name, flag: false, flag2: false };
          this.items.push(value)
        })
        // console.log(this.items);
        if (!this.homeworkStudentLibList) {
          this.homeworkStudentLibList = [];
        }
      } else if (this.data.length >= 2) {
        // 当编辑作业有两个及两个以上的时候，清空作业详情
        this.homeworkStudentLibList = [];
      }
    }
  }
};
</script>

<style scoped>
.personalHomeWordEditForm-content {
  background-color: white;
  border-radius: 10px;
  padding: 30px;
  color: #525252;
}

.font-color {
  color: #006cee;
}

.table-footer {
  line-height: 50px;
  text-align: center;
}

.text-decoration {
  text-decoration: underline;
}
.bgc-fixed{
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1001;
  background-color: rgba(0, 0, 0, 0.7);
  /*display: none;*/
}
  .table-fixed{
    width: 550px;
    height: 550px;
    border-radius: 5px;
    background-color: #ffffff;
    z-index: 1002;
    margin: 80px auto;
  }
</style>
<style lang="scss">
.input-edit{
  width: 100px;
  margin-right: 10px;
  .el-input-number__decrease,.el-input-number__increase{
    display: none;
  }
  .el-input{
    .el-input__inner{
      padding-right: 0px;
      text-align: left;
    }
  }
}
  .hand{
    display: inline-block;
    cursor: pointer;
  }
</style>
