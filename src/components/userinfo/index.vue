<template>
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <img class="user-avatar" src="@/assets/imgs/user_icon.png" v-if="isbreadcrumb">
        <img class="user-avatar" src="@/assets/imgs/user_icon1.png" v-else>
        <span>{{userName}}</span>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <el-dropdown-item>
          <span @click="gotoModify" style="display:block;">修改密码</span>
        </el-dropdown-item>
        <el-dropdown-item divided>
          <span @click="logout" style="display:block;">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    
</template>
<script>
import request from '@/utils/request'
export default {
    props: {
    isbreadcrumb: {
      type: Boolean,
      default: true
    }
  },
    data() {
    return {
      userName: ''
    }
  },
  mounted() {
    const user = JSON.parse(window.localStorage.getItem('ydl_user'));
    this.userName = user.username;
  },
  methods: {
    logout() {
      // this.$store.dispatch('LogOut').then(() => {
      //   location.reload() // 为了重新实例化vue-router对象 避免bug
      // })
      request.get('/api/auth/v1/school/logout').then((res) => {
        let user=localStorage.getItem("ydl_userP");
        localStorage.clear();
        sessionStorage.clear();
        if(user!=null){
          localStorage.setItem("ydl_userP",user);
        }
        this.$router.push({path: '/login'});
      })
    },
    gotoModify() {
      this.$router.push({
        path: `/modifypwd`,
      })
    }
  }
}
</script>
<style lang="scss">
    
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 20px;
        height: 20px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
  .avatar-wrapper * {
    vertical-align: middle;
  }
</style>


