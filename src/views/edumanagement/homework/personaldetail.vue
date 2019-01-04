<template>
  <div class="content">
    <el-row>
      <el-col>
        <div class="title">个人作业详情</div>
      </el-col>
    </el-row>
    <el-row>
      <el-col style="width: 150px" class="normal">学号：{{data.studentNo}}</el-col>
      <el-col style="width: 150px" class="normal">姓名：{{data.name}}</el-col>
      <el-col style="width: 150px" class="normal">
        性别：
        <span v-if="data.sex === 1">男</span>
        <span v-if="data.sex === 2">女</span>
      </el-col>
      <el-col style="width: 150px" class="normal">疾病：{{data.disease}}</el-col>
    </el-row>

    <el-row style="margin-top: 40px;">
      <el-col :span="24">
        <div style="font-weight: bold"><span class="font-color">|</span>&nbsp;&nbsp;作业详情
        </div>
      </el-col>
    </el-row>

    <el-row>
      <div v-for="(val, index) in data.homeworkStudentLibList">
        <el-col class="normal"><span @click="showDialog(val.homeworkLibId)" style="font-weight: bold;text-decoration: underline;cursor: pointer;color: #84B5F7">{{val.homeworkLibName}}:</span></el-col>
        <el-col class="normal" style="width: 140px" >练习量：{{val.exerciseGroupNo}}组&nbsp;&nbsp;&nbsp;&nbsp;|</el-col>
        <el-col class="normal" style="width: 140px">每组：{{val.groupTime}}
          <span v-if="val.groupTimeUnit==1">次</span>
          <span v-if="val.groupTimeUnit==2">秒</span>
          <span v-if="val.groupTimeUnit==3">分</span>
        </el-col>
      </div>
    </el-row>

    <el-row>
      <el-col class="normal" style="width: 80px">作业说明：</el-col>
      <el-col class="normal" style="width: 50%">
        {{data.homeworkExplain}}
      </el-col>
    </el-row>

    <el-row style="margin-top: 40px;">
      <el-col :span="24">
        <div style="font-weight: bold"><span class="font-color">|</span>&nbsp;&nbsp;作业反馈
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-col class="normal" style="width: 250px">完成时间：<span v-if="data.finishTime!=null">{{data.finishTime | formatDate}}</span></el-col>
      <el-col class="normal" style="width: 200px">
        作业反馈：
        <span v-if="data.homeworkFeedback === 1">轻松过</span>
        <span v-if="data.homeworkFeedback === 2">刚刚好</span>
        <span v-if="data.homeworkFeedback === 3">太辛苦</span>
        <span v-if="data.homeworkFeedback === 4">未完成</span>
      </el-col>
      <el-col class="normal" style="width: 200px">视频查看：{{data.isVideoView === 1 ? '已查看':'未查看'}}</el-col>
    </el-row>
    <el-row>
      <el-col class="normal" style="width: 80px">文字反馈：</el-col>
      <el-col class="normal" style="width: 50%">
        {{data.textFeedback}}
      </el-col>
    </el-row>
    <homeworkLibDialog ref="homeworkLibDialog"></homeworkLibDialog>
  </div>
</template>

<script>
  import { formatDate } from '@/utils/index'
  import HomeworkLibDialog from '@/components/Dialog/HomeworkLibDetailDialog'
  export default {
    filters: {
      formatDate(time) {
        var date = new Date(time)
        return formatDate(date, 'yyyy/MM/dd hh:mm')
      }
    },
    name: 'PersonalDetail',
    components: {
      homeworkLibDialog: HomeworkLibDialog
    },
    methods: {
      goBack() {
        this.$router.go(-1)
      },
      doRequest() {
        var id = this.$route.query.ids
        this.$store.dispatch('PersonalHomeworkDetail', id).then(response => {
          this.data = response.data
        })
      },
      showDialog(id) {
        this.$refs.homeworkLibDialog.showDialog(id)
      }
    },
    data() {
      return {
        show: true,
        homeworkdialogVisible: false,
        data: {}
      }
    },
    mounted() {
      this.doRequest()
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

  .content {
    background-color: white;
    border-radius: 10px;
    padding: 30px;
    color: #525252;
  }

  .title {
    width: 100%;
    height: 30px;
    line-height: 30px;
    font-size: 20px;
    font-weight: bold;
    text-align: left;
  }

  .font-color {
    color: #006CEE;
  }
</style>
