<template>
  <div class="content">
    <div class="title title-top">{{title}}{{title2}}</div>
    <el-form ref="classForm" :model="classes" :rules="rules" label-width="100px" size="mini" class="form-tab">
      <el-row>
        <el-col>
          <el-form-item label="学年：" prop="schoolYear">
            <el-select v-model="classes.schoolYear" placeholder="请选择" v-if="classes.id === ''" @change="this.getTeachers">
              <el-option
                v-for="item in schoolYearOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <label v-if="classes.id !== ''" >{{classes.schoolYear}}</label>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="classType==1">
        <el-col>
          <el-form-item label="年级：" prop="dictSchoolTypeGradeId">
            <el-select v-model="classes.dictSchoolTypeGradeId" placeholder="请选择" v-if="classes.id === ''">
              <el-option
                v-for="item in gradeOptions"
                :key="item.id"
                :label="item.gradeName"
                :value="item.id">
              </el-option>
            </el-select>
            <label v-if="classes.id !== ''">{{classes.gradeName}}</label>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="classType==1">
        <el-col>
          <el-form-item label="班级：" prop="dictClassId">
            <el-select v-model="classes.dictClassId" placeholder="请选择">
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
      <el-row v-if="classType==2">
        <el-col>
          <el-form-item label="班级名称：" prop="interestClassName">
            <!--<el-input v-if="classes.id == ''" v-model="classes.interestClassName" style="width: 205px;" placeholder="请输入内容"></el-input>-->
            <el-input v-model="classes.interestClassName" style="width: 205px;" placeholder="请输入内容"></el-input>
            <!--<label v-if="classes.id !== ''">{{classes.interestClassName}}</label>-->

          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="体育老师：" prop="teacher">
            <el-select v-model="classes.teacherId" placeholder="请选择">
              <el-option
                v-for="(item,index) in teacherOptions"
                :key="index"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item size="large" style="text-align: center;" class="form-action">
            <el-button @click="goBack">取消</el-button>
            <el-button type="primary" @click="onSubmit('classForm')" :disabled="submitFlag">保存</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
    import { getSchoolYear } from '@/utils/index'
    import request from '@/utils/request'
    import requestYapi from "@/utils/requestyAPI"
    export default {
      name: 'ClassForm',
      data() {
        return {
          title: '添加班级',
          title2: '',
          id: '',
          submitFlag: false,
          classType: '1', // 班级类型：0-全部；1-行政班；2-兴趣班
          classes: {
            id: '',
            schoolYear: '',
            dictSchoolTypeGradeId: '',
            classId: '',
            teacherId: '',
            interestClassName: '',
            gradeName: '',
            // teacherName: ''
          },
          rules: {
            schoolYear: [
              { required: true, message: '请选择学年', trigger: 'change' }
            ],
            dictSchoolTypeGradeId: [
              { required: true, message: '请选择年级', trigger: 'change' }
            ],
            dictClassId: [
              { required: true, message: '请选择班级', trigger: 'change' }
            ],
            interestClassName: [
              { required: true, message: '请输入兴趣班名称', trigger: 'blur' }
            ]
          },
          schoolYearOptions: [],
          gradeOptions: [],
          classOptions: [],
          teacherOptions: []
        }
      },
      methods: {
        getClassDetail() { // 判断是编辑还是添加
          var id = this.$route.query.id;
          // this.id = this.$route.query.id;
          // this.classType = 2;
          if (typeof id !== 'undefined' && id !== '') {
            this.title = '编辑班级';
            this.getInterestClass();
          }
        },
        getInterestClass() { // 兴趣班获取数据
          var id = this.$route.query.id;
          request.get('/api/auth/v1/interest-class/' + id).then(res => {
          // requestYapi.get('/mock/35/api/auth/v1/interest-class/' + id).then(res => {
            // console.log(res);
            // this.data = res.data
            this.classes.id = res.data.id;
            this.classes.interestClassName = res.data.name;
            this.classes.teacherId = res.data.teacherId;
            // this.classes.teacherName = res.data.teacherName;
          })
        },
        goBack() {
          this.$router.push('classList')
        },
        onSubmit(formName) {
          this.submitFlag = true;
          this.$refs[formName].validate((valid) => {
            if (valid) {
              var list = this.classes.schoolYear.split('-')
              if (list.length > 0) {
                this.classes.schoolYearStart = list[0]
                this.classes.schoolYearEnd = list[1]
              }
              if (this.classType == 1 && this.classes.id !== '') { // 编辑 行政班
                this.$store.dispatch('UpdateClass', this.classes).then(response => {
                  this.$alert('保存成功', '提示', {
                    confirmButtonText: '确定',
                    center: true,
                    callback: action => {
                      this.$router.push({
                        name: 'ClassList',
                        params: {
                          schoolYear: this.classes.schoolYear,
                          type: 'update'
                        }
                      })
                    }
                  })
                })
              } else if (this.classType == 1 && this.classes.id == '') { // 添加行政班
                this.$store.dispatch('AddClass', this.classes).then(response => {
                  this.$alert('保存成功', '提示', {
                    confirmButtonText: '确定',
                    center: true,
                    callback: action => {
                      this.$router.push({
                        name: 'ClassList',
                        params: {
                          schoolYear: this.classes.schoolYear,
                          type: 'update'
                        }
                      })
                    }
                  })
                })
              } else if (this.classType == 2 && this.classes.id !== '') { // 兴趣班编辑
                request.post('/api/auth/v1/interest-class/'+ this.id, {
                // requestYapi.post('/mock/35/api/auth/v1/interest-class/'+ this.id, {
                  schoolYearStart: this.classes.schoolYearStart,
                  schoolYearEnd: this.classes.schoolYearEnd,
                  name: this.classes.interestClassName,
                  teacherId: this.classes.teacherId || null
                }).then(res => {
                  this.$alert('保存成功', '提示', {
                    confirmButtonText: '确定',
                    center: true,
                    callback: action => {
                      this.$router.push({
                        name: 'ClassList',
                        params: {
                          schoolYear: this.classes.schoolYear,
                          type: 'update'
                        }
                      })
                    }
                  })
                  // console.log(res);
                })
              } else if (this.classType == 2 && this.classes.id == '') { // 兴趣班添加
                request.post('/api/auth/v1/interest-class',{
                // requestYapi.post('/mock/35/api/auth/v1/interest-class',{
                  schoolYearStart: this.classes.schoolYearStart,
                  schoolYearEnd: this.classes.schoolYearEnd,
                  name: this.classes.interestClassName,
                  teacherId: this.classes.teacherId || null
                }).then(res => {
                  // console.log(res);
                  this.$alert('保存成功', '提示', {
                    confirmButtonText: '确定',
                    center: true,
                    callback: action => {
                      this.$router.push({
                        name: 'ClassList',
                        params: {
                          schoolYear: this.classes.schoolYear,
                          type: 'update'
                        }
                      })
                    }
                  })
                })
              }
            } else {
              this.$alert('请完成必填/选项!', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                }
              })
            }
          })
          this.submitFlag = false
        },
        getGrade() {
          this.$store.dispatch('GetGrade').then(response => {
            this.gradeOptions = response.data
          })
        },
        getClass() {
          var data = {}
          data.schoolTypeGradeId = this.classes.dictSchoolTypeGradeId
          var list = this.classes.schoolYear.split('-')
          if (list.length > 0) {
            data.schoolYearStart = list[0]
            data.schoolYearEnd = list[1]
          }
          this.$store.dispatch('GetClass', data).then(response => {
            this.classOptions = response.data
          })
        },
        doRequest() {
          for (var i = 1; i <= 50; i++) {
            this.classOptions.push({
              dictClassId: i,
              dictClassName: i + '班'
            })
          }
          var id = this.$route.query.id;
          if (typeof id !== 'undefined') {
            this.$store.dispatch('GetClassDetail', { id: id }).then(response => {
              this.classes = response.data;
              this.classes.schoolYear = this.classes.schoolYearStart + '-' + this.classes.schoolYearEnd;
              let obj = {};
              obj = this.gradeOptions.find((item) => {
                return item.id === this.classes.dictSchoolTypeGradeId
              })
              this.classes.gradeName = obj.gradeName
              // this.getClass()
            })
          }
        },
        getTeachers() {
          let schoolYear = this.classes.schoolYear;
          let params={
            schoolYearStart:schoolYear.split("-")[0],
            schoolYearEnd:schoolYear.split("-")[1],
          }
          request.get("/api/auth/v1/teacher/schoolTeacherList",{
            params
          }).then(res => {
            // console.log(res);
            this.teacherOptions = res.data;
          })
        }
      },
      created() {
        this.schoolYearOptions = getSchoolYear();
        if (!this.classes.schoolYear) {
          // this.classes.schoolYear = this.schoolYearOptions[this.schoolYearOptions.length - 1].value
          this.classes.schoolYear = this.schoolYearOptions[0].value
        }
      },
      mounted() {
        this.classType = this.$route.query.type; // 班级类型：0-全部；1-行政班；2-兴趣班
        this.id = this.$route.query.id;
        if (this.classType == 1) {
          this.title2 = '-行政班';
          this.getGrade();
          setTimeout(function() {
            that.doRequest();
          }, 500)
        } else if (this.classType ==2) {
          this.title2 = '-兴趣班';
        }
        this.getClassDetail();
        var that = this;
        setTimeout(function() {
          that.getTeachers()
        }, 500)
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

  .title {
    width: 100%;
    height: 80px;
    line-height: 80px;
    font-size: 20px;
    font-weight: bold;
    text-align: left;
    padding-left: 30px;
  }

</style>
