<template>
  <div class="content">
    <div class="title" v-if="student.id">编辑学生</div>
    <div class="title" v-else>添加学生</div>
    <el-form ref="StudentForm" :model="student" :rules="rules" label-width="100px" size="mini" class="form-tab">
      <el-row>
        <el-col>
          <el-form-item label="学年" prop="schoolYear">
            <el-select v-model="student.schoolYear" placeholder="请选择" @change="schoolYearChange">
              <el-option v-for="item in schoolYearOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="student.name" placeholder="请输入学生姓名" class="text-input" style="width: 204px;"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="student.sex">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <el-form-item label="身份证/国外护照" label-width="155px" prop="identityType" style="width: 350px;float: left">

            <el-select v-model="student.identityType" placeholder="请选择" @change="identityTypeChange">
              <el-option v-for="item in identityTypeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label-width="10px" prop="identityNo" style="float: left" class="identity-no">
            <el-input v-model="student.identityNo" style="width: 200px;" placeholder="请输入证件号码" class="text-input"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="isShowDate">
        <el-col>
          <el-form-item label="出生日期" label-width="100px" class="born-date" prop="birthdate">
            <el-date-picker v-model="student.birthdate" :picker-options="pickerDate" value-format="yyyy-MM-dd" type="date" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="!student.id">
        <el-col>
          <el-form-item label="班级类别" prop="classType">
            <el-radio v-model="student.classType" label="1">行政班</el-radio>
            <el-radio v-model="student.classType" label="2">兴趣班</el-radio>
            <el-radio v-model="student.classType" label="0">行政班+兴趣班</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <template v-if="student.classType!=='2'">
        <el-row>
          <el-col>
            <el-form-item label="行政班" label-width="100px" style="float: left" prop="gradeId">
              <el-select v-model="student.gradeId" placeholder="请选择年级" style="width: 150px;" @change="getClass">
                <el-option v-for="item in gradeOptions" :key="item.id" :label="item.gradeName" :value="item.gradeId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label-width="0" label="" style="float: left" prop="schoolClassId">
              <!--<el-select v-model="student.classId" placeholder="请选择班级" style="width: 150px;" @change="classChange">-->
              <el-select v-model="student.schoolClassId" placeholder="请选择班级" style="width: 150px;">
                <el-option v-for="item in classOptions" :key="item.id" :label="item.dictClassName" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <span @click="open" v-if="addClassPower" class="addclass">
            班级不存在，添加班级>>
          </span>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="学籍号" label-width="100px" class="enrollment-no">
              <el-input v-model="student.registerNumber" placeholder="请输入学籍号" class="text-input" style="width: 204px;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="行政班学号" prop="studentNo">
              <el-input v-model="student.studentNo" placeholder="请输入行政班学号" class="text-input" style="width: 204px;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="student.id">
          <el-col>
            <el-form-item label="行政班学籍状态" prop="status" label-width="140px" class="enrollment-status">

              <el-radio-group v-model="student.status">
                <el-radio :label="1">在本班</el-radio>
                <el-radio :label="0">不在本班</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <template>
        <el-row v-if="student.id">
          <el-col>
            <!-- `checked` 为 true 或 false -->
            <!--<el-checkbox v-model="checked" style="margin-left: 30px;">添加兴趣班资料</el-checkbox>-->
          </el-col>
        </el-row>
      </template>

      <template v-if="student.classType!=='1'">
        <div class="interest-class" v-if="student.interestClassList">
          <!--兴趣班类型-->
          <el-row>
            <el-col>
              <el-form-item label="兴趣班" prop="status" >
                <span @click="open2" v-if="addClassPower" class="addclass">班级不存在，添加班级>></span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-card v-for="(item, ind) in student.interestClassList" :key="ind+1" class="box-card" style="width: 450px;border-radius: 5px;margin-bottom: 15px;margin-left: 30px;">
            <el-row style="margin-bottom: 0">
              <el-col>
                <el-button type="text" size="mini" round icon="el-icon-delete" style="float:right;" @click="delCard(ind)"></el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="选择兴趣班" style="float: left">
                  <el-select v-model="item.interestClassId" label-width="100px" placeholder="请选择" size="mini">
                    <el-option v-for="item in interestOptions" :label="item.name" :value="item.id" :key="item.id"></el-option>
                  </el-select>
                </el-form-item>

              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="兴趣班学号" label-width="100px">
                  <el-input v-model="item.interestClassStudentNo" placeholder="请输入兴趣班学号" class="text-input" style="width: 204px;"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="student.id">
              <el-col>
                <el-form-item label="兴趣班学籍状态" prop="status" label-width="140px" class="enrollment-status">
                  <el-radio-group v-model="item.interestClassStatus">
                    <el-radio :label="1">在本班</el-radio>
                    <el-radio :label="0">不在本班</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
          <el-row>
            <el-button type="primary" size="small" round @click="addCard" style="text-align:right;margin: 0 40px 30px;">更多兴趣班+</el-button>
          </el-row>
        </div>
      </template>

      <el-row>
        <el-col>
          <el-form-item size="large" style="text-align: center;" class="form-action">
            <el-button @click="goBack">取消</el-button>
            <el-button type="primary" @click="onSubmit('StudentForm')" :disabled="submitFlag">保存</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-dialog title="新增行政班" class="dialog-addclass" :visible.sync="dialogVisible" width="50%" :append-to-body="true">
      <el-form ref="classForm" :model="dialogData" :rules="dialogRules" label-width="80px" size="mini" class="form-tab">
        <el-form-item label="学年" prop="schoolYear">
          <el-select v-model="dialogData.schoolYear" placeholder="请选择" @change="getTeachers(1)">
            <el-option v-for="item in schoolYearOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年级" prop="dictSchoolTypeGradeId">
          <el-select v-model="dialogData.dictSchoolTypeGradeId" placeholder="请选择">
            <el-option v-for="item in gradeOptions" :key="item.id" :label="item.gradeName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级" prop="dictClassId">
          <el-select v-model="dialogData.dictClassId" placeholder="请选择">
            <el-option v-for="item in classOptions1" :key="item.dictClassId" :label="item.dictClassName" :value="item.dictClassId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="体育老师" prop="teacher">
          <el-select v-model="dialogData.teacherId" placeholder="请选择">
            <el-option v-for="(item,index) in teacherOptions" :key="index" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-row class="row-style">
        <el-col :span="24">
          <el-button @click="dialogVisible=false">取消</el-button>
          <el-button type="primary" @click="saveClass">保存</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog title="新增兴趣班" class="dialog-addclass" :visible.sync="dialogVisible2" width="50%" :append-to-body="true">
      <el-form ref="classForm2" :model="dialogData2" :rules="dialogRules2" label-width="80px" size="mini" class="form-tab">
        <el-form-item label="学年" prop="schoolYear">
          <el-select v-model="dialogData2.schoolYear" placeholder="请选择" @change="getTeachers(2)">
            <el-option v-for="item in schoolYearOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级" prop="name">
          <el-input v-model="dialogData2.name" placeholder="请输入兴趣班名称" class="text-input"></el-input>
        </el-form-item>
        <el-form-item label="体育老师" prop="teacher">
          <el-select v-model="dialogData2.teacherId" placeholder="请选择">
            <el-option v-for="(item,index) in teacherOptions" :key="index" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-row class="row-style">
        <el-col :span="24">
          <el-button @click="dialogVisible2=false">取消</el-button>
          <el-button type="primary" @click="saveClass2">保存</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { formatDate, getSchoolYear } from "@/utils/index";
import request from "@/utils/request";
import requestYapi from "@/utils/requestyAPI";
import { isHavePermissions } from "@/utils/auth";

export default {
  name: "StudentForm",
  data() {
    var checkIdentityNo = (rule, value, callback) => {
      if (typeof value !== "string") return callback(new Error("非法身份证"));
      if (value.length === 0) return callback(new Error("身份证号码必填"));
      var city = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江 ",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北 ",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏 ",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外"
      };
      var birthday =
        value.substr(6, 4) +
        "/" +
        Number(value.substr(10, 2)) +
        "/" +
        Number(value.substr(12, 2));
      var d = new Date(birthday);
      var newBirthday =
        d.getFullYear() +
        "/" +
        Number(d.getMonth() + 1) +
        "/" +
        Number(d.getDate());
      var currentTime = new Date().getTime();
      var time = d.getTime();
      var arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      var arrCh = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];
      var sum = 0,
        i,
        residue;
      if (this.student.identityType === 4 && !/^[a-zA-Z][0-9]{9}$/.test(value))
        return callback(new Error("非法台湾身份证"));
      if (
        this.student.identityType === 2 &&
        !/^((\s?[A-Za-z])|([A-Za-z]{2}))\d{6}\(([0−9aA][0−9aA])|([0-9aA])\)$/i.test(
          value
        )
      )
        return callback(new Error("非法香港身份证"));
      if (
        this.student.identityType === 3 &&
        !/^[1|5|7][0-9]{6}\([0-9Aa]\)/i.test(value)
      )
        return callback(new Error("非法澳门身份证"));
      if (this.student.identityType === 5){
          if(/.*[\u4e00-\u9fa5]+.*$/.test(value)) {
            return callback(new Error('不能输入中文'))
          }
          if(value.length>30){
            return callback(new Error('字符长短不能超过30个'))
          }
      }
      if (this.student.identityType === 1) {
        if (!/^\d{17}(\d|x)$/i.test(value))
          return callback(new Error("非法身份证"));
        if (city[value.substr(0, 2)] === undefined)
          return callback(new Error("非法身份证"));
        if (time >= currentTime || birthday !== newBirthday) {
          return callback(new Error("非法身份证"));
        } else {
          for (i = 0; i < 17; i++) {
            sum += value.substr(i, 1) * arrInt[i];
          }
          residue = arrCh[sum % 11];
          if (residue !== value.substr(17, 1))
            return callback(new Error("非法身份证"));
        }
      }
      return callback();
    };
    var checkEnrollmentNo = (rule, value, callback) => {
      if (!/^[a-zA-Z0-9]*$/i.test(value)) {
        return callback(new Error("请输入正确的学籍号"));
      }
      return callback();
    };
    var checkStudentNo = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("学号不能为空,必须为1-3位数字"));
      } else if (!/^[0-9]*$/i.test(value)) {
        return callback(new Error("学号不能为空,请输入1-3位数字"));
      }
      value = parseInt(value);
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入数字"));
        } else {
          var num = parseInt(value);
          if (num > 999) {
            callback(new Error("请输入三位学号"));
          } else {
            callback();
          }
        }
      }, 500);
    };
    return {
      checked: false,
      addClassPower: false,
      pickerDate: {
        disabledDate: time => {
          var date = new Date();
          return time.getTime() > date;
        }
      },
      multiLine: [],
      schoolYearOptions: [],
      gradeOptions: [],
      classOptions: [],
      interestOptions: [], // 兴趣班名称列表
      student: {
        id: "",
        schoolYear: "",
        schoolClassId: "",
        gradeId: "",
        classId: "",
        name: "",
        sex: "",
        identityType: "",
        birthdate: "",
        registerNumber: "", // 学籍号
        identityNo: "",
        classType: '1',
        studentNo: "",
        status: "1",
        interestClassList: [ // 兴趣班
          {
            interestClassId: '',
            interestClassStudentNo: '',
            interestClassStatus: '1'
          }
        ]
      },
      identityTypeOptions: [
        {
          value: 1,
          label: "中国大陆身份证"
        },
        {
          value: 2,
          label: "中国香港身份证"
        },
        {
          value: 3,
          label: "中国澳门身份证"
        },
        {
          value: 4,
          label: "中国台湾身份证"
        },
        {
          value: 5,
          label: "国外护照"
        }
      ],
      rules: {
        schoolYear: [
          { required: true, message: "请选择学年", trigger: "change" }
        ],
        gradeId: [
          { required: true, message: "请选择年级", trigger: "change" }
        ],
        schoolClassId: [
          { required: true, message: "请选择班级", trigger: "change" }
        ],
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 2, max: 10, message: "请输入正确的姓名", trigger: "blur" }
        ],
        sex: [{ required: true, message: "请选性别", trigger: "change" }],
        classType: [{ required: true, message: "请选择班级类别", trigger: "change" }],
        // registerNumber: [{ validator: checkEnrollmentNo, trigger: "blur" }],
        studentNo: [
          { validator: checkStudentNo, trigger: "blur", required: true },
          { min: 1, max: 3, message: "请输入三位学号", trigger: "blur" }
        ],
        interestClassStudentNo: [
          { required: true, message: '兴趣班学号不能为空', trigger: 'blur' },
          // { type: 'number', message: '兴趣班学号必须为数字值', trigger: 'blur' },
          // { min: 1, max: 3, message: '请输入三位学号', trigger: 'blur' }
        ],
        interestClassId: [
          { required: true, message: '请选择兴趣班', trigger: 'change' }
        ],
        identityType: [
          { required: true, message: '请选择证件类型', trigger: 'change' }
        ],
        birthdate: [
          { required: true, message: "请选出生日期", trigger: "change" }
        ],
        status: [
          { required: true, message: "请选学籍状态", trigger: "change" }
        ],
        identityNo: [{ validator: checkIdentityNo, tigger: "blur" }]
      },
      isShowDate: false,
      submitFlag: false,
      dialogVisible: false,
      dialogVisible2: false,
      dialogRules: {
        schoolYear: [
          { required: true, message: "请选择学年", trigger: "change" }
        ],
        dictSchoolTypeGradeId: [
          { required: true, message: "请选择年级", trigger: "change" }
        ],
        // teacher: [{ required: true, message: "请选择老师", trigger: "change" }],
        dictClassId: [
          { required: true, message: "请选择班级", trigger: "change" }
        ]
      },
      dialogRules2: {
        schoolYear: [{ required: true, message: "请选择学年", trigger: "change" }],
        // teacher: [{ required: true, message: "请选择老师", trigger: "change" }],
        name: [{ required: true, message: "请输入兴趣班名称", trigger: "blur" }]
      },
      dialogData: {
        schoolYear: "",
        dictSchoolTypeGradeId: "",
        dictClassId: "",
        teacherId: ""
      },
      dialogData2: {
        schoolYear: "",
        name: "",
        teacherId: ""
      },
      classOptions1: [],
      teacherOptions: []
    };
  },
  methods: {
    schoolYearChange() {
      this.getInterestClass();
    },
    // classChange(val) {
    //   let obj = {};
    //   obj = this.classOptions.find(item => {
    //     return item.dictClassId === val;
    //   });
    //   this.student.schoolClassId = obj.id;
    //   // console.log(this.student);
    // },
    goBack() {
      this.$router.push(this.$route.query.backUrl);
    },
    onSubmit(formName) {
      var id = this.$route.query.id;
      // var schoolYear = this.$route.query.schoolYear;
      // var schoolClassId = this.$route.query.schoolClassId;
      // this.submitFlag = true;
      this.$refs.StudentForm.validate(valid => {
        if (valid) {
          var date = new Date();
          var diff = date.getFullYear() - 2008;
          var month = date.getMonth();
          if (month >= 7) {
            diff++;
          }
          var list = this.student.schoolYear.split("-");
          if (list.length > 0) {
            this.student.schoolYearStart = list[0];
            this.student.schoolYearEnd = list[1];
          }
          if (!this.student.id) { // 添加
            // this.$store.dispatch("AddStudent", this.student).then(response => {
            request.post("/api/auth/v2/student", this.student).then(response => {
            // requestYapi.post("/mock/35/api/auth/v2/student", this.student).then(response => {
              this.$alert("保存成功!", "提示", {
                confirmButtonText: "确定",
                callback: action => {
                  this.$router.push({
                    name: this.$route.query.backUrl,
                    // path: studentSearchList,
                    params: {
                      schoolYear: this.student.schoolYear,
                      type: "update"
                    }
                  });
                }
              });
            });
          } else { // 编辑
            // this.$store.dispatch("UpdateStudent", this.student).then(response => {
            request.post('/api/auth/v2/student/'+id, this.student).then(response => {
              this.$alert("保存成功!", "提示", {
                confirmButtonText: "确定",
                callback: action => {
                  this.$router.push({
                    name: this.$route.query.backUrl,
                    // path: studentSearchList,
                    params: {
                      schoolYear: this.student.schoolYear,
                      type: "update"
                    }
                  });
                }
              });
            });
          }
        } else {
          console.log('error submit!!');
          return false;
        }
        this.submitFlag = false;
      });
    },
    identityTypeChange() {
      if (this.student.identityType !== 1) {
        this.isShowDate = true;
      } else {
        this.isShowDate = false;
      }
    },
    getGrade() {
      this.$store.dispatch("GetGrade").then(response => {
        this.gradeOptions = response.data;
        setTimeout(this.getClass(), 300)
      });
    },
    getClass() {
      var data = {};
      var list = this.student.schoolYear.split("-");
      if (list.length > 0) {
        data.schoolYearStart = list[0];
        data.schoolYearEnd = list[1];
      }
      setTimeout(() => {
        this.gradeOptions.forEach((v) => {
          if (v.gradeId == this.student.gradeId) {
            data.schoolTypeGradeId = v.id;
          }
        })
        if (!data.schoolTypeGradeId) {
          data.schoolTypeGradeId = this.student.gradeId;
        }
        // console.log('data',data);
        this.$store.dispatch('GetClass', data).then(response => {
          this.classOptions = response.data;
        })
      }, 500)
    },
    getInterestClass() {
      // console.log(this.student.schoolYear);
      var params = {};
      var list = this.student.schoolYear.split("-");
      if (list.length > 0) {
        params.schoolYearStart = list[0];
        params.schoolYearEnd = list[1];
      }
      // console.log(list);
      request.get('/api/auth/v1/interest-class', {
      // requestYapi.get("/mock/35/api/auth/v1/interest-class",{ // 获取兴趣班列表
        params
      }).then(res => {
        // console.log(555,res);
        this.interestOptions = res.data;
      })
    },
    delCard(index) {
      this.student.interestClassList.splice(index, 1);
    },
    addCard() {
      this.student.interestClassList.push({
        interestClassId: '',
        interestClassStudentNo: '',
        interestClassStatus: ''
      });
    },
    doRequest() {
      var id = this.$route.query.id;
      var schoolYear = this.$route.query.schoolYear;
      var schoolClassId = this.$route.query.schoolClassId;
      this.student.schoolYear = schoolYear;
      if (id) {
        this.getInterestClass();
        this.student.id = this.$route.query.id;
        var params = {
          id: id,
          schoolClassId: schoolClassId
        };
        // 编辑时获取学生信息
        request.get("/api/auth/v2/student/"+id, { params }).then(response => {
        // requestYapi.get("/mock/35/api/auth/v2/student/"+id).then(response => {
          for( name in this.student) {
            this.student[name] = response.data[name];
          }
          this.student.gradeId = response.data.gradeId;
          // this.student.schoolClassId = response.data.schoolClassId;
          this.student.schoolYear = this.$route.query.schoolYear;
        })
      }
      this.getGrade();
    },
    open() {
      for (let name in this.dialogData) {
        this.dialogData[name] = "";
      }
      this.dialogVisible = true;
      this.dialogData.schoolYear = this.student.schoolYear;
      this.dialogData.dictSchoolTypeGradeId = this.student.dictSchoolTypeGradeId;
      this.getTeachers();
    },
    open2() {
      for (let name in this.dialogData2) {
        this.dialogData2[name] = "";
      }
      this.dialogVisible2 = true;
      this.dialogData2.schoolYear = this.student.schoolYear;
      this.getTeachers();
    },
    getTeachers(index) {
      if (index == 1) {
        var schoolYear = this.dialogData.schoolYear;
      } else if (index == 2) {
        var schoolYear = this.dialogData2.schoolYear;
      } else {
        var schoolYear = this.student.schoolYear;
      }
      let params = {
        schoolYearStart: schoolYear.split("-")[0],
        schoolYearEnd: schoolYear.split("-")[1]
      };
      request
        .get("/api/auth/v1/teacher/schoolTeacherList", {
          params
        })
        .then(res => {
          this.teacherOptions = res.data;
        });
    },
    saveClass() {
      this.$refs.classForm.validate(valid => {
        if (valid) {
          let params = {};
          for (let name in this.dialogData) {
            params[name] = this.dialogData[name];
          }
          params.schoolYearStart = params.schoolYear.split("-")[0];
          params.schoolYearEnd = params.schoolYear.split("-")[1];
          this.$store.dispatch("AddClass", params).then(response => {
            this.student.schoolClassId = response.data.id;
            this.$alert("保存成功", "提示", {
              confirmButtonText: "确定",
              callback: action => {
                this.dialogVisible = false;
                this.student.schoolYear = this.dialogData.schoolYear;
                this.student.dictSchoolTypeGradeId = this.dialogData.dictSchoolTypeGradeId;
                this.student.dictClassId = this.dialogData.dictClassId;
                this.getClass();
              }
            });
          });
        }
      });
    },
    saveClass2() {
      this.$refs.classForm2.validate(valid => {
        if (valid) {
          let params = {};
          params.schoolYearStart = this.dialogData2.schoolYear.split("-")[0];
          params.schoolYearEnd = this.dialogData2.schoolYear.split("-")[1];
          params.name = this.dialogData2.name;
          params.teacherId = this.dialogData2.teacherId;
          // this.$store.dispatch("AddClass", params).then(response => {
          request.post('/api/auth/v1/interest-class', params).then(response => {
            this.$alert("保存成功", "提示", {
              confirmButtonText: "确定",
              callback: action => {
                this.dialogVisible2 = false;
                this.getInterestClass()
              }
            })
          })
        }
      })
    }
  },
  created() {
    this.schoolYearOptions = getSchoolYear();
    this.student.schoolYear = this.schoolYearOptions[0].value;
  },
  mounted() {
    this.doRequest();
    this.student.schoolYear = this.$route.query.schoolYear;
    this.addClassPower = isHavePermissions("addSchoolClass");
    for (var i = 1; i <= 50; i++) {
      this.classOptions1.push({
        dictClassId: i,
        dictClassName: i + "班"
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.content {
  background-color: white;
  border-radius: 10px;
  min-height: 200px;
  padding: 25px;
}

.title {
  width: 100%;
  height: 80px;
  line-height: 80px;
  font-size: 20px;
  font-weight: bold;
  text-align: left;
  padding-left: 30px;
}
.addclass {
  float: left;
  color: #84bef9;
  height: 28px;
  line-height: 28px;
  width: 200px;
  margin-left: 50px;
  cursor: pointer;
}
  .interest-class{
    width: 500px;
  }
</style>
<style lang="scss">
.dialog-addclass {
  .el-form-item {
    width: 49%;
    display: inline-block;
    .el-form-item__content {
      padding-left: 0px;
    }
  }
  .el-row {
    text-align: center;
  }
}
</style>

