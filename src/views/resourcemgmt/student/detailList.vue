<template>
  <div class="detail_list">
    <h2>{{  title  }}</h2>
    <div class="detail_data">
      <el-table
        :data="detailListData"
        style="width: 100%">
        <el-table-column
          align="center"
          prop="studentNo"
          label="学号"
          min-width="180">
        </el-table-column>
        <el-table-column
          align="center"
          prop="name"
          label="姓名"
          min-width="180">
        </el-table-column>
        <el-table-column
          align="center"
          prop="sex"
          label="性别"
          :formatter="formatSex"
          min-width="180">
        </el-table-column>
        <el-table-column
          align="center"
          prop="status"
          :formatter="formatStatus"
          label="学籍状态"
          min-width="180">
        </el-table-column>
        <el-table-column label="操作" align="center" test="date">
          <template slot-scope="scope">
            <el-button
              min-width='180'
              size="mini"
              @click="handleEdit(scope.$index, detailListData)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="bottomC">
      <div class="print">
        <el-button type="primary" size="small">导出</el-button><el-button type="primary" size="small">打印</el-button>
      </div>
      <!--  <div class="data_detail_pagination">
           <el-pagination
           background
           @size-change="handleSizeChange"
           @current-change="handleCurrentChange"
           :current-page="1"
           :page-sizes="[10, 20, 30, 40]"
           :page-size="10"
           layout="prev, pager, next, sizes, jumper"
           :total="40">
           </el-pagination>
       </div> -->
    </div>
  </div>
</template>
<script>
  // import topSelect from '@/components/conditions/topConditions'
  import { mapGetters } from 'vuex'
  import axios from 'axios'
  export default {
    computed:{
      ...mapGetters([
        'routeList',
        'schoolYear',
        'schoolYearArr',
        'queryData',
        'itemizedInfoList',
        'routeList',
        'defaultClassification'
      ])
    },
    data() {
      return {
        title:'',
        detailListData: [
        ],
      }
    },
    mounted () {
      this.$store.dispatch('AddRouteList', {
        path: `/studentStatsDetailList?name=${this.$route.query.name}&id=${this.$route.query.id}&schoolYear=${this.$route.query.schoolYear}`,
        name: this.$route.query.name,
      });
      this.$store.dispatch('InitPageSelectArr', [
        'posProvinceId',//省
        'posCityId',//市
        'posDistrictId',//区
        'schoolId',//学校
        'schoolTypeId',//学校类型
        'schoolYearArr',//学年度
        'schoolYear',//学年度
      ]);
      this.$ajax.get('/api/auth/v1/resourceMgmt/student/stats/class',{
        params: {
          schoolClassId:this.$route.query.id,
          schoolYear:this.$route.query.schoolYear
        }
      })
        .then( res => {
          this.detailListData = res.data;
        });
      this.getTitle();
    },
    methods: {
      getTitle() {
        let name= '';
        name = this.schoolYear+'学年';
        if(this.routeList.length==1){
          name+= '全国'
        }else{
          this.routeList.forEach((item, index) => {
            if(index>0){
              name += item.name
            }
          });
        }
        name += '学生列表';
        this.title = name;
      },
      formatSex: function (row, column, cellValue) {
        if (cellValue == 2){
          return '女';
        }else if (cellValue == 1){
          return '男';
        }
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      handleEdit(index, data) {
        this.$router.push({
          name: 'studentStatsDetail',
          query: {
            name: data[index].name,
            identityNo:data[index].identityNo,
            schoolYearStart:this.$route.query.schoolYear.slice(0,4),
            schoolYearEnd:this.$route.query.schoolYear.slice(5,9)
          }
        })
      },
      formatStatus: function (row, column, cellValue) {
        if (cellValue == 0){
          return '不在本班';
        }else if (cellValue == 1){
          return '在读';
        }
      }
    }
  }
</script>
<style scoped>
  .detail_data{
    height: 500px;
    overflow: auto;
    background-color: #fff
  }
  .detail_list{
    position: relative;
    height: 652px;
    padding: 20px 0;
    background-color: #fff
  }
  h2{
    line-height: 40px;
    text-align: center;
    background-color: #fff;
    margin: 0;
    padding: 39px 0 68px;
  }
  .bottomC{
    background-color: #fff;
    padding: 20px 0
  }
  .print{
    text-align: right;
    padding-right: 28px;
    margin-bottom: 20px
  }
  .data_detail_pagination{
    text-align: right;
    padding-right: 28px
  }
</style>
