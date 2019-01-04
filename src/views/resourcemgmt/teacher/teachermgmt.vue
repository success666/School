<template>
  <div>
    <el-radio-group v-model="teacherModel" style="margin-bottom: 10px;" @change="changeModel">
            <el-radio-button label="1">师资管理</el-radio-button>
            <el-radio-button label="2">师资统计</el-radio-button>
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
      teacherModel: "1"
    };
  },
  methods: {
    changeModel(value) {
      switch(value){
        case "1":
          this.$router.push( `/teacherManagement/teacherList`)
        break;
        case "2":
          this.$router.push( `/teacherManagement/teacherStats`)
        break;
      }
    }
  },
  mounted() {
    if(this.$route.name=="teacherStats"){
      this.teacherModel="2";
    }else{
      this.teacherModel="1"
    }
  },
};
</script>

<style scoped>
</style>
