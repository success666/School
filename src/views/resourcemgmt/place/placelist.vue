<template>
  <div>
    <el-radio-group v-model="placeModel" style="margin-bottom: 10px;" @change="changeRouter">
      <el-radio-button label="1">场地管理</el-radio-button>
      <el-radio-button label="2">场地统计</el-radio-button>
    </el-radio-group>

    <div class="search-form">
      <el-form :inline="true" :model="place" class="">
        <el-form-item label="学年">
          <el-select v-model="place.schoolYear" placeholder="请选择" size="mini" @change="schoolYearChange">
            <el-option
              v-for="item in schoolYearOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search(place)" class="btn" size="mini">查询</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button v-if="havePermissionArr['updateField']" type="primary" @click="placeEdit()" class="btn" size="mini">编辑场地</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="primary" @click="placeImport()" class="btn" size="mini">导入场地</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button v-if="havePermissionArr['addField']" type="primary" @click="placeAdd()" class="btn" size="mini">添加场地</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="list">
      <section ref="printarea">
        <span class="table-title title-top">{{place.schoolYearSE}}{{place.schoolName}}场地配置详情</span>
        <div class="custom">
          <table border="1" cellpadding="3" id="printTable" class="table">
            <tbody>
            <tr>
              <th>场地名称</th>
              <th>实绩配置数据</th>
              <th>规格</th>
              <th>单位</th>
              <th>达标配置标准</th>
              <th style="max-width: 300px;text-align: left">备注</th>
            </tr>
            <tr v-for="(place, index) in list" :key="index">
              <td prop="fieldName" style="min-width: 160px">
                <span v-if='place.fieldId === null'>{{place.otherField === (''||null) ? '-' : place.otherField}}</span>
                <span v-else>{{place.fieldName === (''||null) ? '-' : place.fieldName}}</span>
              </td>
              <td prop="actualConfigQuantity" style="min-width: 80px">{{place.actualConfigQuantity === (''||null) ? '-' : place.actualConfigQuantity}}</td>
              <td prop="specificationsName" style="min-width: 160px">
                <span v-if='place.fieldId === null'>{{place.otherFieldSpecifications === (''||null) ? '-' : place.otherFieldSpecifications}}</span>
                <span v-else>{{place.specificationsName === (''||null) ? '-' : place.specificationsName}}</span>
              </td>
              <td prop="unit" style="min-width: 80px">{{place.unit === (''||null) ? '-' : place.unit}}</td>
              <td prop="standardConfigQuantity" style="min-width: 160px">{{place.standardConfigQuantity === (''||null) ? '-' : place.standardConfigQuantity}}</td>
              <td prop="remark" style="min-width: 250px; text-align: left;">{{place.remark === (''||null) ? '-' : place.remark}}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </section>
      <div class="multi-action" style="height: 80px">
        <el-button type="primary" @click="printAction" class="btn" style="float: right" size="mini">打印</el-button>
        <el-button type="primary" @click="exportAction" class="btn" style="float: right; margin-right: 10px"
                   size="mini">导出
        </el-button>
      </div>


      <el-row style="padding-top: 120px;text-align: center;font-size: 10px;">
        <el-col :span="24">体育场地配置达标标准参考<span style="color: #0077F0;    cursor: pointer;" @click="downDoc">《国家学校体育卫生条件试行基本标准》（教体艺[2008]5号）</span></el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Print from '@/utils/print'
  import { BASE_API } from '../../../../config/prod.env'
  import { getSchoolYear } from '@/utils/index'
  import axios from 'axios'
  import { getToken } from '@/utils/auth'
  import { isHavePermissions } from '@/utils/auth'

  Vue.use(Print) // 注册

  export default {
    name: 'PlaceList',
    data() {
      return {
        // 服务器前缀
        baseApi: BASE_API,
        schoolYearOptions: [],
        schoolYear: '',
        place: {
          schoolName: '',
          schoolYear: '',
          schoolYearStart: '',
          schoolYearEnd: '',
          schoolYearSE: '',
          gradeId: '',
          classId: '',
          name: ''
        },
        placeModel: 1,
        list: [],
        havePermissionArr: {
          addField: false,
          updateField: false
        },
        permissionCode: ['addField', 'updateField']
      }
    },
    methods: {
      // 查询
      search(place) {
        this.schoolYear = this.place.schoolYear
        const search = {}
        search.schoolYearStart = place.schoolYearStart
        search.schoolYearEnd = place.schoolYearEnd
        console.info(' >>> place search ' + JSON.stringify(search))
        this.$store.dispatch('PlaceList', search).then(response => {
          this.list = response.data.schoolFieldList
          this.place.schoolName = response.data.schoolName
          this.place.schoolYearSE = response.data.schoolYearStart + '-' + response.data.schoolYearEnd
          // console.log(' >>> place list response ' + JSON.stringify(this.list))
        })
      },
      // 添加
      placeAdd() {
        this.routeLink = {
          path: 'addPlaceForm',
          query: {
            type: '1'
          }
        }
        this.$router.push(this.routeLink)
      },
      // 编辑
      placeEdit() {
        this.routeLink = {
          path: 'placeForm',
          query: {
            type: '2',
            schoolYear: this.schoolYear
          }
        }
        this.$router.push(this.routeLink)
      },
      // 打印
      printAction() {
        this.$print(this.$refs.printarea)
      },
      // 选择学年
      schoolYearChange() {
        var list = this.place.schoolYear.split('-')
        if (list.length > 0) {
          this.place.schoolYearStart = list[0]
          this.place.schoolYearEnd = list[1]
        }
      },
      // 导出
      exportAction() {
        // console.log('导出场地')
        this.schoolYearChange()
        var instance = axios.create({
          baseURL: process.env.BASE_API,
          timeout: 1000,
          headers: {
            'Authorization': getToken()
          },
          responseType: 'blob'
        })
        var that = this
        instance.get('/api/auth/v1/field/export?schoolYearStart=' + that.place.schoolYearStart + '&schoolYearEnd=' + that.place.schoolYearEnd).then(function(response) {
          // console.log(response)
          var fileName = response.headers['content-disposition']
          // console.log(fileName)
          var blob = new Blob([response.data], {
            type: 'application/vnd.ms-excel'
          })
          var link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = that.place.schoolYearStart + '-' + that.place.schoolYearEnd + that.place.schoolName + '场地配置详情.xls'
          link.click()
        }).catch(function(error) {
          if (error.response) {
            // 存在请求，但是服务器的返回一个状态码
            console.log(error.response)
          } else {
            // 一些错误是在设置请求时触发的
            console.log('Error', error.message)
          }
          console.log(error.config)
        })
      },
      // 导入
      placeImport() {
        this.$router.push({ path: 'placeImport' })
      },
      changeRouter(){
        this.placeModel="1"
        this.$router.push({
          path:"placestats"
        })
      },

      downDoc() {
        let routeData = this.$router.resolve({
          name: "newPageHtml",
          query:{id:"teacherStats"}
        });
        window.open(routeData.href, "_blank");
      },
    },
    mounted() {
      this.permissionCode.forEach(val => {
        this.havePermissionArr[val] = isHavePermissions(val)
      })
    },
    created() {
      // 服务器前缀
      this.baseApi = (this.baseApi).replace(/"/g, '')
      // 组织数据
      this.schoolYearOptions = getSchoolYear()
      // this.place.schoolYear = this.schoolYearOptions[this.schoolYearOptions.length - 1].value
      this.place.schoolYear = this.schoolYearOptions[0].value
      this.schoolYearChange()
      this.search(this.place)
    }
  }

</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
