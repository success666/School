<template>
    <div class="teacherStatsList">
        <h3 class="title-top">{{titleName}}</h3>
        <div class="teacherStatsList-table">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="name" label="姓名" width="180" align="center">
                </el-table-column>
                <el-table-column prop="sexVal" label="性别" width="180" align="center">
                </el-table-column>
                <el-table-column prop="teacherProfessionalTitleName" label="职称" width="180" align="center">
                </el-table-column>
                <el-table-column prop="gradeClassNames" label="任教班级" align="center">
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleDetail( scope.row)">查看</el-button>

                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
import request from "@/utils/request";
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters([
      "teacherstatslist"
      // ...
    ])
  },
  data() {
    return {
      titleName: "asdasdasdasd",
      tableData: []
    };
  },
  methods: {
    handleDetail(row) {
      this.$router.push({
        path: "/teacherManagement/TeacherDetail",
        query: {
          teacherId: row.id
        }
      });
    },
    getFormData(params) {
      request
        .get("/api/auth/v1/teacher/stats/list", {
          params
        })
        .then(res => {
          this.tableData = res.data.list;
        });
    }
  },
  watch: {
    $route(to, from) {
      if (typeof to.params.type != "undefined" && to.params.type == "update") {
        let params1 = {
          pageNum: 1,
          pageSize: 100,
          schoolYear: to.params.schoolYear
        };
        this.getFormData(params1);
      }
    }
  },
  mounted() {
    let params = this.$route.params;
    this.titleName =
      params.schoolYear + "学年" + params.schoolName + "师资统计列表";
    let params1 = { pageNum: 1, pageSize: 100, schoolYear: params.schoolYear };
    this.getFormData(params1);
  }
};
</script>
<style lang="scss" scoped>
.teacherStatsList {
  background-color: #ffffff;
  padding: 20px;
  padding-bottom: 5px;
  border-radius: 8px;
  min-height: 600px;
  h3 {
    line-height: 40px;
    text-align: center;
    margin: 0px;
    margin-bottom: 20px;
  }
}
</style>


