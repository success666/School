<template>
  <div>
    <el-radio-group v-model="routerModel" @change="modelRouter" style="margin-bottom: 10px;">
      <el-radio-button label="1">作业管理</el-radio-button>
      <el-radio-button label="2">作业统计</el-radio-button>
    </el-radio-group>
    <div class="search-form">
      <el-form :inline="true" :model="homework" class>
        <el-row>
          <el-col>
            <el-form-item label="学年">
              <el-select
                v-model="homework.schoolYear"
                placeholder="请选择"
                size="mini"
                @change="schoolYearChange"
                style="width: 140px"
              >
                <el-option
                  v-for="item in schoolYearOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label>
              <el-select
                v-model="homework.term"
                placeholder="请选择学期"
                size="mini"
                style="width: 110px"
              >
                <el-option
                  v-for="item in termOptions"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="班级类型">
              <el-select
                v-model="homework.classType"
                placeholder="请选择类型"
                size="mini"
                style="width: 110px"
                @change="changeClassType"
              >
                <el-option
                  v-for="item in classTypeOptions"
                  :key="item.type"
                  :label="item.name"
                  :value="item.type"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="年级" v-if="homework.classType==1">
              <el-select
                v-model="homework.gradeId"
                placeholder="请选择"
                @change="getClass"
                size="mini"
                style="width: 110px"
              >
                <el-option
                  v-for="item in gradeOptions"
                  :key="item.id"
                  :label="item.gradeName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="班级" v-if="homework.classType==1">
              <el-select
                v-model="homework.classId"
                placeholder="请选择"
                size="mini"
                style="width: 110px"
              >
                <el-option
                  v-for="item in classOptions"
                  :key="item.di"
                  :label="item.dictClassName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="兴趣班" v-if="homework.classType==2">
              <el-select
                v-model="homework.interestClassId"
                placeholder="请选择"
                size="mini"
                style="width: 110px"
              >
                <el-option
                  v-for="item in interestClassIdOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="推送状态">
              <el-select
                v-model="homework.pushState"
                placeholder="请选择"
                size="mini"
                style="width: 110px"
              >
                <el-option
                  v-for="item in pushOptions"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="float: right;margin-right: 10px;">
              <el-button type="primary" @click="search(homework)" class="btn" size="mini">查询</el-button>
              <el-button type="primary" @click="reset(homework)" class="btn" size="mini">重置</el-button>
              <el-button
                type="primary"
                @click="addHomeworkDialog"
                class="btn"
                size="mini"
                v-if="power.addHomework"
              >布置作业</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="list">
      <el-table
        ref="multipleTable"
        :data="list"
        tooltip-effect="dark"
        :header-cell-style="{textAlign:'center', color:'#525252', fontSize:'16px' }"
        :cell-style="{textAlign:'center'}"
        style="width: 100%"
      >
        <el-table-column label="学年">
          <template slot-scope="scope">
            <div style="width: 100%">{{scope.row.schoolYearStart}}-{{scope.row.schoolYearEnd}}</div>
          </template>
        </el-table-column>
        <el-table-column label="学期">
          <template slot-scope="scope">
            <div style="width: 100%" v-if="scope.row.term === 1">上学期</div>
            <div style="width: 100%" v-if="scope.row.term === 2">下学期</div>
          </template>
        </el-table-column>
        <el-table-column label="班级" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.dictGradeName + scope.row.dictClassIdName}}</template>
        </el-table-column>
        <el-table-column prop="startDate" label="开始日期" show-overflow-tooltip></el-table-column>
        <el-table-column prop="endDate" label="结束日期" show-overflow-tooltip></el-table-column>
        <el-table-column label="完成情况" prop="finishRate"></el-table-column>
        <el-table-column label="视频查看情况" width="120" prop="videoViewRate"></el-table-column>
        <el-table-column label="操作" min-width="300">
          <template slot-scope="scope">
            <el-button
              size="mini"
              v-if="scope.row.pushState === 2 && power.updateHomework"
              @click="handleEdit(scope.$index, scope.row)"
              class="btn"
            >编辑</el-button>
            <el-button
              size="mini"
              v-if="scope.row.pushState === 1 && power.getHomework"
              @click="handleView(scope.$index, scope.row)"
              class="btn"
            >查看</el-button>
            <el-button
              size="mini"
              v-if="scope.row.pushState === 2 && power.deleteHomework"
              @click="handleDelete(scope.$index, scope.row)"
              class="btn"
            >删除</el-button>
            <el-button
              size="mini"
              v-if="scope.row.pushState === 1 && power.deleteHomework"
              disabled
              class="btn"
            >删除</el-button>
            <el-button
              size="mini"
              v-if="scope.row.pushState === 2 && power.pushHomework"
              @click="handlePush(scope.$index, scope.row)"
              class="btn"
            >推送</el-button>
            <el-button
              size="mini"
              v-if="scope.row.pushState === 1 && power.pushHomework"
              disabled
              class="btn"
            >推送</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <span class="demonstration"></span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchForm.pageNum"
          :page-sizes="[10, 20, 30]"
          :page-size="searchForm.pageSize"
          layout="prev, pager, next, sizes, jumper"
          backgroud
          :total="searchForm.totalPage"
        ></el-pagination>
      </div>
    </div>
    <el-dialog title :visible.sync="dialogFormVisible" width="600px" class="addhomeWork_dialog">
      <el-row class="changeClassType" v-if="form.classType==''">
        <el-col :span="24">
          <div class="changeClassType_label">请选择班级类型</div>
          <div class="changeClassType_btn">
            <el-button @click="form.classType='1'">行政班</el-button>
            <el-button  @click="form.classType='2'">兴趣班</el-button>
          </div>
        </el-col>
      </el-row>
      <el-form :model="form" :inline="true" v-else>
        <el-form-item label="年级" :label-width="formLabelWidth" v-if="form.classType=='1'">
          <el-select v-model="form.gradeId" placeholder="请选择" @change="getDialogClass" size="mini">
            <el-option
              v-for="item in gradeOptions"
              :key="item.id"
              :label="item.gradeName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级" v-if="form.classType=='1'">
          <el-select v-model="form.classId" placeholder="请选择" @change="getClassName" size="mini">
            <el-option
              v-for="item in classOptions"
              :key="item.id"
              :label="item.dictClassName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="兴趣班" v-if="form.classType=='2'" class="classType1">
          <el-select v-model="form.classId" placeholder="请选择" @change="getClassName" size="mini">
            <el-option
              v-for="item in interestClassIdOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="form.classType!=''">
        <el-button @click="dialogFormVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="addHomework" size="mini">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getSchoolYear, formatDate } from "@/utils/index";
import { isHavePermissions } from "@/utils/auth";
import request from "@/utils/request";
export default {
  name: "HomeworkList",
  data() {
    return {
      power: {
        addHomework: false,
        updateHomework: false,
        pushHomework: false,
        deleteHomework: false,
        getHomework: false
      },
      powerArr: [
        "addHomework",
        "updateHomework",
        "pushHomework",
        "deleteHomework",
        "getHomework"
      ],
      routerModel: "1",
      list: [],
      formLabelWidth: "60px",
      dialogFormVisible: false,
      form: {
        gradeId: "",
        classId: "",
        grade: "",
        class: "",
        classType: ""
      },
      searchForm: { pageNum: 1, pageSize: 10, totalPage: 100 },
      homework: {
        classType: 0,
        schoolYear: "",
        gradeId: "",
        classId: "",
        name: "",
        term: "0",
        interestClassId: "",
        pushState: "0",
        pageSize: 10,
        pageNum: 1,
        totalPage: 10
      },
      schoolYearOptions: [],
      gradeOptions: [],
      classOptions: [],
      interestClassIdOptions: [],
      termOptions: [
        {
          label: "全部",
          id: "0"
        },
        {
          label: "上学期",
          id: "1"
        },
        {
          label: "下学期",
          id: "2"
        }
      ],
      pushOptions: [
        {
          label: "全部",
          id: "0"
        },
        {
          label: "已推送",
          id: "1"
        },
        {
          label: "未推送",
          id: "2"
        }
      ],
      classTypeOptions: [{ type: 0, name: "全部" }]
    };
  },
  methods: {
    modelRouter() {
      this.routerModel = "1";
      this.$router.push("homeworkstats");
    },
    handleEdit(index, row) {
      this.routeLink = {
        path: "/editHomework",
        query: {
          schoolClassId: row.schoolClassId,
          grade: row.dictGradeName,
          class: row.dictClassIdName,
          startDate: row.startDate,
          endDate: row.endDate,
          id: row.id,
          classType:this.form.classType
        }
      };
      this.$router.push(this.routeLink);
    },
    handleView(index, row) {
      this.routeLink = {
        path: "/homeworkDetail",
        query: {
          classId: row.id
        }
      };
      this.$router.push(this.routeLink);
    },
    handleDelete(index, row) {
      this.$confirm("确认删除？").then(_ => {
        var id = row.id;
        this.$store.dispatch("DeleteHomework", id).then(response => {
          this.search(this.homework);
        });
      });
    },
    // 分页大小
    handleSizeChange(val) {
      this.searchForm.pageSize = val;
      this.search(this.searchForm);
    },
    // 当前页跳转
    handleCurrentChange(val) {
      this.searchForm.pageNum = val;
      this.search(this.searchForm);
    },
    handlePush(index, row) {
      this.$confirm("确认推送？").then(_ => {
        var id = row.id;
        this.$store.dispatch("PushHomework", id).then(response => {
          this.search(this.searchForm);
        });
      });
    },
    getClassName(value) {
      let obj = {};
      if (this.form.classType == "1") {
        obj = this.classOptions.find(item => {
          return item.id === value;
        });
        this.form.class = obj.dictClassName;
      } else {
        obj = this.interestClassIdOptions.find(item => {
          return item.id === value;
        });
        this.form.class = obj.name;
      }
    },
    addHomeworkDialog(){
      this.dialogFormVisible = true;
      for (name in this.form) {
        this.form[name] = "";
      }
    },
    addHomework() {
      if (this.form.classType == 1) {
        if (this.form.gradeId !== "" && this.form.classId !== "") {
          this.routeLink = {
            path: "/addHomework",
            query: {
              schoolClassId: this.form.classId,
              grade: this.form.grade,
              class: this.form.class,
              classType:this.form.classType
            }
          };
          this.dialogFormVisible = false;
          this.$router.push(this.routeLink);
        } else {
          this.$confirm("请选择年级班级", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "返回",
            type: "warning"
          })
            .then(() => {})
            .catch(() => {
              this.dialogFormVisible = false;
              for (name in this.form) {
                this.form[name] = "";
              }
            });
        }
      } else {
        if (this.form.classId !== "" && this.form.classId!=="0") {
          this.routeLink = {
            path: "/addHomework",
            query: {
              schoolClassId: this.form.classId,
              grade: "兴趣班",
              class: this.form.class,
              classType:this.form.classType
            }
          };
          this.dialogFormVisible = false;
          this.$router.push(this.routeLink);
        } else {
          this.$confirm("请选择兴趣班类型", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "返回",
            type: "warning"
          })
            .then(() => {})
            .catch(() => {
              this.dialogFormVisible = false;
              for (name in this.form) {
                this.form[name] = "";
              }
            });
        }
      }
    },
    changeClassType() {
      this.homework.gradeId = "";
      this.homework.classId = "";
    },
    getGrade() {
      this.$store.dispatch("GetGrade").then(response => {
        this.gradeOptions = [{ id: "", gradeName: "全部" }].concat(
          response.data
        );
      });
    },
    schoolYearChange() {
      this.homework.classId = "";
      this.form.gradeId = "";
      this.getClass();
      getinterestClass(this);
    },
    getClass() {
      this.homework.classId = "";
      this.getClassOption();
    },
    getClassOption() {
      var data = {};
      data.schoolTypeGradeId = this.homework.gradeId;
      var list = this.homework.schoolYear.split("-");
      if (list.length > 0) {
        data.schoolYearStart = list[0];
        data.schoolYearEnd = list[1];
      }
      this.$store.dispatch("GetClass", data).then(response => {
        this.classOptions = [{ id: "", dictClassName: "全部" }].concat(
          response.data
        );
      });
    },
    getDialogClass(value) {
      this.form.classId = "";
      let obj = {};
      obj = this.gradeOptions.find(item => {
        return item.id === value;
      });
      this.form.grade = obj.gradeName;
      var data = {};
      data.schoolTypeGradeId = this.form.gradeId;
      var list = this.homework.schoolYear.split("-");
      if (list.length > 0) {
        data.schoolYearStart = list[0];
        data.schoolYearEnd = list[1];
      }
      this.$store.dispatch("GetClass", data).then(response => {
        this.classOptions = response.data;
      });
    },
    search: searchForm,
    getFormData: getFormData,
    reset(homework) {
      this.homework.term = "";
      this.homework.classId = "";
      this.homework.gradeId = "";
      this.homework.pushState = "0";
      this.classOptions = [];
      var date = new Date();
      var diff = date.getFullYear() - 2008;
      var month = date.getMonth();
      if (month >= 7) {
        diff++;
      }
      this.homework.schoolYear = 2007 + diff + "-" + (2008 + diff);
    }
  },
  watch: {
    $route(to, from) {
      if (to.name=="HomeworkList" && typeof to.params.type != "undefined" && to.params.type == "update") {
        this.homework.schoolYear = to.params.schoolYear;
        this.search(this.homework);
      }
    }
  },
  mounted() {
    this.schoolYearOptions = getSchoolYear();
    if (!this.homework.schoolYear) {
      // this.homework.schoolYear = this.schoolYearOptions[this.schoolYearOptions.length - 1].value
      this.homework.schoolYear = this.schoolYearOptions[0].value;
    }
    this.getGrade();
    this.getClassOption();
    this.search(this.homework);
    this.powerArr.forEach(val => {
      this.power[val] = isHavePermissions(val);
    });
    getinterestClass(this);

    getClassTypeOptions(this);
  }
};

function getClassTypeOptions(vm) {
  request.get("/api/auth/v1/school/class/type").then(res => {
    vm.classTypeOptions = vm.classTypeOptions.concat(res.data);
  });
}
function getinterestClass(vm) {
  let params = {
    schoolYearStart: vm.homework.schoolYear.split("-")[0],
    schoolYearEnd: vm.homework.schoolYear.split("-")[1]
  };
  request
    .get("/api/auth/v1/interest-class", {
      params
    })
    .then(res => {
      vm.interestClassIdOptions = [{ id: "0", name: "全部" }].concat(res.data);
    });
}
function searchForm() {
  let params = {};
  var yearlist = this.homework.schoolYear.split("-");
  params.schoolYearStart = yearlist[0];
  params.schoolYearEnd = yearlist[1];
  params.term = this.homework.term;
  params.pushState = this.homework.pushState;
  params.classType = this.homework.classType;
  params.pageNum = this.searchForm.pageNum;
  params.pageSize = this.searchForm.pageSize;
  if (this.homework.classType == 1) {
    if (this.homework.gradeId) {
      params.dictGradeId = this.homework.gradeId;
    }
    if (this.homework.classId) {
      params.schoolClassId = this.homework.classId;
    }
  } else if (this.homework.classType == 2) {
    if (this.homework.interestClassId) {
      params.interestClassId = this.homework.interestClassId;
    }
  }
  this.getFormData(params);
}
function getFormData(params) {
  request
    .get("/api/auth/v1/homework", {
      params: params
    })
    .then(res => {
      if (res.data) {
        this.list = res.data.list;
        this.list.forEach((val, index) => {
          val.startDate = formatDate(val.startDate, "yyyy-MM-dd");
          val.endDate = formatDate(val.endDate, "yyyy-MM-dd");
        });
        this.searchForm.totalPage = res.data.total;
        this.searchForm.pageNum = res.data.pageNum;
      } else {
        this.list = [];
        this.searchForm.totalPage = 0;
      }
    });
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.page {
  margin-top: 10px;
}
</style>
<style lang="scss">
.addhomeWork_dialog {
  .el-dialog__header {
    padding: 0px;
  }
  .el-dialog__body {
    padding: 30px;
    padding-top:30px;
    .changeClassType {
      text-align: center;
      .changeClassType_label {
        font-size: 20px;
        margin-bottom: 10px;
        font-weight: 600;
      }
    }
    .el-form{
          text-align: center;
    }
  }
  .el-dialog__footer {
    padding: 10px;
  }
}
</style>

