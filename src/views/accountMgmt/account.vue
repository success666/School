<template>
  <div>
    <div class="search-add">
      <div class="search" v-if="powerBtn.listUserBtn">
        <el-input v-model="username" size="small" placeholder="联系人"></el-input>
        <el-input v-model="tel" size="small" placeholder="联系人手机号"></el-input>
        <el-button type="primary" size="small" @click="searchList()">查询</el-button>
      </div>
      <div v-else>...您没有账号列表的权限...</div>
      <el-button type="primary" size="medium" @click="addList()" v-if="powerBtn.addBtn">新增账号</el-button>
    </div>
    <div class="contain-vessel" v-if="powerBtn.listUserBtn">
      <el-table
        :data="tableList"
        style="width: 100%;"
      >
        <el-table-column
          prop="account"
          label="学校账号"
          align="center"
          header-align="center"
        >
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="角色"
          align="center"
          header-align="center"
        >
        </el-table-column>
        <el-table-column
          prop="username"
          label="联系人名称"
          align="center"
          header-align="center"
        >
        </el-table-column>
        <el-table-column
          prop="tel"
          label="联系人手机号"
          align="center"
          header-align="center"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="状态"
          align="center"
          header-align="center"
        >
          <template slot-scope="scope">{{scope.row.status === 1 ? '启用' : '停用'}}</template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          header-align="center"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="modifyList(scope.row)" v-show="powerBtn.alertBtn">编辑</el-button>
            <!--<el-button type="primary" size="small" @click="deleteList(scope.row)" v-show="powerBtn.deleteBtn">删除</el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <Paging :pageNum="pageNum"
              :pageSize="pageSize"
              :total="total"
              @current="getCurrent"
      >

      </Paging>
    </div>
    <div class="contain-vessel" v-else>...您没有账号列表的权限...</div>
  </div>
</template>

<script>
  import request from '@/utils/request'
  import Paging from '../../components/common/paging'
  import parseBase from '@/utils/parseBase'

  export default {
    created() {
      this.getList();
      var power=localStorage.getItem("access_token").split(".")[1];
      power=parseBase.decode(power);
      if(power.indexOf("addSchoolAccount")<0) this.powerBtn.addBtn=false;
      if(power.indexOf("listSchoolAccount")<0) this.powerBtn.listUserBtn=false;
      // if(power.indexOf("deleteUser")<0) this.powerBtn.deleteBtn=false;
      if(power.indexOf("updateSchoolAccount")<0) this.powerBtn.alertBtn=false;
      // if(power.indexOf("updatePassword")<0) this.powerBtn.updateBtn=false;
    },
    data() {
      return {
        powerBtn:{
          addBtn:true,
          listUserBtn:true,
          alertBtn:true,
          deleteBtn:true,
          updateBtn:true
        },
        tableList: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
        tableData: {},
        username: '',
        tel: ''
      }
    },
    methods: {
      modifyList(row) {
        this.$router.push({
          path: `/accountManagement_lv2/accountedit`,
          query: {id: row.id}
        })
      },
      getList() {
        request.get('/api/auth/v1/school/account', {
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            tel: this.tel,
            username: this.username
          }
        }).then((res) => {
          this.tableList = res.data.list || [];
          this.tableData = res.data;
          this.total = res.data.total;
          this.pageNum = res.data.pageNum;
          this.pageSize = res.data.pageSize;
        })
      },
      deleteList(row) {
        // console.log(row.id);
        this.$confirm('此操作将删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          request.delete(`/api/auth/v1/school/role/${row.id}`).then((res) => {
            this.tableList = this.tableList.filter((item) => {
              return item.id != row.id
            })
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          })
        }).catch(() => {

        });
      },
      addList() {
        this.$router.push({
          path: `/accountManagement_lv2/accountadd`
        })
      },
      getCurrent(current) {
        // console.log(current);
        if (current.currentPage) {
          this.pageNum = current.currentPage;
        }
        if (current.currentSize) {
          this.pageSize = current.currentSize
        }
        this.getList()
      },
      searchList() {
        this.pageSize = 10;
        this.pageNum = 1;
        this.getList();
      }
    },
    components: {
      Paging
    }
  }
</script>

<style lang="scss" scoped>
  .search-add {
    text-align: right;
  }
  .search {
    float: left;
  }
  .el-input {
    width: 150px !important;
  }
</style>
