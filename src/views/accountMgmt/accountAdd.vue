<template>
  <div class="contain-vessel">
    <el-form :model="ruleForm" status-icon ref="ruleForm" :rules="rules" label-width="120px" class="ke-ruleForm">
      <el-form-item label="学校账号" prop="account">
        <el-input v-model="ruleForm.account" auto-complete="off" placeholder="请输入学校账号"></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="roleId">
        <el-select
          v-model="ruleForm.roleId"
          placeholder="角色"
        >
          <el-option
            v-for="item in roleData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="联系人姓名" prop="username">
        <el-input v-model="ruleForm.username" auto-complete="off" placeholder="请输入联系人姓名"></el-input>
      </el-form-item>
      <el-form-item label="联系人手机号" prop="tel">
        <el-input-number class="inputNumber" v-model="ruleForm.tel" auto-complete="off" placeholder="请输入联系人手机号"></el-input-number>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm.password" auto-complete="off" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="ruleForm.status" placeholder="请选择状态">
          <el-option label="启用" value="1"></el-option>
          <el-option label="停用" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveForm" v-if="powerBtn.addBtn">保存</el-button>
        <el-button @click="goback">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import request from "@/utils/request";
import { PASSWORD, PASSWORD_TIP, MOBILE } from "../../utils/validate";
import parseBase from "@/utils/parseBase";
export default {
  created() {
    this.getRoleList();
    var power = localStorage.getItem("access_token").split(".")[1];
    power = parseBase.decode(power);
    if (power.indexOf("addSchoolAccount") < 0) this.powerBtn.addBtn = false;
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else if (!PASSWORD.test(value)) {
        callback(new Error(PASSWORD_TIP));
      } else {
        callback();
      }
    };
    const validateMobile = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入手机号"));
      } else if (!MOBILE.test(value)) {
        callback(new Error("请输入正确的手机号码"));
      } else {
        callback();
      }
    };
    return {
      powerBtn: {
        addBtn: true
      },
      ruleForm: {
        account: "",
        roleId: "",
        username: "",
        tel: "",
        password: "",
        status: ""
      },
      rules: {
        account: [
          { required: true, message: "请输入学校账号", trigger: "blur" }
        ],
        roleId: [{ required: true, message: "请选择角色", trigger: "change" }],
        username: [
          { required: true, message: "请输入联系人姓名", trigger: "blur" }
        ],
        tel: [{ required: true, validator: validateMobile, trigger: "blur" }],
        password: [
          { required: true, validator: validatePass, trigger: "blur" }
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }]
      },
      roleData: []
    };
  },
  methods: {
    getRoleList() {
      request
        .get(`/api/auth/v1/school/account/getSchoolAccountRoleFromSchool`)
        .then(res => {
          this.roleData = res.data;
        });
    },
    saveForm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          request
            .post("/api/auth/v1/school/account", {
              roleId: this.ruleForm.roleId,
              account: this.ruleForm.account,
              username: this.ruleForm.username,
              tel: this.ruleForm.tel,
              password: this.ruleForm.password,
              status: this.ruleForm.status
            })
            .then(res => {
              this.$router.push({
                path: `/accountManagement_lv2/account`
              });
            });
        } else {
        }
      });
    },
    goback() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped lang="scss">
.form-inline {
  display: inline-block;
}
</style>
<style lang="scss">
.inputNumber {
  width: 100%;
  .el-input-number__decrease,
  .el-input-number__increase {
    display: none;
  }
  .el-input__inner {
    padding: 15px;
    text-align: left;
  }
}
</style>

