<template>
  <div :class="['user-layout-wrapper', device]">
    <div class="container">
      <div class="top">
        <div class="login_logo"><img src="@/assets/login_logo.svg" alt="欢迎登录物流视线"></div>
        <div class="desc">欢迎登录物流视线协同运输管理平台</div>
      </div>
        <div class="main" style="text-align:center;">
          <el-form class="user-layout-login" ref="formLogin" :model="formLogin" id="formLogin">
            <el-tabs  v-model="customActiveKey" :style="'float:none;'"
              :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }" size="large" :animated="false" @change="handleTabClick"
            >
              <el-tab-pane name="account" label="账户登录">
                <template v-if="customActiveKey=='account'">
                  <el-form-item v-if="accountAlertShow" style="margin-bottom: 12px">
                    <el-alert :title="accountAlertMsg" type="error" closable @close="handleUserClose" />
                  </el-form-item>
                  <el-form-item  prop="username" :rules="rules.username">
                    <i slot="prefix" class="icon iconfont iconuserd"></i>
                    <el-input size="large"  type="text" placeholder="帐户名或邮箱地址" clearable v-model="formLogin.username"  ref="username"  v-focus-next-on-enter="'password'">
                      <i slot="prefix" class="icon iconfont iconuserd"></i>
                    </el-input>
                  </el-form-item>

                  <el-form-item prop="password" :rules="rules.password">
                    <el-input size="large" type="password" show-password  placeholder="密码" v-model="formLogin.password" ref="password" v-focus-next-on-enter="'loginbutton'">
                    <i slot="prefix" class="icon iconfont iconpwd"></i>
                    </el-input>
                  </el-form-item>
                </template>
              </el-tab-pane>
              <el-tab-pane name="phone" label="短信登录">
                <template v-if="customActiveKey === 'phone'">
                  <el-form-item v-if="phoneAlertShow" style="margin-bottom: 12px" class="lg_input">
                    <el-alert :title="phoneAlertMsg" type="error" closable @close="handlePhoneClose" banner/>
                  </el-form-item>
                  <el-form-item prop="mobile" :rules="rules.mobile">
                    <el-input size="large" type="text" placeholder="手机号" :maxlength="11" v-model="formLogin.mobile"  ref="iconphone" v-focus-next-on-enter="'iconduanxin'">
                    <i slot="prefix" class="icon iconfont iconphone"></i>
                    </el-input>
                  </el-form-item>

                  <el-row :gutter="16">
                    <el-col class="gutter-row" :span="16">
                      <el-form-item  prop="vcode" :rules="rules.vcode">
                        <el-input size="medium" type="text" placeholder="验证码" v-model="formLogin.vcode" class="lg_input"  ref="iconduanxin"  v-focus-next-on-enter="'loginbutton'">
                          <i slot="prefix" class="icon iconfont iconduanxin"></i>
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col class="gutter-row" :span="8">
                      <el-button
                        class="lg_input getCaptcha" tabindex="-1" :disabled="state.smsSendBtn"  @click.stop="getCaptcha"
                        v-text="!state.smsSendBtn && '获取验证码' || (state.time+' s')"
                      ></el-button>
                    </el-col>
                  </el-row>
                </template>
              </el-tab-pane>
            </el-tabs>
            <el-form-item style="margin-top:12px">
              <el-button size="large" type="primary" ref="loginbutton" @click.stop="handleSubmit" class="login-button" :loading="loginBtn" :disabled="loginBtn" >确定</el-button>
            </el-form-item>
            <el-form-item style="margin-top:12px">
              <el-checkbox v-model="formLogin.checked" label="" size="medium" style=""></el-checkbox>
              <div class="lg_tp" style="display:inline-block;">已阅读并同意<a href="./productInfo.html" target='_blank'>《用户使用协议》</a> 和 <a href="./personalAgree.html" target='_blank'>《隐私政策》</a><br/>新用户请使用手机号登录新系统会自动为您完成注册.</div>
            </el-form-item>
          </el-form>
          <div>
          </div>
        </div>
        <div class="footer">
          <div class="links">
            <a href="_self">帮助</a>
          </div>
          <div class="copyright">
            Copyright &copy; 2018 上海点觉信息科技
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import md5 from 'md5'
// import { mapActions, mapGetters } from 'vuex'
export default {
  components: {},
  data () {
    function handleUsernameOrEmail (rule, value, callback) {
      const emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
      if (value) {
        // 判断登录的类型
        let k = value.indexOf('@')
        let l = value.indexOf('.')
        if ((k > 0 || l > 0) && !emailReg.test(value)) {
          let res = '请输入正确的帐户名或邮箱'
          callback(res)
        } else {
          callback()
        }
      } else {
        callback()
      }
    }

    return {
      customActiveKey: 'account',
      loginBtn: false,
      state: {
        time: 120,
        smsSendBtn: false
      },
      formLogin: {
        username: '',
        password: '',
        captcha: '', // 图片验证码
        vcode: '', //  手机验证码
        mobile: '',
        checked: true,
        type: 0
      },
      randomStr: '',
      accountAlertShow: false,
      accountAlertMsg: true,
      phoneAlertShow: false,
      phoneAlertMsg: true,
      rules: {
        mobile: [{ required: true, pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }],
        vcode: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
        username: [{ required: true, message: '请输入帐户名或邮箱！', trigger: 'blur' }, { validator: handleUsernameOrEmail, trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  computed: {
    device () {
      return 'desktop'
    }
  },
  created () {
    if (top.location !== self.location) {
      top.location.href = self.location.href
    }
  },
  methods: {
    // 关闭userAlert提示框
    handleUserClose () {
      this.accountAlertShow = false
    },
    // 关闭phoneAlert提示框
    handlePhoneClose () {
      this.phoneAlertShow = false
    },
    // 切换tabBar
    handleTabClick (key) {
      this.customActiveKey = key
    },
    // 提交表单
    handleSubmit (e) {
      e.preventDefault()
      // 定义登录的参数
      let loginParams = {}
      if (this.customActiveKey === 'account') {
        // 使用账户密码登录
        this.$refs['formLogin'].validate((err) => {
          if (err) {
            loginParams.username = this.formLogin.username
            // console.log(md5(values.password))
            loginParams.password = md5(this.formLogin.password)
            this.getLogin(loginParams, 0)
          } else {
            this.loginBtn = false
          }
        }
        )
      } else {
        // 使用手机号登录
        this.$refs['formLogin'].validate((err) => {
          if (err) {
            loginParams = { mobile: this.formLogin.mobile, vcode: this.formLogin.vcode }
            this.getLogin(loginParams, 1)
          } else {
            this.loginBtn = false
          }
        }
        )
      }
    },
    getLogin (param, type) {
      if (!this.formLogin.checked) {
        this.$message({ type: 'warning', message: '请选择用户协议' })
        return
      }
      this._api({
        url: type ? 'mobilelogin' : 'login',
        webType: 'root',
        type: 'post',
        params: param
      }).then(result => {
        if (!result.code) {
          this.$store.commit('SET_ACCESSTOKEN', result.data.token)
          this.$store.commit('SET_TENANTID', result.data.tenantId)
          this.$store.commit('SET_LOGIN_USER', result.data)
          this.$router.push({ path: 'frame' })
        } else {
          this.errorTips(result.message, type)
        }
        this.loginBtn = false
      }, error => {
        this.errorTips(error.message, type)
        this.loginBtn = false
      }).catch(() => {})
    },
    errorTips (message, type) {
      if (!type) {
        this.accountAlertShow = true
        this.accountAlertMsg = message || '请求出错了'
      } else {
        this.phoneAlertShow = true
        this.phoneAlertMsg = message || '请求出错了'
      }
    },
    // 获取手机验证码
    getCaptcha (e) {
      e.preventDefault()
      let that = this
      this.$refs['formLogin'].validateField('mobile', (err) => {
        if (!err) {
          that.state.smsSendBtn = true
          const interval = window.setInterval(() => {
            if (that.state.time-- <= 0) {
              that.state.time = 120
              that.state.smsSendBtn = false
              window.clearInterval(interval)
            }
          }, 1000)
          if (!that.state.smsSendBtn) {
            return
          }
          // 发送获取手机验证码请求
          that._api({
            url: 'mobilevcode',
            webType: 'root',
            type: 'post',
            params: { mobile: this.formLogin.mobile }
          }).then(result => {
            const data = result.data
            this.listLoading = false
            console.log('code', data)
          }, () => {
            clearInterval(interval)
          })
        }
      })
    },
    clearCahce () {
      this.$store.commit('SET_ACCESSTOKEN', null)
      this.$store.commit('SET_LOGIN_USER', null)
      this.$store.commit('SET_USER_INFO', null)
      this.$store.commit('SET_TENANTID', null)
    }
  }
}
</script>

<style lang="scss" scoped>
  .user-layout-wrapper {
    min-height: 100vh;
    &.mobile {
      .container {
        .main {
          max-width: 368px;
          width: 98%;
        }
      }
    }
    .container {
      width: 100%;
      min-height: 100vh;
      background: #f0f2f5 url(~@/assets/background.svg) no-repeat 50%;
      background-size: 100%;
      padding: 120px 0 144px;
      position: relative;
      a {
        text-decoration: none;
      }
      .top {
        text-align: center;
        .header {
          height: 44px;
          line-height: 44px;
          .badge {
            position: absolute;
            display: inline-block;
            line-height: 1;
            vertical-align: middle;
            margin-left: -12px;
            margin-top: -10px;
            opacity: 0.8;
          }
          .title {
            font-size: 33px;
            color: rgba(0, 0, 0, .85);
            font-family: "Chinese Quote", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
            font-weight: 600;
            position: relative;
            top: 2px;
          }
        }
        .desc {
          font-size: 20px;
          color: #333;
          font-weight: 400;
          margin-top: 12px;
          margin-bottom: 40px;
        }
      }
      .main {
        min-width: 260px;
        width: 368px;
        margin: 0 auto;
      }
      .footer {
        position: absolute;
        width: 100%;
        bottom: 0;
        padding: 0 16px;
        margin: 48px 0 24px;
        text-align: center;
        .links {
          margin-bottom: 8px;
          font-size: 14px;
          a {
            color: rgba(0, 0, 0, 0.45);
            transition: all 0.3s;
            &:not(:last-child) {
              margin-right: 40px;
            }
          }
        }
        .copyright {
          color: rgba(0, 0, 0, 0.45);
          font-size: 14px;
        }
      }
    }
}
.user-layout-login {
  width: 368px;
  display: inline-block;
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }
  }

}
.lg_tp{
  display: inline-block;
  width: calc(100% - 40px);
  font-size: 14px;
  color: #595959;
  text-align: left;
  line-height:20px;
  a{
    color:#1890FF;
    cursor: pointer;
  }
}

</style>

<style lang="scss">

.login_logo {
  text-align: center;margin-bottom: 35px;
  img {
    margin: 0 auto;width: 200px;height: 42px;
  }
}
.user-layout-login {
  .el-tabs{
    .el-tabs__nav-scroll{
      text-align: center;
    }
    .el-tabs__nav{
      display: inline-block;
      float:none;
    }
    .el-tabs__active-bar{
      width: 86px!important;
      left: -15px;
    }
    .el-input__prefix{
      left: 10px;
      .iconfont{
        vertical-align: -3px;
      }
    }
  }
  .el-checkbox{
      margin-top: -8px;
      float:left;
      margin-right:0px;
      font-size:16px;
    .el-checkbox__inner{
      width:16px;
      height:16px;
      border:1px solid #1890FF;
    }
  }
  .lg_input{
    &.el-input--medium .el-input__inner{
      height:40px;
      line-height:40px;
    }
  }
}
</style>
