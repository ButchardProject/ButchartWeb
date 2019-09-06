<template>
<div>
</div>
</template>
<script>
// import wx from 'jweixin-npm'
import { MessageBox } from 'mint-ui'
// WeixinJSBridge
export default {
  name: 'pay',
  data () {
    return {
      createdId: this.$store.state.payParam.createdId, // 下单的id
      appId: this.$store.state.payParam.appId, // 必填，公众号的唯一标识
      timestamp: this.$store.state.payParam.timestamp, // 必填，生成签名的时间戳
      nonceStr: this.$store.state.payParam.nonceStr, // 支付签名随机串，不长于 32 位
      signature: this.$store.state.payParam.signature, // 必填，签名
      timeStamp: this.$store.state.payParam.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
      package: this.$store.state.payParam.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*
      signType: this.$store.state.payParam.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
      paySign: this.$store.state.payParam.paySign // 支付签名
    }
  },
  methods: {
    payBridge () {
      if (typeof WeixinJSBridge === 'undefined') {
        if (document.addEventListener) {
          document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady(), false)
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady())
          document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady())
        }
      } else {
        this.onBridgeReady()
      }
    },
    onBridgeReady () {
      let that = this
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
          'appId': this.appId, // 公众号名称，由商户传入
          'timeStamp': this.timeStamp, // 时间戳，自1970年以来的秒数
          'nonceStr': this.nonceStr, // 随机串
          'package': this.package,
          'signType': this.signType, // 微信签名方式
          'paySign': this.paySign // 微信签名
        },
        function (res) {
          if (res.err_msg === 'get_brand_wcpay_request:ok') {
            // 使用以上方式判断前端返回,微信团队郑重提示：
            // res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
            MessageBox('提示', '支付成功')
            that.$router.push({
              'name': 'allorder',
              query: {
                'selected': '3'
              }
            })
            sessionStorage.removeItem('cart')
            sessionStorage.removeItem('unread')
          } else {
            MessageBox('提示', '支付取消或者失败')
            that.$router.push('/?code=' + sessionStorage.getItem('code'))
          }
        })
    }
  },
  mounted () {
    this.payBridge()
  }
}
</script>
<style lang="css" scoped>
</style>
