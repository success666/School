<template>
  <div class="physical">
    <el-radio-group
      v-model="teachModel"
      @change="teachRouter"
      style="margin-bottom: 10px;"
      v-if="showHear"
    >
      <el-radio-button label="1">大纲管理</el-radio-button>
      <el-radio-button label="2">教案管理</el-radio-button>
    </el-radio-group>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>

</template>

<script>
    export default {
        name: "teachingMgmt",
        data() {
          return {
            teachModel: "1",
            showHear: true
          };
        },
        methods: {
          teachRouter() {
            let pathName = "";
            if (this.teachModel === "1") {
              pathName = "/teachingMgmt/outlineMgmt";
            } else if (this.teachModel === "2") {
              pathName = "/teachingMgmt/teachingplanMgmt";
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
              // case "teachingMgmt":
              //   this.teachModel = "2";
              //    this.$router.push({
              //     path: "/teachingMgmt/teachingplanMgmt"
              //   });
              //   break;
              case "outlineMgmt":
                this.teachModel = "1";
                break;
              case "teachingplanMgmt":
                this.teachModel = "2";
                break;
            }
          }
        },
        mounted() {
          this.showHear = true;
          switch (this.$route.name) {
            case "outlineMgmt":
              this.teachModel = "1";
              break;
            case "teachingplanMgmt":
              this.teachModel = "2";
              break;
            // case "DuidanceDeyail":
              // case "TestItemDetail":
              // this.showHear = false;
              // break;
          }
        }
    }
</script>

<style scoped>

</style>
