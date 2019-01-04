<template>
  <div>
    <el-radio-group v-model="equipmentHeader" style="margin-bottom: 10px;" @change="changeModel">
      <el-radio-button label="1">器材管理</el-radio-button>
      <el-radio-button label="2">器材统计</el-radio-button>
    </el-radio-group>

    <div class="search-form" style="margin-bottom: 10px;">
      <el-form :inline="true" :model="equipment" class ref="equipmentForm">
        <el-form-item label="学年:">
          <el-select v-model="equipment.date" placeholder="请选择" size="mini">
            <el-option
              v-for="item in schoolYearOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn" @click="search('equipmentForm')" size="mini">查询</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button
            v-if="havePermissionArr['addEquipment']"
            type="primary"
            @click="enterAddForm"
            class="btn"
            size="mini"
          >添加器材</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="primary" @click="importHandle" class="btn" size="mini">导入器材</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button
            v-if="havePermissionArr['updateEquipment']"
            type="primary"
            @click="enterEditForm"
            class="btn"
            size="mini"
          >编辑器材</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="equipment-list-content" v-if="equipment.equipmentData != null">
      <!--       打印部分  开始           -->
      <section ref="printarea">
        <el-row class="title-top">
          <el-col
            :span="24"
          >{{equipment.equipmentData.schoolYearStart}}-{{equipment.equipmentData.schoolYearEnd}}学年{{equipment.equipmentData.schoolName}}器材配置详情</el-col>
        </el-row>

        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item
            class="collapse custom"
            v-for="(ins,index) in equipment.equipmentData.schoolEquipmentCategoryList"
            :key="index"
            :name="index"
          >
            <template slot="title">
              <span class="collapse-title-left">{{ins.equipmentCategoryName}}</span>
            </template>

            <table class="table">
              <tbody>
                <tr>
                  <th v-for="(inss,index) in ['名称','实际配置数量','单位','备注']" :key="index">{{inss}}</th>
                </tr>
                <tr v-for="(inss,index) in ins.schoolEquipmentList" :key="index">
                  <td style="width: 15%;" v-if="inss.equipmentId != null">{{inss.equipmentName}}</td>
                  <td style="width: 15%;" v-else>{{inss.otherEquipment}}</td>
                  <td style="width: 15%;">{{inss.actualConfigQuantity}}</td>
                  <td style="width: 15%;">{{inss.unit}}</td>
                  <td style="width: 55%;">{{inss.remark}}</td>
                </tr>
              </tbody>
            </table>
          </el-collapse-item>
        </el-collapse>
      </section>
      <!--       打印部分  结尾           -->
      <el-row class="btn-div" style="text-align: right">
        <el-col :span="24">
          <el-button type="primary" @click="exportAction" class="save-btn" size="mini">导出</el-button>
          <el-button type="primary" @click="print" class="save-btn" size="mini">打印</el-button>
        </el-col>
      </el-row>

      <el-row style="padding-top: 120px;text-align: center;font-size: 10px;">
        <el-col :span="24">
          体育器材配置达标准参考
          <span
            style="color: #0077F0;    cursor: pointer;"
            @click="downDoc"
          >《国家学校体育卫生条件试行基本标准》（教体艺[2008]5号）》</span>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Print from "@/utils/print";
import { getToken } from "@/utils/auth";
import axios from "axios";
import { getSchoolYear } from "@/utils/index";
import { Message } from "element-ui";
import { isHavePermissions } from "@/utils/auth";

Vue.use(Print);

export default {
  name: "equipmentList",
  data() {
    return {
      equipmentHeader: 1,
      activeNames: [],
      // 学年容器
      schoolYearOptions: [],
      // 器材容器
      equipment: {
        date: "",
        equipmentData: null
      },
      havePermissionArr: {
        addEquipment: false,
        updateEquipment: false
      },
      permissionCode: ["addEquipment", "updateEquipment"]
    };
  },
  methods: {
    // 查询响应
    search(searchForm) {
      this.$refs[searchForm].validate(valid => {
        if (valid) {
          this.equipment.equipmentData = null;
          var schoolYearArray = this.equipment.date.split("-");
          var params = {
            schoolYearStart: schoolYearArray[0],
            schoolYearEnd: schoolYearArray[1]
          };
          this.$store.dispatch("Details", params).then(response => {
            this.equipment.equipmentData = response.data;
            for (
              var i = 0;
              i <
              this.equipment.equipmentData.schoolEquipmentCategoryList.length;
              i++
            ) {
              this.activeNames.push(i);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleChange(val) {},
    // 打印
    print() {
      this.$print(this.$refs.printarea);
    },
    // 导出按钮响应
    exportAction() {
      // console.log('导出器材')
      var schoolYearArray = this.equipment.date.split("-");
      var params = {
        schoolYearStart: schoolYearArray[0],
        schoolYearEnd: schoolYearArray[1]
      };
      let instance = axios.create({
        baseURL: process.env.BASE_API,
        timeout: 10000,
        headers: {
          Authorization: getToken()
        }
      });
      var that = this;
      instance
        .get(
          "/api/auth/v1/equipment/statistics/detail/export?schoolYearStart=" +
            params.schoolYearStart +
            "&schoolYearEnd=" +
            params.schoolYearEnd
        )
        .then(function(response) {
          if (response.data.status === undefined) {
            instance = axios.create({
              baseURL: process.env.BASE_API,
              timeout: 10000,
              headers: {
                Authorization: getToken()
              },
              responseType: "blob"
            });
            instance
              .get(
                "/api/auth/v1/equipment/statistics/detail/export?schoolYearStart=" +
                  params.schoolYearStart +
                  "&schoolYearEnd=" +
                  params.schoolYearEnd
              )
              .then(function(response) {
                var blob = new Blob([response.data], {
                  type: "application/vnd.ms-excel"
                });
                var link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                link.download =
                  that.equipment.equipmentData.schoolYearStart +
                  "-" +
                  that.equipment.equipmentData.schoolYearEnd +
                  "学年" +
                  that.equipment.equipmentData.schoolName +
                  "器材配置.xls";
                link.click();
              })
              .catch(function(error) {
                console.log(error);
              });
          } else {
            if (response.data.status.code === 500) {
              Message({
                message: response.data.status.msg,
                type: "error",
                duration: 2 * 1000
              });
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // 进入添加器材
    enterAddForm() {
      this.$router.push({ path: "equipmentForm" });
    },
    // 进入编辑器材
    enterEditForm() {
      this.routeLink = {
        path: "equipmentEditForm",
        query: {
          date: this.equipment.date
        }
      };
      this.$router.push(this.routeLink);
    },
    // 导入
    importHandle() {
      this.$router.push({ path: "equipmentImport" });
    },
    changeModel() {
      this.equipmentHeader = "1";
      this.$router.push("/equipmentManagement/equipmentStats");
    },
    downDoc() {
      let routeData = this.$router.resolve({
        name: "newPageHtml",
        query: { id: "teacherStats" }
      });
      window.open(routeData.href, "_blank");
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === "EquipmentEditForm" || to.name === "EquipmentForm") {
      var condition = JSON.stringify({
        date: this.equipment.date
      });
      localStorage.setItem("Equipment", condition);
    } else {
      localStorage.removeItem("Equipment");
    }
    next();
  },
  watch: {
    $route(to, form) {
      if (to.name == "EquipmentList" && to.params.type == "update") {
        this.equipment.date = to.params.date;
        this.search("equipmentForm");
      }
    }
  },
  mounted() {
    this.search("equipmentForm");

    this.permissionCode.forEach(val => {
      this.havePermissionArr[val] = isHavePermissions(val);
    });
  },
  created() {
    this.schoolYearOptions = getSchoolYear();

    var condition = localStorage.getItem("Equipment");
    if (condition != null) {
      var data = JSON.parse(condition);
      this.equipment.date = data.date;
    } else {
      // this.equipment.date = this.schoolYearOptions[this.schoolYearOptions.length - 1].value
      this.equipment.date = this.schoolYearOptions[0].value;
    }
  }
};
</script>


<style rel="stylesheet/scss" lang="scss" scoped>
.equipment-list-content {
  background-color: white;
  border-radius: 10px;
  padding: 25px;
}

.title {
  padding: 10px;
  font-size: 20px;
  text-align: center;
  font-weight: bold;
}
</style>
