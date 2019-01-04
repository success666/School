<template>

  <div>

    <el-radio-group v-model="equipmentHeader" style="margin-bottom: 10px;">
      <el-radio-button label="1">器材管理</el-radio-button>
      <el-radio-button label="2">器材统计</el-radio-button>
    </el-radio-group>

    <el-form ref="equipmentEditForm" :inline="true" :model="equipment">
    <div class="search-form" style="margin-bottom: 15px;">
        <el-form-item label="学年:">
          <el-select v-model="equipment.date" placeholder="请选择" size="mini">
            <el-option
              v-for="item in schoolYearOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="save-btn" @click="search" size="mini">查询</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button v-if="havePermissionArr['addEquipment']" type="primary" class="save-btn" @click="addEquipment" size="mini">添加器材</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="primary" class="save-btn" @click="importHandle" size="mini">导入器材</el-button>
        </el-form-item>
    </div>

    <div class="equipment-list-content" v-if="equipment.equipmentData != null">
      <el-row class="title">
        <el-col :span="24">{{equipment.equipmentData.schoolYearStart}}-{{equipment.equipmentData.schoolYearEnd}}学年{{equipment.equipmentData.schoolName}}器材配置详情</el-col>
      </el-row>
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item class="collapse custom" v-for="(ins,index) in equipment.equipmentData.schoolEquipmentCategoryList" :key="index" :name="index">
            <template slot="title">
              <span class="collapse-title-left">{{ins.equipmentCategoryName}}</span>
            </template>

            <table class="table">
              <tbody>
              <tr>
                <th v-for="(inss,indexs) in ['名称','实际配置数量','单位','备注']">{{inss}}</th>
              </tr>
              <tr v-for="(inss,indexs) in ins.schoolEquipmentList">

                <td style="width: 15%;" v-if="inss.equipmentId != undefined">{{inss.equipmentName}}</td>
                <td style="width: 15%;padding-top: 20px;" v-else>
                  <el-form-item :prop="'equipmentData.schoolEquipmentCategoryList.' + index +'.schoolEquipmentList.'+indexs+'.otherEquipment'">
                    <el-input class="" v-model="inss.otherEquipment" placeholder="请输入" size="mini"></el-input>
                  </el-form-item>
                </td>

                <td style="width: 15%;alignment: center;padding-top: 20px;" v-if="inss.equipmentId != undefined">
                  <el-form-item :prop="'equipmentData.schoolEquipmentCategoryList.' + index +'.schoolEquipmentList.'+indexs+'.actualConfigQuantity'"
                                :rules="[{validator: isInteger,trigger: 'blur' }]">
                    <el-input class="" v-model="inss.actualConfigQuantity" placeholder="请输入" size="mini"></el-input>
                  </el-form-item>
                </td>
                <td style="width: 15%;alignment: center;padding-top: 20px;" v-else>
                  <el-form-item :prop="'equipmentData.schoolEquipmentCategoryList.' + index +'.schoolEquipmentList.'+indexs+'.actualConfigQuantity'">
                    <el-input class="" v-model.number="inss.actualConfigQuantity" placeholder="请输入" size="mini"></el-input>
                  </el-form-item>
                </td>

                <td style="width: 15%" v-if="inss.equipmentId != undefined">{{inss.unit}}</td>
                <td style="width: 15%;padding-top: 20px;" v-else>
                  <el-form-item :prop="'equipmentData.schoolEquipmentCategoryList.' + index +'.schoolEquipmentList.'+indexs+'.unit'">
                    <el-input class="" v-model="inss.unit" placeholder="请输入" size="mini"></el-input>
                  </el-form-item>
                </td>

                <td style="width: 55%;padding-left: 50px;padding-right: 50px;;padding-top: 20px;">
                  <el-form-item style="width: 100%"
                                :prop="'equipmentData.schoolEquipmentCategoryList.' + index +'.schoolEquipmentList.'+indexs+'.remark'"
                                :rules="[{max: 35, message: '不得超过35个字！', trigger: 'blur'}]">
                    <el-input style="width: 500px" v-model="inss.remark" placeholder="请输入" size="mini"></el-input>
                    <img v-if="inss.equipmentId == undefined" class="icon_style" style="margin-left: 20px;" :src="indexs==0?icon_teacher_file_add:icon_teacher_file_minus" @click="editOhter(indexs)">
                  </el-form-item>
                </td>
              </tr>
              </tbody>
            </table>

          </el-collapse-item>
        </el-collapse>
        <el-row class="btn-div">
          <el-col :span="24">
            <el-button @click="back" >取消</el-button>
            <el-button type="primary" @click="onSubmit('equipmentEditForm')" class="save-btn">保存</el-button>
          </el-col>
        </el-row>

      <el-row style="padding-top: 120px;text-align: center;font-size: 10px;">
        <el-col :span="24">体育器材配置达标标准参考<a href="/static/【附件】国家学校体育卫生条件试行基本标准》（教体艺%5B2008%5D5号）.doc" style="color: #0077F0">《国家学校体育卫生条件试行基本标准》（教体艺[2008]5号）</a></el-col>
      </el-row>
    </div>
    </el-form>
  </div>


</template>

<script>
  import { isIntegerEquipment } from '../../../utils/validate'
  import { Message } from 'element-ui'
  import { getSchoolYear } from '@/utils/index'
  import { isHavePermissions } from '@/utils/auth'

  // 图片资源
  import icon_teacher_file_add from '@/assets/imgs/icon_teacher_file_add.png'
  import icon_teacher_file_minus from '@/assets/imgs/icon_teacher_file_minus.png'

  export default {

    name: 'equipmentEditForm',
    data() {
      return {
        equipmentHeader: 1,
        icon_teacher_file_add: icon_teacher_file_add,
        icon_teacher_file_minus: icon_teacher_file_minus,
        isInteger: isIntegerEquipment,
        activeNames: [],
        schoolYearOptions: [],
        deleteEquipmentids: [],
        equipment: {
          date: '',
          equipmentData: []
        },
        havePermissionArr: {
          addEquipment: false,
          updateEquipment: false
        },
        permissionCode: ['addEquipment', 'updateEquipment']
      }
    },
    methods: {
      // 请求查询器材详情接口
      search() {
        this.equipment.equipmentData = null
        var schoolYearArray = this.equipment.date.split('-')
        var params = {
          schoolYearStart: schoolYearArray[0],
          schoolYearEnd: schoolYearArray[1]
        }
        this.$store.dispatch('Details', params).then(response => {
          this.equipment.equipmentData = response.data
          var hasOther = false
          for (var i = 0; i < this.equipment.equipmentData.schoolEquipmentCategoryList.length; i++) {
            if (this.equipment.equipmentData.schoolEquipmentCategoryList[i].equipmentCategoryId === 8) {
              hasOther = true
            }
          }
          if (!hasOther) {
            this.equipment.equipmentData.schoolEquipmentCategoryList.push({
              equipmentCategoryId: null,
              equipmentCategoryName: '其它器材',
              schoolEquipmentList: [{
                id: null,
                equipmentId: null,
                equipmentName: '',
                otherEquipment: '',
                remark: '',
                unit: '',
                actualConfigQuantity: ''
              }]
            })
          }

          this.deleteEquipmentids = []
          if (this.equipment.equipmentData !== undefined && this.equipment.equipmentData !== null) {
            for (var i = 0; i < this.equipment.equipmentData.schoolEquipmentCategoryList.length; i++) {
              this.activeNames.push(i)
            }
          }
        })
      },
      // 编辑其他类器材
      editOhter(index) {
        if (index === 0) {
          this.equipment.equipmentData.schoolEquipmentCategoryList[this.equipment.equipmentData.schoolEquipmentCategoryList.length - 1].schoolEquipmentList.push({
            id: null,
            remark: '',
            unit: '',
            actualConfigQuantity: '',
            equipmentId: null,
            equipmentName: '',
            otherEquipment: ''
          })
        } else {
          if (this.equipment.equipmentData.schoolEquipmentCategoryList[this.equipment.equipmentData.schoolEquipmentCategoryList.length - 1].schoolEquipmentList[index].id !== null) {
            this.deleteEquipmentids.push(this.equipment.equipmentData.schoolEquipmentCategoryList[this.equipment.equipmentData.schoolEquipmentCategoryList.length - 1].schoolEquipmentList[index].id)
          }
          this.equipment.equipmentData.schoolEquipmentCategoryList[this.equipment.equipmentData.schoolEquipmentCategoryList.length - 1].schoolEquipmentList.splice(index, 1)
        }
      },
      // 请求编辑器材接口
      edit() {
        var delIds = ''
        this.deleteEquipmentids.forEach(function(ins, index) {
          delIds = delIds + ((index === 0) ? '' : ',') + ins
        })
        var params = {
          otherIds: delIds,
          schoolEquipmentList: []
        }
        for (var i = 0; i < this.equipment.equipmentData.schoolEquipmentCategoryList.length; i++) {
          for (var j = 0; j < this.equipment.equipmentData.schoolEquipmentCategoryList[i].schoolEquipmentList.length; j++) {
            var obj = this.equipment.equipmentData.schoolEquipmentCategoryList[i].schoolEquipmentList[j]
            if (obj.unit === '' || obj.otherEquipment === '') {
              continue
            }
            var equipmentParam = {}
            if (obj.id === null) {
              equipmentParam = {
                actualConfigQuantity: obj.actualConfigQuantity === '' ? 0 : obj.actualConfigQuantity,
                unit: obj.unit,
                otherEquipment: obj.otherEquipment,
                remark: obj.remark
              }
            } else {
              equipmentParam = {
                id: obj.id,
                actualConfigQuantity: obj.actualConfigQuantity === '' ? 0 : obj.actualConfigQuantity,
                unit: obj.unit,
                otherEquipment: obj.otherEquipment,
                remark: obj.remark
              }
            }
            // console.log(equipmentParam)
            params.schoolEquipmentList.push(equipmentParam)
          }
        }
        this.$store.dispatch('editEquipment', params).then(response => {
          Message({
            message: '编辑成功',
            type: 'success',
            duration: 2 * 1000
          })
          this.$router.push({
            name:"EquipmentList",
            params:{
              type:"update",
              date:this.equipment.date
            }
          })
        })
      },
      // 跳转添加器材页面
      addEquipment() {
        this.$router.push({ path: 'equipmentForm' })
      },
      handleChange(val) {
      },
      // 返回
      back() {
        this.$router.back()
      },
      // 跳转至导入
      importHandle() {
        this.$router.push({ path: 'equipmentImport' })
      },
      // 保存按钮响应事件
      onSubmit(equipment) {
        this.$refs[equipment].validate((valid) => {
          if (valid) {
            this.edit()
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    },
    beforeRouteLeave(to, from, next) {
      if (to.name === 'EquipmentList' || to.name === 'EquipmentForm') {
        var condition = JSON.stringify({
          date: this.equipment.date
        })
        localStorage.setItem('Equipment', condition)
      } else {
        localStorage.removeItem('Equipment')
      }
      next()
    },
    created() {
      this.schoolYearOptions = getSchoolYear()

      var condition = localStorage.getItem('Equipment')
      if (condition != null) {
        var data = JSON.parse(condition)
        this.equipment.date = data.date
      } else {
        // this.equipment.date = this.schoolYearOptions[this.schoolYearOptions.length - 1].value
        this.equipment.date = this.schoolYearOptions[0].value
      }
    },
    mounted() {
      this.deleteEquipmentids = []
      this.search()

      this.permissionCode.forEach(val => {
        this.havePermissionArr[val] = isHavePermissions(val)
      })
    }
  }
</script>


<style rel="stylesheet/scss" lang="scss" scoped>
  .equipment-list-content {
    background-color: white;
    border-radius: 10px;
    padding: 25px;
  }

  .equipment-list-content .title {
    padding: 10px;
    padding-left: 0px;
    text-align: center;
    font-weight: bold;
    font-size: 20px;
  }

</style>
