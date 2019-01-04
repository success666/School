<template>
  <div class="physical">
    <el-radio-group
      v-model="physicalModel"
      @change="phyRouter"
      style="margin-bottom: 10px;"
      v-if="showHear"
    >
      <el-radio-button label="1">体质统计</el-radio-button>
      <el-radio-button label="2">体测管理</el-radio-button>
      <el-radio-button label="3">体检管理</el-radio-button>
    </el-radio-group>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      physicalModel: "1",
      showHear: true
    };
  },
  methods: {
    phyRouter() {
      let pathName = "";
      if (this.physicalModel === "1") {
        pathName = "/healthStats";
      } else if (this.physicalModel === "2") {
        pathName = "/testItemList";
      } else if (this.physicalModel === "3") {
        pathName = "/healthList";
      }
      this.$router.push({
        path: pathName
      });
    }
  },
  watch: {
    $route(to, from) {
      this.showHear = true;
      switch (to.name) {
        case "healthStats":
        case "studentHealthStatsList":
          this.physicalModel = "1";
          break;
        case "TestItemList":
          this.physicalModel = "2";
          break;
        case "HealthList":
          this.physicalModel = "3";
          break;
        case "DuidanceDeyail":
        case "TestItemDetail":
          this.showHear = false;
          break;
      }
    }
  },
  mounted() {
    this.showHear = true;
    switch (this.$route.name) {
      case "healthStats":
        this.physicalModel = "1";
        break;
      case "TestItemList":
        this.physicalModel = "2";
        break;
      case "HealthList":
        this.physicalModel = "3";
        break;
      case "DuidanceDeyail":
        case "TestItemDetail":
        this.showHear = false;
        break;
    }
  }
};
</script>

<style scoped>
</style>
 