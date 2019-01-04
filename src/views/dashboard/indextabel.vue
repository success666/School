<template>
    <div class="search-form">
      <div class="title">{{title}}</div>
      <div class="subTitle">{{subTitle}}</div>
      <el-table :data="datas" :cell-style="{textAlign: 'center'}" :header-cell-style="{textAlign: 'center'}">
        <el-table-column v-for="(item, index) in param.headers"
                         :label="item.label" :key="index">
          <template slot-scope="scope">
            <span v-if="item.prop == 'className'">
              {{scope.row.gradeName}}{{scope.row.className}}
            </span>
            <span v-if="item.prop == 'schoolName'">
              {{scope.row.posCityName}}{{scope.row.schoolName}}
            </span>
            <span v-if="item.prop == 'sex' && scope.row.sex === 1">男</span>
            <span v-if="item.prop == 'sex' && scope.row.sex === 2">女</span>
            <span v-if="item.prop != 'sex' && item.prop != 'className' && !item.hasUnit && item.prop != 'schoolName'">{{scope.row[item.prop]}}</span>
            <span v-if="item.prop != 'sex' && item.prop != 'className' && item.hasUnit && item.prop != 'schoolName'">{{scope.row[item.prop]}}{{param.unit}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <span class="demonstration"></span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="param.pageNum"
          :page-sizes="[10, 20, 30]"
          :page-size="param.pageSize"
          layout="prev, pager, next, sizes, jumper" backgroud=""
          :total="param.total">
        </el-pagination>
      </div>
    </div>
</template>

<script>
    export default {
      name: 'IndexTabel',
      data() {
        return {
          headers: [],
          datas: [],
          title: '',
          subTitle: '',
          initParam: {
            type: '',
            school: '',
            district: '',
            city: '',
            schoolYear: ''
          },
          param: {
            pageNum: 1,
            pageSize: 10,
            total: 10
          },
          classExcellentRate: {
            unit: '%',
            path: 'ClassExcellentRate',
            headers: [
              {
                label: '班级名称',
                prop: 'className',
                hasUnit: false
              },
              {
                label: '优良率',
                prop: 'excellentRate',
                hasUnit: true
              }
            ],
            pageNum: 1,
            pageSize: 10,
            total: 0
          },
          classQuaRate: {
            unit: '%',
            path: 'ClassQuaRate',
            headers: [
              {
                label: '班级名称',
                prop: 'className',
                hasUnit: false
              },
              {
                label: '合格率',
                prop: 'qualifiedRate',
                hasUnit: true
              }
            ],
            pageNum: 1,
            pageSize: 10,
            total: 0
          },
          schoolQuaRate: {
            unit: '%',
            path: 'SchoolQuaRate',
            headers: [
              {
                label: '学校名称',
                prop: 'schoolName',
                hasUnit: false
              },
              {
                label: '类型',
                prop: 'schoolTypeName',
                hasUnit: false
              },
              {
                label: '合格率',
                prop: 'qualifiedRate',
                hasUnit: true
              }
            ],
            pageNum: 1,
            pageSize: 10,
            total: 0
          },
          stuUnquaRate: {
            unit: '',
            path: 'StuUnquaRate',
            headers: [
              {
                label: '姓名',
                prop: 'name',
                hasUnit: false
              },
              {
                label: '性别',
                prop: 'sex',
                hasUnit: false
              },
              {
                label: '班级',
                prop: 'className',
                hasUnit: false
              },
              {
                label: '综合体质分数',
                prop: 'healthTestScore',
                hasUnit: false
              }
            ],
            pageNum: 1,
            pageSize: 10,
            total: 0
          },
          schoolExcellentRate: {
            unit: '%',
            path: 'SchoolExcellentRate',
            headers: [
              {
                label: '学校名称',
                prop: 'schoolName',
                hasUnit: false
              },
              {
                label: '类型',
                prop: 'schoolTypeName',
                hasUnit: false
              },
              {
                label: '合格率',
                prop: 'excellentRate',
                hasUnit: true
              }
            ],
            pageNum: 1,
            pageSize: 10,
            total: 0
          },
          lessThanOneHour: {
            unit: 'min',
            path: 'LessThanOneHour',
            headers: [
              {
                label: '姓名',
                prop: 'name',
                hasUnit: false
              },
              {
                label: '性别',
                prop: 'sex',
                hasUnit: false
              },
              {
                label: '班级',
                prop: 'className',
                hasUnit: false
              },
              {
                label: '运动时长',
                prop: 'sportTime',
                hasUnit: true
              }
            ],
            pageNum: 1,
            pageSize: 10,
            total: 0
          },
          moreThanOneHour: {
            unit: 'min',
            path: 'MoreThanOneHour',
            headers: [
              {
                label: '姓名',
                prop: 'name',
                hasUnit: false
              },
              {
                label: '性别',
                prop: 'sex',
                hasUnit: false
              },
              {
                label: '班级',
                prop: 'className',
                hasUnit: false
              },
              {
                label: '运动时长',
                prop: 'sportTime',
                hasUnit: true
              }
            ],
            pageNum: 1,
            pageSize: 10,
            total: 0
          },
          notAttend: {
            unit: '次',
            path: 'NotAttend',
            headers: [
              {
                label: '姓名',
                prop: 'name',
                hasUnit: false
              },
              {
                label: '性别',
                prop: 'sex',
                hasUnit: false
              },
              {
                label: '班级',
                prop: 'className',
                hasUnit: false
              }
            ],
            pageNum: 1,
            pageSize: 10,
            total: 0
          }
        }
      },
      methods: {
        handleSizeChange(val) {
          this.param.pageSize = val
          this.search()
        },
        // 当前页跳转
        handleCurrentChange(val) {
          this.param.pageNum = val
          this.search()
        },
        init() {
          switch (this.initParam.type) {
            case 1:
              this.param = this.classExcellentRate
              this.title = this.initParam.schoolYear + '学年' + this.initParam.city + this.initParam.school + '综合体质优良率低于25%的班级列表'
              this.subTitle = '全校优良率：' + this.initParam.phyCount.excellentRate + '%'
              break
            case 2:
              this.param = this.classQuaRate
              this.param.posDistrictId = this.initParam.posDistrictId
              this.title = this.initParam.schoolYear + '学年' + this.initParam.city + this.initParam.school + '综合体质合格率低于94%的班级列表'
              this.subTitle = '全校合格率：' + this.initParam.phyCount.qualifiedRate + '%'
              break
            case 3:
              this.param = this.schoolQuaRate
              this.param.posDistrictId = this.initParam.posDistrictId
              this.title = this.initParam.schoolYear + '学年' + this.initParam.city + this.initParam.district + '综合体质合格率详情列表'
              this.subTitle = '全区合格率：' + this.initParam.phyCount.districtQualifiedRate + '%'
              break
            case 4:
              this.param = this.stuUnquaRate
              this.title = this.initParam.schoolYear + '学年' + this.initParam.city + this.initParam.school + '综合体质不合格的学生列表'
              break
            case 5:
              this.param = this.schoolExcellentRate
              this.param.posDistrictId = this.initParam.posDistrictId
              this.title = this.initParam.schoolYear + '学年' + this.initParam.city + this.initParam.district + '综合体质优良率详情列表'
              this.subTitle = '全区优良率：' + this.initParam.phyCount.districtExcellentRate + '%'
              break
            case 6:
              this.param = this.lessThanOneHour
              this.title = this.initParam.preDateTime + this.initParam.city + this.initParam.school + '运动未达1小时的学生列表'
              break
            case 7:
              this.param = this.moreThanOneHour
              this.title = this.initParam.preDateTime + this.initParam.city + this.initParam.school + '运动超过1小时的学生列表'
              break
            case 8:
              this.param = this.notAttend
              this.title = this.initParam.preDateTime + this.initParam.city + this.initParam.school + '未参加运动的学生列表'
              break
          }
          this.search()
        },
        search() {
          // console.log(this.param.path)
          // console.log(typeof this.param.path)
          this.$store.dispatch(this.param.path, { pageSize: this.param.pageSize, pageNum: this.param.pageNum, posDistrictId: this.param.posDistrictId }).then(response => {
            if (response.data.list) {
              this.datas = response.data.list
              this.param.total = response.data.total
            } else {
              this.datas = response.data
            }
          })
        }
      },
      mounted() {
        this.init()
      },
      created() {
        var condition = localStorage.getItem('indexCondition')
        if (condition != null) {
          this.initParam = JSON.parse(condition)
        }
      }
    }
</script>

<style scoped>
  .title{
    width: 100%;
    height: 80px;
    line-height: 80px;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
  }
  .subTitle{
    width: 100%;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
  }
</style>
