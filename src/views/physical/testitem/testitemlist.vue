<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="testItem" class="">
        <el-row>
          <el-col>
            <el-form-item label="学年：">
              <el-select v-model="testItem.schoolYear" placeholder="请选择" size="mini" @change="schoolYearChange" style="width: 130px;">
                <el-option
                  v-for="item in schoolYearOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="年级：">
              <el-select v-model="testItem.gradeId" placeholder="请选择" @change="getClass" size="mini" style="width: 120px;">
                <el-option
                  v-for="item in gradeOptions"
                  :key="item.gradeId"
                  :label="item.gradeName"
                  :value="item.gradeId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="班级：">
              <el-select v-model="testItem.classId" placeholder="请选择" size="mini" style="width: 120px;">
                <el-option
                  v-for="item in classOptions"
                  :key="item.dictClassId"
                  :label="item.dictClassName"
                  :value="item.dictClassId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-input v-model="testItem.name" placeholder="请输入学生姓名" class="text-input" size="mini" style="width: 130px;"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search(testItem)" class="btn" size="mini">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="reset(testItem)" class="btn" size="mini">重置</el-button>
            </el-form-item>
            <el-form-item style="float: right">
              <el-button type="primary" @click="testItemImport()" class="btn" size="mini" v-if="power.batchUploadTestItem">批量导入</el-button>
              <el-button type="primary" @click="add" class="btn" size="mini" v-if="power.addTestItem">单个添加</el-button>
            </el-form-item>
            <el-form-item style="float: right">

            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="list">
      <el-table
        ref="multipleTable"
        :data="list"
        tooltip-effect="dark" :header-cell-style="{textAlign:'center', color:'#525252', fontSize:'16px'}" :cell-style="{textAlign:'center'}"
        style="width: 100%" @selection-change="selectChange">
        <el-table-column
          prop="id"
          width="50"
          type="selection">
        </el-table-column>
        <el-table-column
          prop="testItemReport"
          label="标题"
          width="230"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="bindingStatusValue"
          label="关联状态"
          width="110"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="gradeName"
          width="100"
          label="年级">
        </el-table-column>
        <el-table-column
          prop="className"
          width="100"
          label="班级">
        </el-table-column>
        <el-table-column
          label="体测时间"
          width="110"
          prop="healthTestTime">
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="240">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleView(scope.$index, scope.row)" class="btn" v-if="power.testItemDtl">查看</el-button>
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)" class="btn" v-if="power.uodateTestItem">编辑</el-button>
            <el-button
              size="mini" v-if="scope.row.shelvesStatus == 1 && power.updateSelvesTestItem"
              @click="handleOut(scope.$index, scope.row, 0)" class="btn">下架</el-button>
            <el-button
              size="mini"
              @click="handleOut(scope.$index, scope.row, 1)" class="btn" v-if="scope.row.shelvesStatus != 1 && power.updateSelvesTestItem">上架</el-button>
            <el-button
              size="mini"
              @click="handleDelete(scope.$index, scope.row)" class="btn" v-if="power.delTestItem">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="multi-action">
        <el-button type="primary" @click="updateBatch(0)" class="btn" size="mini" v-if="power.updateSelvesTestItem">批量下架</el-button>
        <el-button type="primary" @click="updateBatch(1)" class="btn" size="mini" v-if="power.updateSelvesTestItem">批量上架</el-button>
        <el-button type="primary" @click="deleteBatch" class="btn" size="mini" v-if="power.delTestItem">批量删除</el-button>
      </div>
      <div class="page">
        <span class="demonstration"></span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchForm.pageNum"
          :page-sizes="[10, 20, 30]"
          :page-size="searchForm.pageSize"
          layout="prev, pager, next, sizes, jumper" backgroud=""
          :total="searchForm.totalPage">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getSchoolYear } from "@/utils/index";
import { isHavePermissions } from "@/utils/auth";
export default {
  name: "TestItemList",
  methods: {
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
    reset(testItem) {
      testItem.gradeId = "";
      testItem.classId = "";
      testItem.name = "";
      this.classOptions=[];
      var date = new Date();
      var diff = date.getFullYear() - 2008;
      var month = date.getMonth();
      if (month >= 7) {
        diff++;
      }
      testItem.schoolYear = 2007 + diff + "-" + (2008 + diff);
      const list = testItem.schoolYear.split("-");
      if (list.length > 0) {
        testItem.schoolYearStart = list[0];
        testItem.schoolYearEnd = list[1];
      }
    },
    search(testItem) {
      this.searchForm = this.searchForm = JSON.parse(JSON.stringify(testItem));
      this.doSearch(this.searchForm);
    },
    // 查询
    doSearch(testItem) {
      const search = {};
      if (testItem.schoolYear !== "") {
        search.schoolYear = testItem.schoolYear;
      }
      if (testItem.gradeId !== "") {
        search.gradeId = testItem.gradeId;
      }
      if (testItem.classId !== "") {
        search.classId = testItem.classId;
      }
      if (testItem.name !== "") {
        search.name = testItem.name;
      }
      search.pageNum = testItem.pageNum;
      search.pageSize = testItem.pageSize;
      this.$store.dispatch("GetTestItemList", search).then(response => {
        if (response.data) {
          this.list = response.data.list;
          // this.list.forEach((item, index) => {
          //   if (item.schoolClassName) {
          //     item.grade = item.schoolClassName.substring(0, 3)
          //     item.class = item.schoolClassName.substring(3, 5)
          //   }
          // })
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
        this.$store.dispatch("DeleteTestItem", row.id).then(response => {
          this.doSearch(this.searchForm);
        });
      });
    },
    handleEdit(index, row) {
      this.routeLink = {
        path: "/testItemForm",
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
        var testItem = { id: row.id, shelvesStatus: status };
        this.$store.dispatch("UpdateSelves", testItem).then(response => {
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
        this.$store.dispatch("UpdateBatchSelves", testItem).then(response => {
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
    deleteBatch() {
      var ids = { ids: this.ids };
      this.$confirm("确认删除体测报告？").then(_ => {
        this.$store.dispatch("DeleteBatchTestItem", ids).then(response => {
          this.doSearch(this.searchForm);
        });
      });
    },
    handleView(index, row) {
      this.routeLink = {
        path: "/testItemDetail",
        query: {
          id: row.id,
          type:row.bindingStatusValue
        }
      };
      this.$router.push(this.routeLink);
    },
    add() {
      this.$router.push("/addTestItemForm");
    },
    getGrade() {
      this.$store.dispatch("GetGrade").then(response => {
        this.gradeOptions = response.data;
      });
    },
    schoolYearChange() {
      this.testItem.classId = "";
      if (this.testItem.gradeId !== "") {
        this.getClass();
      }
      // this.getClass()
    },
    getClass() {
      this.testItem.classId = "";
      this.getClassOption();
    },
    getClassOption() {
      var data = {};
      for (let i = 0; i < this.gradeOptions.length; i++) {
        if (this.testItem.gradeId == this.gradeOptions[i].gradeId) {
          data.schoolTypeGradeId = this.gradeOptions[i].id;
        }
      }
      var list = this.testItem.schoolYear.split("-");
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
    // 批量导入
    testItemImport() {
      this.$router.push({ path: "/testItemImport" });
    }
  },
  beforeRouteLeave(to, from, next) {
    if (
      to.name === "TestItemDetail" ||
      to.name === "TestItemForm" ||
      to.name === "AddTestItemForm"
    ) {
      var condition = JSON.stringify(this.searchForm);
      localStorage.setItem("testItemCondition", condition);
    } else {
      localStorage.removeItem("testItemCondition");
    }
    if (
      to.name == "healthStats" ||
      to.name == "TestItemList" ||
      to.name == "HealthList"
    ) {
      // 设置下一个路由的 meta
      to.meta.keepAlive = true; // B 跳转到 A 时，让 A 缓存，即不刷新

    }else{
      to.meta.keepAlive = false;
    }
    next();
  },
  watch:{
    $route(to,from){
      if(to.name=="TestItemList" && JSON.stringify(to.params)!="{}"&& to.params.type=="update"){
        this.testItem.schoolYear=to.params.schoolYear;
           this.search(this.testItem);
      }
    }
  },
  mounted() {
    this.schoolYearOptions = getSchoolYear();
    if (!this.testItem.schoolYear) {
      // this.testItem.schoolYear = this.schoolYearOptions[this.schoolYearOptions.length - 1].value;
      this.testItem.schoolYear = this.schoolYearOptions[0].value;
    }
    this.getGrade();
    this.getClassOption();
    this.search(this.testItem);
    this.powerArr.forEach(val => {
      this.power[val] = isHavePermissions(val);
    });
  },
  created() {
    var condition = localStorage.getItem("testItemCondition");
    if (condition != null) {
      this.testItem = JSON.parse(condition);
    }
  },
  data() {
    return {
      power: {
        delTestItem: false,
        updateSelvesTestItem: false,
        addTestItem: false,
        testItemDtl: false,
        batchUploadTestItem: false,
        uodateTestItem: false
      },
      powerArr: [
        "delTestItem",
        "updateSelvesTestItem",
        "addTestItem",
        "testItemDtl",
        "uodateTestItem",
        "batchUploadTestItem"
      ],
      ids: "",
      multiLine: [],
      schoolYearOptions: [],
      gradeOptions: [],
      classOptions: [],
      testItem: {
        schoolYear: "",
        gradeId: "",
        classId: "",
        name: "",
        pageSize: 10,
        pageNum: 1,
        totalPage: 0
      },
      physicalModel: 2,
      list: [],
      multipleSelection: [],
      searchForm: {}
    };
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
