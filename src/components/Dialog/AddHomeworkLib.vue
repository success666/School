<template>
  <!--  添加作业详情弹出框  -->
  <el-dialog :visible.sync="addHomeworkdialogVisible" width="70%">

    <div class="search-form">
      <el-form :inline="true" :model="searchParam" class="">

        <el-form-item>
          <el-input v-model="searchParam.name" placeholder="请输入锻炼项目" class="text-input"></el-input>
        </el-form-item>

        <el-form-item>
          <el-input v-model="searchParam.sportItemNames" placeholder="请输入项目" class="text-input"></el-input>
        </el-form-item>

        <el-form-item label="年级：">
          <el-select v-model="searchParam.gradeIds" placeholder="">
            <el-option v-for="item in gradeArray" :key="item.code" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="性别：">
          <el-select v-model="searchParam.sex" placeholder="请选择">
            <el-option v-for="item in sexArray" :key="item.label" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="难度：">
          <el-select v-model="searchParam.difficulty" placeholder="请选择">
            <el-option v-for="item in difficultyArray" :key="item.label" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="search" class="btn">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="line"></div>

    <div style="margin: 30px;border: 3px #F0F0F0 solid">
      <el-table ref="multipleTable" :data="data.list" tooltip-effect="dark" style="width: 100%;" :header-cell-style="{color:'#525252', fontSize:'16px', backgroundColor: '#F8F8F8'}" @selection-change="handleSelectionChange">
        <el-table-column type="selection">
        </el-table-column>
        <el-table-column label="锻炼项目">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column prop="sportItemNames" label="运动项目">
        </el-table-column>
        <el-table-column prop="gradeNames" label="适合年级" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="sexName" label="适合性别" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="difficultyName" label="难度" show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </div>

    <el-row>
      <el-col style="text-align: center;">
        <el-button @click="close">取消</el-button>
        <el-button @click="confirm" type="primary">确认</el-button>
      </el-col>
    </el-row>

  </el-dialog>
</template>

<script>
export default {
  name: "AddHomeworkLib",
  data() {
    return {
      // 显示标记
      addHomeworkdialogVisible: false,
      // 数据容器
      data: {},
      // 查询参数
      searchParam: {
        name: "",
        sportItemNames: "",
        gradeIds: 0,
        sex: 0,
        difficulty: 0
      },

      gradeArray: [
        {
          code: 0,
          name: "全部"
        }
      ],
      sexArray: [
        {
          label: "全部",
          value: 0
        },
        {
          label: "男",
          value: 1
        },
        {
          label: "女",
          value: 2
        }
      ],
      difficultyArray: [
        {
          label: "全部",
          value: 0
        },
        {
          label: "高难度",
          value: 1
        },
        {
          label: "中难度",
          value: 2
        },
        {
          label: "低难度",
          value: 3
        }
      ],
      tableData3: [],
      multipleSelection: [],
      selectedData: [],
      tableSelectDatas: []
    };
  },
  methods: {
    show(data) {
      if (typeof data == "undefined") {
        this.selectedData = [];
      } else {
        this.selectedData = data;
      }
      // 清空已选数据
      this.multipleSelection = [];
      this.addHomeworkdialogVisible = true;
      this.getGradeUnion();
      // 如果上次已请求过数据，无需再请求
      if (this.data.list !== undefined) {
        this.data.list = [];
        // this.$refs.multipleTable.clearSelection()
      }
      this.search();
    },
    // 获取所有动作点
    getAllAction(name, sportItemNames, gradeIds, sex, difficulty) {
      var param = {
        pageNum: 1,
        pageSize: 100000,
        name: name,
        sportItemNames: sportItemNames,
        gradeIds: gradeIds,
        sex: sex,
        difficulty: difficulty
      };
      var that = this;
      var tableSelectDatas = [];
      // 每次获取新数据的时候将已选去掉
      this.multipleSelection = [];
      // 获取数据
      this.$store.dispatch("GetHomeworkLibList", param).then(response => {
        this.data = response.data;
        // 将之前已选置顶，并选中
        this.selectedData.forEach(function(e, index) {
          for (var i = 0; i < that.data.list.length; i++) {
            if (that.data.list[i].id === e.id) {
              var dd = that.data.list[i];
              tableSelectDatas.push(dd);
              that.data.list.splice(i, 1);
              that.data.list.unshift(dd);
              break;
            }
          }
        });
        this.tableSelectDatas = tableSelectDatas;
        // 需要加上setTimeout，否则不生效
        setTimeout(function() {
          that.check();
        }, 1);
      });
    },
    // 获取年级数据
    getGradeUnion() {
      this.$store.dispatch("gradeUnion").then(response => {
        this.gradeArray = response.data;
        this.gradeArray.unshift({
          code: 0,
          name: "全部"
        });
      });
    },
    search() {
      this.getAllAction(
        this.searchParam.name,
        this.searchParam.sportItemNames,
        this.searchParam.gradeIds,
        this.searchParam.sex,
        this.searchParam.difficulty
      );
    },
    close() {
      this.addHomeworkdialogVisible = false;
    },
    confirm() {
      this.addHomeworkdialogVisible = false;
      this.$parent.completeAddHomeworkLib(this.multipleSelection);
    },
    check() {
      this.tableSelectDatas.forEach(row => {
        this.$refs.multipleTable.toggleRowSelection(row);
      });
    },
    toggleSelection(rows) {
      rows.forEach(row => {
        this.$refs.multipleTable.toggleRowSelection(row);
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
};
</script>

<style scoped>
.line {
  width: 100%;
  border: 1px solid #eaf4ff;
  height: 3px;
}
</style>
