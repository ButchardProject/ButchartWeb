<template>
<div class="confirm-order-body">
    <div class="header">
      <span class="shop-yourself">到店自取</span>
      <span class="express-delivery">快递配送</span>
    </div>
    <!-- 号码行 -->
    <div class="phone-info">
        <span>您的手机</span>
        <input type="text" placeholder="请填写" maxlength="11" v-model="phone" oninput="value=value.replace(/[^\d]/g,'')" @blur="check()"/>
    </div>
    <!-- errorMsg -->
    <div class="errorMsg" v-show="errorMsg">{{errorMsg}}</div>
    <!-- tip -->
    <div class="tip">
        <span>当收花电话无法接通时，我们将联系您协调收花事宜</span>
    </div>
    <!-- 订单行 -->
    <div class="div-order">
      <div class="order-info">
        <img src="../assets/images/list01.png"/>
        <span class="info-name">【{{nick}}】</span>
        <span class="info-number">x{{value}}</span>
        <span class="info-price">¥{{price}}</span>
      </div>
      <hr>
      <!-- 数量 -->
      <div class="div-number">
        <span class="buy-number">购买数量</span>
        <span class="calculator">
            <span class="add-remove left">-</span>
            <input id="number" v-model="value" disabled/>
            <span class="add-remove right">+</span>
        </span>
      </div>
      <div class="div-mode-discount">
          <span class="mode-discount-name">配送方式</span>
          <span class="mode-discount-common">></span>
      </div>
      <div class="div-mode-discount">
          <span class="mode-discount-name">店铺优惠</span>
          <span class="mode-discount-common">></span>
      </div>
      <hr>
      <div class="div-text">
        <span>买家留言：</span>
        <textarea type="text" placeholder="是否需要卡片，卡片内容等（限制30个字）" rows="3" cols="40" maxlength="30"></textarea> 
      </div>
      <div class="div-sum">共<span>{{value}}</span>件商品&nbsp;&nbsp;共计:<span>{{value * price}}</span>元</div>
    </div>
    <!-- 确定支付button -->
    <div class="confirm">
        <span class="confirm-button" @click="confirmPay()">确认支付</span>
    </div>
</div>
</template>
<script>
export default {
  name: 'confirmorder',
  data () {
    return {
      phone: '', // 紧急手机号
      errorMsg: '', // 错误提示
      value: this.$route.params.value, // 购物车数量,从订单页面传递过来
      nick: this.$route.params.nick, // 花名
      price: this.$route.params.price // 价格
    }
  },
  methods: {
      // 确认支付操作
      confirmPay () {

      },
      // 校验当前phone是否正确
      check () {
        if (!(/^1[3|5|7|8|9][0-9]\d{8}$/.test(this.phone))) {
          this.errorMsg = '您输入的手机号码有误'
          return
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
/* 整个body的高和宽 */
.confirm-order-body{
    height: 100%;
    widows: 100%;
    font-size: 0.6rem;
}
/* header */
.header {
    height: 15%;
    width: 100%;
    border-bottom: 2px solid #63B8FF;
    color: #C9C9C9;
    font-weight: bold;
    font-size: 0.8rem;/* header中的字体单独设置 */
}
/* 自取样式 */
.shop-yourself {
    display: inline-block;
    border: 2px solid #C9C9C9;
    width: 40%;
    line-height: 60px;
    text-align: center;
    margin: 2% 0 0 5%;
    border-radius: 10px;
}
/* 快递配送样式 */
.express-delivery {
    display: inline-block;
    border: 2px solid #C9C9C9;
    width: 40%;
    line-height: 60px;
    margin-left: 5%;
    text-align: center;
    border-radius: 10px;
}
/* 手机信息行 */
.phone-info {
    width: 100%;
    line-height: 40px;
    padding-top: 1%;
}
.phone-info > span {
    display: inline-block;
    width: 40%;
    margin-left: 5%;
}
.phone-info > input {
    margin-left: 6%;
    width: 40%;
    border: none;
}
/* 错误提示 */
.errorMsg {
  color: #FF0000;
  font-size: 0.6rem;
  text-align: left;
  margin-left: 5%;
}
/* tip行 */
.tip{
    background-color: #F0F0F0;
    color: #C9C9C9;
    line-height: 30px;
    font-size: 0.3rem;
}
.tip > span {
    margin-left: 5%;
}
/* 外部的div订单信息，整个body */
.div-order {
    padding: 3% 12% 0 5%;
    padding-bottom: 7%;/* 增加底部div的padding，防止fixed的button挡住 */
}
/* 内部的div订单信息 */
.order-info {
    margin-bottom: 5%;
}
/* 订单中的图片 */
.order-info > img {
    display: inline-block;
    width: 30%;
    height: 15%;
}
/* 订单中的名字 */
.info-name {
    vertical-align: top;
    margin-left: 1%;
    display: inline-block;
    display: inline-block;
    width: 30%;
}
/* 订单中的数量 */
.info-number {
    vertical-align: bottom;
    position: relative;
    left: -28%;
    display: inline-block;
    width: 10%;
}
/* 订单中的价格 */
.info-price {
    vertical-align: bottom;
    display: inline-block;
    width: 28%;
    text-align: right;
}
/* hr的border */
hr {
    border: 0.5px solid #EDEDED;
}
/* 数量的区域 */
.div-number {
    line-height: 40px;
}
/* 购物数量的name */
.buy-number {
    display: inline-block;
    width: 50%;
}
/* 设置父元素来取消span和input之间的间隙，font-size子元素在重新设置 */
.calculator {
  font-size: 0;
  display: inline-block;
  width: 50%;
  text-align: right;
}
/* 添加减少 */
.add-remove{
  display: inline-block;
  font-size: 0.5rem;
  background-color: #f2f2f2;
  width: 25px;
  height: 20px;
  line-height: 20px;
  text-align: center;
}
/* 选择当前的value */
#number{
  font-size: 0.5rem;
  width: 30px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  box-sizing: border-box;
}
/* 配送及优惠方式区域 */
.div-mode-discount {
  line-height: 50px;
}
/* 配送及优惠name */
.mode-discount-name{
    display: inline-block;
    width: 50%;
}
/* 配送及优惠选项 */
.mode-discount-common {
    display: inline-block;
    width: 50%;
    text-align: right;
    color: #DEDEDE;
}
/* 买家留言 */
.div-text {
    margin: 5% 0;
}
.div-text > span {
    display: inline-block;
    width: 24%;
    position: relative;
    top:5px;
}
textarea {
    width: 74%;
    resize: none;
}
/* 合计数量 */
.div-sum {
    width: 100%;
    text-align: right;
}
/* 底部确认区域 */
.confirm {
  height: 6%;
  width: 100%;
  background-color: #F8F8FF;
  position: fixed;
  bottom: 0;
  line-height:35px;
  padding-top: 1%;
  text-align: center;
}
/* 确认支付button */
.confirm-button {
    border: 1px solid #63B8FF;
    background-color: #63B8FF;
    color: #FFFFFF;
    display: inline-block;
    width: 100%;
    text-align: center;
}
</style>