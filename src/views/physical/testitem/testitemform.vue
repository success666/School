<template>
  <div class="content">
    <el-form ref="testItem" :model="testItem" :rules="rules" label-width="80px" size="mini" class="form-tab">
      <el-row>
        <el-col>
          <el-form-item label="学年：" prop="schoolYear">
            <el-select v-model="testItem.schoolYear" placeholder="请选择" @change="schoolYearChange">
              <el-option
                v-for="item in schoolYearOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="姓名：" style="width: 250px;float: left" prop="name">
            <el-input v-model="testItem.name" placeholder="请输入学生姓名" class="text-input"></el-input>
          </el-form-item>
          <el-form-item label="性别：" style="width: 250px;float: left" prop="sex">
            <el-radio-group v-model="testItem.sex" @change="changeRadio">
              <el-radio label=1>男</el-radio>
              <el-radio label=2>女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="年级：" style="width: 250px;float: left" prop="gradeId" >
            <el-select @change="getTestItems" v-model="testItem.gradeId" placeholder="请选择" style="width: 100px;" >
              <el-option
                v-for="item in gradeOptions"
                :key="item.gradeId"
                :label="item.gradeName"
                :value="item.gradeId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="班级：" style="width: 200px;float: left" prop="classId">
            <el-select v-model="testItem.classId" placeholder="请选择" style="width: 100px;" @change="getClassName">
            <!--<el-select v-model="testItem.classId" placeholder="请选择" style="width: 100px;">-->
              <el-option
                v-for="item in classOptions"
                :key="item.dictClassId"
                :label="item.dictClassName"
                :value="item.dictClassId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="border-bottom: 1px solid #e6e6e6;">
        <el-col>
          <el-form-item label="身份证/国外护照：" label-width="160px" prop="identityType" style="width: 350px;float: left">

            <el-select v-model="testItem.identityType" placeholder="请选择" @change="identityTypeChange">
              <el-option
                v-for="item in identityTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label-width="0px" prop="identityNo" style="width: 250px;float: left">
            <el-input v-model="testItem.identityNo" style="width: 250px;" placeholder="请输入证件号码" class="text-input"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="testItem.identityType !== 1">
        <el-col>
          <el-form-item label="出生日期：" label-width="105px" class="born-date" :rules="{ required: true, message: '请选出生日期', trigger: 'change' }">
            <el-date-picker
              v-model="testItem.birthday" :picker-options="pickerDate"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="体测时间：" label-width="110px" prop="healthTestTime">
            <el-date-picker
              v-model="testItem.healthTestTime"
              type="date" :picker-options="pickerDate"
              >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-collapse v-model="activeArr">
            <el-collapse-item class="collapse" v-for="(ins, index) of itemList " :key="index" :name="index+1+''">
              <template slot="title">
                <span class="collapse-title-left">{{ ins.categoryName }}</span>
              </template>
              <table class="table" style="width: 100%">
                <tbody>
                <tr>
                  <th v-for="val in tableHeaderArray">{{val}}</th>
                </tr>
                <template  v-for="(obj, ind) of ins.physicalTestItemListResponseBeanList">
                  <tr :key="ind" v-if="(obj.code!='bodyMassIndex'&&testItem.id === '')||testItem.id !== ''">
                    <td style="width: 33%;text-align: center">
                      <span v-if="obj.name != null && obj.name != ''">{{obj.name}}</span>
                      <span v-else>-</span>
                    </td>
                    <td style="width: 33%;text-align: center" v-if="obj.attrType==1">
                      <el-input style="width: 100px" v-if="testItem.id !== ''" :disabled="obj.code=='bodyMassIndex'" v-model="items[index].item[ind].value"  v-bind:id="obj.code" v-bind:name="obj.code"   @blur="checkAndBind(obj.validRegex, obj.containBoundary, obj.resultRangeStart, obj.resultRangeEnd)"></el-input>
                      <el-input style="width: 100px" v-if="testItem.id === ''" v-bind:id="obj.code" v-bind:name="obj.code"  @blur="checkAndBind(obj.validRegex, obj.containBoundary, obj.resultRangeStart, obj.resultRangeEnd)"></el-input>
                      <span style="width: 80px;color: red;" v-if="items[index].item[ind].flag">请输入正确信息！</span>
                    </td>

                    <td style="width: 33%;text-align: center" v-if="obj.attrType==2">
                      <!--第一个输入框-->
                      <el-input style="width: 80px"  v-model="minValue" v-bind:id="obj.code" v-bind:name="obj.code"  @blur="checkAndBind(obj.validRegex, obj.containBoundary, obj.resultRangeStart, obj.resultRangeEnd)"></el-input>
                      <b >′</b>
                      <!--第二个输入框-->
                      <el-input style="width: 80px" v-if="testItem.id !== ''" v-model="secondValue"  v-bind:id="obj.code" v-bind:name="obj.code"  @blur="checkAndBindSecond(obj.validRegex, obj.containBoundary, obj.resultRangeStart, obj.resultRangeEnd)"></el-input>
                      <b >″</b>
                      <span style="width: 80px;color: red;" v-if="items[index].item[ind].flag">请输入正确信息！</span>
                    </td>
                    <td style="width: 33%;text-align: center">
                      <span v-if="obj.unit != null && obj.unit != ''">{{obj.unit}}</span>
                    </td>
                  </tr>
                </template>
                
                </tbody>
              </table>
            </el-collapse-item>
          </el-collapse>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item size="large" style="text-align: center;" class="form-action">
            <el-button @click="goBack">取消</el-button>
            <el-button type="primary" :disabled="submitFlag" @click="onSubmit('testItem')">保存</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import '@/styles/common.scss'
  import { formatDate, getSchoolYear } from '@/utils/index'

  export default {
    name: 'TestItemForm',
    methods: {
      isNumber(event, regular, boundary, start, end) {
        var indexs = '';
        var innerIndex = '';
        this.items.forEach((val, index) => {
          val.item.forEach((v, i) => {
            if (v.id === event.target.id) {
              indexs = index;
              innerIndex = i
            }
          })
        })
        if (event.target.value !== '') {
          // const re = new RegExp(regular);
          let re;
          if (regular) {
            re = new RegExp(regular);
          } else {
            re = /^[0-9]+(.[0-9]{1})?$/;
          }
          const rsCheck = re.test(event.target.value);
          if (!rsCheck) {
            this.$set(this.items[indexs].item[innerIndex], 'flag', true)
          } else {
            const value = parseFloat(event.target.value);
            if (boundary === 1) {
              if (start == null) {
                if (end == null) {
                  this.$set(this.items[indexs].item[innerIndex], 'flag', true)
                } else {
                  if (value < end) {
                    this.$set(this.items[indexs].item[innerIndex], 'flag', false)
                  } else {
                    this.$set(this.items[indexs].item[innerIndex], 'flag', true)
                  }
                }
              } else if (end == null) {
                if (value >= start) {
                  this.$set(this.items[indexs].item[innerIndex], 'flag', false)
                } else {
                  this.$set(this.items[indexs].item[innerIndex], 'flag', true)
                }
              } else {
                if (value >= start && value < end) {
                  this.$set(this.items[indexs].item[innerIndex], 'flag', false)
                } else {
                  this.$set(this.items[indexs].item[innerIndex], 'flag', true)
                }
              }
            } else if (boundary === 2) {
              if (start == null) {
                if (end == null) {
                  this.$set(this.items[indexs].item[innerIndex], 'flag', true)
                } else {
                  if (value <= end) {
                    this.$set(this.items[indexs].item[innerIndex], 'flag', false)
                  } else {
                    this.$set(this.items[indexs].item[innerIndex], 'flag', true)
                  }
                }
              } else if (end == null) {
                if (value > start) {
                  this.$set(this.items[indexs].item[innerIndex], 'flag', false)
                } else {
                  this.$set(this.items[indexs].item[innerIndex], 'flag', true)
                }
              } else {
                if (value > start && value <= end) {
                  this.$set(this.items[indexs].item[innerIndex], 'flag', false)
                } else {
                  this.$set(this.items[indexs].item[innerIndex], 'flag', true)
                }
              }
            } else if (boundary === 3) {
              if (start == null) {
                if (end == null) {
                  this.$set(this.items[indexs].item[innerIndex], 'flag', true)
                } else {
                  if (value < end) {
                    this.$set(this.items[indexs].item[innerIndex], 'flag', false)
                  } else {
                    this.$set(this.items[indexs].item[innerIndex], 'flag', true)
                  }
                }
              } else if (end == null) {
                if (value > start) {
                  this.$set(this.items[indexs].item[innerIndex], 'flag', false)
                } else {
                  this.$set(this.items[indexs].item[innerIndex], 'flag', true)
                }
              } else {
                if (value >= start && value <= end) {
                  this.$set(this.items[indexs].item[innerIndex], 'flag', false)
                } else {
                  this.$set(this.items[indexs].item[innerIndex], 'flag', true)
                }
              }
            } else if (boundary === 4) {
              if (start == null) {
                if (end == null) {
                  this.$set(this.items[indexs].item[innerIndex], 'flag', true)
                } else {
                  if (value < end) {
                    this.$set(this.items[indexs].item[innerIndex], 'flag', false)
                  } else {
                    this.$set(this.items[indexs].item[innerIndex], 'flag', true)
                  }
                }
              } else if (end == null) {
                if (value > start) {
                  this.$set(this.items[indexs].item[innerIndex], 'flag', false)
                } else {
                  this.$set(this.items[indexs].item[innerIndex], 'flag', true)
                }
              } else {
                if (value > start && value < end) {
                  this.$set(this.items[indexs].item[innerIndex], 'flag', false)
                } else {
                  this.$set(this.items[indexs].item[innerIndex], 'flag', true)
                }
              }
            } else {
              this.$set(this.items[indexs].item[innerIndex], 'flag', true)
            }
          }
        } else {
          this.$set(this.items[indexs].item[innerIndex], 'flag', false)
        }
      },
      goBack() {
        this.$router.push('physicalManageSecondary1')
      },
      identityTypeChange() {
        if (this.testItem.identityType !== 1) {
          this.isShowDate = true
        } else {
          this.isShowDate = false
        }
      },
      schoolYearChange() {
        this.testItem.classId = ''
        if (this.testItem.gradeId !== '') {
          this.getClass()
        }
      },
      changeRadio(val){
        this.$store.dispatch('GetTestItem', { 'sex': this.testItem.sex, 'gradeId': this.testItem.gradeId }).then(response => {
          this.itemList.forEach(item=>{
            item.physicalTestItemListResponseBeanList.forEach(item1=>{
              if(typeof this.testItem[item1.code]!="undefined"){
                  delete this.testItem[item1.code];
              }
            })
          })
          this.itemList = response.data;
          this.items = []
          this.itemList.forEach((val, index) => {
            var arr = []
            val.physicalTestItemListResponseBeanList.forEach((v, i) => {
              var value = { 'value': v.result, flag: false, id: v.code };
              this.$set(this.testItem, v.code, v.result);
              arr.push(value)
            })
            var i = { 'item': arr }
            this.items.push(i)
          });
          this.testItem.classId = '';
          this.minValue="";
          this.secondValue="";
          this.getClass();
        }).catch(err => {
          this.$message.error('体测信息列表请求失败');
        })
      },
      getTestItems(value) {
        this.$store.dispatch('GetTestItem', { 'sex': this.testItem.sex, 'gradeId': this.testItem.gradeId }).then(response => {
          this.itemList.forEach(item=>{
            item.physicalTestItemListResponseBeanList.forEach(item1=>{
              if(typeof this.testItem[item1.code]!="undefined"){
                  delete this.testItem[item1.code];
              }
            })
          })
          this.itemList = response.data;
          this.items = []
          this.itemList.forEach((val, index) => {
            var arr = []
            val.physicalTestItemListResponseBeanList.forEach((v, i) => {
              var value = { 'value': v.result, flag: false, id: v.code }
              this.$set(this.testItem, v.code, v.result);
              arr.push(value)
            })
            var i = { 'item': arr }
            this.items.push(i)
          });
          this.testItem.classId = '';
          this.minValue="";
          this.secondValue="";
          this.getClass();
        }).catch(err => {
          this.$message.error('体测信息列表请求失败');
        })
        // this.getClass();
        if (value) {
          let obj = {};
          obj = this.gradeOptions.find((item) => {
            return item.gradeId === value
          })
          this.testItem.schoolGradeName = obj.gradeName;
          // this.schoolTypeGradeId = obj.id
        }
      },
      getClass() {
        var data = {};
        for (let i = 0; i < this.gradeOptions.length; i++) {
          if (this.testItem.gradeId == this.gradeOptions[i].gradeId) {
            data.schoolTypeGradeId = this.gradeOptions[i].id;
          }
        }
        var list = this.testItem.schoolYear.split('-')
        if (list.length > 0) {
          data.schoolYearStart = list[0]
          data.schoolYearEnd = list[1]
        }
        this.$store.dispatch('GetClass', data).then(response => {
          this.classOptions = response.data;
          // this.testItem.schoolId = response.data.schoolId;
        }).catch(err => {
          this.$message.error('班级数据请求失败');
        })
        // this.testItem.classId = ''
      },
      getClassName(value) {
        let obj = {}
        obj = this.classOptions.find((item) => {
          return item.dictClassId === value
        })
        this.testItem.schoolClassName = obj.dictClassName;
        this.testItem.schoolId = obj.schoolId;
      },
      getGrade() {
        this.$store.dispatch('GetGrade').then(response => {
          this.gradeOptions = response.data;
          if (this.testItem.gradeId !== '') {
            this.getTestItems();
            this.getClass();
          }
          this.detailRequest()
        }).catch(err => {
          this.$message.error('年级数据请求失败');
        })
      },
      changeSecend: function(event) {
        if (event == null) {
          return ['', '']
        } else {
          return event.replace("″", '').split('′')
        }
      },
      checkAndBind: function(regular, boundary, start, end) {
        this.isNumber(event, regular, boundary, start, end);
        this.$set(this.testItem, event.target.id, event.target.value);
        this.submitFlag = false
      },
      checkAndBindSecond: function(regular, boundary, start, end) {
        this.isNumber(event, regular, 1, start, 60);
        this.$set(this.testItem, event.target.id, event.target.value);
        this.submitFlag = false
      },
      onSubmit(formName) {
        var that = this;
        that.submitFlag = true;
        var flag = true;
        that.items.forEach((val, index) => {
          val.item.forEach((v, i) => {
            if (v.flag) {
              flag = false;
              return
            }
          })
        })
        that.$refs[formName].validate((valid) => {
          if (valid && flag) {
            var list = this.testItem.schoolYear.split('-');
            if (list.length > 0) {
              that.testItem.schoolYearStart = list[0];
              that.testItem.schoolYearEnd = list[1]
            }
            var user = JSON.parse(window.localStorage.getItem('ydl_user'));
            that.testItem.userId = user.userId;
            that.testItem.healthTestTime = formatDate(that.testItem.healthTestTime, 'yyyy-MM-dd');
            let value =  Number(that.minValue)*60 + Number(that.secondValue);
            that.itemList.forEach((item, index) => {
              item.physicalTestItemListResponseBeanList.forEach((v, i) => {
                if (v.attrType==2) {
                  that.fieldName = v.code;
                }
              })
            });
            if(that.fieldName){
              if(value==0){
                that.testItem[that.fieldName]=null;
              }else{
                that.testItem[that.fieldName]=value;
              }
            }
            if (that.testItem.fiftyMeterRun) {
              that.testItem.fiftyMeterRun = that.testItem.fiftyMeterRun.replace("″", '');
            }
            that.$store.dispatch('AddTestItem', this.testItem).then(response => {
              that.$alert('保存成功', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  that.$router.push({
                    name: 'TestItemList',
                    params: {
                      schoolYear: that.testItem.schoolYear,
                      type: 'update'
                    }
                  })
                }
              })
            })
          } else {
            that.$alert('请完成必填/选项!', '提示', {
              confirmButtonText: '确定',
              callback: action => {
              }
            })
          }
        })
        that.submitFlag = false
      },
      detailRequest() { // 初始化的请求
        var id = this.$route.query.id;
        if (typeof id !== 'undefined' && id !== '') {
          var testItem = {
            id: id,
            type:1,
          };
          this.$store.dispatch('GetTestItemDetail', testItem).then(response => {
            var time = response.data.healthTestTime.replace('T', ' ');
            this.testItem.gradeId = response.data.gradeId;
            this.testItem.classId = response.data.classId;
            this.getClass();
            setTimeout(() => {
              var b = formatDate(time, 'yyyy-MM-dd');
              response.data.healthTestTime = b;
              for (let name in response.data) {
                if (typeof this.testItem[name] !== 'undefined') {
                  this.testItem[name] = response.data[name]
                }
              }
              // this.testItem = response.data;
              this.testItem.schoolYear = this.testItem.schoolYearStart + '-' + this.testItem.schoolYearEnd;
              this.testItem.healthTestTime = b;
              this.testItem.sex = this.testItem.sex + '';
              this.testItem.id = id;
              this.itemList = response.data.physicalTestItemCategoryResponseBeanList;
              this.itemList.forEach((val, index) => {
                var arr = [];
                val.physicalTestItemListResponseBeanList.forEach((v, i) => {
                  var value = { 'value': v.result, flag: false, id: v.code };
                  this.$set(this.testItem, v.code, v.result);
                  arr.push(value);
                  if (v.attrType==2) {
                    this.fieldName = v.code;
                    let value = this.changeSecend(v.result);
                    if (value.length > 1) {
                      this.minValue = value[0];
                      this.secondValue = value[1];
                    } else {
                      this.minValue = 0;
                      this.secondValue = value[0];
                    }
                  }
                });
                var i = { 'item': arr };
                this.items.push(i)
              }, 1000)
            })
            this.testItem.id = id
          }).catch(err => {
            this.$message.error('体测详情请求失败');
          })
        }
      }
    },
    data() {
      var checkIdentityNo = (rule, value, callback) => {
        if (typeof value !== 'string') return callback(new Error('非法身份证'))
        if (value.length === 0) return callback(new Error('身份证号码必填'))
        var city = {
          11: '北京',
          12: '天津',
          13: '河北',
          14: '山西',
          15: '内蒙古',
          21: '辽宁',
          22: '吉林',
          23: '黑龙江 ',
          31: '上海',
          32: '江苏',
          33: '浙江',
          34: '安徽',
          35: '福建',
          36: '江西',
          37: '山东',
          41: '河南',
          42: '湖北 ',
          43: '湖南',
          44: '广东',
          45: '广西',
          46: '海南',
          50: '重庆',
          51: '四川',
          52: '贵州',
          53: '云南',
          54: '西藏 ',
          61: '陕西',
          62: '甘肃',
          63: '青海',
          64: '宁夏',
          65: '新疆',
          71: '台湾',
          81: '香港',
          82: '澳门',
          91: '国外'
        }
        var birthday = value.substr(6, 4) + '/' + Number(value.substr(10, 2)) + '/' + Number(value.substr(12, 2))
        var d = new Date(birthday)
        var newBirthday = d.getFullYear() + '/' + Number(d.getMonth() + 1) + '/' + Number(d.getDate())
        var currentTime = new Date().getTime()
        var time = d.getTime()
        var arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
        var arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
        var sum = 0, i, residue
        if (this.testItem.identityType === 4 && !/^[a-zA-Z][0-9]{9}$/.test(value)) return callback(new Error('非法台湾身份证'))
        if (this.testItem.identityType === 2 && !/^((\s?[A-Za-z])|([A-Za-z]{2}))\d{6}\(([0−9aA][0−9aA])|([0-9aA])\)$/i.test(value)) return callback(new Error('非法香港身份证'))
        if (this.testItem.identityType === 3 && !/^[1|5|7][0-9]{6}\([0-9Aa]\)/i.test(value)) return callback(new Error('非法澳门身份证'))
        if (this.testItem.identityType === 5){
          if(/.*[\u4e00-\u9fa5]+.*$/.test(value)) {
            return callback(new Error('不能输入中文'))
          }
          if(value.length>30){
            return callback(new Error('字符长短不能超过30个'))
          }
        }
        if (this.testItem.identityType === 1) {
          if (!/^\d{17}(\d|x)$/i.test(value)) return callback(new Error('非法身份证'))
          if (city[value.substr(0, 2)] === undefined) return callback(new Error('非法身份证'))
          if (time >= currentTime || birthday !== newBirthday) {
            return callback(new Error('非法身份证'))
          } else {
            for (i = 0; i < 17; i++) {
              sum += value.substr(i, 1) * arrInt[i]
            }
            residue = arrCh[sum % 11]
            if (residue !== value.substr(17, 1)) return callback(new Error('非法身份证'))
          }
        }
        return callback()
      }
      return {
        pickerDate: {
          disabledDate: (time) => {
            var date = new Date()
            return time.getTime() > date
          }
        },
        fieldName: '',
        minValue: '',
        secondValue: '',
        submitFlag: false,
        isShowDate: false,
        itemList: [],
        items: [],
        rules: {
          schoolYear: [
            { required: true, message: '请选择学年', trigger: 'change' }
          ],
          gradeId: [
            { required: true, message: '请选择年级', trigger: 'change' }
          ],
          classId: [
            { required: true, message: '请选择班级', trigger: 'change' }
          ],
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          sex: [
            { required: true, message: '请选性别', trigger: 'change' }
          ],
          identityType: [
            { required: true, message: '请选择证件类型', trigger: 'change' }
          ],
          identityNo: [
            { validator: checkIdentityNo, tigger: 'blur' }
          ],
          healthTestTime: [
            { required: true, message: '请选择体测时间', trigger: 'change' }
          ]
        },
        testItem: {
          id: '',
          userId: '',
          schoolYear: '', // 学年
          schoolId: '', // 学校Id
          gradeId: '', // 年级Id
          classId: '', // 班级Id
          name: '', // 学生姓名
          sex: '1', // 性别 1-男；2-女
          birthday: '', // 出生日期
          identityType: '', // 身份证类型
          identityNo: '', // 身份证id
          healthTestTime: new Date(), // 体测时间
          schoolYearStart: '', // 学年度开始年份
          schoolYearEnd: '', // 学年度结束年份
          schoolClassName: '', // 班级名
          schoolGradeName: '', // 年级名称
        },
        schoolYearOptions: [],
        gradeOptions: [],
        classOptions: [],
        identityTypeOptions: [
          {
            value: 1,
            label: '中国大陆身份证'
          },
          {
            value: 2,
            label: '中国香港身份证'
          },
          {
            value: 3,
            label: '中国澳门身份证'
          },
          {
            value: 4,
            label: '中国台湾身份证'
          },
          {
            value: 5,
            label: '国外护照'
          }
        ],
        activeArr: ['1', '2', '3', '4', '5'],
        tableHeaderArray: ['项目', '结果', '单位']
      }
    },
    mounted: function() {
      this.schoolYearOptions = getSchoolYear();
      this.testItem.schoolYear = this.schoolYearOptions[0].value;
      this.getGrade();
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .content {
    background-color: white;
    border-radius: 10px;
    min-height: 200px;
    padding: 25px;
  }
  .tab-cell{
    text-align: center;
  }

</style>
