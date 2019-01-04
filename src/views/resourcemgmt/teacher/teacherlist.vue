<template>
  <div>

    <div class="search-form">
      <el-form :inline="true" :model="teacher" class="">
        <el-form-item label="学年">
          <el-select v-model="teacher.schoolYear" placeholder="请选择" size="mini">
            <el-option
              v-for="item in schoolYearOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search(teacher)" class="btn" size="mini">查询</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button v-if="havePermissionArr['addTeacher']" type="primary" @click="teacherAdd()" class="btn" size="mini">添加师资</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="list">
      <section ref="printarea">
        <table  cellpadding="3" id="printTable" class="table">
          <tbody>
          <tr>
            <th :class="printWidth">姓名</th>
            <th :class="printWidth">性别</th>
            <th :class="printWidth">职称</th>
            <th :class="printWidth">在职状态</th>
            <th :class="noprint">操作</th>
          </tr>
          <tr v-for="(teacher, index) in list">
            <td prop="name" :class="printWidth"><div style="width: 100%;text-align: center;cursor: pointer" @click="havePermissionArr['getTeacher']?rowClickAction(teacher):''">{{teacher.name}}</div></td>
            <td prop="sex" :class="printWidth"><div style="width: 100%;text-align: center;cursor: pointer" @click="havePermissionArr['getTeacher']?rowClickAction(teacher):''">{{teacher.sex}}</div></td>
            <td prop="teacherProfessionalTitleName" :class="printWidth"><div style="width: 100%;text-align: center;cursor: pointer" @click="havePermissionArr['getTeacher']?rowClickAction(teacher):''">{{teacher.teacherProfessionalTitleName}}</div></td>
            <td prop="status" :class="printWidth"><div style="width: 100%;text-align: center;cursor: pointer" @click="havePermissionArr['getTeacher']?rowClickAction(teacher):''">{{teacher.status}}</div></td>
           <td :class="noprint">
             <el-button
               v-if="havePermissionArr['updateTeacher']"
               size="mini"
               @click="handleEdit(index, teacher)" class="btn">编辑
             </el-button>
             <el-button
               v-if="havePermissionArr['deleteTeacher']"
               size="mini"
               @click="handleDelete(index, teacher)" class="btn">删除
             </el-button>
            </td>
          </tr>
          </tbody>
        </table>
      </section>
      <div class="multi-action" style="height: 80px">
        <el-button type="primary" @click="printAction" class="btn" style="float: right" size="mini">打印</el-button>
        <el-button type="primary" @click="exportAction" class="btn" style="float: right; margin-right: 10px" size="mini">导出
        </el-button>
      </div>
      <div class="page">
        <span class="demonstration"></span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="teacher.pageNum"
          :page-sizes="[10, 20, 30]"
          :page-size="teacher.pageSize"
          layout="prev, pager, next, sizes, jumper" backgroud=""
          :total="teacher.totalPage">
        </el-pagination>
      </div>
    </div>

  </div>
</template>

<script>
import Vue from 'vue'
import Print from '@/utils/print'
import { getSchoolYear } from '@/utils/index'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'
import axios from 'axios'
import { isHavePermissions } from '@/utils/auth'

Vue.use(Print); // 注册

export default {
  name: "TeacherList",
  data() {
    return {
      printWidth: "",
      noprint: "",
      schoolYearOptions: [],
      teacher: {
        schoolYear: "",
        name: "",
        sex: "",
        status: "",
        teacherProfessionalTitleName: "",
        pageSize: 10,
        pageNum: 1,
        totalPage: 1
      },
      teacherModel: 1,
      list: [],
      havePermissionArr: {
        addTeacher: false,
        updateTeacher: false,
        getTeacher: false,
        listTeacher: false,
        deleteTeacher: false
      },
      permissionCode: ['addTeacher', 'updateTeacher', 'getTeacher', 'listTeacher', 'deleteTeacher']
    }
  },
  methods: {
    // 分页大小
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.teacher.pageSize = val;
      this.search(this.teacher);
    },
    // 当前页跳转
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.teacher.pageNum = val;
      this.search(this.teacher);
    },
    // 查询
    search(teacher) {
      const search = {};
      if (teacher.schoolYear !== "") {
        search.schoolYear = teacher.schoolYear;
      }
      search.pageNum = teacher.pageNum;
      search.pageSize = teacher.pageSize;
      this.$store.dispatch("TeacherList", search).then(response => {
        this.list = response.data.list;
        // console.log(this.list);
        this.teacher.totalPage = response.data.total;
        this.teacher.pageNum = response.data.pageNum;
      });
    },
    // 添加
    teacherAdd() {
      this.routeLink = {
        path: "teacherEdit",
        query: {
          teacherId: null
        }
      };
      this.$router.push(this.routeLink);
    },
    // 打印
    printAction() {
      // this.$print(this.$refs.printarea)
      var that = this;
      var t;
      this.noprint = "noprint";
      this.printWidth = "print-width";
      clearTimeout(t);
      t = setTimeout(function() {
        that.$print(that.$refs.printarea);
        that.noprint = "";
        that.printWidth = "";
      }, 500);
    },
    // 导出
    exportAction() {

      // console.log('导出师资列表')
      var instance = axios.create({
        baseURL: process.env.BASE_API,
        timeout: 10000,
        headers: {
          'Authorization': getToken()
        }
      })
      var that = this
      instance.get('/api/auth/v1/teacher/stats/exportList?schoolYear=' + this.teacher.schoolYear + '&pageSize=' + this.teacher.pageSize + '&pageNum=' + this.teacher.pageNum).then(function(response) {
        if (response.data.status === undefined) {
          instance = axios.create({
            baseURL: process.env.BASE_API,
            timeout: 10000,
            headers: {
              'Authorization': getToken()
            },
            responseType: 'blob'
          })

          instance.get('/api/auth/v1/teacher/stats/exportList?schoolYear=' + that.teacher.schoolYear + '&pageSize=' + that.teacher.pageSize + '&pageNum=' + that.teacher.pageNum).then(function(response) {
            var blob = new Blob([response.data], {
              type: 'application/vnd.ms-excel'
            })
            var link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = that.teacher.schoolYear + '体育师资列表.xls'
            link.click()
          }).catch(function(error) {
            console.log(error)
          })
        } else {
          if (response.data.status.code === 500) {
            Message({
              message: response.data.status.msg,
              type: 'error',
              duration: 2 * 1000
            })
          }
        }
      }).catch(function(error) {
        console.log(error)
      })

    },
    // 删除
    handleDelete(index, row) {
      this.$confirm("确认删除？").then(_ => {
        this.$store.dispatch("TeacherDelete", row.id).then(response => {
          this.search(this.teacher);
          Message({
            message: "删除成功",
            type: "success",
            duration: 2 * 1000
          });
        });
      });
    },
    handleEdit(index, row) {
      // console.log(index, row);
      this.routeLink = {
        path: "teacherEdit",
        query: {
          teacherId: row.id
        }
      };
      this.$router.push(this.routeLink);
    },
    rowClickAction(row) {
      // console.log(row);
      this.routeLink = {
        path: "TeacherDetail",
        query: {
          teacherId: row.id
        }
      };
      this.$router.push(this.routeLink);
    }
  },
  beforeRouteLeave (to, from, next) {
    if(to.name=="teacherStats"){
      to.params.schoolYear=this.teacher.schoolYear;
      to.params.type="update";
    }
    next();
  },
  watch:{
    $route(to,from){
      if(typeof to.params.type!="undefined" && to.params.type=="update" && to.name=="TeacherList"){
        this.teacher.schoolYear = to.params.schoolYear;
         this.search(this.teacher);
      }
    }
  },
  mounted() {
    this.schoolYearOptions = getSchoolYear();
    if (typeof this.$route.query.schoolYear != "undefined") {
      this.teacher.schoolYear = this.$route.query.schoolYear;
    } else {
      // this.teacher.schoolYear = this.schoolYearOptions[this.schoolYearOptions.length - 1].value;
      this.teacher.schoolYear = this.schoolYearOptions[0].value;
    }
    this.search(this.teacher);

    this.permissionCode.forEach(val => {
      this.havePermissionArr[val] = isHavePermissions(val)
    })
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.page {
  margin-top: 30px;
}
.list .table {
  margin-top: 10px;
  width: 100%;
  border-spacing: 0px;
  text-align: center;
}

.list .tbody {
}

.list tr {
  border: none;
  height: 40px;
}

.list th {
  border-bottom: 1px solid #ebeef5;
  font-size: 16px;
  color: #666666;
}

.list td {
  border: none;
  background-color: white;
  word-wrap: break-word;
  font-family: PingFang-SC-Medium;
  font-size: 14px;
  color: #6b6b6b;
}
tr:hover > td {
  background-color: #84bef9;
  color: #ffffff;
}
tr:hover > td .btn {
  color: #84bef9;
}
.noprint {
  display: none;
}
.print-width {
  width: 20%;
}
</style>
