<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <div class="logo">
      <img :src="ydl_icon" alt>
    </div>
    <el-menu
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      background-color="#2E89E6"
      text-color="#fff"
      :router="true"
      :default-active="showValue"
    >
      <el-menu-item index="/dashboard">
       <img src="@/assets/imgs/dashboard.png" alt class="menusIcon">
        首页
      </el-menu-item>
      <template v-for="(item, key) in menus">
        <el-submenu :key="key" :index="key + ''" v-if="item.children.length > 0">
          <template slot="title">
            <img
              v-if="item.code == 'physicalManageFirst'"
              class="menusIcon"
              src="@/assets/imgs/physicalManageFirst.png"
              alt
            >
            <img
              v-if="item.code == 'educational'"
              class="menusIcon"
              src="@/assets/imgs/educational.png"
              alt
            >
            <img
              v-if="item.code == 'resourceManagement'"
              class="menusIcon"
              src="@/assets/imgs/resourceManagement.png"
              alt
            >
            <img
              v-if="item.code == 'accountManagement'"
              class="menusIcon"
              src="@/assets/imgs/accountManagement.png"
              alt
            >
            <span slot="title" v-text="item.name"></span>
          </template>
          <el-menu-item
            v-for="(child, cKey) in item.children"
            :key="cKey"
            :index="'/' + child.code"
          >{{child.name}}</el-menu-item>
        </el-submenu>
      </template>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from "vuex";
import ydl_icon from "@/assets/imgs/ydl_icon.png";

export default {
  created() {
    this.menus = JSON.parse(window.localStorage.getItem("menuData"));
    this.showValue = this.$route.meta.showMenu;
  },
  data() {
    return {
      ydl_icon,
      showValue: ""
    };
  },
  computed: {
    ...mapGetters(["sidebar"]),
    routes() {
      return this.$router.options.routes;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
  watch: {
    $route(to, from) {
      this.showValue = to.meta.showMenu;
    }
  }
};
</script>

<style lang="scss" scoped>
.el-submenu .el-menu-item.is-active {
  color: #409eff !important;
  background: #fff !important;
  margin-left: 25px;
  padding-left: 15px !important;
  border-radius: 25px 0 0 25px;
}
img.menusIcon {
  width: 20px;
  height: 20px;
}
.el-submenu .el-menu-item {
  height: 35px;
  line-height: 35px;
}
.el-submenu .el-menu-item {
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  -ms-transition: all 0.3s;
  -o-transition: all 0.3s;
  transition: all 0.3s;
}
.logo {
  width: 100%;
  background: #2e89e6;

  > img {
    width: 100%;
    display: block;
    margin: 0 auto;
  }
}
</style>
