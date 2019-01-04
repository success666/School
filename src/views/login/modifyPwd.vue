<template>
    <div class="modify">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="ke-ruleForm">
            <el-form-item label="旧密码" prop="oldPass">
                <el-input type="password" v-model="ruleForm.oldPass" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="pass">
                <el-input type="password" v-model="ruleForm.pass" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认新密码" prop="checkPass">
                <el-input type="password" v-model="ruleForm.checkPass" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                <el-button @click="goback">取消</el-button>
            </el-form-item>
        </el-form> 
    </div>
</template>

<script>
  import request from '@/utils/request'
  import {PASSWORD, PASSWORD_TIP} from '../../utils/validate'

  export default {
    data() {
      const validateOldPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入旧密码'))
        } else {
          callback()
        }
      }
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新密码'));
        } else if(!PASSWORD.test(value)) {
          callback(new Error(PASSWORD_TIP));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      const validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入新密码'));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入新密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        ruleForm: {
          pass: '',
          checkPass: '',
          oldPass: ''
        },
        rules: {
          pass: [
            {validator: validatePass, trigger: 'blur'}
          ],
          checkPass: [
            {validator: validatePass2, trigger: 'blur'}
          ],
          oldPass: [
            {validator: validateOldPass, trigger: 'blur'}
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            request.post('/api/auth/v1/school/account/updatePassword', {
              oldPassword: this.ruleForm.oldPass,
              newPassword: this.ruleForm.pass
            }).then((res) => {
              if (res.status && res.status.code === 500) {
                this.$message.error(res.status.msg);
                return;
              }else{
                let vm=this;
                this.$message.success("修改密码成功，三秒后去到重新登陆页面");
                setTimeout(function(){
                  if (window.localStorage.getItem('access_token')) {
                    localStorage.clear();
                    sessionStorage.clear();
                  }
                  vm.$router.push({path: '/login'});
                },3000)
              }
              
            }).catch(err => {

            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      goback() {
        this.$router.push({path: '/'});
      }
    }
  }
</script>

<style lang="scss" scoped>
    .modify {
        position: absolute;
        width: 450px;
        height: 300px;
        padding: 20px;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        border: 1px solid #ccc;
    }
</style>
