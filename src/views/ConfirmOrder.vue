<template>
<div class="confirm-order-body">
    <div class="header">
      <span class="shop-yourself" @click="takeSelf()" :class="{self: isSelf}">到店自取</span>
      <span class="express-delivery" @click="express()" :class="{express: isExpress}">快递配送</span>
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
      <div class="order-info" v-for="(item,index) in cart" :key="index">
        <img src="../assets/images/list01.png"/>
        <span class="info-name">【{{item.flowerName}}】</span>
        <span class="info-number">x{{item.flowerNum}}</span>
        <span class="info-price">¥{{item.price}}</span>
      </div>
      <hr>
      <!-- 数量 -->
      <div class="div-people">
        <span class="people">花艺师</span>
        <div class="select">
          <select @change="selectFlorist($event)">
            <option value='default' selected>默认</option>
            <option :value="floristId[index]" v-for="(item,index) in floristName.length" :key="index">{{floristName[index]}}</option>
          </select>
        </div>
      </div>
      <div class="div-mode-discount">
          <span class="mode-discount-name">配送方式</span>
          <span class="mode-discount-common" v-if="delivery">{{ship}}</span>
          <span class="mode-discount-common" v-else>></span>
      </div>
      <div class="div-mode-discount">
          <span class="mode-discount-name">店铺优惠</span>
          <span class="mode-discount-common" v-if="delivery">{{favour}}</span>
          <span class="mode-discount-common" v-else>></span>
      </div>
      <hr>
      <div class="div-text">
        <span>买家留言：</span>
        <textarea type="text" placeholder="是否需要卡片，卡片内容等（限制30个字）" rows="3" cols="40" maxlength="30" v-model="comment"></textarea>
      </div>
      <div class="div-sum">共<span>{{totalNum}}</span>件商品&nbsp;&nbsp;共计:
        <span>{{totalPrice}}元</span>
      </div>
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
import { MessageBox } from 'mint-ui'
import { setTimeout } from 'timers'
export default {
  name: 'confirmorder',
  data () {
    return {
      phone: JSON.parse(sessionStorage.getItem('userInfo')).phone, // 紧急手机号
      errorMsg: '', // 错误提示
      cart: JSON.parse(sessionStorage.getItem('cart')), // 购物车信息
      isSelf: false, // 是否是自取
      isExpress: false, // 是否是配送
      ship: '', // 配送方式
      delivery: false, // 根据配送方式显示
      floristId: [], // 花艺师的ID
      floristName: [], // 花艺师的username
      currentFloristId: '', // 当前花艺师
      isFlorist: false, // 是否有花艺师
      comment: '', // 备注
      totalNum: 0, // 所有数量
      totalPrice: 0, // 所有价格
      deliveryMethod: [], // 配送方案
      freight: '', // 运费
      type: [], // 当前购物产品的类型
      favour: '' // 减免
    }
  },
  // 页面创建前先去获取一把花艺师
  created () {
    this.getTotal() // 获取当前购物车的数量和总价
    // 获取登陆之后是否有默认的花艺师
    if (sessionStorage.getItem('defaultFlorist')) {
      this.isFlorist = true
      this.currentFloristId = sessionStorage.getItem('defaultFlorist')
    }
    // 获取花艺师
    let that = this
    axios.get(config.url + '/getFlorists?access_token=' + sessionStorage.getItem('token'))
      .then(function (res) {
        // console.log(res.data)
        for (let index in res.data) {
          that.floristId.push(res.data[index].florist._id) // 先把花艺师的id推进去
          that.floristName.push(res.data[index].username) // 花艺师的name推进去
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  },
  mounted () {
    if (this.totalPrice) {
      // 判断当前配送方式
      if (this.$route.query.ship) {
        this.delivery = true
        let ship = this.$route.query.ship
        // 自取
        if (ship === 'takeself') {
          this.isSelf = true
          this.isExpress = false
          this.ship = '到店自取'
          this.favour = '即享原花价9折优惠'
          this.totalPrice = this.totalPrice * 0.9 + this.freight
        } else {
          // 顺丰
          this.isSelf = false
          this.isExpress = true
          // 是否是省内
          if (this.$route.query.isInside) {
            this.freight = 20
          } else {
            this.freight = 30
          }
          // 是否需要打折
          let discount = JSON.parse(sessionStorage.getItem('discount'))
          let discountPrice
          // 从购物车里面获取type
          for (let i = 0; i < this.type.length; i++) {
            if (this.type[i] === '伴手礼') {
              discountPrice = parseInt(discount.discountOther) // 折扣价
              // 当前展示文本
              this.ship = '快递配送 ' + this.freight + '¥'
              this.favour = '伴手礼减免' + discountPrice + '¥'
              this.totalPrice = this.totalPrice + this.freight + discountPrice
            } else {
              discountPrice = parseInt(discount.discountNormal)
              this.ship = '快递配送 ' + this.freight + '¥'
              this.favour = '即享原花价9折优惠'
              this.totalPrice = this.totalPrice * 0.9 + this.freight + discountPrice
            }
          }
        }
      }
    }
  },
  methods: {
    // 计算当前总数量与总价
    getTotal () {
      if (this.cart) {
        for (let i = 0; i < this.cart.length; i++) {
          this.totalNum += parseInt(this.cart[i].flowerNum)
          this.totalPrice += parseInt(this.cart[i].flowerNum) * parseInt(this.cart[i].price)
          this.type.push(this.cart[i].type)
        }
      }
    },
    // 选择花艺师
    selectFlorist (event) {
      this.currentFloristId = event.target.value
      if (this.currentFloristId === 'default') {
        this.isFlorist = false
      } else {
        this.isFlorist = true
      }
    },
    // 确认支付操作
    confirmPay () {
      if (!this.ship) {
        MessageBox('提示', '当前配送方式未选择')
      } else {
        let that = this
        let productList = []
        let orderParams
        let userId = this.phone
        // 自取
        if (this.$route.query.ship === 'takeself') {
          for (let i = 0; i < JSON.parse(sessionStorage.getItem('cart')).length; i++) {
            let info = JSON.parse(sessionStorage.getItem('cart')) // 先把下单的东西捞出来
            let list = {
              'productId': info[i].productId,
              'name': info[i].flowerName,
              'price': info[i].price,
              'quantity': info[i].flowerNum
            }
            productList.push(list)
          }
          if (this.isFlorist) {
            orderParams = JSON.stringify({
              // 花品
              'productList': productList,
              'storeId': JSON.parse(sessionStorage.getItem('storeInfo')).storeId, // 店铺id
              'totalPrice': this.totalPrice, //  价格
              'floristId': this.currentFloristId, // 花艺师id
              'logistics': {
                'deliveryMethod': '自取',
                'freight': 0
              },
              'expectedDeliverDate': JSON.parse(sessionStorage.getItem('takeMainDate')) + ' ' + JSON.parse(sessionStorage.getItem('takeTime')),
              'comment': this.comment
            })
          } else {
            orderParams = JSON.stringify({
              // 花品
              'productList': productList,
              'storeId': JSON.parse(sessionStorage.getItem('storeInfo')).storeId, // 店铺id
              'totalPrice': this.totalPrice, //  价格
              'logistics': {
                'deliveryMethod': '自取',
                'freight': 0
              },
              'expectedDeliverDate': JSON.parse(sessionStorage.getItem('takeMainDate')) + ' ' + JSON.parse(sessionStorage.getItem('takeTime')),
              'comment': this.comment
            })
          }
          axios.post(config.url + '/user/' + this.phone + '/createTransaction?access_token=' + sessionStorage.getItem('token'), orderParams, {
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(function (res) {
            // 支付订单
            axios.put(config.url + '/user/' + userId + '/transactionId/' + res.data.createdId + '/payTransaction?access_token=' + sessionStorage.getItem('token'), {
              headers: {
                'Content-Type': 'application/json'
              }
            }).then(function (res) {
              MessageBox('提示', '支付成功')
              setTimeout(function () {
                that.$router.push({
                  'name': 'allorder',
                  query: {
                    'selected': '3'
                  }
                })
                sessionStorage.removeItem('cart')
                sessionStorage.removeItem('unread')
              }, 1000)
            }).catch(function (error) {
              console.log(error)
            })
          }).catch(function (error) {
            console.log(error)
          })
        } else { //  快递配送
          for (let i = 0; i < JSON.parse(sessionStorage.getItem('cart')).length; i++) {
            let info = JSON.parse(sessionStorage.getItem('cart'))
            let list = {
              'productId': info[i].productId,
              'name': info[i].flowerName,
              'price': info[i].price,
              'quantity': info[i].flowerNum
            }
            productList.push(list)
          }
          if (this.isFlorist) {
            orderParams = JSON.stringify({
              // 花品
              'productList': productList,
              'addressId': JSON.parse(sessionStorage.getItem('addressInfo')).currentLocationId, // 快递地址
              'totalPrice': this.totalPrice, //  价格
              'floristId': this.currentFloristId, // 花艺师id
              'logistics': {
                'deliveryMethod': '快递',
                'freight': 0
              },
              'expectedDeliverDate': JSON.parse(sessionStorage.getItem('expressDate')),
              'comment': this.comment
            })
          } else {
            orderParams = JSON.stringify({
              // 花品
              'productList': productList,
              'addressId': JSON.parse(sessionStorage.getItem('addressInfo')).currentLocationId, // 快递地址
              'totalPrice': this.totalPrice, //  价格
              'logistics': {
                'deliveryMethod': '快递',
                'freight': 0
              },
              'expectedDeliverDate': JSON.parse(sessionStorage.getItem('expressDate')),
              'comment': this.comment
            })
          }
          axios.post(config.url + '/user/' + this.phone + '/createTransaction?access_token=' + sessionStorage.getItem('token'), orderParams, {
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(function (res) {
            console.log(res)
            console.log(res.data.createdId)
            // 支付订单
            axios.put(config.url + '/user/' + userId + '/transactionId/' + res.data.createdId + '/payTransaction?access_token=' + sessionStorage.getItem('token'), {
              headers: {
                'Content-Type': 'application/json'
              }
            }).then(function (res) {
              MessageBox('提示', '支付成功')
              setTimeout(function () {
                that.$router.push({
                  'name': 'allorder',
                  query: {
                    'selected': '3'
                  }
                })
                sessionStorage.removeItem('cart')
                sessionStorage.removeItem('unread')
              }, 1000)
            }).catch(function (error) {
              console.log(error)
            })
          }).catch(function (error) {
            console.log(error)
          })
        }
      }
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
      // 判断是第一次过去还是第二次
      if (this.$route.query.ship) {
        this.$router.push(
          { 'name': 'takeself',
            query: {
              isFirst: 1
            }
          })
      } else {
        this.$router.push(
          { 'name': 'takeself',
            query: {
              isFirst: 0
            }
          })
      }
    },
    // 快递配送
    express () {
      if (this.$route.query.ship) {
        this.$router.push(
          { 'name': 'express',
            query: {
              isFirst: 1
            }
          })
      } else {
        this.$router.push(
          { 'name': 'express',
            query: {
              isFirst: 0
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
.express {
  border: 2px solid #63B8FF;
  color: #63B8FF;
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
    padding-bottom: 2rem;/* 增加底部div的padding，防止fixed的button挡住 */
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
  line-height:1.5rem;
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
