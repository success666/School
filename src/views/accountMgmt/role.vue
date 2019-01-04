<template>
  <div>
    <div class="search-add">
      <el-button type="primary" size="medium" @click="addRole()" v-if="powerBtn.addRoleBtn">新增角色</el-button>
    </div>
    <div class="contain-vessel" v-if="powerBtn.listBtn">
      <el-table
        :data="roleList"
        style="width: 100%;"
      >
        <el-table-column
          prop="name"
          label="角色"
          align="center"
          header-align="center"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          header-align="center"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="modifyRole(scope.row)" v-if="powerBtn.updateBtn">编辑</el-button>
            <el-button type="primary" size="small" @click="deleteRole(scope.row)" v-if="powerBtn.deleteBtn">删除</el-button>
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
    <div class="contain-vessel" v-else>...您无此操作权限...</div>
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
      if(power.indexOf("addSchoolRoleFromSchool")<0) this.powerBtn.addRoleBtn=false;
      // if(power.indexOf("deleteRole")<0) this.powerBtn.deleteBtn=false;
      if(power.indexOf("listSchoolRoleFromSchool")<0) this.powerBtn.listBtn=false;
      if(power.indexOf("updateSchoolRoleFromSchool")<0) this.powerBtn.updateBtn=false;
    },
    data() {
      return {
        powerBtn: {
          addRoleBtn: true,
          deleteBtn:true,
          listBtn:true,
          updateBtn:true
        },
        roleList: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
        tableData: {}
      }
    },
    methods: {
      modifyRole(row) {
        this.$router.push({
          path: `/accountManagement_lv2/roleedit`,
          query: {id: row.id}
        })
      },
      getList() {
        request.get('/api/auth/v1/school/role', {
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize
          }
        }).then((res) => {
          this.roleList = res.data.list || [];
          this.tableData = res.data;
          this.total = res.data.total;
          this.pageNum = res.data.pageNum;
          this.pageSize = res.data.pageSize;
        })
      },
      deleteRole(row) {
        // console.log(row.id);
        this.$confirm('此操作将删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          request.delete(`/api/auth/v1/school/role/${row.id}`).then((res) => {
            this.roleList = this.roleList.filter((item) => {
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
      addRole() {
        this.$router.push({
          path: `/accountManagement_lv2/roleadd`
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
</style>
