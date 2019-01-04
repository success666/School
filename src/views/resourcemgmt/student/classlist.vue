<template>
  <div>

    <el-radio-group v-model="studentModel" style="margin-bottom: 10px;" @change="changeModel">
      <el-radio-button label="1">学生管理</el-radio-button>
      <el-radio-button label="2">班级管理</el-radio-button>
      <el-radio-button label="3">学生统计</el-radio-button>
    </el-radio-group>

    <div class="search-form">
      <el-form :inline="true" :model="classes" class="" ref="classes">
        <el-form-item label="学年">
          <el-select v-model="classes.schoolYear" placeholder="请选择" size="mini">
            <el-option
              v-for="item in schoolYearOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item>-->
          <!--<el-input  placeholder="请输入姓名" v-model="classes.name" size="mini"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item>
          <el-button type="primary"  class="btn" @click="search" size="mini">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  class="btn" @click="reset" size="mini">重置</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <!--<el-button type="primary" @click="addStudent" class="btn" size="mini">添加学生</el-button>-->
          <!--<el-button type="primary" @click="importHandle" class="btn" size="mini">批量导入学生</el-button>-->
          <el-button type="primary" @click="centerDialogVisible = true" class="btn" size="mini" v-if="power.addSchoolClass">添加班级</el-button>
        </el-form-item>
      </el-form>
    </div>
    <section ref="printarea" id="classlist">
      <div id="subOutputRank-print" class="equipment-list-content">
        <el-tabs v-model="activeName">
          <el-tab-pane v-for="(ins,index) in classList" :key="ins.name" :name="ins.name" :label="ins.name">
            <el-table
              :data="ins.array"
              style="width: 100%">
              <el-table-column
                prop="dictClassName"
                align="left"
                label="班级"
                width="160">
              </el-table-column>
              <el-table-column
                prop="teacherName"
                align="left"
                label="老师">
                <template slot-scope="scope">
                  <span @click="toClassStudentList(scope.$index, scope.row)" style="color: #84BEF9;text-decoration: underline;">
                    体育老师：{{scope.row.teacherName}}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                prop=""
                align="center"
                label="操作"
                width="200">
                <template slot-scope="scope">
                  <el-button @click="handleEdit(scope.$index, scope.row)" size="small" v-if="power.updateSchoolClass">编辑</el-button>
                  <!--<el-button @click="handleDelete(scope.$index, scope.row)" size="small" v-if="power.deleteSchoolClass">删除</el-button>-->
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane key="兴趣班" name="兴趣班" label="兴趣班">
            <el-table
              :data="insClassData"
              style="width: 100%">
              <el-table-column
                prop="name"
                align="left"
                label="班级"
                width="160">
              </el-table-column>
              <el-table-column
                prop="teacherName"
                align="left"
                label="老师">
                <template slot-scope="scope">
                  <span @click="toInClassStudentList(scope.$index, scope.row)" style="cursor:pointer;color: #84BEF9;text-decoration: underline;">
                    体育老师：{{scope.row.teacherName}}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                prop="id"
                align="center"
                label="操作"
                width="200">
                <template slot-scope="scope">
                  <el-button @click="editInter(scope.$index, scope.row)" size="small" v-if="power.updateSchoolClass">编辑</el-button>
                  <el-button @click="deleteInter(scope.$index, scope.row)" size="small" v-if="power.deleteSchoolClass">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </section>
    <el-dialog
      title="请选择添加的班级"
      :visible.sync="centerDialogVisible"
      width="30%"
      center style="margin-top: 15vh;">
      <!--<span>需要注意的是内容是默认不居中的</span>-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addClassType(1)">行政班</el-button>
        <el-button @click="addClassType(2)">兴趣班</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    import { getSchoolYear } from '@/utils/index'
    import { isHavePermissions } from '@/utils/auth'
    import request from '@/utils/request'
    import requestYapi from "@/utils/requestyAPI"

    export default {
      name: 'ClassList',
      methods: {
        reset() {
          this.classes.name = ''
          var date = new Date()
          var diff = date.getFullYear() - 2008
          var month = date.getMonth()
          if (month >= 7) {
            diff++
          }
          this.classes.schoolYear = (2007 + diff) + '-' + (2008 + diff)
        },
        handleDelete(index, row) {
          this.$confirm('将删除此班级！').then(_ => {
            this.$store.dispatch('DeleteClass', { id: row.id }).then(response => {
              this.doRequest()
            })
          })
        },
        deleteInter(index, row) {
          this.$confirm('将删除此班级！').then(_ => {
            request.delete('/api/auth/v1/interest-class/' + row.id).then(res => {
            // requestYapi.delete('/mock/35/api/auth/v1/interest-class/' + row.id).then(res => {
              this.$message({
                message: '删除成功！',
                type: 'success'
              });
              this.getInterData()
            }).catch(err => {
              this.$message({
                message: '删除失败！',
                type: 'error'
              })
            })
          })
        },
        handleEdit(index, val) {
          this.$router.push({
            path: 'classForm',
            query: {
              id: val.id,
              type: 1
            }
          })
        },
        editInter(index, val) {
          this.$router.push({
            path: 'classForm',
            query: {
              id: val.id,
              type: 2
            }
          })
        },
        // 跳转到兴趣班学生列表
        toInClassStudentList(index, row) {
          this.$router.push({
            name: 'ClassStudentList',
            query: {
              schoolYear: row.schoolYearStart + '-' + row.schoolYearEnd,
              id: row.id, // 班级id
              name: row.name,
              classType: 2,
              backUrl: 'ClassList',
              type:"update"
            }
          })
        },
        // 跳转到行政班学生列表
        toClassStudentList(index, row) {
          if (this.power.getSchoolClass) {
            this.$router.push({
              name: 'ClassStudentList',
              query: {
                schoolClassId: row.id,
                className: row.dictClassName,
                gradeName: row.gradeName,
                schoolYear: row.schoolYearStart + '-' + row.schoolYearEnd,
                schoolTypeGradeId: row.dictSchoolTypeGradeId,
                // dictClassId: row.dictClassId,
                backUrl: 'ClassList',
                classType: 1,
                type: 'update'
              }
            })
          }
        },
        // 导入
        importHandle() {
          this.routeLink = {
            path: 'studentImport',
            query: {
              backUrl: 'ClassList'
            }
          }
          this.$router.push(this.routeLink)
        },
        goSearch() {
          this.$router.push({
            name: 'StudentSearchList',
            params: {
              schoolYear: this.classes.schoolYear,
              name: this.classes.name,
              type:"update"
            }
          })
        },
        search() {
          // this.changeSearch = true;
          if (this.classes.name) {
            this.goSearch()
          } else {
            this.doRequest();
            this.getInterData();
          }
        },
        handleDetail() {
          this.$router.push('studentSearchList')
        },
        addClassType(index) {
          this.$router.push({
            path: 'addClassForm',
            query: {
              backUrl: 'ClassList',
              type: index // 班级类型：0-全部；1-行政班；2-兴趣班
            }
          });
          this.centerDialogVisible = false
        },
        addStudent() {
          this.$router.push({
            path: 'studentForm',
            query: {
              backUrl: 'ClassList'
            }
          })
        },
        doRequest() {
          var list = this.classes.schoolYear.split('-')
          if (list.length > 0) {
            this.$store.dispatch('GetClassList', { schoolYearStart: list[0], schoolYearEnd: list[1] }).then(response => {
              this.classList = []
              if (response.data.length > 0) {
                response.data.forEach((val, index) => {
                  var isContain = false
                  this.activeArr.push((index + 1) + '')
                  this.classList.forEach((v, i) => {
                    if (v.array.length === 0 || v.name === val.gradeName) {
                      v.array.push(val)
                      isContain = true
                      return
                    }
                  })
                  if (!isContain) {
                    var newList = [];
                    newList.push(val);
                    // console.log(newList);
                    this.classList.push({ name: val.gradeName, array: newList })
                  }
                })
                this.activeName = this.classList[0].name
              }
            })
          }
        },
        getInterData() {
          this.insClassData = [];
          let schoolYear = this.classes.schoolYear;
          let params = {
            schoolYearStart: schoolYear.split("-")[0],
            schoolYearEnd: schoolYear.split("-")[1],
          };
          request.get('/api/auth/v1/interest-class/list', { params }).then(res => {
          // requestYapi.get('/mock/35/api/auth/v1/interest-class/list', { params }).then(res => {
            this.insClassData = res.data
          })
        },
        changeModel() {
          switch (this.studentModel) {
            case '1':
              this.goSearch()
              break
            case '3':
              this.$router.push('/studentManagement/studentStats')
              break
          }
          this.studentModel="2";
        }
      },
      data() {
        return {
          centerDialogVisible: false,
          activeName: '1',
          // changeSearch:false,
          power: {
            addSchoolClass: false,
            updateSchoolClass: false,
            getSchoolClass: false,
            deleteSchoolClass: false
          },
          powerArr: ['addSchoolClass', 'updateSchoolClass', 'getSchoolClass', 'deleteSchoolClass'],
          student: {
            schoolYear: ''
          },
          studentModel: 2,
          classes: {
            schoolYear: ''
          },
          schoolYearOptions: [],
          equipment: {
            date: ''
          },
          insClassData: [], // 兴趣班的数据
          classList: [],
          activeArr: []
        }
      },
      watch: {
        $route(to, from) {
          if (to.name == 'ClassList' && typeof to.params.type !='undefined' && to.params.type == 'update') {
            if (to.params.schoolYear) {
              this.classes.schoolYear = to.params.schoolYear;
              this.getInterData();
              this.doRequest()
            }
          }
          if(to.name=="ClassList"){
            let activeName=this.activeName;
            this.activeName="1";
            let that=this;
            setTimeout(()=>{
              that.activeName=activeName;
            },300)
          }
        }
      },
      mounted() {
        this.schoolYearOptions = getSchoolYear();
        if (!this.classes.schoolYear) {
          this.classes.schoolYear = this.schoolYearOptions[0].value
        }
        this.doRequest();
        this.getInterData();
        this.powerArr.forEach(val => {
          this.power[val] = isHavePermissions(val)
        })
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .equipment-list-content {
    background-color: white;
    border-radius: 10px;
    padding: 25px;
    margin-top: 10px;
  }
  .gray{
    background-color: #F9F9F9;
  }
  .el-tabs__item,.is-top {
    width: 100px!important;
    text-align: center;
  }
  .el-table thead {
    display: none;
  }
  .el-tabs__nav{
    width: 100%!important;
  }
  .el-tabs__item.is-top{
    width: 10%!important;
    text-align: center!important;
  }
</style>
<style>
  #classlist .el-table thead {
    display: none;
  }
  #classlist .el-tabs__nav{
    width: 100%;
  }
  #classlist .el-tabs__item.is-top{
    width: 10%;
    text-align: center;
  }
  #classlist .el-tabs__item.is-active{
    font-size: 18px;
  }
  .el-message-box .el-message-box__btns button:nth-child(2){
    color:#606266;
    background-color:#fff;
    border-color:#dcdfe6;
  }
  .el-message-box .el-message-box__btns button:hover {
    color: #409EFF;
    border-color: #c6e2ff;
    background-color: #ecf5ff;
  }
</style>
