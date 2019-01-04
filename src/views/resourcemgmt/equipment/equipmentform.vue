<template>

  <div>
    <div class="equipment-list-content">
      <el-row class="title">
        <el-col :span="24">添加器材</el-col>
      </el-row>
      <el-form ref="equipmentForm" :inline="true" :model="equipment">
        <el-form-item label="学年:" prop="date" :rules="[{ required: true, message: '学年不能为空' }]">
          <el-select v-model="equipment.date" placeholder="请选择学年" size="mini">
            <el-option
              v-for="item in schoolYearOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item>-->
          <!--<el-button type="primary" class="save-btn" @click="queryAction('equipmentForm')">查询</el-button>-->
        <!--</el-form-item>-->

        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item class="collapse custom" v-for="(ins,index) in equipment.equipmentData" :key="index" :name="index">
            <template slot="title">
              <span class="collapse-title-left">{{ins.equipmentCategoryName}}</span>
            </template>

            <table class="table">
              <tbody>
              <tr>
                <th v-for="(inss,indexs) in ['名称','实际配置数量','单位','备注']">{{inss}}</th>
              </tr>
              <tr v-for="(inss,indexs) in ins.equipmentDetailList">

                <td style="width: 15%;" v-if="inss.id != undefined">{{inss.name}}</td>
                <td style="width: 15%;padding-top: 20px;" v-else>
                  <el-form-item :prop="'equipmentData.' + index +'.equipmentDetailList.'+indexs+'.name'">
                    <el-input class="" v-model="inss.name" placeholder="请输入" size="mini"></el-input>
                  </el-form-item>
                </td>

                <td style="width: 15%;alignment: center;padding-top: 20px;" v-if="inss.id != undefined">
                  <el-form-item :prop="'equipmentData.' + index +'.equipmentDetailList.'+indexs+'.value'"
                                :rules="[{validator: isInteger,trigger: 'blur' }]">
                      <el-input class="" v-model="inss.value" placeholder="请输入" size="mini"></el-input>
                  </el-form-item>
                </td>
                <td style="width: 15%;alignment: center;padding-top: 20px;" v-else>
                  <el-form-item :prop="'equipmentData.' + index +'.equipmentDetailList.'+indexs+'.value'">
                    <el-input class="" v-model="inss.value" placeholder="请输入" size="mini"></el-input>
                  </el-form-item>
                </td>

                <td style="width: 15%" v-if="inss.id != undefined">{{inss.unit}}</td>
                <td style="width: 15%;padding-top: 20px;" v-else>
                  <el-form-item :prop="'equipmentData.' + index +'.equipmentDetailList.'+indexs+'.unit'">
                    <el-input class="" v-model="inss.unit" placeholder="请输入" size="mini"></el-input>
                  </el-form-item>
                </td>

                <td style="width: 55%;padding-left: 50px;padding-right: 50px;;padding-top: 20px;">
                  <el-form-item style="width: 100%"
                                :prop="'equipmentData.' + index +'.equipmentDetailList.'+indexs+'.remarks'"
                                :rules="[{max: 35, message: '不得超过35个字！', trigger: 'blur'}]">
                    <el-input style="width: 500px" v-model="inss.remarks" placeholder="请输入" size="mini"></el-input>
                    <img v-if="inss.id == undefined" class="icon_style" style="margin-left: 20px;" :src="indexs==0?icon_teacher_file_add:icon_teacher_file_minus" @click="addOhter(indexs)">
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
              <el-button type="primary" @click="onSubmit('equipmentForm')" class="save-btn">保存</el-button>
            </el-col>
          </el-row>
      </el-form>
      <el-row style="padding-top: 120px;text-align: center;font-size: 10px;">
        <el-col :span="24">体育器材配置达标标准参考<a href="/static/【附件】国家学校体育卫生条件试行基本标准》（教体艺%5B2008%5D5号）.doc" style="color: #0077F0">《国家学校体育卫生条件试行基本标准》（教体艺[2008]5号）</a></el-col>
      </el-row>
    </div>
  </div>


</template>

<script>
  import { isIntegerEquipment } from '../../../utils/validate'
  import { Message } from 'element-ui'
  import { getSchoolYear } from '@/utils/index'

  // 图片资源
  import icon_teacher_file_add from '@/assets/imgs/icon_teacher_file_add.png'
  import icon_teacher_file_minus from '@/assets/imgs/icon_teacher_file_minus.png'

  export default {

    name: 'equipmentForm',
    data() {
      return {
        icon_teacher_file_add: icon_teacher_file_add,
        icon_teacher_file_minus: icon_teacher_file_minus,
        isInteger: isIntegerEquipment,
        activeNames: [],
        schoolYearOptions: [],
        equipment: {
          date: '',
          equipmentData: []
        },
        // 新增器材数据容器
        addEquipmentData: {
          schoolYearStart: '',
          schoolYearEnd: '',
          schoolEquipmentList: []
        },
      }
    },
    methods: {
      handleChange(val) {
      },
      back() {
        this.$router.back()
      },
      onSubmit(equipment) {
        this.$refs[equipment].validate((valid) => {
          if (valid) {
            this.addEquipment()
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      // 获取默认器材
      getDefaultEquipment() {
        this.$store.dispatch('Defalut').then(response => {
          this.equipment.equipmentData = response.data
          // 其他器材
          this.equipment.equipmentData.push({
            equipmentCategoryId: null,
            equipmentCategoryName: '其它器材',
            equipmentDetailList: [{
              id: null,
              name: '',
              remarks: '',
              unit: '',
              value: ''
            }]
          })
          for (var i = 0; i < this.equipment.equipmentData.length; i++) {
            for (var j = 0; j < this.equipment.equipmentData[i].equipmentDetailList.length; j++) {
              this.equipment.equipmentData[i].equipmentDetailList[j].value = ''
              this.equipment.equipmentData[i].equipmentDetailList[j].remarks = ''
            }
            this.activeNames.push(i)
          }
        })
      },
      // 添加器材
      addEquipment() {
        // 学年数据解析
        var schoolYearArray = this.equipment.date.split('-')
        var params = {
          schoolYearStart: schoolYearArray[0], // 学年开始年份
          schoolYearEnd: schoolYearArray[1], // 学年结束年份
          schoolEquipmentList: [] // 学校器材集合
        }
        // 设置学校器材
        this.equipment.equipmentData.forEach(function(ins, index) {
          var equipmentDetailList = ins.equipmentDetailList
          equipmentDetailList.forEach(function(inschild, indexchild) {
            if (inschild.id === null) {
              // 设置其他器材
              if (inschild.value !== '' && inschild.name !== '' && inschild.value !== '' && inschild.unit !== '') {
                params.schoolEquipmentList.push({
                  equipmentId: null,
                  otherEquipment: inschild.name,
                  actualConfigQuantity: inschild.value === '' ? 0 : inschild.value,
                  unit: inschild.unit,
                  remark: inschild.remarks
                })
              }
            } else {
              // 设置系统预设的器材
              params.schoolEquipmentList.push({
                equipmentId: inschild.id,
                actualConfigQuantity: inschild.value === '' ? 0 : inschild.value,
                remark: inschild.remarks
              })
            }
          })
        })
        this.$store.dispatch('addEquipment', params).then(response => {
          Message({
            message: '添加成功',
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
      // 添加其他器材
      addOhter(index) {
        if (index === 0) {
          this.equipment.equipmentData[this.equipment.equipmentData.length - 1].equipmentDetailList.push({
            id: null,
            name: '',
            remarks: '',
            unit: '',
            value: ''
          })
        } else {
          this.equipment.equipmentData[this.equipment.equipmentData.length - 1].equipmentDetailList.splice(index, 1)
        }
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
      // this.equipment.date = this.schoolYearOptions[this.schoolYearOptions.length - 1].value
      this.equipment.date = this.schoolYearOptions[0].value
    },
    mounted() {
      this.getDefaultEquipment()
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
    text-align: left;
    font-weight: bold;
  }

</style>
