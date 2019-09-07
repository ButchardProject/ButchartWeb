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
            <span class="span-btn" v-on:click="sendCode()" :class="{disabled:!this.canClick}">{{content}}</span>
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
import { MessageBox } from 'mint-ui'
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
      canClick: true //  添加canClick
    }
  },
  methods: {
    /*  发送验证码请求  */
    sendCode () {
      if (!(/^1[3|5|7|8|9][0-9]\d{8}$/.test(this.phone))) {
        this.errorMsg = '您输入的手机号码有误'
        return
      }
      let that = this
      // 发起http请求获取验证码
      axios.post(config.url + '/sendMessage/' + this.phone + '?operation=register')
        .then(function (res) {
          console.log(res)
          console.log(res.data)
          if (!that.canClick) { }
          that.canClick = false
          that.content = that.totalTime + 's后重新发送'
          let clock = window.setInterval(() => {
            that.totalTime--
            that.content = that.totalTime + 's后重新发送'
            if (that.totalTime < 0) {
              window.clearInterval(clock)
              that.content = '重新发送'
              that.totalTime = 10
              that.canClick = true //  这里重新开启
            }
          }, 1000)
        })
        .catch(function (error) {
          MessageBox('提示', '发送失败,code:' + error.response.status)
        })
    },
    // 请求登陆
    submit () {
      if (!(this.phone && this.code)) {
        this.errorMsg = '请填写正确的手机号与验证码'
      } else {
        let self = this // then方法内部不能使用Vue的实例化this，在内部this没有被绑定
        let w = window
        // 验证登陆
        axios.post(config.url + '/login?tel=' + this.phone + '&code=' + this.code)
          .then(function (res) {
            console.log(res)
            let userInfo = {
              'phone': self.phone,
              'code': self.code
            }
            sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
            sessionStorage.setItem('token', res.data.token.id) // 保存当前token到sessionStorage
            if (res.data.userProfile.defaultFlorist) { // 判断服务器会不会给我默认的，有了在存
              sessionStorage.setItem('defaultFlorist', res.data.userProfile.defaultFlorist)
            }
            self.$store.dispatch('getAddUnread', res.data.shoppingCart.length) // 更新购物车未读数
            self.$store.dispatch('setUser', self.phone)
            self.$store.dispatch('saveToken', res.data.token.id) // 保存当前token到store
            // w.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx66142d5363835ef3&redirect_uri=https://www.thebutchart.cn/&response_type=code&scope=snsapi_base&state=123#wechat_redirect'
          self.$router.push('/')
          }).catch(function (error) {
            console.log(error)
            MessageBox('登陆失败', '请检查手机号与验证码是否正确')
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
}
/* logo */
.logo{
  width: 100%;
  text-align: center;
  padding-top: 20%;
}
/* 表单 */
.form{
  width: 70%;
  margin: 0 auto;
  height: 100%;
}
/* 输入文本框 */
.input-account{
  width: 95%;
  font-size: 0.6rem;
  border: none;
  border-bottom: 1px solid #D3D3D3;
  outline: none;
  margin-top: 15%;
  -webkit-appearance: none;
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
  margin-top: 1rem;
}
/* 输入code框 */
.input-pwd{
  width: 56%;
  font-size: 0.6rem;;
  border: none;
  border-bottom: 1px solid #D3D3D3;
  outline: none;
  vertical-align: bottom;
  -webkit-appearance: none;
}
/* 发送验证码按钮 */
.span-btn{
  width: 35%;
  display: inline-block;
  border: 1px solid #87CEEB;
  color: #87CEEB;
  border-radius: 0.25rem;
  font-size: 0.5rem;
  line-height: 1.5rem;
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
