<template>
    <div class="pageHtml">
        <div v-html="htmlValue"></div>
    </div>
</template>
<script>
import Jquery from "../../../static/jquery-2.1.1.min";
export default {
  data() {
    return {
      htmlValue: ""
    };
  },
  mounted() {
    console.log(this.$route);
    let api = "../../../static/" + this.$route.query.id + ".txt";
    let vm = this;
    Jquery.ajax({
      url: api,
      success(res) {
        vm.htmlValue = res;
      }
    });
  }
};
</script>
<style scoped>
.pageHtml {
  min-width: 1240px;
  margin: 0px 20px;
}
</style>


