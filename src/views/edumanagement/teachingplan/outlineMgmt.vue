<template>
  <div>
    <div>
      <h2>大纲管理</h2>
      <div class="search-form">
        <el-form :inline="true" :model="outline" class="">
          <el-row>
            <el-col>
              <el-form-item label="年级">
                <el-select v-model="outline.gradeId" placeholder="请选择" @change="getClass" size="mini">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="一年级" value="1"></el-option>
                  <el-option label="二年级" value="2"></el-option>
                  <el-option label="三年级" value="3"></el-option>
                  <!--<el-option-->
                    <!--v-for="item in gradeOptions"-->
                    <!--:key="item.gradeId"-->
                    <!--:label="item.gradeName"-->
                    <!--:value="item.gradeId">-->
                  <!--</el-option>-->
                </el-select>
              </el-form-item>
              <el-form-item label="学期">
                <el-select v-model="outline.schoolTime" placeholder="请选择" size="mini">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="第一学期" value="1"></el-option>
                  <el-option label="第二学期" value="2"></el-option>
                  <!--<el-option-->
                    <!--v-for="item in classOptions"-->
                    <!--:key="item.dictClassId"-->
                    <!--:label="item.dictClassName"-->
                    <!--:value="item.dictClassId">-->
                  <!--</el-option>-->
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="search(outline)" class="btn" size="mini">查询</el-button>
              </el-form-item>
              <el-form-item style="float: right">
                <el-button type="primary" @click="editOutline" class="btn" size="mini">编辑大纲</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="list">
        <div>
          <div class="tree-1">
            <span></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import request from "@/utils/request";
  import { formatDate, getSchoolYear } from "@/utils/index";

  let id = 1000;
  export default {
    name: "outlineMgmt",
    data() {
      const data = [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }];
      return {
        data4: JSON.parse(JSON.stringify(data)),
        data5: JSON.parse(JSON.stringify(data)),
        teachModel: '1',
        outline: {
          gradeId: '',
          schoolTime: '',

        }
      }
    },
    methods: {
      append(data) {
        const newChild = { id: id++, label: 'testtest', children: [] };
        if (!data.children) {
          this.$set(data, 'children', []);
        }
        data.children.push(newChild);
      },

      remove(node, data) {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
      },

      renderContent(h, { node, data, store }) {
        return (
          <span class="custom-tree-node">
            <span>{node.label}</span>
            <span class="dig">
              <el-button size="mini" type="text" on-click={ () => this.append(data) }>添加子元素</el-button>
              <el-button size="mini" type="text" on-click={ () => this.remove(node, data) }>删除</el-button>
            </span>
          </span>
       )
      },
      teachRouter() {
        if (this.teachModel === '1') {
          // this.$router.push('outlineMgmt')
        } else if (this.teachModel === '2') {
          this.$router.push('teachingplanMgmt')
        }
      },
      search(){}
    }
  }
</script>

<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

</style>
