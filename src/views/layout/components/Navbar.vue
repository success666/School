<template>
  <el-menu
    class="navbar"
    mode="horizontal"
  >
    <!--<hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>-->
    <breadcrumb v-if="isbreadcrumb"></breadcrumb>
    <userinfo :isbreadcrumb="isbreadcrumb"></userinfo>
  </el-menu>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Userinfo from "@/components/userinfo";
import Hamburger from "@/components/Hamburger";
import request from "@/utils/request";

export default {
  props: {
    isbreadcrumb: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      userName: ""
    };
  },
  mounted() {
    const user = JSON.parse(window.localStorage.getItem("ydl_user"));
    this.userName = user.username;
  },
  components: {
    Breadcrumb,
    Hamburger,
    Userinfo
  },
  computed: {
    ...mapGetters(["sidebar", "avatar"])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("ToggleSideBar");
    },
    logout() {
      // this.$store.dispatch('LogOut').then(() => {
      //   location.reload() // 为了重新实例化vue-router对象 避免bug
      // })
      request.get("/api/auth/v1/school/logout").then(res => {
        let user = localStorage.getItem("ydl_userP");
        localStorage.clear();
        sessionStorage.clear();
        if (user != null) {
          localStorage.setItem("ydl_userP", user);
        }
        this.$router.push({ path: "/login" });
      });
    },
    gotoModify() {
      this.$router.push({
        path: `/modifypwd`
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  background: transparent;
  border-bottom: none;

  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-wrapper * {
    vertical-align: middle;
  }
}
</style>

