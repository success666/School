<template>
  <div>
    <el-radio-group v-model="placeModel" style="margin-bottom: 10px;" @change="changeRouter">
      <el-radio-button label="1">场地管理</el-radio-button>
      <el-radio-button label="2">场地统计</el-radio-button>
    </el-radio-group>

    <div class="search-form">
      <el-form :inline="true" :model="place" class="">
        <el-form-item label="学年">
          <el-select v-model="place.schoolYear" placeholder="请选择" size="mini">
            <el-option
              v-for="item in schoolYearOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getDetail" class="btn" size="mini">查询</el-button>
        </el-form-item>
        <el-form-item style="float: right" v-if="this.$route.query.type!=='1'">
          <el-button type="primary" @click="placeImport()" class="btn" size="mini">导入场地</el-button>
        </el-form-item>
        <el-form-item style="float: right" v-if="this.$route.query.type!=='1'">
          <el-button v-if="havePermissionArr['addField']" type="primary" @click="placeAdd()" class="btn" size="mini">添加场地</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="list">

      <div class="table-title">{{place.schoolYear}}{{place.schoolName}}场地配置</div>

      <el-form :model="placeForm" ref="PlaceForm">
        <el-form-item>
          <div class="custom">
            <table border="1" cellpadding="3" id="printTable" class="table">
              <tbody>
              <tr>
                <th>场地名称</th>
                <th>实际配置数量</th>
                <th>规格</th>
                <th>单位</th>
                <!--<th>达标配置标准</th>-->
                <th style="max-width: 300px;text-align: left">备注</th>
                <th></th>
              </tr>
              <tr v-for="(place, index) in placeForm.list">
                <td>
                  <el-row v-if='place.fieldId'>{{place.name}}</el-row>
                  <el-form-item v-else :prop="'list.'+index+'.otherField'">
                    <el-input style="min-width: 160px" class="input" v-model="place.otherField" placeholder="请输入"
                              size="mini"/>
                  </el-form-item>
                </td>
                <td>
                  <el-form-item :prop="'list.'+index+'.actualConfigQuantity'" :rules="{ validator: isInteger, trigger: 'blur' }">
                    <el-input style="min-width: 80px" class="input" v-model="place.actualConfigQuantity" placeholder="请输入"
                              size="mini"/>
                  </el-form-item>
                </td>
                <td>
                  <el-form-item :prop="'list.'+index+'.specifications'">
                    <el-select v-if='place.fieldId == 1' v-model="place.specifications" placeholder="请选择" size="mini">
                      <el-option
                        v-for="item in specificationOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <el-row v-else-if='place.fieldId'>-</el-row>
                    <el-input style="min-width: 160px" v-else class="input" v-model="place.otherFieldSpecifications"
                              placeholder="请输入" size="mini"/>
                  </el-form-item>
                </td>
                <td>
                  <el-row v-if='place.fieldId'>{{place.unit}}</el-row>
                  <el-form-item v-else :prop="'list.'+index+'.unit'">
                    <el-input style="min-width: 80px" class="input" v-model="place.unit" placeholder="请输入" size="mini"/>
                  </el-form-item>
                </td>
                <!--<td prop="standard">-->
                  <!--<el-row v-if='index<4'>{{place.standard}}</el-row>-->
                  <!--<el-form-item v-else :prop="'list.'+index+'.standard'">-->
                    <!--<el-input style="min-width: 160px" class="input" v-model="place.standard" placeholder="请输入"-->
                              <!--size="mini"/>-->
                  <!--</el-form-item>-->
                <!--</td>-->
                <td prop="remark" style="max-width: 300px;" align="left">
                  <el-form-item :prop="'list.'+index+'.remark'"
                                :rules="{ max: 35, message: '不得超过35个字！', trigger: 'blur' }">
                    <el-input style="min-width: 250px" class="input" v-model="place.remark" placeholder="不得超过35个字"
                              size="mini"/>
                  </el-form-item>
                </td>
                <td v-if="index>otherIndex-1 || index==(placeForm.list.length-1)" style="text-align: left;">
                  <el-form-item>
                    <img class="icon_style" style="margin-right: 10px" :src="index==otherIndex?icon_add:icon_minus" @click="addOrRemovePlace(index)">
                  </el-form-item>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="multi-action" style="text-align: center">
            <el-button @click="goback" size="mini">取消</el-button>
            <el-button type="primary" @click="onSubmit('PlaceForm')" class="btn" size="mini">保存</el-button>
          </div>
        </el-form-item>
      </el-form>

      <el-row style="padding-top: 120px;text-align: center;font-size: 10px;">
        <el-col :span="24">体育场地配置达标标准参考<a href="/static/【附件】国家学校体育卫生条件试行基本标准》（教体艺%5B2008%5D5号）.doc" style="color: #0077F0">《国家学校体育卫生条件试行基本标准》（教体艺[2008]5号）</a></el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
  import { isInteger } from '../../../utils/validate'
  import { getSchoolYear } from '@/utils/index'
  import { isHavePermissions } from '@/utils/auth'

  // 图片资源
  import icon_add from '@/assets/imgs/icon_teacher_file_add.png'
  import icon_minus from '@/assets/imgs/icon_teacher_file_minus.png'

  export default {
    name: 'PlaceForm',
    data() {
      return {
        icon_add: icon_add,
        icon_minus: icon_minus,
        isInteger: isInteger,
        otherIndex: 0,
        schoolYearOptions: [],
        specificationOptions: [{
          label: '200米环形',
          value: '1'
        }, {
          label: '300米环形',
          value: '2'
        }, {
          label: '300~400米环形',
          value: '3'
        }],
        placeForm: {
          name: '',
          actualConfigQuantity: '',
          specifications: '',
          unit: '',
          standard: '',
          remark: '',
          list: [],
          otherIds: ''
        },
        place: {
          schoolName: '',
          schoolYear: '',
          gradeId: '',
          classId: '',
          name: ''
        },
        placeModel: 1,
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
        this.$store.dispatch('DefaultPlace', place).then(response => {
          this.otherIndex=4;
          this.placeForm.list = response.data
          this.placeForm.list.forEach((val, index) => {
            val.fieldId = val.id
          })
          this.placeForm.list.push({
            unit: '',
            otherField: '',
            otherSpecifications: '',
            actualConfigQuantity: '',
            remark: ''
          })
        })
      },
      goback() {
        this.$router.push('/fieldManagement')
      },
      addOrRemovePlace(index) {
        if (index === this.otherIndex) {
          // 添加场地
          this.placeForm.list.push({
            unit: '',
            otherField: '',
            otherSpecifications: '',
            actualConfigQuantity: '',
            remark: ''
          })
        } else {
          // 删除场地
          if (index !== -1) {
            if (this.placeForm.list[index].id) {
              this.placeForm.otherIds += this.placeForm.list[index].id + ','
            }
            this.placeForm.list.splice(index, 1)
          }
        }
      },
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var type = this.$route.query.type
            if (type === '1') {
              var data = {}
              data.schoolFieldList = this.placeForm.list
              data.schoolFieldList = data.schoolFieldList.filter(field => field.otherField !== '')
              data.schoolFieldList.forEach((val, index) => {
                val.id = ''
              })
              var list = this.place.schoolYear.split('-')
              if (list.length > 0) {
                data.schoolYearStart = list[0]
                data.schoolYearEnd = list[1]
              }
              this.$store.dispatch('AddPlace', data).then(response => {
                this.$alert('保存成功!', '提示', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.$router.push('/fieldManagement')
                  }
                })
              })
            } else {
              var datas = {
                otherIds: this.placeForm.otherIds,
                schoolFieldList: this.placeForm.list
              }
              datas.schoolFieldList = datas.schoolFieldList.filter(field => field.otherField !== '')
              this.$store.dispatch('PlaceEdit', datas).then(response => {
                this.$alert('保存成功!', '提示', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.$router.push('/fieldManagement')
                  }
                })
              })
            }
          }
        })
      },

      changeRouter(){
        this.placeModel="1"
        this.$router.push({
          path:"placestats"
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
      // 导入
      placeImport() {
        this.$router.push({ path: 'placeImport' })
      },
      getDetail() {
        var list = this.place.schoolYear.split('-')
        var data = {}
        if (list.length > 0) {
          data.schoolYearStart = list[0]
          data.schoolYearEnd = list[1]
        }
        this.$store.dispatch('PlaceDetail', data).then(response => {
          if (response.data) {
            this.place.schoolName = response.data.schoolName
            this.placeForm.list = response.data.schoolFieldList
            this.placeForm.list.forEach((val, index) => {
              val.name = val.fieldName
              if (!val.specifications) {
                val.specifications = ''
              } else {
                val.specifications = val.specifications + ''
              }
              // val.otherFieldSpecifications = val.otherSpecifications
            })
            while (this.placeForm.list[0].otherField) {
              var item = this.placeForm.list.shift();
              this.placeForm.list = this.placeForm.list.splice(0);
              this.placeForm.list.push(item);
            }
            if (this.placeForm.list.length <= 4) {
              this.placeForm.list.push({
                unit: '',
                otherField: '',
                otherFieldSpecifications: '',
                actualConfigQuantity: '',
                remark: ''
              })
            } else if (this.placeForm.list.length <= 5) {
              this.placeForm.list.push({
                unit: '',
                otherField: '',
                otherFieldSpecifications: '',
                actualConfigQuantity: '',
                remark: ''
              })
            }
            for (var i = 0; i < this.placeForm.list.length; i++) {
              if (!this.placeForm.list[i].fieldId) {
                this.otherIndex = i
                break
              }
            }
          } else {
            this.search(this.place)
          }
        })
      }
    },
    created() {
    },
    mounted() {
      this.schoolYearOptions = getSchoolYear()
      // this.place.schoolYear = this.schoolYearOptions[this.schoolYearOptions.length - 1].value
      this.place.schoolYear = this.schoolYearOptions[0].value
      var type = this.$route.query.type
      if (this.$route.query.schoolYear) {
        this.place.schoolYear = this.$route.query.schoolYear
      }
      if (type === '1') {
        this.search(this.place)
      } else {
        this.getDetail()
      }
      this.permissionCode.forEach(val => {
        this.havePermissionArr[val] = isHavePermissions(val)
      })
    }
  }

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .custom table td {
    height: 60px;
  }
</style>
