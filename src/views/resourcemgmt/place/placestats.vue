<template>
    <div class="placeStats">
        <el-radio-group v-model="placeModel" style="margin-bottom: 10px;" @change="changeRouter">
            <el-radio-button label="1">场地管理</el-radio-button>
            <el-radio-button label="2">场地统计</el-radio-button>
        </el-radio-group>
        <div class="search">
            <el-row>
                <el-col :span="5">
                    <span class="search_label">学年</span>
                    <el-select class="search_value" v-model="search.schoolYear.value" placeholder="请选择" size="mini">
                        <el-option
                        v-for="item in search.schoolYear.data"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="4" class="search_btn">
                    <el-button type="primary" size="mini" @click="getDataList">查询</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="placestatsContent" >
          <div ref="printarea">
            <h3 class="title-top">{{titleValue}}
                <el-popover class="titlemessage"
                  placement="right"
                  width="280"
                  trigger="click">
                  <div class="titlemessage">
                    <div>根据《国家学校体育卫生条件试行基本标准》进行统计</div>
                  </div>
                  <span slot="reference" class="shuoming">?</span>
                </el-popover>
            </h3>
            <el-row class="gradeNumber">
                <el-col :span="24">
                    <img src="../../../assets/imgs/icon_sourse_area_ban.png"/>
                    <span>班级总数：{{formData.classConfigQuantity}}班</span>
                </el-col>
            </el-row>
            <div v-if="showDetail">
                <div class="palic_value" >
                    <div class="square" @click="showDetail=false" v-for="(item,index) in placeArr" :key="index"  :class="item.class">
                        <el-col :span="24" class="square_head">
                            <span class="radius-a spanleft"></span><span class="radius-b spanleft"></span><span class="radius-c spanleft"></span>
                            {{item.fieldName}}
                            <span class="radius-c spanright"></span><span class="radius-b spanright"> </span><span class="radius-a spanright"></span>
                        </el-col>
                        <el-col :span="24"   class="square_content">
                            <div class="semicircle">
                              <img :src="item.imgSrc"/>
                            </div>
                            <span v-if="item.missConfigQuantity>0">暂缺：</span>
                            <span v-if="item.missConfigQuantity==0">已达标：</span>
                            <span v-if="item.fieldName.indexOf('器械体操')>=0 && item.missConfigQuantity>0" >{{item.missConfigQuantity}}平方米</span>
                            <span v-if="item.fieldName.indexOf('器械体操')<0 &&item.missConfigQuantity>0">{{item.missConfigQuantity}}块</span>
                            <span v-if="item.missConfigQuantity==0">{{item.actualConfigQuantity}}</span>
                        </el-col>
                        <el-col :span="24" class="square_foot">
                            <span>达标值:</span>
                            <span>{{item.standardConfigQuantity}}</span>
                            <span :title="item.specifications" class="title1">?</span>
                        </el-col>
                    </div>
                </div>
                <div  v-bind:class="{ active: tableData.columns.length==4 }" class="square_table">
                    <el-table :data="tableData.data" border
                        style="width: 100%">
                        <el-table-column
                            prop="place" align="center"
                            label="运动场地类别"
                            width="150">
                        </el-table-column>
                        <el-table-column :label="tableData.title"  align="center">
                            <el-table-column  align="center" v-for="(item,index) in tableData.columns"
                                    v-bind="item" :key="index">
                            </el-table-column>


                        </el-table-column>
                    </el-table>
                </div>
                <el-row class="down-foot">
                  <el-col :span="24">
                    <span>体育场地配置达标准参考</span>
                    <span class="downDoc" @click="downDoc">《国家学校体育卫生条件试行基本标准》(教体艺[2008]5号)</span>
                  </el-col>
                </el-row>
            </div>
            <div v-else>
                <el-table :data="schoolFieldDetailList"  border
                        style="width: 100%">
                    <el-table-column
                            prop="fieldName" align="center"
                            label="场地类型"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            prop="specifications" align="center"
                            label="规格型号功能"
                            width="410">
                    </el-table-column>
                    <el-table-column
                            prop="standardConfigQuantity" align="center"
                            label="达标值"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            prop="actualConfigQuantity" align="center"
                            label="实际数量"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            prop="isStandard" align="center"
                            label="是否达标"
                            width="150">
                    </el-table-column>

                </el-table>
            </div>
          </div>
          <el-row v-if="!showDetail" >
              <el-col :span="24" style="text-align: center;margin-top:20px;">
                  <el-button @click="showDetail=true" type="primary" size="mini">返回</el-button>
                   <el-button @click="exportData" type="primary" size="mini">导出</el-button>
                        <el-button @click="printAction" type="primary" size="mini">打印</el-button>
                    </el-col>
          </el-row>
        </div>
    </div>
</template>
<script>
import { getSchoolYear } from "@/utils/index";
import Print from "@/utils/print";
import { BASE_API } from "../../../../config/prod.env";
import axios from "axios";
import { getToken, isHavePermissions } from "@/utils/auth";
import request from "@/utils/request";
export default {
  created() {
    this.search.schoolYear.data = getSchoolYear();
    this.search.schoolYear.value = this.search.schoolYear.data[0].value;
    this.getDataList();
    this.tableData = this.highSchool;
  },
  data() {
    return {
      placeModel: "2",
      search: {
        schoolYear: { value: "", data: [] }
      },
      placeArr: [],
      showDetail: true,
      schoolFieldDetailList: [],
      titleValue: "",
      schoolName: "小学",
      formData: {
        cityName: "",
        classConfigQuantity: "",
        districtName: "",
        provinceName: "",
        schoolName: "",
        schoolTypeName: "",
        schoolYearEnd: "",
        schoolYearStart: ""
      },
      tableData: {
        title: "",
        columns: [],
        data: []
      },
      athletics: {
        actualConfigQuantity: "",
        missConfigQuantity: "",
        specifications: "",
        standardConfigQuantity: "",
        fieldName: ""
      },
      basketball: {
        actualConfigQuantity: "",
        missConfigQuantity: "",
        specifications: "",
        standardConfigQuantity: "",
        fieldName: ""
      },
      volleyball: {
        actualConfigQuantity: "",
        missConfigQuantity: "",
        specifications: "",
        standardConfigQuantity: "",
        fieldName: ""
      },
      playground: {
        actualConfigQuantity: "",
        missConfigQuantity: "",
        specifications: "",
        standardConfigQuantity: "",
        fieldName: ""
      },
      primarySchool: {
        title: "小学",
        columns: [
          { label: "≤18班", prop: "eighteen", width: "150" },
          { label: "24班", prop: "twentyFour", width: "150" },
          { label: "30班以上", prop: "thirty", width: "200" }
        ],
        data: [
          {
            place: "田径场（块）",
            eighteen: "200米(环形)1块",
            twentyFour: "300米(环形)1块",
            thirty: "300~400米(环形)1块"
          },
          {
            place: "篮球场（块）",
            eighteen: "2",
            twentyFour: "2",
            thirty: "3"
          },
          {
            place: "排球场（块）",
            eighteen: "1",
            twentyFour: "2",
            thirty: "2"
          },
          {
            place: "器械体操+游戏区",
            eighteen: "200平方米",
            twentyFour: "300平方米",
            thirty: "300平方米"
          }
        ]
      },
      juniorMiddleSchool: {
        title: "初级中学",
        columns: [
          { label: "≤18班", prop: "eighteen", width: "150" },
          { label: "24班", prop: "twentyFour", width: "150" },
          { label: "30班以上", prop: "thirty", width: "200" }
        ],
        data: [
          {
            place: "田径场（块）",
            eighteen: "200米(环形)1块",
            twentyFour: "300米(环形)1块",
            thirty: "300~400米(环形)1块"
          },
          {
            place: "篮球场（块）",
            eighteen: "2",
            twentyFour: "2",
            thirty: "3"
          },
          {
            place: "排球场（块）",
            eighteen: "1",
            twentyFour: "2",
            thirty: "2"
          },
          {
            place: "器械体操",
            eighteen: "100平方米",
            twentyFour: "150平方米",
            thirty: "200平方米"
          }
        ]
      },
      NineSchool: {
        title: "九年制学校",
        columns: [
          { label: "≤18班", prop: "eighteen", width: "150" },
          { label: "27班", prop: "twentyFour", width: "150" },
          { label: "35班以上", prop: "thirty", width: "200" }
        ],
        data: [
          {
            place: "田径场（块）",
            eighteen: "200米(环形)1块",
            twentyFour: "300米(环形)1块",
            thirty: "300~400米(环形)1块"
          },
          {
            place: "篮球场（块）",
            eighteen: "2",
            twentyFour: "3",
            thirty: "3"
          },
          {
            place: "排球场（块）",
            eighteen: "1",
            twentyFour: "2",
            thirty: "3"
          },
          {
            place: "器械体操+游戏区",
            eighteen: "200平方米",
            twentyFour: "300平方米",
            thirty: "350平方米"
          }
        ]
      },
      allSchool: {
        title: "完全中学",
        columns: [
          { label: "≤18班", prop: "eighteen", width: "150" },
          { label: "24班", prop: "twentyFour", width: "150" },
          { label: "30班", prop: "thirty", width: "200" },
          { label: "36班以上", prop: "thirtySix", width: "200" }
        ],
        data: [
          {
            place: "田径场（块）",
            eighteen: "300米(环形)1块",
            twentyFour: "300米(环形)1块",
            thirty: "300米(环形)1块",
            thirtySix: "400米(环形)1块"
          },
          {
            place: "篮球场（块）",
            eighteen: "2",
            twentyFour: "2",
            thirty: "3",
            thirtySix: "3"
          },
          {
            place: "排球场（块）",
            eighteen: "1",
            twentyFour: "2",
            thirty: "2",
            thirtySix: "3"
          },
          {
            place: "器械体操+游戏区",
            eighteen: "100平方米",
            twentyFour: "150平方米",
            thirty: "200平方米",
            thirtySix: "200平方米"
          }
        ]
      },
      highSchool: {
        title: "高级中学（含中等职业学校）",
        columns: [
          { label: "≤18班", prop: "eighteen", width: "150" },
          { label: "24班", prop: "twentyFour", width: "150" },
          { label: "30班", prop: "thirty", width: "200" },
          { label: "36班以上", prop: "thirtySix", width: "200" }
        ],
        data: [
          {
            place: "田径场（块）",
            eighteen: "300米(环形)1块",
            twentyFour: "300米(环形)1块",
            thirty: "300米(环形)1块",
            thirtySix: "400米(环形)1块"
          },
          {
            place: "篮球场（块）",
            eighteen: "2",
            twentyFour: "2",
            thirty: "3",
            thirtySix: "3"
          },
          {
            place: "排球场（块）",
            eighteen: "1",
            twentyFour: "2",
            thirty: "2",
            thirtySix: "3"
          },
          {
            place: "器械体操+游戏区",
            eighteen: "100平方米",
            twentyFour: "150平方米",
            thirty: "200平方米",
            thirtySix: "200平方米"
          }
        ]
      }
    };
  },
  methods: {
    changeRouter() {
      this.$router.push({
        path: "placelist"
      });
    },
    // 打印
    printAction() {
      var that = this;
      var t;
      this.noprint = "noprint";
      this.printWidth = "print-width";
      clearTimeout(t);
      t = setTimeout(function() {
        that.$print(that.$refs.printarea);
        that.noprint = "";
        that.printWidth = "";
      }, 500);
    },
    exportData() {
      let schoolYearStart = this.search.schoolYear.value.split("-")[0];
      let schoolYearEnd = this.search.schoolYear.value.split("-")[1];
      let params = {
        schoolYearStart: schoolYearStart,
        schoolYearEnd: schoolYearEnd
      };
      let instance = axios.create({
        baseURL: process.env.BASE_API,
        timeout: 1000,
        headers: {
          Authorization: getToken()
        },
        responseType: "blob"
      });
      let that = this;
      instance
        .get(
          "/api/auth/v1/field/statistics/detail/export?schoolYearStart=" +
            schoolYearStart +
            "&schoolYearEnd=" +
            schoolYearEnd
        )
        .then(function(response) {
          let fileName = response.headers["content-disposition"];
          let blob = new Blob([response.data], {
            type: "application/vnd.ms-excel"
          });
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = that.titleValue + "场地配置详情.xls";
          link.click();
        })
        .catch(function(error) {
          if (error.response) {
            // 存在请求，但是服务器的返回一个状态码
            console.log(error.response);
          } else {
            // 一些错误是在设置请求时触发的
            console.log("Error", error.message);
          }
          console.log(error.config);
        });
    },
    downDoc() {
      let routeData = this.$router.resolve({
        name: "newPageHtml",
        query: { id: "teacherStats" }
      });
      window.open(routeData.href, "_blank");
    },
    getDataList: getDataList
  }
};
function getDataList() {
  let schoolYearStart = this.search.schoolYear.value.split("-")[0];
  let schoolYearEnd = this.search.schoolYear.value.split("-")[1];
  let params = {
    schoolYearStart: schoolYearStart,
    schoolYearEnd: schoolYearEnd
  };
  request
    .get("/api/auth/v1/field/statistics", {
      params
    })
    .then(res => {
      let data = res.data;
      for (let name in this.formData) {
        if (typeof data[name] != "undefined") {
          this.formData[name] = data[name];
        }
      }
      this.titleValue =
        data.schoolYearStart +
        "-" +
        data.schoolYearEnd +
        "学年" +
        data.schoolName +
        "体育场地配置达标统计";
      this.schoolFieldDetailList = res.data.schoolFieldDetailList;
      let schoolFieldDetailList = res.data.schoolFieldDetailList;
      let reachArr = [],
        unreachArr = [];
      for (let i = 0; i < schoolFieldDetailList.length; i++) {
        let item = schoolFieldDetailList[i];
        switch (item.fieldName) {
          case "田径场":
            item.class = "imggum";
            item.imgSrc = require("../../../assets/imgs/icon_gum.png");
            if (item.missConfigQuantity > 0) {
              item.class += " redColor";
            }
            break;
          case "篮球场":
            item.class = "imgbasketball";
            item.imgSrc = require("../../../assets/imgs/icon_basketball.png");
            if (item.missConfigQuantity > 0) {
              item.class += " redColor";
            }
            break;
          case "排球场":
            item.class = "imgvolleyball";
            item.imgSrc = require("../../../assets/imgs/icon_volleyball.png");
            if (item.missConfigQuantity > 0) {
              item.class += " redColor";
            }
            break;
          case "器械体操":
          case "器械体操+游戏区":
            item.class = "imggame";
            item.imgSrc = require("../../../assets/imgs/icon_game.png");
            if (item.missConfigQuantity > 0) {
              item.class += " redColor";
            }
            break;
        }
        if (item.missConfigQuantity > 0) {
          unreachArr.push(item);
        } else {
          reachArr.push(item);
        }
      }
      this.placeArr = unreachArr.concat(reachArr);
      switch (res.data.schoolTypeName) {
        case "小学":
          this.tableData = this.primarySchool;
          break;
        case "九年制学校":
          this.tableData = this.NineSchool;
          break;
        case "初级中学":
          this.tableData = this.juniorMiddleSchool;
          break;
        case "完全中学":
          this.tableData = this.allSchool;
          break;
        case "高级中学":
          this.tableData = this.highSchool;
          break;
      }
    });
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.search {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 18px 15px;
  margin-bottom: 10px;
  font-size: 0px;
  .search_label {
    color: #6b6b6b;
    font-family: "PingFang SC";
    display: inline-block;
    width: 40px;
    line-height: 27px;
    font-size: 14px;
    font-weight: 600;
    margin-right: 5px;
    vertical-align: middle;
    text-align: right;
  }
  .search_value {
    width: calc(100% - 45px);
    vertical-align: middle;
  }
  .search_btn {
    padding-left: 10px;
    text-align: left;
  }
}
.placestatsContent {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 15px;
  position: relative;
  min-height: 600px;
  h3 {
    text-align: center;
    line-height: 32px;
  }
  .gradeNumber {
    text-align: center;
    img {
      vertical-align: middle;
    }
    span {
      height: 20px;
      line-height: 20px;
      display: inline-block;
      vertical-align: middle;
      color: #4c9ef0;
      margin-left: 5px;
      font-size: 18px;
      font-weight: bold;
    }
  }
  .palic_value {
    width: 621px;
    margin: auto;
    overflow: auto;
    padding-top: 10px;
    .square {
      cursor: pointer;
      width: 283px;
      height: 168px;
      float: left;
      margin-left: 10px;
      border: 1px solid #cccccc;
      border-radius: 10px;
      margin-bottom: 25px;
      box-sizing: border-box;
      box-shadow: 0px 0px 10px #4c9ef0;
      &:nth-child(even) {
        margin-left: 40px;
      }
      .square_head {
        line-height: 40px;
        text-align: center;
        font-size: 18px;
        .spanleft {
          background-color: #4c9ef0;
          vertical-align: middle;
          margin-right: 5px;
        }
        .spanright {
          background-color: #4c9ef0;
          vertical-align: middle;
          margin-left: 5px;
        }
        .radius-a {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 3px;
        }
        .radius-b {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 5px;
        }
        .radius-c {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 5px;
        }
      }
      .redColor {
        background: red;
      }
      .square_content {
        text-align: center;
        font-size: 25px;
        line-height: 80px;
        height: 80px;
        color: #4c9ef0;
        .semicircle {
          display: block;
          height: 80px;
          width: 40px;
          float: left;
          background: #4c9ef0;
          border-radius: 0px 40px 40px 0px;
          img {
            margin-left: -6px;
            margin-top: 23px;
          }
        }
      }
      .square_foot {
        padding: 5px 0px;
        text-align: center;
        color: #424040;
        font-size: 12px;
        .title1 {
          display: inline-block;
          width: 20px;
          height: 20px;
          text-align: center;
          line-height: 20px;
          border-radius: 10px;
          font-size: 16px;
          font-weight: bold;
          color: white;
          background-color: #e6a23c;
          vertical-align: middle;
          cursor: pointer;
        }
      }
    }
    .square1 {
      margin-left: 40px;
    }
    .redColor {
      box-shadow: 0px 0px 10px #ff7b97 !important;
      .spanleft,
      .spanright {
        background-color: #ff7b97 !important;
      }
      .square_content {
        color: #ff7b97 !important;

        .semicircle {
          background: #ff7b97 !important;
        }
      }
    }
  }
  .square_table_label {
    margin: 30px 0px;
    margin-left: -15px;
    span {
      padding: 10px 0px 10px 20px;
      background-color: #827c7cc4;
      color: #fff;
      width: 255px;
      display: inline-block;
      font-size: 12px;
    }
  }
  .square_table {
    width: 650px;
    margin: auto;
    margin-bottom: 30px;
  }
  .active {
    width: 850px;
  }
}
.down-foot {
  position: absolute;
  bottom: 10px;
  width: 100%;
  line-height: 30px;
  margin-top: 20px;
  text-align: center;
  font-size: 12px;
  .downDoc {
    color: #409eff;
    cursor: pointer;
    &:hover {
      color: #065db7;
    }
  }
}

.imggum {
  background-image: url(../../../assets/imgs/icon_sourse_area_gum_bg.png);
}
.imgvolleyball {
  background-image: url(../../../assets/imgs/icon_sourse_area_volleyball_bg.png);
}
.imggame {
  background-image: url(../../../assets/imgs/icon_sourse_area_game_bg.png);
}
.imgbasketball {
  background-image: url(../../../assets/imgs/icon_sourse_area_basketball_bg.png);
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
<style lang="scss">
.placeStats {
  .el-table {
    td,
    th {
      padding: 10px 0px;
      border-right: 1px solid #ebeef5 !important;
      border-bottom: 1px solid #ebeef5 !important;
    }
    .el-table__header {
      th {
        background: none;
      }
    }
  }
}
</style>



