<template>
<div class="confirm-order-body">
    <div class="header">
      <span class="shop-yourself" @click="takeSelf()" :class="{self: isSelf}">到店自取</span>
      <span class="express-delivery" @click="express()">快递配送</span>
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
        <span class="info-name">【{{name}}】</span>
        <span class="info-number">x{{value}}</span>
        <span class="info-price">¥{{price}}</span>
      </div>
      <hr>
      <!-- 数量 -->
      <div class="div-people">
        <span class="people">花艺师</span>
        <div class="select">
          <select>
            <option value='' disabled selected>默认</option>
            <option value="volvo">Volvo</option>
            <option value="saab">Saab</option>
            <option value="opel">Opel</option>
          </select>
        </div>
      </div>
      <div class="div-mode-discount">
          <span class="mode-discount-name">配送方式</span>
          <span class="mode-discount-common" v-if="!isSelf">></span>
          <span class="mode-discount-common" v-else>到店自取</span>
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
import config from '@/config'
import axios from 'axios'
export default {
  name: 'confirmorder',
  data () {
    return {
      phone: sessionStorage.getItem('phone'), // 紧急手机号
      errorMsg: '', // 错误提示
      value: this.$route.query.value, // 购物车数量,从订单页面传递过来
      name: sessionStorage.getItem('name'), // 花名
      price: sessionStorage.getItem('price'), // 价格
      isSelf: sessionStorage.getItem('isSelf'), // 是否是自取
      isExpress: false // 是否是快递配送
    }
  },
  methods: {
    // 确认支付操作
    confirmPay () {
      let orderParams = JSON.stringify({
        // 花品
        'productList': [
          {
            'productId': (this.$store.state.product.productId)[sessionStorage.getItem('index')], // 花品id
            'addDate': this.getDateTime(), // 添加日期
            'quantity': this.value // 添加数量
          }
        ],
        'addressId': sessionStorage.getItem('locationId'), // 地址id
        'storeId': '', // 店铺id
        'totalPrice': this.price, // 价格
        'freight': '' // 货运
      })
      axios.put(config.url + '/userId/' + this.phone + '/createTransaction', orderParams, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(function (res) {
          console.log(res)
          console.log(res.data)
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    // 格式化日期
    getDateTime () {
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1 // 注意getMonth从0开始，getDay()也是(此时0代表星期日)
      let day = date.getDate()
      let hour = date.getHours() // 时
      let minutes = date.getMinutes() // 分
      let seconds = date.getSeconds() // 秒
      let str = year + '年' + month + '月' + day + '日' + hour + '时' + minutes + '分' + seconds + '秒'
      return str
    },
    // 校验当前phone是否正确
    check () {
      if (!(/^1[3|5|7|8|9][0-9]\d{8}$/.test(this.phone))) {
        this.errorMsg = '您输入的手机号码有误'
      }
    },
    // 到店自取
    takeSelf () {
      // 向本地存储一个值，来维护当前状态
      sessionStorage.setItem('isSelf', false)
      this.$router.push('takeself')
    },
    // 快递配送
    express () {
      // 先把自取的清除
      sessionStorage.removeItem('isSelf')
      this.$router.push('express')
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
/* 自取确定之后 */
.self {
  border: 2px solid #63B8FF;
  color: #63B8FF;
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
    width: 50%;
}
/* 订单中的数量 */
.info-number {
    vertical-align: bottom;
    position: relative;
    left: -47%;
    display: inline-block;
    width: 5%;
}
/* 订单中的价格 */
.info-price {
    vertical-align: bottom;
    display: inline-block;
    width: 14%;
    text-align: right;
}
/* hr的border */
hr {
    border: 0.5px solid #EDEDED;
}
/* 花艺师模块 */
.div-people {
  line-height: 50px;
}
.div-people > span {
  display: inline-block;
  width: 50%;
}
/* 花艺师的选择 */
.select {
  display: inline-block;
  width: 50%;
  text-align: right;
}
/* 选择靠右 */
select {
  direction: rtl;
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
    color: #B5B5B5;
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
