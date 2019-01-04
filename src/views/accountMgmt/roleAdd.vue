<template>
  <div class="role contain-vessel">
    <el-input v-model="roleName" placeholder="请输入角色名称" class="role-name"></el-input>
    <el-tree :data="menuList"
             :default-expanded-keys="[1]"
             :default-checked-keys="permissionIds"
             show-checkbox
             node-key="id"
             :props="defaultProps"
             ref="roletree"
             :check-strictly="true"
             @check-change="checkChange"
    >
    </el-tree>
    <div class="role-btn">
      <el-button @click="cancelSet">取消</el-button>
      <el-button type="primary" @click="sureSet" v-if="powerBtn.addBtn">确认</el-button>
    </div>
  </div>
</template>

<script>
  import request from '@/utils/request'
  import parseBase from '@/utils/parseBase'

  export default {
    created() {
      request.get(`/api/auth/v1/school/account/getSchoolAccountMenuFromSchool`).then((res) => {
        this.menuList = res.data || [];
      })
      var power=localStorage.getItem("access_token").split(".")[1];
      power=parseBase.decode(power);
      if(power.indexOf("addSchoolRoleFromSchool")<0) this.powerBtn.addBtn=false;
    },
    data() {
      return {
        powerBtn: {
          addBtn:true
        },
        roleName: '',
        menuList: [],
        permissionIds: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        }
      }
    },
    methods: {
      sureSet() {
        if (!this.roleName) {
          this.$message.error('请输入角色名称');
          return
        }
        const permissionId = this.$refs.roletree.getCheckedKeys();
        // console.log(permissionId);
        request.post(`/api/auth/v1/school/role`, {
          name: this.roleName,
          remark: '',
          menuIds: permissionId
        }).then((res) => {
          // console.log(res);
          this.$router.push({
            path: `/accountManagement_lv2/role`
          })
        })
      },
      cancelSet() {
        this.$router.push({
          path: `/accountManagement_lv2/role`
        })
      },
      checkChange(node, isCheck, parent) {
        if (node.children.length > 0) {
          for (let i = 0; i < node.children.length; i++) {
            setNode(this, node.children[i], isCheck);
          }
        }
      }
    }
  }
  function setNode(vm,node,isCheck){
    if(node.children.length==0){
      vm.$refs.roletree.setChecked(node.id,isCheck,false);
    }else{
      vm.$refs.roletree.setChecked(node.id,isCheck,false);
      for(let i=0;i<node.children.length;i++){
        setNode(vm,node.children[i],isCheck,false);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .role {
    padding: 10px;
    background: #fff;
  }
  .role-btn {
    text-align: center;
    margin-top: 40px;
    margin-bottom: 40px;
  }
  .role-name {
    display: inline-block;
    width: 250px;
    margin-bottom: 20px;
  }
</style>
