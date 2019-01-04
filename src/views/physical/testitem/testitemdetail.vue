<template>
  <div class="physical-content" v-loading="loading" element-loading-text="正在加载中">
    <section ref="printarea">
      <div class="personnelMsg">
        <el-row class="userMsg">
          <el-col :span="24">{{testItem.name}}</el-col>
        </el-row>
        <el-row class="userMsg_1">
          <el-col :span="6">
            <img class="icon_style" :src="image_sex">
            <span class="userMsg_val">性别:{{testItem.sex| formatter}}</span>
          </el-col>
          <el-col :span="6">
            <img class="icon_style" :src="image_year">
            <span class="userMsg_val">年龄：{{testItem.age}}</span>
          </el-col>
          <el-col :span="9">
            <img class="icon_style" :src="image_ban">
            <span class="userMsg_val">班级：{{testItem.schoolGradeName}}{{testItem.schoolClassName}}</span>
          </el-col>
          <el-col :span="3" class="test_btn">
            <el-button type="text" v-if="!showMore" @click="showMore=true">
              更多
              <i class="el-icon-arrow-down"></i>
            </el-button>
            <el-button type="text" v-if="showMore" @click="showMore=false">
              隐藏
              <i class="el-icon-arrow-up"></i>
            </el-button>
          </el-col>
        </el-row>
        <el-row class="userMsg_1" v-if="showMore">
          <el-col :span="12">
            <img class="icon_style" :src="image_id">
            <span class="userMsg_val">身份证：{{testItem.identityNo}}</span>
          </el-col>
          <el-col :span="12">
            <img class="icon_style" :src="image_xueji">
            <span class="userMsg_val">学籍状态：{{testItem.studentStatus | formatterStu}}</span>
          </el-col>
        </el-row>
        <el-row class="userMsg_1" v-if="showMore">
          <el-col :span="12">
            <img class="icon_style" :src="image_xuejihao">
            <span class="userMsg_val">学籍号： {{testItem.registerNumber}}</span>
          </el-col>
          <el-col :span="12">
            <img class="icon_style" :src="image_bangding">
            <span class="userMsg_val">家长绑定状态：{{testItem.parentBindingStatus | formatterPar}}</span>
          </el-col>
        </el-row>
        <el-row class="userMsg_1" v-if="showMore">
          <el-col :span="12">
            <img class="icon_style" :src="image_bangding_phone">
            <span class="userMsg_val">绑定手机：{{testItem.parentTel}}</span>
          </el-col>
        </el-row>
      </div>
      <el-row class="time">
        <el-col :span="24">体测时间: {{testItem.healthTestTime}}</el-col>
      </el-row>
      <div class="test_perform">
        <div :style="{backgroundImage:backgroundImage}" class="test_perform_img">
          <span class="test_perform_num">{{testItem.healthTestScore}}</span>
          <span style="font-size: 20px; color: #ffd649;">分</span>
          <span class="test_perform_num1">体侧成绩</span>
        </div>
        <div class="test_perform_duibi">
          <img class="icon_style" :src="imageNum">
          <span :class="numLableType">{{numLable}}</span>
          <span class="avgScore">平均分 ({{testItem.avgScore}}分）</span>
        </div>
      </div>
      <div class="assess">评估</div>
      <hr style="border:0.5px solid #C1DAFB;">
      <el-table :data="testItem.assessmentDtlList" width="100%" class="test_table">
        <el-table-column
          prop="name"
          label="项目"
          align="center"
          width="200"
          class-name="test_table_column"
        ></el-table-column>
        <el-table-column
          prop="appraise"
          label="评价"
          align="center"
          width="200"
          class-name="test_table_column"
        >
          <template slot-scope="scope">
            <span
              style="vertical-align: middle;font-size:14px;"
            >{{ formatterAppraise(scope.row.appraise).value[0] }}</span>
            <span
              :style="formatterAppraise(scope.row.appraise).style"
            >{{ formatterAppraise(scope.row.appraise).value[1] }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="advise"
          label="建议"
          align="center"
          min-width="180"
          class-name="test_table_column"
        ></el-table-column>
      </el-table>

      <div class="tes_zhidao" v-if="$route.query.type=='已关联' &&imgUrlArr.length>0">
        <h3>指导锻炼</h3>
        <template v-for="(item,index) in imgUrlArr">
          <div :key="index" class="tes_zhidao_img" @click="openDuidance(item)">
            <img class="icon_style" :src="item.coverUrl">
            <span class="tes_zhidao_name">{{item.name}}</span>
          </div>
        </template>
      </div>

      <el-collapse v-model="activeNames" @change="handleChange" class="custom">
        <el-collapse-item
          class="collapse"
          v-for="(ins,index) in testItem.physicalTestItemCategoryResponseBeanList"
          :key="index"
          :name="index"
        >
          <template slot="title">
            <span class="collapse-title-left">{{ins.categoryName}}</span>
            <span class="collapse-title-right">
              异常项:
              <span v-if="ins.exceptionTerm" style="color: #9C4F59;">{{ins.exceptionTerm}}</span>
              <span v-else>无</span>
            </span>
            <span class="collapse-title-right">
              缺测:
              <span v-if="ins.vacancyItem" style="color: #9C4F59;">{{ins.vacancyItem}}</span>
              <span v-else>无</span>
            </span>
          </template>
          <el-table
            :data="ins.physicalTestItemListResponseBeanList"
            width="100%"
            class="tableValue"
          >
            <el-table-column
              prop="name"
              label="项目"
              :formatter="formatterTableValue"
              align="center"
              min-width="150"
            ></el-table-column>
            <el-table-column label="结果" :formatter="formatterTableValue" align="center" width="140">
              <template slot-scope="scope" class="physical-unnormal">
                <div
                  v-bind:class="{'physical-unnormal':scope.row.resultInclination==2|| scope.row.resultInclination==3}"
                >
                  <span style="margin-left: 10px">{{ scope.row.result | formatterTableResult }}</span>
                  <span v-if="scope.row.resultInclination==2">↑</span>
                  <span v-else-if="scope.row.resultInclination==3">↓</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="referenceRange"
              label="参考范围"
              :formatter="formatterTableValue"
              align="center"
              width="170"
            ></el-table-column>
            <el-table-column
              prop="unit"
              label="单位"
              :formatter="formatterTableValue"
              align="center"
              width="140"
            ></el-table-column>
            <el-table-column
              prop="itemScore"
              label="成绩"
              :formatter="formatterTableValue"
              align="center"
              width="120"
            ></el-table-column>
            <el-table-column
              prop="level"
              label="等级"
              :formatter="formatterTableValue"
              align="center"
              width="150"
            ></el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </section>

    <el-row class="btn-div">
      <el-col :span="24">
        <el-button type="primary" class="save-btn" @click="goBalck">返回</el-button>
        <el-button type="primary" class="save-btn" @click="exportAction">导出</el-button>
        <el-button type="primary" class="save-btn" @click="printAction">打印</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Vue from "vue";
import "@/styles/common.scss";
import "@/views/physical/physical.scss";
import Print from "@/utils/print";
import { formatDate } from "@/utils/index";
import { getLevelName } from "@/views/physical/index.js";
import axios from "axios";
import { Message } from "element-ui";
import { getToken } from "@/utils/auth";

// 图片资源
import image_sex from "@/assets/imgs/icon_sex.png";
import image_year from "@/assets/imgs/icon_year.png";
import image_id from "@/assets/imgs/icon_id.png";
import image_ban from "@/assets/imgs/icon_ban.png";
import image_xueji from "@/assets/imgs/icon_xueji.png";
import image_xuejihao from "@/assets/imgs/icon_xuejihao.png";
import image_bangding from "@/assets/imgs/icon_bangding.png";
import image_bangding_phone from "@/assets/imgs/icon_bangding_phone.png";
import image_tice_score from "@/assets/imgs/icon_tice_score.png";
import icon_compare_high from "@/assets/imgs/icon_compare_high.png";
import icon_compare_equot from "@/assets/imgs/icon_compare_equot.png";
import icon_compare_low from "@/assets/imgs/icon_compare_low.png";

Vue.use(Print); // 注册

export default {
  data() {
    return {
      loading: true,
      backgroundImage:
        "url(" + require("@/assets/imgs/img_class_ala_bg.png") + ")",
      image_sex,
      image_year,
      image_id,
      image_ban,
      image_xueji,
      image_xuejihao,
      image_bangding,
      image_bangding_phone,
      image_tice_score,
      numLable: "",
      numLableType: "",
      imageNum: "",
      icon_compare_high,
      icon_compare_equot,
      icon_compare_low,
      activeNames: [],
      testItem: { healthTestScore: 0, avgScore: 0 },
      imgUrlArr: [],
      tableHeaderArray: ["项目", "结果", "参考范围", "单位", "成绩", "等级"],
      getLevelName: getLevelName,
      showMore: false
    };
  },
  filters: {
    formatter(val) {
      if (val == "1") {
        return "男";
      } else {
        return "女";
      }
    },
    formatterStu(val) {
      if (val == "1") {
        return "在读";
      } else {
        return "不在读";
      }
    },
    formatterPar(val) {
      if (val == "1") {
        return "绑定";
      } else {
        return "未绑定";
      }
    },
    formatterTableResult(val) {
      let value = val;
      if (val == null || val == "") {
        value = "-";
      }
      return value;
    }
  },
  name: "testItemDetail",
  methods: {
    goBalck() {
      this.$router.go(-1);
    },
    formatterTableValue(row, column, cellValue, index) {
      let value = cellValue;
      if (column.property == "itemScore") {
        if (cellValue == null){
          value = "-";
        }
      } else {
        if (cellValue == null || cellValue == "") {
          value = "-";
        } else {
          if (column.property == "level") {
            value = this.getLevelName(value);
          }
        }
      }
      return value;
    },
    handleChange(val) {},
    // 接口网络请求体测详情
    detailRequest() {
      var testItem = {
        id: this.$route.query.id
      };
      this.loading = true;
      this.$store
        .dispatch("GetTestItemDetail", testItem)
        .then(response => {
          this.loading = false;
          var time = response.data.healthTestTime.replace("T", " ");
          var b = formatDate(time, "yyyy-MM-dd");
          response.data.healthTestTime = b;
          this.testItem = response.data;
          this.testItem.healthTestTime = b;
          this.testItem.avgScore = response.data.avgScore || 0;
          if (this.testItem.healthTestScore > this.testItem.avgScore) {
            this.numLable = "大于";
            this.numLableType = "num_high";
            this.imageNum = this.icon_compare_high;
          } else if (this.testItem.healthTestScore == this.testItem.avgScore) {
            this.imageNum = this.icon_compare_equot;
            this.numLable = "等于";
            this.numLableType = "num_equot";
          } else {
            this.imageNum = this.icon_compare_low;
            this.numLable = "小于";
            this.numLableType = "num_low";
          }
          if (this.$route.query.type == "已关联") {
            getRecomData(this);
          }
        })
        .catch(res => {
          this.loading = false;
          this.$message.error("该学生不存在体测信息，三秒后返回上级页面");
          setTimeout(() => {
            this.$router.go(-1);
          }, 3000);
        });
    },
    openDuidance(row) {
      this.$router.push({
        path: "/duidanceDeyail",
        query: {
          id: row.id
        }
      });
    },
    formatterAppraise(value) {
      let value1;
      if (value.indexOf("肥胖") >= 0) {
        value1 = value.split("肥胖", 1);
        value1.push("肥胖");
        return {
          value: value1,
          style: {
            color: "#b93838",
            fontSize: "14px",
            verticalAlign: "middle"
          }
        };
      }
      if (value.indexOf("超重") >= 0) {
        value1 = value.split("超重", 1);
        value1.push("超重");
        return {
          value: value1,
          style: {
            color: "#4cca4d",
            fontSize: "14px",
            verticalAlign: "middle"
          }
        };
      }
      if (value.indexOf("标准") >= 0) {
        value1 = value.split("标准", 1);
        value1.push("标准");
        return {
          value: value1,
          style: {
            color: "#409eff",
            fontSize: "14px",
            verticalAlign: "middle"
          }
        };
      }
      if (value.indexOf("较轻") >= 0) {
        value1 = value.split("较轻", 1);
        value1.push("较轻");
        return {
          value: value1,
          style: {
            color: "#b93838",
            fontSize: "14px",
            verticalAlign: "middle"
          }
        };
      }
      if (value.indexOf("比较好") >= 0) {
        value1 = value.split("比较好", 1);
        value1.push("比较好");
        return {
          value: value1,
          style: {
            color: "#409eff",
            fontSize: "14px",
            verticalAlign: "middle"
          }
        };
      }
      if (value.indexOf("较好") >= 0) {
        value1 = value.split("较好", 1);
        value1.push("较好");
        return {
          value: value1,
          style: {
            color: "#409eff",
            fontSize: "14px",
            verticalAlign: "middle"
          }
        };
      }
      if (value.indexOf("一般") >= 0) {
        value1 = value.split("一般", 1);
        value1.push("一般");
        return {
          value: value1,
          style: {
            color: "#74d842",
            fontSize: "14px",
            verticalAlign: "middle"
          }
        };
      }
      if (value.indexOf("较差") >= 0) {
        value1 = value.split("较差", 1);
        value1.push("较差");
        return {
          value: value1,
          style: {
            color: "#b93838",
            fontSize: "14px",
            verticalAlign: "middle"
          }
        };
      }
    },
    // 打印
    printAction() {
      for (
        var i = 0;
        i < this.testItem.physicalTestItemCategoryResponseBeanList.length;
        i++
      ) {
        this.activeNames.push(i);
      }
      var that = this;
      var t;
      clearTimeout(t);
      t = setTimeout(function() {
        that.$print(that.$refs.printarea);
      }, 500);
    },
    // 导出
    exportAction() {
      let instance = axios.create({
        baseURL: process.env.BASE_API,
        timeout: 10000
        // headers: {
        //   'Authorization': getToken()
        // }
      });
      var that = this;
      var testItemId = this.$route.query.id;
      instance
        .get("/api/auth/v1/physical/testItem/export/" + testItemId)
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
              .get("/api/auth/v1/physical/testItem/export/" + testItemId)
              .then(function(response) {
                var blob = new Blob([response.data], {
                  type: "application/vnd.ms-excel"
                });
                var link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                link.download = that.testItem.name + "体测详情-导出.xls";
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
    }
  },
  mounted: function() {
    this.detailRequest();
    // getRecomData(this)
  }
};
function getRecomData(vm) {
  let params = { testItemId: vm.$route.query.id };
  vm.$store.dispatch("GetRecomData", params).then(response => {
    vm.imgUrlArr = response.data.recommendedGuidancePointBeanList;
  });
}
</script>
<style lang="scss" scoped>
.physical-content {
  position: relative;
}
.tableValue {
  margin-top: 15px;
}
.personnelMsg {
  width: 594px;
  background: #f0f0f0;
  border-radius: 10px;
  padding: 16px 16px 6px 24px;
  margin-bottom: 30px;
  .el-row {
    margin-bottom: 0px;
  }
  .userMsg {
    font-size: 30px;
    color: #1875f0;
    padding-bottom: 16px;
  }
  .userMsg_1 {
    font-size: 0px;
    height: 20px;
    line-height: 20px;
    margin-bottom: 16px;

    .icon_style {
      width: 16px;
      height: 16px;
      margin-right: 10px;
      vertical-align: middle;
    }
    .userMsg_val {
      font-size: 14px;
      color: #333333;
      vertical-align: middle;
    }
    .test_btn {
      .el-button {
        padding: 0px;
        line-height: 20px;
      }
    }
  }
}

.time {
  position: absolute;
  top: 26px;
  right: 40px;
  background: #f5f5f5;
  padding: 10px 20px;
  margin-top: 0px;
}
.test_perform {
  .test_perform_img {
    width: 305px;
    height: 172px;
    padding-top: 39px;
    text-align: center;
    font-size: 0px;
  }
  .test_perform_num {
    font-size: 60px;
    color: #ffd649;
  }
  .test_perform_num1 {
    display: inline-block;
    width: 100%;
    height: 20px;
    color: #e2e2e2;
    line-height: 20px;
    font-size: 16px;
  }
}
.test_perform_duibi {
  height: 56px;
  width: 305px;
  line-height: 56px;
  background: #f0f0f0;
  border-radius: 0 0 7px 7px;
  text-align: center;
  img {
    vertical-align: middle;
    margin-right: 5px;
  }
  .num_high {
    color: rgb(247, 77, 106);
    font-size: 23px;
    vertical-align: middle;
    margin-right: 5px;
  }
  .num_equot {
    color: rgb(48, 141, 32);
    font-size: 23px;
    vertical-align: middle;
    margin-right: 5px;
  }
  .num_low {
    color: rgb(33, 110, 210);
    font-size: 23px;
    vertical-align: middle;
    margin-right: 5px;
  }
  .avgScore {
    color: #666666;
    vertical-align: middle;
    height: 22px;
    line-height: 22px;
    display: inline-block;
    padding-top: 3px;
  }
}
.assess {
  font-size: 20px;
  margin-top: 30px;
}
.tes_zhidao {
  width: 100%;
  height: 274px;
  text-align: center;
  border-radius: 6px;
  background: #f5f5f5;
  h3 {
    margin: 0px;
    padding: 24px 26px;
    text-align: left;
  }
  .tes_zhidao_img {
    cursor: pointer;
    vertical-align: middle;
    width: 300px;
    height: 180px;
    display: inline-block;
    border-radius: 6px;
    position: relative;
    img {
      width: 300px;
      height: 180px;
      border-radius: 6px;
    }
    .tes_zhidao_name {
      position: absolute;
      bottom: 0px;
      width: 100%;
      left: 0px;
      height: 30px;
      line-height: 30px;
      background-color: #000000;
      opacity: 0.5;
      -moz-opacity: 0.5;
      -khtml-opacity: 0.5;
      color: white;
      border-radius: 0px 0px 6px 6px;
    }
  }
  .tes_zhidao_img + .tes_zhidao_img {
    margin-left: 20px;
  }
}
</style>
<style lang="scss">
.test_table {
  margin-bottom: 30px;
  th.test_table_column {
    background: #f0f0f0;
  }
}
</style>


