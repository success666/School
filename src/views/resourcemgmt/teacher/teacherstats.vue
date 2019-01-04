<template>
  <div class="teacherstats">
    <div class="search-form">
      <el-form :inline="true" :model="teacher" class="">
        <el-form-item label="学年">
          <el-select v-model="teacher.schoolYear.value" placeholder="请选择" size="mini">
            <el-option v-for="item in teacher.schoolYear.data" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="教师姓名">
          <el-input v-model="teacher.name.value" placeholder="请输入教师姓名" size="mini">
          </el-input>
        </el-form-item>
        <el-form-item class="item_btn">
          <el-button type="primary" class="btn" size="mini" @click="getTeacherTotal" :disabled="loading||!this.teacher.schoolYear.value">查询</el-button>
          <el-button type="primary" class="btn" size="mini" @click="clearSearch">重置</el-button>
        </el-form-item>

      </el-form>
    </div>
    <div class="formContent" v-loading="loading" element-loading-text="拼命加载中">
      <h3 class="formContent_title title-top">{{titleValue}}
        <el-popover class="titlemessage" placement="right" width="280" trigger="click">
          <div class="titlemessage">
            <div>根据《国家学校体育卫生条件试行基本标准》进行统计</div>
          </div>
          <span slot="reference" class="shuoming">?</span>
        </el-popover>
      </h3>
      <div class="formContent_pie">
        <div class="todetail" @click="toTeacherList"><span>详情>></span></div>
        <div id="charts">
        </div>
        <div class="showValue">
          <span class="showValue_title">达标率</span>
          <span class="showValue_value">{{formValue.standard}}</span>
        </div>
        <div class="hasTeacher">
          <span>已有体育教师：</span>
          <span style="color: #1983f1;">{{formValue.existPhyEduTeacher}}位</span>
        </div>
        <div class="hasTeacher">
          <span>暂缺体育教师：</span>
          <span style="color:red">{{formValue.lackPhyEduTeacher==null ? 0:formValue.lackPhyEduTeacher}}位</span>
        </div>
      </div>
      <div class="formContent_table">
        <el-row v-if="formValue.schoolTypeName=='小学'">
          <el-col :span="24">小学学校</el-col>
          <el-col :span="16">各年级对应班级数量</el-col>
          <el-col :span="8">配备体育教师数量</el-col>
          <el-col :span="8">1~2年级</el-col>
          <el-col :span="8">每5~6个班级</el-col>
          <el-col :span="8">至少一名</el-col>
          <el-col :span="8">3~6年级</el-col>
          <el-col :span="8">每5~6个班级</el-col>
          <el-col :span="8">至少一名</el-col>
        </el-row>
        <el-row v-if="formValue.schoolTypeName=='初级中学'">
          <el-col :span="24">初中学校</el-col>
          <el-col :span="16">各年级对应班级数量</el-col>
          <el-col :span="8">配备体育教师数量</el-col>
          <el-col :span="8">初一~初三年级</el-col>
          <el-col :span="8">每6~7个班级</el-col>
          <el-col :span="8">至少一名</el-col>
        </el-row>
        <el-row v-if="formValue.schoolTypeName=='高中'">
          <el-col :span="24">高中学校</el-col>
          <el-col :span="16">各年级对应班级数量</el-col>
          <el-col :span="8">配备体育教师数量</el-col>
          <el-col :span="8">高一~高三年级</el-col>
          <el-col :span="8">每8~8个班级</el-col>
          <el-col :span="8">至少一名</el-col>
        </el-row>
        <el-row v-if="formValue.schoolTypeName=='农村学校'">
          <el-col :span="24">农村中小学校</el-col>
          <el-col :span="16">学校学生总人数</el-col>
          <el-col :span="8">配备体育教师数量</el-col>
          <el-col :span="16">总人数>200</el-col>
          <el-col :span="8">至少一名</el-col>
        </el-row>
      </div>
      <el-row class="footer">
        <el-col :span="24">
          <span>体育师资配置达标标准参考</span>
          <span class="getdoc" @click="downDoc">《国家学校体育卫生条件试行基本标准》（教体艺[2008]5号）</span>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import request from "@/utils/request";
import { getSchoolYear } from "@/utils/index";
import { mapGetters } from "vuex";
import echarts from "echarts";
export default {
  computed: {
    ...mapGetters([
      "teacherstats"
      // ...
    ])
  },
  data() {
    return {
      teacherModel: "2",
      teacher: {
        schoolYear: { value: "", data: [] },
        name: { value: "" }
      },
      tableData: [],
      loading: false,
      formValue: {
        existPhyEduTeacher: "",
        lackPhyEduTeacher: "",
        posCityName: "",
        posDistrictName: "",
        posProvinceName: "",
        schoolName: "",
        schoolTypeName: "",
        schoolYearEnd: "",
        schoolYearStart: ""
      },
      titleValue: "",
      docName: "",
      docUrl: ""
    };
  },
  methods: {
    clearSearch() {
      for (let name in this.teacher) {
        this.teacher[name].value = "";
      }
      this.teacher.schoolYear.value = this.teacher.schoolYear.data[0].value;
    },
    toTeacherList() {
      this.$router.push({
        name: `teacherStatsList`,
        params: {
          schoolYear: this.teacher.schoolYear.value,
          schoolName: this.formValue.schoolName,
          type: "update"
        }
      });
    },
    downDoc() {
      let routeData = this.$router.resolve({
        name: "newPageHtml",
        query: { id: "teacherStats" }
      });
      window.open(routeData.href, "_blank");
    },
    getTeacherTotal: getTeacherTotal
  },
  watch: {
    $route(to, from) {
      if (
        typeof to.params.type != "undefined" &&
        to.params.type == "update" &&
        to.name == "teacherStats"
      ) {
        let searchData = this.$route.params;
        for (let name in searchData) {
          if (this.teacher[name]) {
            this.teacher[name].value = searchData[name];
          }
        }
        this.getTeacherTotal();
      }
    }
  },
  mounted() {
    this.teacher.schoolYear.data = getSchoolYear();
    let searchData = this.$route.params;
    for (let name in searchData) {
      if (this.teacher[name]) {
        this.teacher[name].value = searchData[name];
      }
    }
    if (!this.teacher.schoolYear.value) {
      this.teacher.schoolYear.value = this.teacher.schoolYear.data[0].value;
    }
    this.pieCharts = echarts.init(document.getElementById("charts"));
    this.getTeacherTotal();
  }
};
function getTeacherTotal() {
  console.log(1);
  if (this.teacher.name.value == "") {
    this.loading = true;
    request
      .get("/api/auth/v1/teacher/stats/total", {
        params: {
          schoolYear: this.teacher.schoolYear.value
        }
      })
      .then(res => {
        this.$store.dispatch("setTeacherStats", {
          schoolYear: this.teacher.schoolYear.value
        });
        for (let name in res.data) {
          if (typeof this.formValue[name] != "undefined") {
            this.formValue[name] = res.data[name];
          }
        }
        this.titleValue =
          this.formValue.schoolYearStart +
          "-" +
          this.formValue.schoolYearEnd +
          "学年" +
          this.formValue.schoolName +
          "体育师资配置达标统计";
        let existPhyEduTeacher =
          this.formValue.existPhyEduTeacher == null
            ? 0
            : this.formValue.existPhyEduTeacher;
        let lackPhyEduTeacher =
          this.formValue.lackPhyEduTeacher == null
            ? 0
            : this.formValue.lackPhyEduTeacher;
        this.formValue.standard = 0;
        if (existPhyEduTeacher + lackPhyEduTeacher > 0) {
          this.formValue.standard =
            Math.round(
              (existPhyEduTeacher / (existPhyEduTeacher + lackPhyEduTeacher)) *
                10000
            ) /
              100 +
            "%";
        }
        this.loading = false;
        let data = [
          {
            value: existPhyEduTeacher,
            name: "达标率",
            itemStyle: { color: "#2c82da" }
          },
          {
            value: lackPhyEduTeacher,
            name: "未达标率",
            itemStyle: { color: "#CCCCCC" }
          }
        ];
        creatEcharts(this, data);
      })
      .catch(() => {});
  } else {
    request
      .get("/api/auth/v1/teacher/stats/teacherDtl", {
        params: {
          schoolYear: this.teacher.schoolYear.value,
          name: this.teacher.name.value
        }
      })
      .then(res => {
        if (res.data != null) {
          this.$router.push({
            path: "/teacherManagement/TeacherDetail",
            query: {
              teacherId: res.data.id
            }
          });
        } else {
          this.$message({
            message: "不存在姓名为：" + this.teacher.name.value + "的老师",
            type: "error"
          });
        }
      });
  }
}
function creatEcharts(vm, data) {
  let option = {
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}:  {d}%"
    },
    series: [
      {
        name: "师资统计",
        type: "pie",
        radius: ["50%", "90%"],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: false,
            position: "center"
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        data: data
      }
    ]
  };
  vm.pieCharts.setOption(option);
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.item_btn {
  float: right;
}
.formContent {
  padding: 20px;
  box-sizing: border-box;
  background: white;
  min-height: 400px;
  margin-top: 10px;
  border-radius: 5px;
  .formContent_title {
    line-height: 27px;
    text-align: center;
  }
  .formContent_pie {
    border-radius: 5px;
    width: 300px;
    height: 350px;
    margin: auto;
    background-color: #f0f0f0;
    position: relative;
    margin-bottom: 20px;
    .todetail {
      display: inline-block;
      padding-right: 5px;
      width: 100%;
      text-align: right;
      line-height: 20px;
      font-size: 14px;
      color: #2e89e6;
      padding-top: 10px;
      span {
        cursor: pointer;
        &:hover {
          color: #146290;
        }
      }
    }
    #charts {
      width: 250px;
      height: 250px;
      margin-left: 20px;
    }
    .showValue {
      position: absolute;
      top: 125px;
      left: 95px;
      width: 100px;
      text-align: center;
      .showValue_title {
        display: block;
        font-size: 16px;
        margin-bottom: 10px;
      }
      .showValue_value {
        display: block;
        font-size: 22px;
        color: #2c82da;
      }
    }
    .hasTeacher {
      text-align: center;
      margin-bottom: 10px;
    }
  }
  .formContent_table {
    width: 600px;
    margin: auto;
    .el-row {
      border: 1px solid #268df994;
      .el-col {
        border-radius: 0px;
        line-height: 31px;
        text-align: center;
        border-bottom: 1px solid;
        border: 0.5px solid #268df994;
      }
    }
  }
  .footer {
    font-size: 12px;
    text-align: center;
    padding-top: 20px;
    margin-bottom: 0px;
    .getdoc {
      color: rgb(3, 76, 150);
      cursor: pointer;
      &:hover {
        color: #0c5cbf;
      }
    }
  }
}

.shuoming {
  display: inline-block;
  width: 18px;
  height: 18px;
  background: #c8cace;
  line-height: 18px;
  font-size: 14px;
  color: white;
  border-radius: 12px;
  vertical-align: middle;
  cursor: pointer;
}
.el-popper {
  width: 300px !important;
}
</style>


