<template>
  <div>
    <div class="tab">
      <div class="tab-vessel">
        <div :class="[activeName == idx ? 'is-active' : '', 'tab-btn']"
             v-for="(item, idx) in tabData"
             @click="handleClick(idx, item.path)"
        >
          {{item.name}}
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        activeName: '0',
        tabData: [
          { name: '账号管理', path: '/accountManagement_lv2/account' },
          { name: '角色管理', path: '/accountManagement_lv2/role' },
        ]
      };
    },
    methods: {
      handleClick(idx, path) {
        this.activeName = idx;
        this.$router.push({
          path: path
        })
      },
      getTabActive() {
        const strArr = this.$router.history.current.path.split('/');
        const str = strArr[strArr.length - 1];
        if (str === 'account' || str === 'accountadd' || str === 'accountedit') {
          this.activeName = 0;
        } else if (str === 'role' || str === 'roleadd' || str === 'roleedit') {
          this.activeName = 1;
        }
      }
    },
    created() {
      this.getTabActive();
    },
    watch: {
      $route() {
        this.getTabActive();
      }
    }
  }
</script>

<style lang="scss" scoped>
  .tab {
    margin-bottom: 10px;
    overflow: hidden;
  }
  .tab-vessel {
    float: left;
    border: 1px solid #409EFF;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
  }
  .tab-btn {
    display: inline-block;
    padding: 10px 14px;
    border-right: 1px solid #409EFF;
    color: #409EFF;
    font-size: 14px;
    cursor: pointer;

    &:last-child {
       border-right: transparent;
     }
  }
  .tab-btn.is-active {
    background: #409EFF;
    color: #fff;
  }
</style>
