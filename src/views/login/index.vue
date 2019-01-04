<template>
  <div class="login-container">
    <div class="login-logo">
      <img src="../../assets/imgs/img_login_logo.png" />
    </div>
    <el-form v-show="showform.login" class="login-form ydl-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
      <h3 class="title">学校管理中心</h3>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <img src="../../assets/imgs/icon_login_user.png" />
        </span>
        <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="用户名" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container svg-container_password">
          <img src="../../assets/imgs/icon_login_lock.png" />
        </span>
        <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on"
                  placeholder="密码"></el-input>
        <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
      </el-form-item>

      <el-form-item class="rememberPassword">
        <el-row>
          <el-col :span="12" class="checkPassword">
            <el-checkbox v-model="checked">记住密码</el-checkbox>
          </el-col>
          <el-col :span="12" class="forget">
            <span @click="updatePassword">忘记密码？</span>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
          登 录
        </el-button>
      </el-form-item>
    </el-form>
    <el-form class="ydl-form updatePassword" v-show="!showform.login" size="small" :model="passwordForm" :rules="passwordRules" ref="passwordForm">
      <template v-if="showform.phoneNumber">
        <el-form-item  label="手机号码" label-width="80px" prop="phoneNumber">
          <el-input v-model="passwordForm.phoneNumber" class="phoneNumber"></el-input>
        </el-form-item>
        <el-form-item  label="验证码" label-width="80px" prop="authCode">
          <el-input v-model="passwordForm.authCode" class="authCode" ></el-input>
          <el-button size="small" type="primary" @click="getauthCode" class="a1uthCode_btn"  :loading="authCodeLoading">{{authCodeName}}</el-button>
        </el-form-item>
        <el-form-item style="    text-align: center;">
          <el-button size="medium" @click="cancel">取消</el-button>
          <el-button size="medium" type="primary" @click="checkauthCode">确认</el-button>
        </el-form-item>
      </template>
      <template v-if="showform.newPassword">
        <el-form-item label="新密码" label-width="80px" prop="newPassword">
          <el-input :type="pwdType" v-model="passwordForm.newPassword">
            <span slot="suffix" class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
          </el-input>
        </el-form-item>
        <el-form-item style="text-align: center;">
          <el-button size="medium" @click="cancel">取消</el-button>
          <el-button size="medium" type="primary" @click="alertPassword">确认</el-button>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script>
  import request from '@/utils/request'
  import parseBase from '@/utils/parseBase'
  export default {
    name: 'login',
    created() {
      let user=JSON.parse(localStorage.getItem("ydl_userP"));
      if(user!=null){
        this.checked=true;
        let username=parseBase.decode(user.username);
        let password=parseBase.decode(user.password);
        this.loginForm.username=username;
        this.loginForm.password=password;
      }
    },
    data() {
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入手机号码'),false);
        } else {
          let partten =/^1\d{10}$/;
          if(!partten.test(value)){
            callback(new Error('请输入正确的手机号码'));
          }
          callback();
        }
      };
      return {
        loginForm: {
          username: '',
          password: ''
        },
        loginRules: {
          username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
          password: [{ required: true, trigger: 'blur', message: '请输入密码' }]
        },
        passwordForm:{
          phoneNumber:"",
          authCode:"",
          newPassword:""
        },
        passwordRules:{
          phoneNumber: [{ required: true, trigger: 'blur', validator: validatePass }],
          authCode: [{ required: true, trigger: 'blur', message: '请输入验证码' }],
          newPassword: [{ required: true, trigger: 'blur', message: '请输入新的密码' }],
        },
        loading: false,
        authCodeLoading:false,
        authCodeName:"获取验证码",
        pwdType: 'password',
        showform:{
          login:true,
          phoneNumber:true,
          newPassword:false
        },
        checked:false
      }
    },
    methods: {
      showPwd() {
        if (this.pwdType === 'password') {
          this.pwdType = ''
        } else {
          this.pwdType = 'password'
        }
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.$store.dispatch('Login', this.loginForm).then(() => {
              if(this.checked){
                let username=this.loginForm.username;
                let password=this.loginForm.password;
                username=parseBase.encode(username);
                password=parseBase.encode(password);
                let user=JSON.stringify({username:username,password:password});
                localStorage.setItem("ydl_userP",user);
              }else{
                localStorage.removeItem("ydl_userP");
              }
              this.loading = false;
              this.$router.push({ path: '/' });
            }).catch(() => {
              this.loading = false;
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      updatePassword(){
        this.showform.login=false;
        this.showform.phoneNumber=true;
        this.showform.newPassword=false;
        this.passwordForm.phoneNumber="";
        this.passwordForm.authCode="";
        this.passwordForm.newPassword="";
        this.$refs.passwordForm.resetFields();
      },
      //获取验证码
      getauthCode(){
        // console.log("123")
        this.$refs.passwordForm.validateField('phoneNumber');
        if(this.passwordForm.phoneNumber==""){
          return
        }else{
          let partten = /^1\d{10}$/;
          if(!partten.test(this.passwordForm.phoneNumber)){
            return
          }
        }
        this.authCodeLoading=true;
        let countdown=60;
        request.get(`/api/auth/v1/school/account/forgetPassword/verificationCode`,{
          params:{phoneNumber:this.passwordForm.phoneNumber}
        }).then((res)=>{
          settime(60,this);
        }).catch(()=>{
          this.authCodeLoading=false;
        })
      },
      cancel(){
        this.showform.newPassword=false;
        this.showform.login=true;
        this.showform.phoneNumber=false;
        this.passwordForm.phoneNumber="";
        this.passwordForm.authCode="";
        this.passwordForm.newPassword="";
        this.pwdType='password';
      },
      checkauthCode(){
        this.$refs['passwordForm'].validate((valid) => {
          if(valid){
            request.get(`api/auth/v1/school/account/forgetPassword/checkVerificationCode`,{
              params:{
                phoneNo:this.passwordForm.phoneNumber,
                verificationCode:this.passwordForm.authCode
              }
            }).then((res)=>{
              this.showform.newPassword=true;
              this.showform.login=false;
              this.showform.phoneNumber=false;
            })
          }
        })
      },
      alertPassword(){
        this.$refs['passwordForm'].validate((valid) => {
          if(valid){
            request.post(`/api/auth/v1/school/account/forgetPassword`,{
              phoneNo:this.passwordForm.phoneNumber,
              verificationCode:this.passwordForm.authCode,
              password:this.passwordForm.newPassword

            }).then((res)=>{
              this.showform.newPassword=false;
              this.showform.login=true;
              this.showform.phoneNumber=false;
              this.pwdType = 'password'
              this.$message({
                message: '修改成功，请重新登陆',
                type: 'success'
              });
            })
          }
        })
      }
    }
  }
  function settime(val,vm){
    if (val == 0) {
      vm.authCodeName="获取验证码";
      vm.authCodeLoading=false;
    } else {
      vm.authCodeName="重新获取(" + val + ")";
      val--;
      setTimeout(function() {
        settime(val,vm)
      },1000)
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #fff;
$light_gray1: #000;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-logo {
  position: absolute;
  left: calc(100% - 594px);
  top: 67px;
  height: 129px;
  right: 0;
  width: 129px;
  margin: auto;
  img{
    width: 160px;
    height: 130px;
  }
}
/* reset element-ui css */
.login-container {
  position: relative;
  height: 100%;
  min-height: 700px;
  width: 100%;
  background-image: url(../../assets/imgs/img_ST_bg.png);
  filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale')";
  -moz-background-size: 100% 100%;
  background-size: 100% 100%;
  background-attachment: fixed;
  .ydl-form {
    position: absolute;
    left: calc(100% - 570px);
    top: 229px;
    height: 380px;
    right: 0;
    width: 362px;
    padding: 35px 56px 15px 44px;
    margin: auto;
    border-radius: 5px;
    background-color: white;
    opacity: 0.9;
  }
  .login-form {
    .el-input {
      vertical-align: middle;
      display: inline-block;
      height: 41px;
      border-bottom: 1px solid #cccccc;
      width: calc(100% - 50px);
      input {
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 5px;
        color: $light_gray1;
        background-color: white;
        height: 36px;
        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px #ffffff inset !important;
          box-shadow: 0 0 0px 1000px #ffffff inset !important;
          -webkit-text-fill-color: #000 !important;
        }
      }
    }
  }
  .updatePassword {
    height: 200px;
    padding-left: 20px;
    padding-right: 20px;
    .authCode {
      width: calc(100% - 115px);
      margin-right: 5px;
      vertical-align: middle;
    }
    .a1uthCode_btn{
      width: 110px;
    }
    .el-button {
      vertical-align: middle;
    }
  }
  .el-form-item {
    color: #454545;
    .el-form-item__content {
      font-size: 0px;
      line-height: inherit;
    }
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    vertical-align: middle;
    width: 40px;
    text-align: left;
    display: inline-block;
    img {
      margin-top: 10px;
    }
    &_login {
      font-size: 26px;
      color: #409eff;
    }
    &_password {
      font-size: 20px;
      color: #409eff;
    }
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: #000;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .rememberPassword {
    line-height: 40px;
    .el-col {
      vertical-align: middle;
    }
    .checkPassword{
      text-align: left;
      padding-left: 25px;
    }
    .forget {
      font-size: 14px;
      text-align: right;
      span {
        display: inline-block;
        cursor: pointer;
        &:hover {
          color: #409eff;
        }
      }
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
@media screen and (max-width: 700px) {
  .login-logo,
  .login-form {
    left: 0 !important;
  }
}
</style>
