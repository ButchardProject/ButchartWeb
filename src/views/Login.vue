<!-- 登陆页 -->
<template>
    <div id="form-data">
      <div class="logo">
        <!-- logo -->
        <img v-bind:src="logo"/>
      </div>
      <div class="form">
        <form action="" method="post">
          <!-- account -->
          <input type="text" v-model="phone" class="input-account" placeholder="输入手机号码" maxlength="11" oninput = "value=value.replace(/[^\d]/g,'')"/>
          <!-- errorMsg -->
          <div class="errorMsg" v-show="errorMsg">{{errorMsg}}</div>
          <!-- code -->
          <div class="div-code">
            <input type="text" v-model="code" class="input-pwd" placeholder="输入验证码" maxlength="6" oninput = "value=value.replace(/[^\d]/g,'')"/>
          <span class="span-btn" v-on:click="sendCode()" v-bind:class="{disabled:!this.canClick}">{{content}}</span>
          </div>
          <!-- loginButton -->
          <div>
            <input type="button" value="登录" class="submit" v-on:click="submit()"/>
          </div>
        </form>
      </div>
    </div>
</template>
<script>
import config from '@/config'
import axios from 'axios'

export default {
  name: 'login',
  data () {
    return {
      logo: config.loginLogo,
      phone: '', //  手机号
      code: '', //  验证码
      errorMsg: '', //  错误提示
      content: '获取验证码', //  内容
      totalTime: 60, //  时长
      canClick: true, //  添加canClick
      operation: '' //  告知服务器当前请求
    }
  },
  methods: {
    /*  发送验证码请求  */
    sendCode () {
      if (!(/^1[3|5|7|8|9][0-9]\d{8}$/.test(this.phone))) {
        this.errorMsg = '您输入的手机号码有误'
        return
      }
      if (!this.canClick) { }
      this.operation = 'register'//  注册请求
      this.canClick = false
      this.content = this.totalTime + 's后重新发送'
      let clock = window.setInterval(() => {
        this.totalTime--
        this.content = this.totalTime + 's后重新发送'
        if (this.totalTime < 0) {
          window.clearInterval(clock)
          this.content = '重新发送'
          this.totalTime = 10
          this.canClick = true //  这里重新开启
        }
      }, 1000)
      // 发起http请求获取验证码
      axios.post(config.url + '/sendMessage/' + this.phone + '?operation=' + this.operation)
        .then(function (res) {
          console.log(res)
          console.log(res.data)
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    // 请求登陆
    submit () {
      if (!(this.phone && this.code)) {
      } else {
        let self = this // then方法内部不能使用Vue的实例化this，在内部this没有被绑定
        // 验证登陆
        axios.post(config.url + '/login?tel=' + this.phone + '&code=' + this.code)
          .then(function (res) {
            console.log(res)
            if (res.status === 200) {
              sessionStorage.setItem('phone', self.phone)
              sessionStorage.setItem('code', self.code)
              self.$store.dispatch('setUser', self.phone)
              self.$router.push('/')
            }
          }).catch(function (error) {
            console.log(error)
            if (error.statusCode === 500) {
              self.errorMsg = '验证失败'
            }
          })
      }
    }
  },
  watch: {
  //  判断是否需要错误提示
    phone: function (val, oldval) {
      if (val > oldval) {
        this.errorMsg = ''
      }
    }
  }
}
</script>
<style lang="css" scoped>
html body{
  width: 100%;
  height: 100%;
}
/* logo */
.logo{
  width: 100%;
  text-align: center;
  margin-top: 20%;
}
/* 表单 */
.form{
  width: 70%;
  margin: 0 auto;
  height: 100%;
}
/* 输入文本框 */
.input-account{
  width: 100%;
  font-size: 0.6rem;
  border: none;
  border-bottom: 1px solid #D3D3D3;
  outline: none;
  margin-top: 15%;
}
/* 错误提示 */
.errorMsg {
  color: #FF0000;
  font-size: 0.6rem;
  text-align: left;
}
.div-code{
  width: 100%;
  font-size: 0;
}
/* 输入code框 */
.input-pwd{
  width: 58%;
  font-size: 0.6rem;;
  border: none;
  border-bottom: 1px solid #D3D3D3;
  outline: none;
  vertical-align: bottom;
  margin-top: 15%;
}
/* 发送验证码按钮 */
.span-btn{
  width: 34%;
  display: inline-block;
  border: 1px solid #87CEEB;
  color: #87CEEB;
  border-radius: 0.25rem;
  font-size: 0.5rem;
  padding: 3% 3%;
  text-align: center;
  vertical-align: bottom;
}
/* 发送验证之后不能点击 */
.disabled{
  background-color: #ddd;
  border-color: #ddd;
  color: #57a3f3;
  cursor: not-allowed;
}
/* 提交按钮 */
.submit{
  margin-top: 10%;
  font-size: 0.6rem;
  color: #FFFFFF;
  background: #63B8FF;
  width: 100%;
  border-radius: 5px;
  padding: 3%;
  outline: none;
}
input::-webkit-input-placeholder{
  color:#CCCCCC;
}
</style>
