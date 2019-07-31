<template>
  <div>
    <div class="content" v-for="(item,index) in send" :key="index">
      <div class="div-text">
        <!-- 选中checkbox -->
        <input class="checkbox" type="checkbox">
        <span class="text">等待买家付款</span>
      </div>
      <div class="div-content">
        <img class="photo" src="../assets/images/list01.png"/>
        <span class="name">【{{name[index]}}】</span>
        <span class="price">¥{{price[index]}}</span>
        <span class="number">x{{quantity[index]}}</span>
      </div>
      <div class="div-sum">
        共<span>{{quantity[index]}}</span>件商品&nbsp;&nbsp;
        共计:¥<span>{{price[index] * quantity[index]}}</span>
      </div>
      <div class="confirm">
        <span class="pay">确认收货</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'waitreceive',
  props: {
    send: {
      type: Array
    }
  },
  data () {
    return {
      name: [], // 花名
      totalPrice: [], // 价格
      quantity: [], // 购买的数量
      price: [], // 花的单价
      transactionsID: [] // 订单ID
    }
  },
  watch: {
    send (val, oldVal) {
      if (val) {
        for (let i = 0; i < val.length; i++) {
          this.transactionsID.push(val[i]._id)
          for (let j = 0; j < val[i].productList.length; j++) {
            this.name.push(val[i].productList[j].name)
            this.price.push(val[i].productList[j].price)
            this.quantity.push(val[i].productList[j].quantity)
          }
        }
      }
    }
  }
}
</script>
<style lang="css" scoped>
/* 下属内容的div */
.content {
  width: 80%;
  margin: 0 auto;
  background-color: #FFFFFF;
  margin-top: 5%;
  border-radius: 15px;
  padding: 2% 5%;
}
/* 第一行的div*/
.div-text {
  line-height: 20px;
  padding-bottom: 1%;
}
/* 第一行中的text，根据tabbar来显示 */
.text {
  display: inline-block;
  width: 92%;
  text-align: right;
  color: #63B8FF;
  padding-bottom: 1%;
}
/* checkbox选中的颜色 */
.checkbox:checked{
  background:#63B8FF;
}
/* checkbox的样式 */
.checkbox {
  width:18px;
  height:18px;
  background-color:#ffffff;
  border:solid 1px #dddddd;
  -webkit-border-radius:50%;
  border-radius:50%;
  font-size:0.8rem;
  margin:0;
  padding:0;
  position:relative;
  display:inline-block;
  vertical-align:middle;
  cursor:default;
  -webkit-appearance:none;
  -webkit-user-select:none;
  user-select:none;
  -webkit-transition:background-color ease 0.1s;
  transition:background-color ease 0.1s;
}
/* 选中的勾 */
.checkbox:checked::after{
  content:'';
  top:3px;
  left:2px;
  position:absolute;
  background:transparent;
  border:#fff solid 2px;
  border-top:none;
  border-right:none;
  height:6px;
  width:10px;
  -moz-transform:rotate(-45deg);
  -ms-transform:rotate(-45deg);
  -webkit-transform:rotate(-45deg);
  transform:rotate(-45deg);
}
/* 购买的图片 */
.photo {
  display: inline-block;
  /* 图片自适应 */
  width: 30%;
  height: 40%;
  padding-bottom: 2%;
}
/* 花的名称 */
.name {
  vertical-align: top;
  display: inline-block;
  width: 40%;
}
/* 单价 */
.price {
  position: relative;
  vertical-align: top;
  font-size: 0.5rem;
  display: inline-block;
  left: 15%;
}
/* 数量 */
.number {
  position: relative;
  font-size: 0.5rem;
  display: inline-block;
  left: 8%;
}
/* 合计价格 */
.div-sum {
  width: 95%;
  text-align: right;
  line-height: 30px;
  font-size: 0.5rem;
  padding-bottom: 1%;
}
/* 操作栏 */
.confirm {
  width: 95%;
  text-align: right;
}
/* 付款按钮 */
.pay {
  border: 1px solid #63B8FF;
  line-height: 20px;
  display: inline-block;
  width: 30%;
  text-align: center;
  border-radius: 5px;
  color: #63B8FF;
}
</style>
