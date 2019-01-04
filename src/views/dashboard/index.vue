<template>
  <!--<div class="dashboard-container">-->
  <!--<div class="dashboard-text">index</div>normalIntensityId-->
  <!--</div><indexPieChartLeft :chartId="execriseId" class="topChart" ref="indexPieChartLeft"></indexPieChartLeft>-->
  <div id="indexDiv" ref="indexDiv" style="min-width: 1500px;background-color: #013A87" 
    v-loading="loading"
    element-loading-text="正在加载中">
    <el-row style="margin-bottom: 10px;">
      <el-col :span="14" class="title_schoolName">
        <div id="schoolTitle">
          <div>{{school.schoolName}}智慧体育数据统计</div>
        </div>
      </el-col>
      <el-col :span="10" class="title_time">
        <div class="timeDiv"><span>{{dateNow}}</span><span class="yellowSpan">{{weekNow}}</span><span class="yellowSpan">{{noonNow}}</span><span>{{timeNow}}</span></div>
      </el-col>
    </el-row>
    <div style="width: 100%;position: relative" class="index">
      <el-row :gutter="10">
        <el-col :span="6">
          <el-row class="box">
            <el-col class="title">
              综合体质合格率
              <el-button class="i_btn" @click="showTips('综合体质合格率', passRateTip)"><i class="el-icon-question"></i></el-button>
            </el-col>
            <el-col :span="6" class="top top-left">
              <router-link to="/healthStats" style="cursor: pointer;">
                <el-col style="position: relative">
                  <indexPieChartTop :chartId="passRateId" class="topChart" ref="indexPieChatTop"></indexPieChartTop>
                  <div style="position: absolute;width: 100%;text-align: center;bottom: 5px">全校</div>
                  <hr style="position: absolute;border: 0px;background-color: #00D7F5;width: 2px;height: 100px;right: 0;top: 15px;" />
                </el-col>
              </router-link>
              <el-col>
                <div class="chartLabel">
                  <div></div>
                </div>
              </el-col>
            </el-col>
            <el-col :span="18" class="top">
              <el-row>
                <el-col class="line">对比全区平均（<span class="blueChar">{{phyCount.districtQualifiedRate}}%</span>）：
                  <span class="redChar" v-if="phyCount.qualifiedRate < phyCount.districtQualifiedRate" @click="routerTab(3)" style="cursor: pointer">低</span>
                  <span class="redChar" v-if="phyCount.qualifiedRate == phyCount.districtQualifiedRate" @click="routerTab(3)" style="cursor: pointer">相等</span>
                  <span class="redChar" v-if="phyCount.qualifiedRate > phyCount.districtQualifiedRate" @click="routerTab(3)" style="cursor: pointer">高</span>
                </el-col>
                <el-col class="line">达到94%合格率还需：<span class="blueChar">{{phyCount.requiredNumOfQualifiedStu}}人</span></el-col>
                <el-col class="line">低于合格率94%的班级：<span class="blueCharWithLine" @click="routerTab(2)">{{phyCount.requiredNumOfQualifiedClass}}个</span></el-col>
                <el-col class="line">综合体质不合格人数：<span class="blueCharWithLine" @click="routerTab(4)">{{phyCount.numOfUnqualifiedStu}}人</span></el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row class="box">
            <el-col class="title">
              综合体质优良率
              <el-button class="i_btn" @click="showTips('综合体质优良率', goodRateTip)"><i class="el-icon-question"></i></el-button>
            </el-col>
            <el-col :span="6" class="top top-left">
              <router-link to="/healthStats" style="cursor: pointer;">
                <el-col style="position: relative">
                  <indexPieChartTop :chartId="goodRateId" class="topChart" ref="indexPieChatTop"></indexPieChartTop>
                  <div style="position: absolute;width: 100%;text-align: center;bottom: 5px">全校</div>
                  <hr style="position: absolute;border: 0px;background-color: #00D7F5;width: 2px;height: 100px;right: 0;top: 15px;" />
                </el-col>
              </router-link>
              <el-col>
                <div class="chartLabel">
                  <div></div>
                </div>
              </el-col>
            </el-col>
            <el-col :span="18" class="top">
              <el-row style="margin-top: 15px">
                <el-col class="line">对比全区平均（<span class="blueChar">{{phyCount.districtExcellentRate}}%</span>）：
                  <span class="redChar" v-if="phyCount.excellentRate < phyCount.districtExcellentRate" style="cursor: pointer" @click="routerTab(5)">低</span>
                  <span class="redChar" v-if="phyCount.excellentRate == phyCount.districtExcellentRate" style="cursor: pointer" @click="routerTab(5)">相等</span>
                  <span class="redChar" v-if="phyCount.excellentRate > phyCount.districtExcellentRate" style="cursor: pointer" @click="routerTab(5)">高</span>
                </el-col>
                <el-col class="line">达到25%优良率还需：<span class="blueChar">{{phyCount.requiredNumOfExcellentStu}}人</span></el-col>
                <el-col class="line">
                  低于优良率25%的班级：<span class="blueCharWithLine" @click="routerTab(1)">{{phyCount.classNumBelowExcellentRate}}个</span>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="4">
          <el-row class="box">
            <el-col class="title">
              {{preDateTime}}运动时长
              <el-button class="i_btn" @click="showTips(preDateTime+'运动时长', sportTimeTip)"><i class="el-icon-question"></i></el-button>
            </el-col>
            <el-col :span="9" class="top top-left">
              <router-link to="lessonManagemnt/classStats" style="cursor: pointer">
                <el-col style="position: relative">
                  <indexPieChartTop :chartId="sportTimeId" class="topChart" ref="indexPieChatTop"></indexPieChartTop>
                  <div style="position: absolute;width: 100%;text-align: center;bottom: 5px">全校</div>
                  <hr style="position: absolute;border: 0px;background-color: #00D7F5;width: 2px;height: 100px;right: 0;top: 15px;" />
                </el-col>
              </router-link>
              <el-col>
                <div class="chartLabel">
                  <div></div>
                </div>
              </el-col>
            </el-col>
            <el-col :span="15" class="top">
              <el-row style="margin-top: 15px">
                <el-col class="line"><span class="blueCharWithLine" @click="routerTab(7)">{{sportData.moreThanOneHourNo}}人</span>运动超过1小时</el-col>
                <el-col class="line"><span class="blueCharWithLine" @click="routerTab(6)">{{sportData.lessThanOneHourNo}}人</span>运动未达1小时</el-col>
                <el-col class="line"><span class="blueCharWithLine" @click="routerTab(8)">{{sportData.notAttendNo}}人</span>未参加运动</el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="3">
          <el-row class="box">
            <el-col class="title">
              本周课堂运动消耗
              <el-button class="i_btn" @click="showTips('课堂运动消耗', sportExpendTip)"><i class="el-icon-question"></i></el-button>
            </el-col>
            <el-col class="top">
              <router-link to="lessonManagemnt/classStats" style="cursor: pointer">
                <el-col style="height: 100px;font-size: 22px;font-weight: 400;text-align: center;line-height: 120px;color: #FFD24A">
                  <span style="font-size: 40px">{{calorieExpendvalue}}</span>大卡
                </el-col>
                <el-col style="height: 50px;font-size: 20px;text-align: center;line-height: 50px">
                  <img :src="icon_school_home_fire" height="22px">人均消耗
                </el-col>
              </router-link>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="5">
          <el-row class="box">
            <el-col class="title">
              本周不同强度运动时长
              <el-button class="i_btn" @click="showTips('本周不同强度运动时长', weekLessonIntensityTip)"><i class="el-icon-question"></i></el-button>
            </el-col>
            <el-col :span="11" class="top top-left">
              <el-col style="height: 120px;font-size: 25px;font-weight: 400;text-align: center;line-height: 120px;position: relative">
                <indexGagueChart :chartId="normalIntensityId" class="topRightChart" ref="indexGagueChart"></indexGagueChart>
                <hr style="position: absolute;border: 0px;background-color: #00D7F5;width: 2px;height: 100px;right: 0;top: 15px;" />
              </el-col>
            </el-col>
            <el-col :span="2" class="top"></el-col>
            <el-col :span="11" class="top">
              <el-col style="height: 120px;font-size: 25px;font-weight: 400;text-align: center;line-height: 120px">
                <indexGagueChart :chartId="maxIntensityId" ref="indexGagueChart"></indexGagueChart>
              </el-col>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="19">
          <div style="position: relative;overflow: hidden;border: 2px solid #34AFF7;" ref="mapDiv">
            <div class="zhe1" :style="zhe1Left"></div>
            <div class="zhe2" :style="zhe2Left"></div>
            <div class="zhe3" :style="zhe1Left"></div>
            <div class="zhe4" :style="zhe4Left"></div>
            <baidu-map class="map" :center="map.center" :zoom="map.zoom" :double-click-zoom="false" :dragging="false">
             <bm-circle :center="map.expect" :radius="map.radius" stroke-color="#0E82FE" :stroke-weight="map.weight" fill-color="#FFCC00" :stroke-opacity="1"></bm-circle>
              <!--<bm-point-collection :points="map.points" shape="BMAP_POINT_SHAPE_CIRCLE" color="#FFCC00"-->
              <!--size="BMAP_POINT_SIZE_BIG"></bm-point-collection>-->
              <bm-point-collection :points="map.points" shape="BMAP_POINT_SHAPE_CIRCLE" color="#0E82FE" size="BMAP_POINT_SIZE_SMALL"></bm-point-collection>
            </baidu-map>
            <div class="number-grow top-left-border">
              <div class="num mui-text-center">
                <div class="blueSpan">
                  <div>运动数据</div>
                </div>
                <div id="rotate"></div>
                <div class="blueSpan" style="width: 60px">
                  <div style="width: 60px;font-size: 14px;line-height: 25px;color: #FFD953">
                    <el-button class="i_btn" @click="showTips('运动数据', sportDataTip)" style="width: 100%;height: 25px;display: block;text-align: left"><i class="el-icon-question"></i></el-button>
                    {{unitNumber}}
                  </div>
                </div>
              </div>
            </div>
            <div id="sportTab" class="bottom-left-border">
              <div style="width: 100%;text-align: center;height: 40px;font-size: 20px;color: #fff;background-color: rgba(33, 51, 115, .75);line-height: 40px">
                <span class="blueChar">{{dateTime}}</span>
                实时数据
              </div>
              <el-table :data="sportDatas" :header-cell-style="{backgroundColor: 'rgba(33, 51, 115, .75)', color: '#00D7F5', borderBottom: '1px solid rgba(33, 51, 115, .75)'}" :cell-style="sportCellStyle">
                <el-table-column prop="studentName" label="姓名">
                </el-table-column>
                <el-table-column prop="className" label="班级">
                </el-table-column>
                <el-table-column prop="sportTime" label="运动时长">
                </el-table-column>
              </el-table>
            </div>
            <div id="weatherGroup" style="display: none">
              <img :src="icon_school_home_weather" style="height: 60px;width: 70px;position: absolute;top: 0;left: 20px;" />
              <div style="width: 200px;height: 70px;position: absolute;top: 0;left: 100px">
                <span style="width: 100%;height: 40px;display: block">
                  <span style="color: #FBDA00;font-size: 30px;width: 80px;display: inline-block">28℃</span><span style="color: #FFD24A;font-size: 20px">中度污染</span>
                </span>
                <span style="width: 100%;height: 30px;display: block;color: #00D7F5;font-size: 20px;">
                  <span style="width: 80px;display: inline-block;">26/30℃</span><span>湿度80%</span>
                </span>
              </div>
            </div>
            <div id="schoolGroup">
              <div style="color: white;font-size: 22px;">{{school.schoolName}}</div>
              <div><span class="blueChar">{{school.courseClassCount}}个</span>班级正在上体育课</div>
              <div><span class="blueChar">{{school.useDeviceCount}}个</span>学生正在使用智能设备</div>
            </div>
          </div>
        </el-col>
        <el-col class="left-chart" :span="5">
          <el-row style="margin-bottom: 10px">
            <el-col class="title">
              本周课外锻炼
              <el-button class="i_btn" @click="showTips('本周课外锻炼', execriseTip)"><i class="el-icon-question"></i></el-button>
            </el-col>
            <el-col :span="12" class="left">
              <indexPieChartLeft :chartId="execriseId" class="topChart" ref="indexPieChartLeft"></indexPieChartLeft>
              <div style="position: absolute;border: 2px solid #00D7F5;top: 30px;left: 25px;padding: 5px">
                <span class="blueChar">{{execriseData.notAttendNo}}人</span>未锻炼
                <!--<hr style="width: 2px;height: 60px;border: 0px;background-color: #00D7F5;position: absolute;left: -2px;bottom: -59px"/>-->
              </div>
              <div style="position: absolute;border: 2px solid #00D7F5;bottom: 30px;right: 25px;padding: 5px">
                <span class="blueChar">{{execriseData.attendNo}}人</span>参加锻炼
                <!--<hr style="width: 2px;height: 60px;border: 0px;background-color: #00D7F5;position: absolute;right: -2px;top: -59px"/>-->
              </div>
            </el-col>
            <el-col :span="12" class="left" style="font-size: 16px;display: table;position: relative">
              <hr style="width: 2px;height: 240px;background-color: #00D7F5;border: 0;position: absolute;top: 30px;" />
              <div style="display: table-cell;vertical-align: middle">
                <el-col class="line">
                  <span class="left-title">锻炼达人</span>
                </el-col>
                <el-col class="line" v-for="(val,index) in execriseData.exerciseBest" :key="index">
                  <span class="left-name">{{val.name}}</span><span class="blueChar fr">{{val.time}}天</span>
                </el-col>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <router-link to="" style="cursor: pointer">
                <el-col class="title">
                  本周体育作业
                  <el-button class="i_btn" @click="showTips('本周体育作业', homeworkTip)"><i class="el-icon-question"></i></el-button>
                </el-col>
                <el-col :span="12" class="left">
                  <router-link to="/homework/homeworkstats" style="cursor: pointer;">
                    <indexPieChartLeft :chartId="homeworkId" class="topChart" ref="indexPieChartLeft">
                    </indexPieChartLeft>
                    <div style="position: absolute;border: 2px solid #00D7F5;top: 30px;left: 25px;padding: 5px">
                      <span class="blueChar">{{homework.nonFinishCount}}人</span>未完成
                      <!--<hr style="width: 2px;height: 60px;border: 0px;background-color: #00D7F5;position: absolute;left: -2px;bottom: -59px"/>-->
                    </div>
                    <div style="position: absolute;border: 2px solid #00D7F5;bottom: 30px;right: 25px;padding: 5px">
                      <span class="blueChar">{{homework.finishCount}}人</span>已完成
                      <!--<hr style="width: 2px;height: 60px;border: 0px;background-color: #00D7F5;position: absolute;right: -2px;top: -59px"/>-->
                    </div>
                  </router-link>
                </el-col>
                <el-col :span="12" class="left" style="font-size: 18px;display: table;position: relative">
                  <hr style="width: 2px;height: 240px;background-color: #00D7F5;border: 0;position: absolute;top: 30px;" />
                  <div style="display: table-cell;vertical-align: middle;">
                    <el-col class="line" style="display: table-cell;vertical-align: middle">
                      <span class="left-title">完成率</span>
                    </el-col>
                    <el-col class="line" v-for="(val, index) in homework.detailList" style="font-size: 16px;vertical-align: middle" :key="index">
                      <span class="left-name">{{val.gradeName}}{{val.className}}</span><span class="blueChar fr">{{val.finishRate}}%</span>
                    </el-col>
                  </div>
                </el-col>
              </router-link>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col style="color: white;font-size: 20px;height: 40px;line-height: 60px;text-align: center">
          粤ICP备17031860号-1©2017-2018校体通版权所有
        </el-col>
      </el-row>
      <el-dialog :title="showTitle" :visible.sync="dialogVisible" width="500px" :show-close="false" top="30vh">
        <span v-html="showTip">
        </span>
        <span slot="footer" class="dialog-footer" style="text-align: center">
          <el-button type="primary" style="background-color: #FCC837;color: #000;border: 0px;font-weight: bold;border-radius: 10px;width: 100px" @click="dialogVisible = false">好 的</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Print from "@/utils/print";
import request from "@/utils/request";
import IndexPieChartTop from "@/components/Chart/IndexPieChartTop";
import IndexPieChartLeft from "@/components/Chart/IndexPieChartLeft";
import IndexGagueChart from "@/components/Chart/IndexGagueChart";
import $ from "jquery";
import "@/static/rotate-number.min.js";
import { formatDate } from "@/utils/index";

import icon_school_home_weather from "@/assets/imgs/icon_school_home_weather.png";
import index_left from "@/assets/imgs/index-left.png";
import index_right from "@/assets/imgs/index-right.png";
import icon_school_home_fire from "@/assets/imgs/icon_school_home_fire.png";

Vue.use(Print); // 注册

export default {
  name: "dashboard",
  data() {
    return {
      loading:true,
      time1: null,  // 定时器名称  
      time2: null,  // 定时器名称  
      time3: null,  // 定时器名称 
      unitNumber: "条",
      posDistrictId: "",
      schoolYear: "",
      district: "",
      city: "",
      phyCount: {
        qualifiedRate:0,
        districtQualifiedRate:0,
        requiredNumOfQualifiedStu:0,
        requiredNumOfQualifiedClass:0,
        numOfUnqualifiedStu:0,
        districtExcellentRate:0,
        excellentRate:0,
        requiredNumOfExcellentStu:0,
        classNumBelowExcellentRate:0,
      },
      sportData: {
        averageSportTime:0,
        lessThanOneHourNo:0,
        moreThanOneHourNo:0,
        notAttendNo:0
      },
      dataNum: 0,
      dateTime: "",
      preDateTime: "",
      intensity: {},
      homework: {},
      lessThanOneHour: [],
      moreThanOneHour: [],
      notAttend: [],
      execriseData: {},
      school: {},
      dialogVisible: false,
      calorieExpendvalue: 0,
      icon_school_home_fire: icon_school_home_fire,
      icon_school_home_weather: icon_school_home_weather,
      index_left: index_left,
      index_right: index_right,
      zhe1Left: { left: 0 },
      zhe2Left: { left: 0 },
      zhe4Left: { left: 0 },
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      nextNum: 10,
      passRateId: "passRate",
      goodRateId: "goodRate",
      sportTimeId: "sportTime",
      execriseId: "execrise",
      homeworkId: "homework",
      normalIntensityId: "normalIntensity",
      maxIntensityId: "maxIntensity",
      map: {
        center: { lng: "", lat: "" },
        expect: { lng: 116.331398, lat: 39.897445 },
        radius: 8,
        zoom: 18,
        weight: 1,
        points: [
          {
            lng: 116.331398,
            lat: 39.897145
          },
          {
            lng: 116.331698,
            lat: 39.897535
          },
          {
            lng: 116.331698,
            lat: 39.897535
          }
        ]
      },
      show: true,
      // i: 0,
      // j: 0,
      // k: 0,
      // l: 0,
      // interval: null,
      // arr: [1, 0, 7, 0, 0, 6],
      // resultArr: [2, 3, 4, 5, 6, 7],
      sportDatas: [],
      weekLessonIntensityTip:
        "&nbsp&nbsp&nbsp&nbsp根据《“健康中国2030规划纲要》要求，青少年学生每周参与体育活动达到中等强度3次以上<br>" +
        "&nbsp&nbsp&nbsp&nbsp根据《全民健身指南》要求，每周应进行150分钟以上的中等强度运动<br>" +
        "统计说明：<br>" +
        "&nbsp&nbsp&nbsp&nbsp中等强度：120次/分≤中等强度＜150次/分<br>" +
        "&nbsp&nbsp&nbsp&nbsp大强度：150次/分≤大强度＜170次/分<br>" +
        "中等强度运动时长：<br>" +
        "&nbsp&nbsp&nbsp&nbsp单节课堂平均中等强度运动时长=单节课堂中等强度运动总时长/学生数<br>" +
        "&nbsp&nbsp&nbsp&nbsp单天课堂平均中等强度运动时长=单天全部单节课堂平均中等强度运动时长的总和<br>" +
        "&nbsp&nbsp&nbsp&nbsp单天课堂平均中等强度运动时长=单天全部单节课堂平均中等强度运动时长的总和/单天课堂数<br>" +
        "&nbsp&nbsp&nbsp&nbsp一周中等强度运动总时长=一周全部单天课堂平均中等强度运动时长的总和<br>" +
        "大强度运动时长：<br>" +
        "&nbsp&nbsp&nbsp&nbsp单节课堂平均大强度运动时长=单节课堂大强度运动总时长/学生数<br>" +
        "&nbsp&nbsp&nbsp&nbsp单天课堂平均大强度运动时长=单天全部单节课堂平均大强度运动时长的总和/单天课堂数<br>" +
        "&nbsp&nbsp&nbsp&nbsp一周大强度运动总时长=一周全部单天课堂平均大强度运动时长的总和",
      passRateTip:
        "根据《广州市教育事业发展第十三个五年规划（2016—2020年）》的要求，学生体质健康标准合格率需保持在94%以上。<br>" +
        "统计说明：<br>" +
        "依据《国家学生体质健康标准（2014年修订）》的计算标准。<br>" +
        "合格率数据来源当今学年的体测数据统计<br>合格率 = 成绩合格（成绩≥60分）的人数/体质测试总人数×100%",
      goodRateTip:
        "根据《青少年体育活动促进计划》的要求，学生体质健康标准优良率需达到25%以上。<br>" +
        "                  统计说明：<br>" +
        "                  依据《国家学生体质健康标准（2014年修订）》的计算标准。<br>" +
        "                  优良率数据来源当今学年的体测数据统计<br>" +
        "                  优良率=[成绩优秀（90分≤成绩＜100分）的人数+成绩良好（80分≤成绩＜90分）的人数]/体质测试总人数×100%",
      sportTimeTip:
        "根据《青少年体育活动促进计划》要求，为了切实保障体育课时，学生每天需锻炼1小时。<br>" +
        "                  统计说明：<br>" +
        "                  运动时长=学生运动总时长/学生数",
      sportExpendTip:
        "根据《青少年体育活动促进计划》要求，为了切实保障体育课时，学生每天需锻炼1小时。<br>" +
        "                  统计说明：<br>" +
        "                  平均运动消耗=学生运动总消耗/学生数",
      execriseTip:
        "统计说明：<br>" +
        "                  人均锻炼天数=学生锻炼总天数/学生数<br>" +
        "                  未锻炼人数=本周未参加锻炼的学生数<br>" +
        "                  参加锻炼人数=本周参加参加锻炼的学生数",
      homeworkTip:
        "统计说明：<br>" +
        "                    作业总份数=布置作业次数*学生数<br>" +
        "                    已完成作业比例=已完成作业份数/作业总份数<br>" +
        "                    未完成作业比例=未完成作业份数/作业总份数<br>",
      sportDataTip: "数据来源：本区域投入使用的运动智能穿戴设备",
      showTip: "",
      showTitle: "",
      dateNow: "",
      weekNow: "",
      noonNow: "",
      timeNow: "",
      weekDay: [
        "星期天",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六"
      ],
      queryParam: {}
    };
  },
  created() {},
  updated() {
    if (parseInt(document.body.clientWidth) <= 1300) {
      document.querySelector("#indexDiv").setAttribute("style", "zoom: 0.67");
    } else if (parseInt(document.body.clientWidth) <= 2000) {
      document.querySelector("#indexDiv").setAttribute("style", "zoom: 0.78");
    } else {
      document.querySelector("#indexDiv").setAttribute("style", "zoom: 1.2");
    }
    document
      .querySelector(".main-container")
      .setAttribute("style", "background:#013A87");
    document.querySelector("body").setAttribute("style", "background:#013A87");
  //  document.querySelector(".navbar").setAttribute("style", "display:none");
  },
  beforeDestroy() {
    clearInterval(this.time1);        
    this.time1 = null;
    clearInterval(this.time2);        
    this.time2 = null;
    clearInterval(this.time3);        
    this.time3 = null;
    if(document.querySelector("#indexDiv")){
      document.querySelector("#indexDiv").setAttribute("style", "");
    }
    if(document.querySelector(".main-container")){
      document.querySelector(".main-container").setAttribute("style", "");
    }
    if( document.querySelector("body")){
      document.querySelector("body").setAttribute("style", "");
    }
    
  //  document.querySelector(".navbar").setAttribute("style", "");
  },
  components: {
    indexPieChartTop: IndexPieChartTop,
    indexPieChartLeft: IndexPieChartLeft,
    indexGagueChart: IndexGagueChart
  },
  methods: {
    routerTab(type) {
      this.queryParam.type = type;
      this.$router.push("indexTab");
    },
    showTips(title, content) {
      this.dialogVisible = true;
      this.showTip = content;
      this.showTitle = title;
    },
    initTopChart(params) {
      params.title = params.title == "undefined%" ? "0%" : params.title;
      if(document.getElementById(params.id)==null) return;
      var pieChart = this.$echarts.init(document.getElementById(params.id));
      pieChart.setOption({
        backgroundColor: "#213373",
        title: {
          text: params.title,
          left: "center",
          top: "25%",
          padding: [24, 0],
          textStyle: {
            color: params.color,
            // fontSize: 18,
            align: "center",
            fontWeight: "normal"
          }
        },
        series: [
          {
            name: "",
            type: "pie",
            hoverAnimation: false,
            legendHoverLink: false,
            radius: ["50%", "65%"],
            color: [params.pieColor, "#5C618E"],
            label: {
              normal: {
                position: "inner"
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            tooltip: {
              show: false
            },

            data: params.data
          }
        ]
      });
    },
    initLeftChart(params) {
      if(document.getElementById(params.id)==null) return
      var pieChart = this.$echarts.init(document.getElementById(params.id));
      pieChart.setOption({
        backgroundColor: "#213373",
        title: {
          text: params.title,
          left: "center",
          top: "35%",
          padding: [24, 0],
          textStyle: {
            color: params.titleColor,
            // fontSize: 18,
            align: "center",
            fontWeight: "normal"
          },
          subtext: params.subTitle,
          subtextStyle: {
            color: params.subColor,
            align: "center",
            fontSize: "normal",
            fontWeight: "normal"
          }
        },
        series: [
          {
            name: "",
            type: "pie",
            hoverAnimation: false,
            legendHoverLink: false,
            radius: ["55%", "65%"],
            color: ["#00FD00", "#5C618E"],
            label: {
              normal: {
                position: "outer",
                show: false,
                formatter: "{c}人{b}"
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            tooltip: {
              show: false
            },

            data: params.data || []
          }
        ]
      });
    },
    initGaugeChart(params) {
      if(document.getElementById(params.id)==null) return;
      var gagueChart = this.$echarts.init(document.getElementById(params.id));
      gagueChart.setOption({
        backgroundColor: "#213373",
        title: {
          show: false
        },
        series: [
          {
            name: "",
            type: "gauge",
            startAngle: 180,
            endAngle: 0,
            min: 0,
            max: 200,
            radius: "70%",
            splitNumber: 4,
            center: ["50%", "60%"],
            detail: {
              show: true,
              formatter:
                "{score|{value}}{unit|min/人}\n{label|" + params.type + "}",
              offsetCenter: [0, "65%"],
              rich: {
                score: {
                  color: "#FFD24A",
                  fontSize: 22
                },
                unit: {
                  color: "#FFD24A",
                  fontSize: 16
                },
                label: {
                  color: "#00D7F5",
                  fontSize: 22
                }
              }
            },
            pointer: {
              width: "10%"
            },
            axisLine: {
              show: true,
              lineStyle: {
                width: 10,
                shadowBlur: 0,
                color: [
                  [
                    0.25,
                    {
                      colorStops: [
                        {
                          offset: 0,
                          color: "rgba(255,0,0,1)"
                        },
                        {
                          offset: 0.8,
                          color: "rgba(255,164,0,1)"
                        }
                      ]
                    }
                  ],
                  [
                    0.5,
                    {
                      colorStops: [
                        {
                          offset: 0,
                          color: "rgba(255,164,0,1)"
                        },
                        {
                          offset: 1,
                          color: "rgba(255,234,0,1)"
                        }
                      ]
                    }
                  ],
                  [
                    0.75,
                    {
                      colorStops: [
                        {
                          offset: 0,
                          color: "rgba(255,234,0,1)"
                        },
                        {
                          offset: 1,
                          color: "rgba(0,255,0,1)"
                        }
                      ]
                    }
                  ],
                  [1, "rgba(0,255,0,1)"]
                ]
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: true,
              distance: -50,
              textStyle: {
                color: "#00D7F5",
                fontSize: 10
              }
            },
            splitLine: {
              show: false
            },
            itemStyle: {
              normal: {
                shadowBlur: 0
              }
            },
            data: [{ value: params.value, name: "" }]
          }
        ]
      });
    },
    draw({ el, BMap, map }) {
      const pixel = map.pointToOverlayPixel(
        new BMap.Point(116.330598, 39.898645)
      );
      el.style.left = pixel.x - 60 + "px";
      el.style.top = pixel.y - 20 + "px";
    },
    sportCellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex !== 1) {
        return { color: "#FFD24A", backgroundColor: "rgba(33, 51, 115, .75)" };
      } else {
        return { color: "#fff", backgroundColor: "rgba(33, 51, 115, .75)" };
      }
    },
    getDevicePosition() {
      this.$store.dispatch("DevicePosition").then(response => {
        if (response.data.school) {
          this.map.center.lng = response.data.school.longitudeValue;
          this.map.center.lat = response.data.school.latitudeValue;
          this.city = response.data.school.posCityName;
          this.district = response.data.school.posDistrictName;
          this.posDistrictId = response.data.school.posDistrictId;
        }
        let points=[];
        if (response.data.deviceUsePositionList.length > 0) {
          response.data.deviceUsePositionList.forEach((val, index) => {
           points.push({
              lng: val.longitudeValue,
              lat: val.lattudeValue
            });
          });
        }
        this.map.points=points
      });
    },
    getCourse() {
      this.$store.dispatch("Course").then(response => {
        if (response.data) {
          this.school = response.data;
        }
      });
    },
    getCalorieExpend() {
      this.$store.dispatch("CalorieExpend").then(response => {
        if (response.data) {
          this.calorieExpendvalue = response.data.calorieExpendvalue;
        }
      });
    },
    getExtracurricularExercise() {
      this.$store.dispatch("ExtracurricularExercise").then(response => {
        this.execriseData.averageExercise = response.data.averageExercise;
        this.execriseData.notAttendNo = response.data.notAttendNo;
        this.execriseData.attendNo = response.data.attendNo;
        this.execriseData.exerciseBest = response.data.exerciseBest;
      });
    },
    getNotAttend() {
      this.$store.dispatch("NotAttend").then(response => {
        this.notAttend = response.data;
      });
    },
    getLessThanOneHour() {
      this.$store.dispatch("LessThanOneHour").then(response => {
        this.lessThanOneHour = response.data;
      });
    },
    getMoreThanOneHour() {
      this.$store.dispatch("MoreThanOneHour").then(response => {
        this.moreThanOneHour = response.data;
      });
    },
    getHomework() {
      this.$store.dispatch("Homework").then(response => {
        this.homework = response.data;
      });
    },
    getSportTimeRanking() {
      this.$store.dispatch("SportTimeRanking").then(response => {
        this.sportDatas = response.data;
        this.sportDatas.forEach(val => {
          val.className = val.grade + val.className;
          val.sportTime = Number(val.sportTime).toFixed(2);
        });
      });
    },
    getStrengthSportTime() {
      this.$store.dispatch("StrengthSportTime").then(response => {
        this.intensity = response.data;
        if (this.intensity.medial) {
          this.intensity.medial = Number(this.intensity.medial).toFixed(2);
        } else {
          this.intensity.medial = 0;
        }
        if (this.intensity.highStrength) {
          this.intensity.highStrength = Number(
            this.intensity.highStrength
          ).toFixed(2);
        } else {
          this.intensity.highStrength = 0;
        }
        var param3 = {
          id: this.normalIntensityId,
          value: this.intensity.medial,
          type: "中等强度"
        };
        var param4 = {
          id: this.maxIntensityId,
          value: this.intensity.highStrength,
          type: "大强度"
        };
        this.initGaugeChart(param3);
        this.initGaugeChart(param4);
      });
    },
    getStatisticsDeviceMessage() {
      this.$store.dispatch("GetStatisticsDeviceMessage").then(response => {
        this.dataNum = response.data.dataNum;
        let value = response.data.dataNum;
        if (this.dataNum >= 10000000) {
          this.unitNumber = "W条";
          value = parseInt(this.dataNum / 10000);
        }
        this.rotator.setNumber(value);
      });
    },
    getSportTime() {
      this.$store.dispatch("SportTime").then(response => {
        this.sportData = response.data;
      });
    },
    getSchoolYearDtl() {
      this.$store.dispatch("SchoolYearDtl").then(response => {
        if (response.data && response.data.list.length > 0) {
          this.phyCount = response.data.list[0];
          this.schoolYear =
            this.phyCount.schoolYearStart + "-" + this.phyCount.schoolYearEnd;
        }
      });
    },
    doRequest() {
      document.querySelector(".app-main").setAttribute("style", "padding:0px");
      this.loading=true;
      this.getDevicePosition();
      this.getCourse();
      this.getCalorieExpend();
      this.getExtracurricularExercise();
      this.getNotAttend();
      this.getLessThanOneHour();
      this.getMoreThanOneHour();
      this.getHomework();
      this.getSportTimeRanking();
      this.getStrengthSportTime();
      this.getStatisticsDeviceMessage();
      this.getSportTime();
      this.getSchoolYearDtl();
      var that = this;
      setTimeout(function() {
        that.loading=false;
        document.querySelector(".app-main").setAttribute("style", "padding:0px 20px 20px");
        that.queryParam = {
          city: that.city,
          school: that.school.schoolName,
          district: that.district,
          schoolYear: that.schoolYear,
          phyCount: that.phyCount,
          posDistrictId: that.posDistrictId,
          preDateTime: that.preDateTime
        };
        that.initChart();
      }, 2000);
    },
    initChart() {
      var params = {
        id: this.passRateId,
        title: this.phyCount.qualifiedRate + "%",
        data: [this.phyCount.qualifiedRate, 100 - this.phyCount.qualifiedRate],
        color: "#00FC00",
        pieColor: "#00FC00"
      };

      this.initTopChart(params);
      params.title = this.phyCount.excellentRate + "%";
      params.data = [
        this.phyCount.excellentRate,
        100 - this.phyCount.excellentRate
      ];
      params.color = "#FBDA00";
      params.pieColor = "#FBDA00";
      params.id = this.goodRateId;
      this.initTopChart(params);
      params.data = [
        this.sportData.averageSportTime / 60,
        1 - this.sportData.averageSportTime / 60
      ];
      params.id = this.sportTimeId;
      params.color = "#FF8E00";
      params.pieColor = "#FF8E00";
      params.title = this.sportData.averageSportTime + "min";
      this.initTopChart(params);
      var param1 = {
        id: this.execriseId,
        title: "平均锻炼",
        subTitle:
          (this.execriseData.averageExercise == 0
            ? 0
            : this.execriseData.averageExercise.toFixed(2)) + "天/人",
        data: [
          {
            name: "参加锻炼",
            value: this.execriseData.attendNo
          },
          {
            name: "未锻炼",
            value:
              this.execriseData.averageExercise === 0
                ? 1
                : this.execriseData.notAttendNo
          }
        ],
        titleColor: "#00D7F5",
        subColor: "#00FC00"
      };
      this.initLeftChart(param1);
      var param2 = {
        id: this.homeworkId,
        title: "作业",
        subTitle:
          typeof this.homework.homeworkAllCount == "undefined"
            ? 0 + "份"
            : this.homework.homeworkAllCount + "份",
        data: [
          {
            name: "已完成",
            value: this.homework.finishCount
          },
          {
            name: "未完成",
            value:
              this.homework.finishCount === 0 &&
              this.homework.nonFinishCount === 0
                ? 1
                : this.homework.nonFinishCount
          }
        ],
        titleColor: "#00D7F5",
        subColor: "#00FC00"
      };
      this.initLeftChart(param2);
    }
  },
  mounted() {
    if (parseInt(document.body.clientWidth) <= 1300) {
      this.$refs.indexDiv.setAttribute("style", "zoom: 0.67");
    } else if (parseInt(document.body.clientWidth) <= 2000) {
      this.$refs.indexDiv.setAttribute("style", "zoom: 0.78");
    } else {
      this.$refs.indexDiv.setAttribute("style", "zoom: 1.2");
    }
    document
      .querySelector(".main-container")
      .setAttribute("style", "background:#013A87");
    document.querySelector("body").setAttribute("style", "background:#013A87");

    document.querySelector(".app-main").setAttribute("style", "padding:0px");
   // document.querySelector(".navbar").setAttribute("style", "display:none");

    var date = new Date();
    this.dateTime = formatDate(date, "MM/dd");
    var ms = 24 * 3600 * 1000 * -1;
    var nowTime = date.getTime();
    var yesterDay = new Date();
    yesterDay.setTime(parseInt(nowTime + ms));
    this.preDateTime = formatDate(yesterDay, "MM/dd");
    var width = this.$refs.mapDiv.getBoundingClientRect().width;
    var left = (width - 2200) / 2.5;
    this.zhe1Left = { left: left + "px" };
    this.zhe2Left = { left: 1600 - 800 + left + "px" };
    this.zhe4Left = { left: 1600 - 800 + 30 + left + "px" };
    var that = this;
    that.rotator = $("#rotate").rotateNumber({
      digits: 7,
      separator: ""
    });

    that.rotator.setNumber(this.dataNum);
    //时间更新
    this.time1=setInterval(function() {
      var date = new Date();
      that.weekNow = that.weekDay[date.getDay()];
      that.dateNow = formatDate(date, "yyyy.MM.dd");
      that.timeNow = formatDate(date, "hh:mm:ss");
      if (date.getHours() >= 8 && date.getHours() < 12) {
        that.noonNow = "上午";
      } else if (date.getHours() >= 12 && date.getHours() < 14) {
        that.noonNow = "中午";
      } else if (date.getHours() >= 14 && date.getHours() < 18) {
        that.noonNow = "下午";
      }
    }, 1000);
    //运动数据更新
    setTimeout(function() {
      that.doRequest();
      that.getStatisticsDeviceMessage();
    }, 1000);
    this.time2=setInterval(function() {
      if(that.$route.name!="DashboardMain") return;
      that.getStatisticsDeviceMessage();
    }, 60000);
    this.time3=setInterval(function() {
      if(that.$route.name!="DashboardMain") return;
      that.doRequest();
    }, 300000);
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === "IndexTab") {
      var condition = JSON.stringify(this.queryParam);
      localStorage.setItem("indexCondition", condition);
    } else {
      localStorage.removeItem("indexCondition");
    }
    next();
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.top {
  height: 170px;
  background-color: #213373;
  color: #00d7f5;
}
.title {
  background-color: #213373;
  color: #00d7f5;
  line-height: 30px;
  height: 50px;
  text-align: left;
  font-size: 20px;
  padding-left: 20px;
  padding-top: 10px;
}
.left {
  height: 310px;
  background-color: #213373;
  color: #ffffff;
  position: relative;
}
.left-title {
  color: #00d7f5;
}
.left-name {
  /*width: 88px;*/
  display: inline-block;
}
.map {
  width: 100%;
  height: 730px;
  border: 2px solid #34aff7;
}

.zhe1 {
  width: 2200px;
  height: 2200px;
  position: absolute;
  border: 800px solid rgba(94, 100, 136, 0.7);
  border-radius: 50%;
  z-index: 10;
  /*left: -100px;*/
  top: -750px;
  background: url("~@/assets/imgs/img_school_home_cycle.png") no-repeat;
  background-size: contain;
}
.zhe3 {
  width: 2200px;
  height: 2200px;
  position: absolute;
  border-radius: 50%;
  z-index: 99;
  /*left: -100px;*/
  top: -750px;
  /*background: url('~@/assets/imgs/img_school_home_cycle.png') no-repeat;*/
  /*background-size: contain;*/
}
.zhe2 {
  width: 600px;
  height: 600px;
  position: absolute;
  border: 30px solid rgba(94, 100, 136, 0.7);
  border-radius: 50%;
  z-index: 1;
  /*left: 510px;*/
  top: 50px;
}
.zhe4 {
  width: 540px;
  height: 540px;
  position: absolute;
  border: 10px solid #4794e8;
  border-radius: 50%;
  z-index: 99;
  /*left: 510px;*/
  top: 80px;
}
.topChart {
  /*padding-right: 3px;*/
  background-color: #213373;
  /*border-right: 2px solid #34AFF7;*/
  /*padding-right: 2px;*/
}
.topRightChart {
  background-color: #213373;
  /*border-right: 2px solid #34AFF7;*/
  /*padding-right: 2px;*/
}
.chartLabel {
  background-color: #213373;
  /*padding-right: 2px;*/
  height: 40px;
}
.chartLabel div {
  /*font-size: 18px;*/
  text-align: center;
  background-color: #213373;
  color: #00d7f5;
}
.blueCharWithLine {
  color: #ffd73e;
  text-decoration: underline;
  cursor: pointer;
}
.fr {
  float: right;
  margin-right: 5px;
}
.blueChar {
  color: #ffd73e;
}
.redChar {
  color: red;
  text-decoration: underline;
}
.redCharWithLine {
  color: red;
  text-decoration: underline;
}
.line {
  line-height: 40px;
  font-size: 15px;
  padding-left: 5px;
}
.top-left {
  /*border-right: 2px solid #f2f2f2*/
}
.sample {
  width: 300px;
  height: 150px;
  line-height: 40px;
  font-size: 26px;
  overflow: hidden;
  color: #fff;
  text-align: center;
  padding: 10px;
  position: absolute;
  z-index: 99;
}

.num {
  /*position: relative;*/
  width: 100%;
  height: 50px;
  overflow: hidden;
}

.num .span {
  /*position: absolute;*/
  background: #fff;
  color: #1e9fff;
  width: 30px;
  height: 50px;
  line-height: 50px;
  font-size: 40px;
  font-weight: bold;
  float: left;
  margin-right: 2px;
}

.num .span div {
  background: #fff;
  color: #1e9fff;
  width: 30px;
  height: 50px;
  line-height: 50px;
  font-size: 40px;
  font-weight: bold;
  text-align: center;
}
.number-grow {
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 99;
  overflow: hidden;
  height: 83px;
  padding: 5px;
  padding-top: 10px;
  background: url("~@/assets/imgs/index-left.png") no-repeat;
  background-size: cover;
}
.num .blueSpan {
  width: 110px;
  height: 50px;
  line-height: 50px;
  color: #fff;
  float: left;
}
.num .blueSpan div {
  padding-left: 5px;
  font-size: 25px;
  color: #00d7f5;
  width: 110px;
  height: 50px;
  line-height: 50px;
  font-weight: bold;
}
.i_btn {
  border: 0px;
  margin: 0px;
  padding: 0px;
  background-color: #213373;
  color: white;
}

.num .i_btn {
  background-color: rgba(0, 0, 0, 0);
}

#rotate {
  font-family: Arial;
  float: left;
}
#rotate .digit {
  width: 30px;
}
.bottom-left-border {
  border-top: 4px solid rgba(33, 51, 115, 0.55);
  border-right: 4px solid rgba(33, 51, 115, 0.55);
}
#sportTab {
  width: 360px;
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 99;
}
#weatherGroup {
  width: 300px;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 99;
  height: 80px;
  background: url("~@/assets/imgs/index-right.png") no-repeat;
  background-size: cover;
}
#schoolGroup {
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 99;
  height: 135px;
  width: 340px;
  color: #00d7f5;
  border-top: 6px solid rgba(33, 51, 115, 0.55);
  border-left: 6px solid rgba(33, 51, 115, 0.55);
}
#schoolGroup div {
  background-color: rgba(33, 51, 115, 0.75);
  padding: 11px;
  text-align: right;
  font-size: 18px;
}
.title_schoolName{
  margin-top: 18px;
}
#schoolTitle {
  width: 900px;
  color: #ffd73e;
  font-weight: bold;
  font-size: 40px;
  padding: 2px;
}
.title_time{
  margin-top: 50px;
}
#schoolTitle div {
  width: 887px;
  margin-top: 20px;
  margin-left: 1px;
  padding-left: 20px;
}
.left .topChart {
  border-right: 0px;
  padding-right: 0px;
}
.left .line {
  padding-left: 16px;
}
.timeDiv {
  margin-top: 30px;
  font-size: 20px;
  font-weight: 400;
  color: #ffffff;
  text-align: right;
}
.yellowSpan {
  color: #ffd73e;
  padding: 0 10px;
}
.main-container {
  background-color: #0060c3;
}
</style>
<style lang="scss">
.BMap_cpyCtrl {
  display: none;
}
.anchorBL {
  display: none;
}
</style>
<style lang="scss">
#rotate {
  .digit {
    height: 500px;
  }
}
</style>

