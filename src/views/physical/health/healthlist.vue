<template>
  <div>

    <div class="search-form">
      <el-form :inline="true" :model="health" class="
">
        <el-row>
          <el-col>
            <el-form-item label="学年：">
              <el-select v-model="health.schoolYear" placeholder="请选择" size="mini" @change="schoolYearChange" style="width: 130px;">
                <el-option v-for="item in schoolYearOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="年级：">
              <el-select v-model="health.gradeId" placeholder="请选择" @change="getClass" size="mini" style="width: 120px;">
                <el-option v-for="item in gradeOptions" :key="item.gradeId" :label="item.gradeName" :value="item.gradeId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="班级：">
              <el-select v-model="health.classId" placeholder="请选择" size="mini" style="width: 120px;">
                <el-option v-for="item in classOptions" :key="item.dictClassId" :label="item.dictClassName" :value="item.dictClassId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-input v-model="health.name" placeholder="请输入学生姓名" class="text-input" size="mini" style="width: 130px;"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search(health)" class="btn" size="mini">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="reset(health)" class="btn" size="mini">重置</el-button>
            </el-form-item>
            <el-form-item style="float: right">
              <el-button type="primary" @click="healthImport()" class="btn" size="mini" v-if="power.batchUploadHealth">批量导入</el-button>
            </el-form-item>
            <el-form-item style="float: right">
              <el-button type="primary" @click="add" class="btn" size="mini" v-if="power.addHealth">添加</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="list">
      <el-table ref="multipleTable" :data="list" tooltip-effect="dark" :header-cell-style="{textAlign:'center', color:'#525252', fontSize:'16px'}" :cell-style="{textAlign:'center'}" style="width: 100%" @selection-change="selectChange">
        <el-table-column prop="id" type="selection">
        </el-table-column>
        <el-table-column prop="halthExaminationReport" label="标题">
        </el-table-column>
        <el-table-column prop="bindingStatusValue" label="关联状态" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="grade" label="年级" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="class" label="班级" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="体检时间" prop="healthExamTime">
        </el-table-column>
        <el-table-column label="操作" min-width="300">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleView(scope.$index, scope.row)" class="btn" v-if="power.healthDtl">查看</el-button>
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)" class="btn" v-if="power.updateHealth">编辑</el-button>
            <el-button size="mini" v-if="scope.row.shelvesStatus == 1 && power.updateSelvesHealth" @click="handleOut(scope.$index, scope.row, 0)" class="btn">下架</el-button>
            <el-button size="mini" v-if="scope.row.shelvesStatus != 1 && power.updateSelvesHealth" @click="handleOut(scope.$index, scope.row, 1)" class="btn">上架</el-button>
            <el-button size="mini" @click="handleDelete(scope.$index, scope.row)" class="btn" v-if="power.delHealth">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="multi-action">
        <el-button type="primary" @click="updateBatch(0)" class="btn" size="mini" v-if="power.updateSelvesHealth">批量下架</el-button>
        <el-button type="primary" @click="updateBatch(1)" class="btn" size="mini" v-if="power.updateSelvesHealth">批量上架</el-button>
        <el-button type="primary" @click="deleteBatch" class="btn" size="mini" v-if="power.delHealth">批量删除</el-button>
      </div>
      <div class="page">
        <span class="demonstration"></span>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchForm.pageNum" :page-sizes="[10, 20, 30]" :page-size="searchForm.pageSize" layout="prev, pager, next, sizes, jumper" backgroud="" :total="searchForm.totalPage">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getSchoolYear } from "@/utils/index";
import { isHavePermissions } from "@/utils/auth";
export default {
  name: "HealthList",

  data() {
    return {
      power: {
        addHealth: false,
        delHealth: false,
        updateSelvesHealth: false,
        updateHealth: false,
        healthDtl: false,
        batchUploadHealth: false
      },
      powerArr: [
        "addHealth",
        "delHealth",
        "updateSelvesHealth",
        "updateHealth",
        "healthDtl",
        "batchUploadHealth"
      ],
      searchForm: {},
      ids: "",
      multiLine: [],
      schoolYearOptions: [],
      gradeOptions: [],
      classOptions: [],
      health: {
        schoolYear: "",
        gradeId: "",
        classId: "",
        name: "",
        pageSize: 10,
        pageNum: 1,
        totalPage: 0
      },
      physicalModel: 3,
      list: [],
      multipleSelection: []
    };
  },
  methods: {
    add() {
      this.$router.push("/addHealthForm");
    },
    // 批量上下架
    updateBatch(status) {
      var msg = "";
      if (status === 1) {
        msg = "上架";
      } else {
        msg = "下架";
      }
      this.$confirm("确认" + msg + "？").then(_ => {
        var testItem = { ids: this.ids, shelvesStatus: status };
        this.$store.dispatch("UpdateBatchHealth", testItem).then(response => {
          if (response.status.code === 200 || response.status.code === 0) {
            this.$message({
              message: msg + "成功",
              type: "success"
            });
          }
          this.doSearch(this.searchForm);
        });
      });
    },
    // 批量删除
    deleteBatch() {
      var ids = { ids: this.ids };
      this.$confirm("确认删除体检报告？").then(_ => {
        this.$store.dispatch("DeleteBatchHealth", ids).then(response => {
          this.doSearch(this.searchForm);
        });
      });
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
    // 重置搜索栏
    reset(health) {
      health.schoolYear = "";
      health.gradeId = "";
      health.classId = "";
      health.name = "";
      this.classOptions=[];
      var date = new Date();
      var diff = date.getFullYear() - 2008;
      var month = date.getMonth();
      if (month >= 7) {
        diff++;
      }
      health.schoolYear = 2007 + diff + "-" + (2008 + diff);
      const list = health.schoolYear.split("-");
      if (list.length > 0) {
        health.schoolYearStart = list[0];
        health.schoolYearEnd = list[1];
      }
    },
    search(health) {
      this.searchForm = JSON.parse(JSON.stringify(health));
      this.doSearch(this.searchForm);
    },
    // 查询
    doSearch(health) {
      const search = {};
      if (health.schoolYear !== "") {
        search.schoolYear = health.schoolYear;
      }
      if (health.gradeId !== "") {
        search.gradeId = health.gradeId;
      }
      if (health.classId !== "") {
        search.classId = health.classId;
      }
      if (health.name !== "") {
        search.name = health.name;
      }
      search.pageNum = health.pageNum;
      search.pageSize = health.pageSize;
      this.$store.dispatch("GetHealthList", search).then(response => {
        if (response.data) {
          this.list = response.data.list;
          this.list.forEach((item, index) => {
            if (item.className) {
              item.grade = item.className.substring(0, 3);
              item.class = item.className.substring(3, 5);
            }
          });
          this.searchForm.totalPage = response.data.total;
          this.searchForm.pageNum = response.data.pageNum;
        } else {
          this.list = [];
          this.searchForm.totalPage = 0;
        }
      });
    },
    // 列表多选
    selectChange(val) {
      this.ids = "";
      val.forEach((item, index) => {
        this.ids += item.id + ",";
      });
      this.ids = this.ids.substring(0, this.ids.length - 1);
    },
    // 删除
    handleDelete(index, row) {
      this.$confirm("确认删除体检报告？").then(_ => {
        this.$store.dispatch("DeleteHeadlthItem", row.id).then(response => {
          this.doSearch(this.searchForm);
        });
      });
    },
    handleEdit(index, row) {
      this.routeLink = {
        path: "/healthForm",
        query: {
          id: row.id
        }
      };
      this.$router.push(this.routeLink);
    },
    // 上下架
    handleOut(index, row, status) {
      var msg = "";
      if (status === 1) {
        msg = "上架";
      } else {
        msg = "下架";
      }
      this.$confirm("确认" + msg + "？").then(_ => {
        var health = { id: row.id, shelvesStatus: status };
        this.$store.dispatch("UpdateHealthSelves", health).then(response => {
          if (response.status.code === 200 || response.status.code === 0) {
            this.$message({
              message: msg + "成功",
              type: "success"
            });
          }
          this.doSearch(this.searchForm);
        });
      });
    },
    handleView(index, row) {
      this.routeLink = {
        path: "/healthItemDetail",
        query: {
          id: row.id
        }
      };
      this.$router.push(this.routeLink);
    },
    getGrade() {
      this.$store.dispatch("GetGrade").then(response => {
        this.gradeOptions = response.data;
      });
    },
    getClass() {
      this.health.classId = "";
      this.getClassOption();
    },
    getClassOption() {
      var data = {};
      for (let i = 0; i < this.gradeOptions.length; i++) {
        if (this.health.gradeId == this.gradeOptions[i].gradeId) {
          data.schoolTypeGradeId = this.gradeOptions[i].id;
        }
      }
      var list = this.health.schoolYear.split("-");
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
      this.health.classId = "";
      if (this.health.gradeId !== "") {
        this.getClass();
      }
    },
    // 批量导入
    healthImport() {
      this.$router.push({ path: "/healthImport" });
    }
  },
  watch:{
    $route(to,from){
      if(typeof to.params.type!="undefined" && to.params.type =="update"){
        this.health.schoolYear = to.params.schoolYear;
         this.search(this.health);
      }
    }
  },
  mounted() {
    var condition = localStorage.getItem("healthCondition");
    if (condition != null) {
      this.health = JSON.parse(condition);
    }
    this.schoolYearOptions = getSchoolYear();
    if (!this.health.schoolYear) {
      // this.health.schoolYear = this.schoolYearOptions[this.schoolYearOptions.length - 1].value;
      this.health.schoolYear = this.schoolYearOptions[0].value;
    }
    this.getGrade();
    this.getClassOption();
    this.search(this.health);
    this.powerArr.forEach(val => {
      this.power[val] = isHavePermissions(val);
    });
  },
  beforeRouteLeave(to, from, next) {
    if (
      to.name === "HealthForm" ||
      to.name === "HealthItemDetail" ||
      to.name === "AddHealthForm"
    ) {
      var condition = JSON.stringify(this.searchForm);
      localStorage.setItem("healthCondition", condition);
    } else {
      localStorage.removeItem("healthCondition");
    }
    next();
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
