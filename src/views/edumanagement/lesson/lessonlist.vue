<template>
  <div>
    <el-radio-group v-model="routerModel" @change="modelRouter" style="margin-bottom: 10px;" >
      <el-radio-button label="1">课堂表现管理</el-radio-button>
      <el-radio-button label="2">课堂表现统计</el-radio-button>
    </el-radio-group>
    <div class="search-form">
      <el-form :inline="true" :model="lesson" class="" style="font-size: 16px">
        <el-form-item label="学年：">
          <el-select v-model="lesson.schoolYear" placeholder="请选择" size="mini" @change="schoolYearChange" style="width: 130px;">
            <el-option
              v-for="item in schoolYearOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="lesson.term" placeholder="请选择学期"  size="mini" style="width: 130px;">
            <el-option label="上学期" value="1"></el-option>
            <el-option label="下学期" value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="班级类型：">
          <el-select v-model="lesson.classType" placeholder="请选择" size="mini">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="lesson.classType == 1">
          <el-select v-model="lesson.schoolTypeGradeId" placeholder="请选择年级" size="mini" @change="getClass" style="width: 120px;">
            <el-option
              v-for="item in gradeOptions"
              :key="item.id"
              :label="item.gradeName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="lesson.classType == 1">
          <el-select v-model="lesson.schoolClassId" placeholder="请选择班级" size="mini" style="width: 120px;">
            <el-option
              v-for="item in classOptions"
              :key="item.id"
              :label="item.dictClassName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="lesson.classType == 2">
          <el-select v-model="lesson.interestClassId" placeholder="请选择" size="mini" style="width: 120px;">
            <el-option
              v-for="item in interestClass"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item style="margin-right: 40px;float:right">
          <el-button type="primary" @click="search(lesson)" class="btn"  size="mini">查询</el-button>
          <el-button type="primary" @click="reset" class="btn"  size="mini">重置</el-button>
        </el-form-item>
      </el-form>
   </div>

    <div class="list">
      <section ref="printarea">
        <div>
          <el-table
            tooltip-effect="dark"
            :header-cell-style="{textAlign:'center', color:'#525252', fontSize:'16px',}" :cell-style="{textAlign:'center'}"
            :data="list"
            style="width:100%"
          >
            <el-table-column
              prop="schoolYear"
              label="学年">
            </el-table-column>
            <el-table-column
              prop="term"
              label="学期">
            </el-table-column>
            <el-table-column
              label="班级">
              <template slot-scope="scope">
                {{scope.row.gradeName?scope.row.gradeName + scope.row.className :'' + scope.row.className}}
              </template>
            </el-table-column>
            <el-table-column
              prop="lessonTime"
              label="上课时间">
            </el-table-column>
            <el-table-column
              label="操作" min-width="70">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="enterClassHomeworkDetail(scope.$index, scope.row)" class="btn">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </section>

      <div class="page">
        <!--<div style="float: left">-->
          <!--<el-radio v-model="radio" label="1">自动推送</el-radio>-->
        <!--</div>-->
        <span class="demonstration"></span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchForm.pageNum"
          :page-sizes="[10, 20, 30]"
          :page-size="searchForm.pageSize"
          layout="total, prev, pager, next, sizes, jumper" backgroud=""
          :total="searchForm.totalPage">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Print from "@/utils/print";
import request from "@/utils/request";
import { formatDate, getSchoolYear } from "@/utils/index";
import requestYapi from "@/utils/requestyAPI";

Vue.use(Print); // 注册
export default {
  name: "LessonList",
  data() {
    return {
      routerModel: "1",
      schoolYearOptions: [],
      gradeOptions: [],
      classOptions: [],
      lesson: {
        schoolYear: "",
        term: "",
        schoolTypeGradeId: "",
        schoolClassId: "",
        schooltime: "",
        type: "0",
        pageSize: 10,
        pageNum: 1,
        totalPage: 10,
        interestClassId:'',
        classType: '0',
      },
      radio: "1",
      lessonModel: 1,
      list: [],
      searchForm: {},
      options: [{
          value: '0',
          label: '全部'
        },{
          value: '1',
          label: '行政班'
        }, {
          value: '2',
          label: '兴趣班'
        }],
        interestClass:[],
    };
  },
  methods: {
    modelRouter() {
      this.$router.push("./classStats");
      this.routerModel = "1";
    },
    // 分页大小
    handleSizeChange(val) {
      this.searchForm.pageSize = val;
      this.doSearch(this.searchForm);
    },
    // 当前页跳转
    handleCurrentChange(val) {
      this.searchForm.pageNum = val;
      this.doSearch(this.searchForm);
    },
    // 进入班级作业详情
    enterClassHomeworkDetail(index, data) {
      this.routeLink = {
        path: "lessonPerformance",
        query: {
          courseId: data.id
        }
      };
      this.$router.push(this.routeLink);
    },
    handlePush(index, data) {},
    getGrade() {
      this.$store.dispatch("GetGrade").then(response => {
        this.gradeOptions = response.data;
      });
    },
    // 兴趣班下拉
    getInterestClass() {
      request.get("/api/auth/v1/interest-class").then(res => {
        this.interestClass = res.data;
      })
     
    },
    getClass() {
      this.lesson.schoolClassId = "";
      this.getClassOptions();
    },
    getClassOptions() {
      var data = {};
      data.schoolTypeGradeId = this.lesson.schoolTypeGradeId;
      var list = this.lesson.schoolYear.split("-");
      if (list.length > 0) {
        data.schoolYearStart = list[0];
        data.schoolYearEnd = list[1];
      }
      this.$store.dispatch("GetClass", data).then(response => {
        if (response.data) {
          this.classOptions = response.data;
        } else {
          this.classOptions = [];
        }
      });
    },
    schoolYearChange() {
      this.lesson.schoolClassId = "";
      if (this.lesson.schoolTypeGradeId !== "") {
        this.getClass();
      }
    },
    search(lesson) {
      this.searchForm = this.searchForm = JSON.parse(JSON.stringify(lesson));

      // console.log('lesson',this.searchForm);
      this.doSearch(this.searchForm);
    },
    doSearch(lesson) {

      if (lesson.schoolYear) {
        var list = lesson.schoolYear.split("-");
        if (list.length > 0) {
          lesson.schoolYearStart = list[0];
          lesson.schoolYearEnd = list[1];
        }

        lesson.dictSchoolTypeGradeId = lesson.schoolTypeGradeId;
        lesson.schoolTypeGradeId = lesson.classType == 1? lesson.schoolTypeGradeId : '';
        lesson.schoolClassId = lesson.classType == 1? lesson.schoolClassId : '';
        lesson.interestClassId = lesson.classType == 2? lesson.interestClassId : '';
        // console.log(lesson);
      }
      // this.$store.dispatch("LessnoList", lesson).then(response => {
        let params = JSON.parse(JSON.stringify(lesson)); 
       
        request.get('/api/auth/v2/course/schoolClassCourseRecord',{params}).then(response => {
        
          // console.log(response);
        if (response.data) {
          this.list = response.data.list;
          this.searchForm.totalPage = response.data.total;
          this.list.forEach((val, index) => {
            // console.log(val);
            if (val.term === 1) {
              val.term = "上学期";
            } else {
              val.term = "下学期";
            }
            if (val.startTime && val.endTime) {
              // console.log('startTime')
              val.lessonTime = formatDate(
                val.startTime.replace("T", " "),
                "yyyy/MM/dd hh:mm"
              );
              val.lessonTime =
                val.lessonTime +
                "-" +
                formatDate(val.endTime.replace("T", " "), "hh:mm");
            }else{
              val.lessonTime = '---'
            }
            val.schoolYear = this.lesson.schoolYear;
          });
        } else {
          this.list = [];
          this.searchForm.totalPage = 0;
        }
      });
    },
    
    reset() {
      this.lesson.classType = '0'
      this.lesson.term = "";
      this.lesson.schoolTypeGradeId = "";
      this.lesson.schoolClassId = "";
      this.lesson.type = "0";
      this.classOptions=[];
      var date = new Date();
      var diff = date.getFullYear() - 2008;
      var month = date.getMonth();
      if (month >= 7) {
        diff++;
      }
      this.lesson.schoolYear = 2007 + diff + "-" + (2008 + diff);
    }
  },
  beforeRouteLeave(to, from, next) {
    if(to.name=="LessonPerformance"){
      to.meta.keepAlive=false;
    }
    // console.log(to)
    next();
  },
  mounted() {
    this.getInterestClass();
    this.schoolYearOptions = getSchoolYear();
    if (!this.lesson.schoolYear) {
      // this.lesson.schoolYear = this.schoolYearOptions[this.schoolYearOptions.length - 1].value;
      this.lesson.schoolYear = this.schoolYearOptions[0].value;
    }
    this.getGrade();
    this.getClassOptions();
    this.search(this.lesson);
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.el-select {
  width: 155px;
}
</style>
