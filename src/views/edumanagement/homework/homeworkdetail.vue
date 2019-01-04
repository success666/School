<template>
  <div class="HomeworkDetail-content">

    <el-row>
      <el-col :span="24">
        <div class="info-title"><span>班级作业详情</span>
        </div>
      </el-col>
    </el-row>

    <el-row style="margin-top: 40px;">
      <el-col :span="5">班级：{{detailModel.dictGradeName}}{{detailModel.dictClassIdName}}</el-col>
      <el-col :span="8">作业时间：{{detailModel.startDate | formatDate}} - {{detailModel.endDate | formatDate}}</el-col>
      <el-col :span="5">推送时间：{{detailModel.pushTime | formatDate}}</el-col>
    </el-row>
    <el-row>
      <el-col :span="2">完成情况：</el-col>
      <el-col :span="10">轻松过<span class="font-color">&nbsp;&nbsp;({{detailModel.soEasyCount}}人)&nbsp;&nbsp;&nbsp;</span> 刚刚好<span class="font-color">&nbsp;&nbsp;&nbsp;({{detailModel.justCount}}人)&nbsp;&nbsp;</span> 太辛苦<span class="font-color">&nbsp;&nbsp;({{detailModel.tooHardCount}}人)&nbsp;&nbsp;&nbsp;</span></el-col>
    </el-row>
    <el-row>
      <el-col :span="5">完成情况：{{detailModel.finishRate}}</el-col>
      <el-col :span="10">视频查看情况：{{detailModel.videoViewRate}}</el-col>
    </el-row>

    <hr style="border:0.5px solid #EAF4FF;"/>

    <div style="margin-top: 30px;border: 3px #F0F0F0 solid">
      <el-table
        ref="multipleTable"
        :data="detailModel.homeworkStudentList"
        tooltip-effect="dark" :header-cell-style="{textAlign:'center', color:'#525252', fontSize:'16px', backgroundColor: '#F8F8F8'}" :cell-style="{textAlign:'center'}"
        style="width: 100%" >
        <el-table-column width="100px"
                         prop="studentNo"
                         label="学号">
        </el-table-column>
        <el-table-column width="120px"
                         prop="name"
                         label="姓名">
        </el-table-column>
        <el-table-column width="100px"
                         prop="sex"
                         label="性别">
          <template slot-scope="scope">
            <span v-if='scope.row.sex=="1"'>男</span>
            <span v-else-if='scope.row.sex=="2"'>女</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="detail"
          label="作业详情"
          min-width="100px">
          <template slot-scope="scope">
            <div class="homework-detail">
              <span v-for="(ins,index) in scope.row.homeworkStudentLibList">
                <a @click="showDialog(ins)" class="font-color">{{ins.homeworkLibName}}</a>
                ({{ins.exerciseGroupNo}}*{{ins.groupTime}})<span v-if="index!==scope.row.homeworkStudentLibList.length-1">、</span>
              </span>
              <span v-if="scope.row.homeworkExplain!=null&&scope.row.homeworkExplain!=''">
                、运动说明：{{scope.row.homeworkExplain}}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="100px"
                         label="完成日期"
                         prop="completeDate">
          <template slot-scope="scope">
            <span v-if="scope.row.finishTime!=null">{{scope.row.finishTime | formatDate}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="作业反馈"
          prop="homeworkFeedback"
          :formatter="formatter">
        </el-table-column>
        <el-table-column width="100px"
                         label="视频查看"
                         prop="isSee">
          <template slot-scope="scope">
            <span v-if='scope.row.isVideoView=="1"'>已查看</span>
            <span v-else-if='scope.row.isVideoView=="2"'>未查看</span>
          </template>
        </el-table-column>
        <el-table-column width="100px"
                         label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="enterStuHomeworkDetail(scope.$index, scope.row)" class="btn">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <homeworkLibDialog ref="homeworkLibDialog"></homeworkLibDialog>

  </div>
</template>

<script>
  import { formatDate } from '@/utils/index'
  import HomeworkLibDialog from '@/components/Dialog/HomeworkLibDetailDialog'

  export default {
    name: 'HomeworkDetail',
    components: {
      homeworkLibDialog: HomeworkLibDialog
    },
    filters: {
      formatDate(time) {
        var date = new Date(time)
        return formatDate(date, 'yyyy/MM/dd')
      }
    },
    data() {
      return {
        // 数据容器
        detailModel: {},
        // 作业详情弹窗容器
        detailLibModel: {},
        homeworkdialogVisible: false,
        list: [],
        showDialog(ins) {
          this.$refs.homeworkLibDialog.showDialog(ins.homeworkLibId)
        },
        enterStuHomeworkDetail(index, data) {
          console.log(data)
          var routeLink = {
            path: 'personalDetail',
            query: {
              ids: data.id
            }
          }
          this.$router.push(routeLink)
        }
      }
    },
    methods:{
      formatter(row, column, cellValue, index){
        let value="";
        switch (cellValue) {
          case 1:
          case "1":
            value = "轻松过";
            break;
          case 2:
          case "2":
            value = "刚刚好";
            break;
          case 3:
          case "3":
            value = "太辛苦";
            break;
          case "4":
          case 4:
            value = "未完成";
            break;
        }
        return value;
      }
    },
    beforeRouteLeave (to, from, next) {
      if(to.name=="PersonalDetail"){
        to.meta.keepAlive=false;
      }else{
        to.meta.keepAlive=true;
      }
      next();
    },
    mounted() {
      var detail = {
        id: this.$route.query.classId
      }
      this.$store.dispatch('GetHomeworkDetail', detail).then(response => {
        this.detailModel = response.data
      })
    }
  }
</script>

<style scoped>
  .HomeworkDetail-content {
    background-color: white;
    border-radius: 10px;
    padding: 30px;
    color: #525252;
  }
  .font-color {
    color: #006CEE;
  }

  .homework-detail{
    overflow: hidden;
    -webkit-line-clamp: 1;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }
  .homework-detail:hover{
    -webkit-line-clamp: 20
  }
</style>
