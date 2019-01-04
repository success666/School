<template>
  <div
    class="app-wrapper"
    :class="classObj"
  >
    <!--<div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"></div>-->
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <navbar :isbreadcrumb="isbreadcrumb" v-bind:class="{isbreadcrumb:!isbreadcrumb}"></navbar>
      <app-main></app-main>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from "./components";
import ResizeMixin from "./mixin/ResizeHandler";

export default {
  name: "layout",
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    device() {
      return this.$store.state.app.device;
    },
    classObj() {
      return {
        // hideSidebar: !this.sidebar.opened,
        // withoutAnimation: this.sidebar.withoutAnimation,
        // mobile: this.device === 'mobile'
      };
    }
  },
  data() {
    return {
      isbreadcrumb: false
    };
  },
  watch: {
    $route(to, from) {
      if (to.name == "DashboardMain") {
        this.isbreadcrumb = false;
      } else {
        this.isbreadcrumb = true;
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch("CloseSideBar", { withoutAnimation: false });
    }
  },
  mounted() {
    if (this.$route.name == "DashboardMain") {
      this.isbreadcrumb = false;
    } else {
      this.isbreadcrumb = true;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
.main-container {
  min-width: 1080px;
  position: relative;
}
.app-main {
  overflow: hidden;
  margin: 0px;
  padding: 0px 20px 20px;
}
</style>
<style lang="scss">
.isbreadcrumb{
  position: absolute;
  top: 5px;
  height: 30px !important;
  line-height:30px !important;
  right: 20px;
  z-index: 10000;
  .avatar-container{
    color: white;
    position: relative;
    right: 0px;
    height: 25px;
  }
}
</style>

