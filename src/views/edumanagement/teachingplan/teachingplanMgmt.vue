<template>
    <div>
        <!-- <h2>教案管理</h2> -->
      <div class="search-form">
        <el-form :inline="true" :model="formData" class="">
          <el-row>
            <el-col>
              <el-form-item label="学年">
                <el-select v-model="formData.schoolYear" placeholder="请选择" size="mini" @change="schoolYearChange">
                  <el-option
                    v-for="item in schoolYearOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="学期">
                <el-select v-model="formData.schoolTime" placeholder="请选择" size="mini">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="第一学期" value="1"></el-option>
                  <el-option label="第二学期" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="年级">
                <el-select v-model="formData.gradeId" placeholder="请选择" @change="getClass" size="mini">
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
              <el-form-item label="班级">
                <el-select v-model="formData.classId" placeholder="请选择" size="mini">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="1班" value="1"></el-option>
                  <el-option label="2班" value="2"></el-option>
                  <el-option label="3班" value="3"></el-option>
                  <!--<el-option-->
                    <!--v-for="item in classOptions"-->
                    <!--:key="item.dictClassId"-->
                    <!--:label="item.dictClassName"-->
                    <!--:value="item.dictClassId">-->
                  <!--</el-option>-->
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="search(health)" class="btn" size="mini">查询</el-button>
                <el-button type="primary" @click="reset(health)" class="btn" size="mini">重置</el-button>
              </el-form-item>
              <el-form-item style="float: right">
                <el-button type="primary" @click="addteachShow1" class="btn" size="mini">新增教案</el-button>
                <el-button type="primary" @click="centerDialogVisible = true" class="btn" size="mini">统计教案</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="list">
        <template>
          <el-table
            :data="tableData"
            style="width: 100%"
            :default-sort = "{prop: 'date', order: 'descending'}"
            >
            <el-table-column
              prop="date"
              label="学年"
              width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              label="学期"
              width="180">
            </el-table-column>
            <el-table-column
              prop="address"
              label="班级">
            </el-table-column>
            <el-table-column
              prop="address"
              label="教案（份）">
            </el-table-column>
            <el-table-column
              label="操作"
              sortable>
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">详情</el-button>
                <!-- <el-button type="text" size="small">编辑</el-button> -->
              </template>
            </el-table-column>
          </el-table>
          <!--分页器-->
          <div class="page">
            <span class="demonstration"></span>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="formData.pageNum"
              :page-sizes="[10, 20, 30]"
              :page-size="formData.pageSize"
              layout="total, prev, pager, next, sizes, jumper" backgroud=""
              :total="formData.totalPage">
            </el-pagination>
          </div>
        </template>
        <!-- 选择新增教案的方式 -->
        <el-dialog
          title="新增教案"
          :visible.sync="addplan"
          width="50%"
          style="margin-top: 15vh;">
          <el-radio v-model="teachModelRadio" label="1" style="width:30%;text-align: center;">标准教案模板</el-radio>
          <el-radio v-model="teachModelRadio" label="2" style="width:30%;text-align: center;">空白教案模板</el-radio>
          <el-radio v-model="teachModelRadio" label="3" style="width:30%;text-align: center;">上传教案（Word格式）</el-radio>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addplan = false" size="mini">取 消</el-button>
            <el-button type="primary" @click="addteachingplan" size="mini">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 上传Word教案文件 -->
        <el-dialog
          title="上传教案"
          :visible.sync="addword"
          width="50%"
          style="margin-top: 15vh;">
          <el-upload
            class="upload-demo"
            ref="upload"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <div slot="tip" class="el-upload__tip">只能上传Word文件，且不超过500kb</div>
          </el-upload>

          <span slot="footer" class="dialog-footer">
            <el-button @click="addword = false" size="mini">取 消</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">导入</el-button>
          </span>
        </el-dialog>
        <!-- 导出教案 -->
        <el-dialog
          title="确认导出教案？"
          :visible.sync="exportDialogVisible"
          width="30%"
          center style="margin-top: 15vh;">
          <!-- <span>这是一段信息</span> -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="exportDialogVisible = false" size="mini">取 消</el-button>
            <el-button type="primary" @click="exportDialogVisible = false" size="mini">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 新增教案 -->
        <el-dialog
          title="新增教案"
          :visible.sync="addDialogVisible"
          width="400"
          center style="margin-top: 15vh;">
          <div>
            <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="80px">
              <el-form-item label="学期">
                <el-select size="mini" v-model="formInline.semester" placeholder="请选择学期" style="width: 120px;">
                  <el-option label="第一学期" value="1"></el-option>
                  <el-option label="第二学期" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="班级">
                <el-select size="mini" v-model="formInline.gradeId" placeholder="请选择年级" @change="getClass" style="width: 120px;">
                  <el-option label="一年级" value="1"></el-option>
                  <el-option label="二年级" value="2"></el-option>
                </el-select>
                <el-select size="mini" v-model="formInline.classId" placeholder="请选择班级" style="width: 120px;">
                  <el-option label="1班" value="1"></el-option>
                  <el-option label="2班" value="2"></el-option>
                </el-select>
              </el-form-item>
              <br>
              <el-form-item label="授课老师">
                <el-select size="mini" v-model="formInline.teacherId" placeholder="请选择老师" style="width: 120px;">
                  <el-option label="1班" value="1"></el-option>
                  <el-option label="2班" value="2"></el-option>
                </el-select>
              </el-form-item>
              <br>
              <el-form-item label="上课时间">
                <el-select size="mini" v-model="formInline.lessonTime" placeholder="请选择老师" style="width: 120px;">
                  <el-option label="1班" value="1"></el-option>
                  <el-option label="2班" value="2"></el-option>
                </el-select>
              </el-form-item>

            </el-form>
          </div>
          <div>
            <span class="lessonchecked" v-for="(item, index) in formInline.lesson" :key="index">
              <span>{{item.time}}</span>
              <span>第{{item.num}}节课</span>
            </span>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false" size="mini">取 消</el-button>
            <el-button type="primary" @click="nextDialogVisible" size="mini">下一步</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
</template>

<script>
  import { getSchoolYear } from '@/utils/index'
  import request from "@/utils/request";
  export default {
    name: "teachingplanMgmt",
    data() {
      return {
        tableData: [], // 表格数据
        addplan: false, // 新增教案弹窗
        addword: false, // 上传Word文件的窗口
        teachModelRadio: '1',
        exportDialogVisible: false, // 确认导出提示框
        addDialogVisible: false, // 新增教案
        teachModel: '2', // 页面切换
        formInline: {
          semester: '',
          gradeId: '',
          classId: '',
          teacherId: '',
          lessonTime: '',
          lesson: []
        },
        formData: {
          schoolYear: '',
          schoolTime: '',
          gradeId: '',
          classId: '',
          pageSize: 10,
          pageNum: 1,
          totalPage: 10
        },
        schoolYearOptions: '',
        gradeOptions: '',
        classOptions: '',
      }
    },
    mounted() {
      this.schoolYearOptions = getSchoolYear();
      this.formData.schoolYear = this.schoolYearOptions[0].value
    },
    methods: {
      // 新增教案1
      addteachShow1() {
        this.addDialogVisible = true;
      },
      // 下一步2
      nextDialogVisible() {
        this.addDialogVisible = false;
        this.addplan = true
      },
      // 新增教案3
      addteachingplan() {
        if (this.teachModelRadio) {
          if (this.teachModelRadio == 3) {
            this.addplan = false;
            this.addword = true;
          } else {
            this.addplan = false;
            this.$router.push('addteachplan')
          }
        } else {
          this.$message('请先选择')
        }
      },
      // 上传Word文件
      submitUpload() {
        this.$refs.upload.submit();
      //  上传成功后跳转，

      },
      onSubmit() {
        console.log('submit!');
      },
      teachRouter() {
        if (this.teachModel === '1') {
          this.$router.push('outlineMgmt')
        } else if (this.teachModel === '2') {
          // this.$router.push('teachingplanMgmt')
        }
      },
      // 重置搜索栏
      reset(health) {
        this.formData.schoolYear = this.schoolYearOptions[0].value;
        this.formData.schoolTime = '';
        this.formData.gradeId = '';
        this.formData.classId = '';
      },
      schoolYearChange() {
        console.log('学年改变');
      },
      getClass() {
        console.log('请求获得班级数据');
      },
      // 分页大小
      handleSizeChange(val) {
        this.formData.pageSize = val;
      },
      // 当前页跳转
      handleCurrentChange(val) {
        this.formData.pageNum = val;
      },
    }
  }
</script>

<style scoped>

</style>
