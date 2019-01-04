<template>
  <div class="guidanceDeyail">
    <h3>指导锻炼</h3>
    <div class="guidanceDeyail_video">
      <video :src="formData.vedioHeadUrl" controls></video>
    </div>
    <el-row class="groupValue">
      <el-col :span="24">
        <span class="groupValue_name">{{formData.name}}</span>
        <span class="groupValue_value">{{formData.groupValue}}次 x {{formData.exerciseGroupNo}}组</span>
      </el-col>
    </el-row>
    <el-row class="equipment">
      <el-col :span="24">
        <div class="equipment_name">运动器材</div>
        <span class="equipment_value">{{apparatusList.join(",")}}</span>
      </el-col>
    </el-row>
    <el-row class="actionDescription">
      <el-col :span="24">
        <div class="actionDescription_name">运动描述</div>
        <div class="actionDescription_value" v-html="formData.actionDescription"></div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      id: 11,
      formData: {},
      apparatusList: []
    };
  },
  methods: {},
  mounted() {
    let params = { id: this.$route.query.id };
    this.$store.dispatch("GetRecomDetailData", params).then(response => {
      this.formData = response.data;
      this.apparatusList = [];
      response.data.apparatusList.forEach(item => {
        this.apparatusList.push(item.name);
      });
    });
  }
};
</script>
<style lang="scss" scoped>
.guidanceDeyail {
  background-color: white;
  border-radius: 10px;
  min-height: 200px;
  padding: 20px 25px;
  color: #525252;
  h3 {
    margin-top: 0px;
  }
  .guidanceDeyail_video {
    padding: 20px 0px;
    text-align: center;
    background-color: rgb(229, 226, 226);
    border-radius: 10px;
    margin-bottom: 40px;
    video{
      width: 500px;
    }
  }
  .groupValue {
    margin-bottom: 20px;
    .groupValue_name {
      color: #1263f7;
      font-size: 20px;
      vertical-align: middle;
    }
    .groupValue_value {
      font-size: 14px;
      color: #736969;
      vertical-align: sub;
    }
  }
  .equipment {
    margin-bottom: 20px;
    .equipment_name {
      line-height: 20px;
      height: 20px;
      border-left: 2px solid #1263f7;
      padding-left: 5px;
      margin-bottom: 10px;
    }
    .equipment_value {
      padding-left: 10px;
      font-size: 14px;
    }
  }
  .actionDescription {
    .actionDescription_name {
      line-height: 20px;
      height: 20px;
      border-left: 2px solid #1263f7;
      padding-left: 5px;
      margin-bottom: 10px;
    }
    .actionDescription_value {
      font-size: 14px;
      padding-left: 10px;
    }
  }
}
</style>
<style lang="scss">
.actionDescription_value {
  p {
    margin: 10px 0px;
  }
}
</style>



