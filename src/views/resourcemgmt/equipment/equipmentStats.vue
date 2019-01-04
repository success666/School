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
          <el-button type="primary" class="btn" @click="toDetailList" size="mini">详情</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="search-form" style="margin-bottom: 15px;">
      <!--<h3>{{schoolYear}}学年{{datas.provinceName}}{{datas.cityName}}{{datas.districtName}}{{datas.choolName}}({{datas.schoolTypeName}})体育器材配置达标统计</h3>-->
      <el-row class="title">
        <el-col class="title-top" :span="24">
          {{title}}体育器材配置达标统计
          <el-popover class="titlemessage" placement="right" width="280" trigger="click">
            <div class="titlemessage">
              <div>{{iconTitle}}</div>
            </div>
            <span slot="reference" class="shuoming">?</span>
          </el-popover>
        </el-col>
      </el-row>
      <el-row class="title color_blue">
        <el-col :span="24">班级总数：{{ datas.classConfigQuantity }} &nbsp;&nbsp;班</el-col>
      </el-row>
      <p class="text_right font14">达标：
        <span class="color_blue">{{datas.standardedConfigQuantity }}种</span>&nbsp;&nbsp;未达标：
        <span class="color_red">{{datas.nonStandardConfigQuantity }}种</span>
      </p>
      <!--  卡片，每行3个  -->
      <div class="card-box">
        <div
          v-for="(item, index) in datas2"
          :key="index"
          class="card"
          v-show="item.standardConfigQuantity!==0"
        >
          <el-card
            shadow="always"
            :class="{item: item.missConfigQuantity!==0, item1: item.missConfigQuantity===0}"
          >
            <div @click="toDetailList" class="no-margin">
              <div>{{item.equipmentName }}</div>
              <p
                class="font30"
                :class="{color_blue: item.missConfigQuantity===0, color_red: item.missConfigQuantity!==0}"
                :title="'已有'+item.actualConfigQuantity"
              >暂缺：{{item.missConfigQuantity===0?'无': (item.missConfigQuantity+'个')}}</p>
              <div>
                达标值：{{item.standardConfigQuantity}}{{item.unit}}
                <span class="shuoming" :title="'已有'+item.actualConfigQuantity">?</span>
              </div>
            </div>
          </el-card>
        </div>
      </div>
      <el-row style="padding-top: 60px;padding-bottom: 20px;text-align: center;font-size: 10px;">
        <el-col :span="24">体育器材配置达标准参考
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
import request from "@/utils/request";
import { getSchoolYear } from "@/utils/index";

export default {
  name: "equipmentStats",
  data() {
    return {
      equipmentHeader: 2,
      title: "",
      iconTitle: "根据《国家学校体育卫生条件试行基本标准》进行统计",
      downLoadUrl: "",
      schoolYear: "",
      schoolName: "",
      items: [],
      datas: [],
      datas2: [], // 卡片内容
      // classConfigQuantity: '',
      schoolYearOptions: [], // 学年容器
      equipment: {
        date: "",
        equipmentData: null
      }
    };
  },
  mounted() {
    this.schoolYearOptions = getSchoolYear();
    if (!this.schoolYear) {
      // this.schoolYear = this.schoolYearOptions[this.schoolYearOptions.length - 1].value;
      // this.equipment.date = this.schoolYearOptions[this.schoolYearOptions.length - 1].value
      this.schoolYear = this.schoolYearOptions[0].value;
      this.equipment.date = this.schoolYearOptions[0].value;
    }
    // console.log(this.schoolYear,this.equipment.date)
    this.search();
  },
  methods: {
    search() {
      let schoolYearStart = this.equipment.date.slice(0, 4);
      let schoolYearEnd = this.equipment.date.slice(5, 9);
      request
        .get("/api/auth/v1/equipment/statistics", {
          params: {
            schoolYearStart: schoolYearStart,
            schoolYearEnd: schoolYearEnd
            // schoolYear: this.schoolYear,
            // schoolId: ''
          }
        })
        .then(res => {
          // console.log(res)
          this.datas = res.data;
          let arr = [];
          arr = res.data.schoolEquipmentDetailList;
          function up(a, b) {
            // 排序
            return b.missConfigQuantity - a.missConfigQuantity;
          }
          arr.sort(up); // arr 根据missConfigQuantity 进行升序排列
          this.datas2 = arr;
          this.title =
            res.data.schoolYearStart +
            "-" +
            res.data.schoolYearEnd +
            "学年" +
            res.data.schoolName;
        })
        .catch(err => {
          console.log(err);
        });
    },
    changeModel() {
      this.equipmentHeader = "2";
      this.$router.push("/equipmentManagement/equipmentList");
    },
    toDetailList() {
      let schoolYearStart = this.equipment.date.slice(0, 4);
      let schoolYearEnd = this.equipment.date.slice(5, 9);
      this.$router.push({
        path: "/equipmentManagement/detailList",
        query: {
          schoolYearStart: schoolYearStart,
          schoolYearEnd: schoolYearEnd,
          title: this.title
        }
      });
    },
    downDoc() {
      let routeData = this.$router.resolve({
        name: "newPageHtml",
        query: { id: "teacherStats" }
      });
      window.open(routeData.href, "_blank");
    }
  }
};
</script>

<style scoped>
.item {
  margin: 15px 15px;
  text-align: center;
}
.item1 {
  margin: 15px 15px;
  text-align: center;
}
.title {
  text-align: center;
}
.text_right {
  text-align: right;
  margin-right: 40px;
}
.color_blue {
  color: #1e9fff;
}
.font14 {
  font-size: 14px;
}
.font30 {
  font-size: 30px;
}
.font20 {
  font-size: 20px;
}
.color_red {
  color: #ff6f56;
}
.item.el-card.is-always-shadow {
  -webkit-box-shadow: 5px 0px 12px 3px rgba(239, 11, 11, 0.31);
  box-shadow: 5px 0px 12px 3px rgba(239, 11, 11, 0.11);
}
.item1.el-card.is-always-shadow {
  -webkit-box-shadow: 5px 0px 12px 3px rgba(92, 132, 196, 0.51);
  box-shadow: 5px 0px 12px 3px rgba(92, 132, 196, 0.51);
}
.card-box {
  width: 920px;
  margin: 0 auto;
}
.card {
  display: inline-block;
  width: 300px;
  height: 160px;
}
.no-margin {
  width: 100%;
  height: 100%;
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
</style>
