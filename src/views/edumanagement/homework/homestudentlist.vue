<template>
    <div class="homeStudentList">
        <div class=homeworkList v-if="formType">
            <h3 class="homeworkList_title">2018-07-01至2019-07-08广州市真光学校(小学部)一年级1班作业统计</h3>
            <div class="homeworkList_table">
                <el-table :data="homeworkList" style="width:100%">
                    <el-table-column label="学号" prop="studentNo" align="center"></el-table-column>
                    <el-table-column label="姓名" prop="studentName" align="center"></el-table-column>
                    <el-table-column label="性别" prop="six" align="center"></el-table-column>
                    <el-table-column label="疾病" prop="disease" align="center"></el-table-column>
                    <el-table-column label="完成作业（份）" prop="finishCount" align="center" width="150"></el-table-column>
                    <el-table-column label="作业完成率" prop="finishRate" align="center"></el-table-column>
                    <el-table-column label="操作" align="center" width="100">
                        <template slot-scope="scope">
                            <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class=studentList v-else>
            <el-row class="studentList_title">
                <el-col :span="24"></el-col>
            </el-row>
            <div class="studentList_table">
                <el-table :data="studentList" style="width:100%">
                    <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
                    <el-table-column label="作业详情" prop="homeworkDetails" align="center"></el-table-column>
                    <el-table-column label="布置日期" prop="arrangeTime" align="center"></el-table-column>
                    <el-table-column label="完成日期" prop="finishTime" align="center"></el-table-column>
                    <el-table-column label="作业反馈" prop="homeworkFeedback" align="center"></el-table-column>
                    <el-table-column label="操作" align="center" width="100">
                        <template slot-scope="scope">
                            <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            formType:true,
            homeworkList:[]
        }
    },
    methods:{
        handleClick(){

        }
    }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.homeStudentList {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 15px;
  position: relative;
  min-height: 600px;
  .homeworkList_table{
      width: 800px;
      margin: auto;
  }
}
</style>


