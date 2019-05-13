<template>
  <div>
    <div class="content" v-for="(item,index) in num" :key="index">
      <div class="div-text">
        <!-- 选中checkbox -->
        <input class="checkbox" type="checkbox">
        <span class="text">等待买家付款</span>
      </div>
      <img class="photo" src="../assets/images/list01.png"/>
      <span class="price">¥{{price[index]}}</span>
      <span class="number">x{{value[index]}}</span>
      <div class="div-sum">
        共<span>{{value[index]}}</span>件商品&nbsp;&nbsp;
        共计:¥<span>{{price[index] * value[index]}}</span>
      </div>
      <div class="confirm">
        <span class="cancel">取消</span>
        <span class="pay">付款</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'waitpay',
  data () {
    return {
      price: this.$store.state.carOrder.price, // 价格
      seriesId: '', // 系列id
      productId: '', // 产品id
      value: [], // 当前未付款的数量
    }
  },
  methods: {
    getProduct () {
      let carInfo = JSON.parse(sessionStorage.getItem('carInfo'))
      if(carInfo){
        for (var i in carInfo){
          this.value.push(carInfo[i].value)
          let ids = {
            seriesId: carInfo[i].seriesId,
            productId: carInfo[i].productId 
          }
          this.$store.dispatch('getCarOrder', ids)
        }
      }
    }
  },
  mounted () {
    this.getProduct()
  },
  computed: {
    // 待付款就根据未读来显示未处理的订单
    num: function () {
      if (this.$store.state.unread){
        return this.$store.state.unread
      }
      if (parseInt(sessionStorage.getItem('unread'))) {
        return parseInt(sessionStorage.getItem('unread'))
      }
      else {
        return 0
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
/* 单价 */
.price {
  vertical-align: top;
  display: inline-block;
  width: 65%;
  text-align: right;
  font-size: 0.5rem;
}
/* 数量 */
.number {
  position: relative;
  font-size: 0.5rem;
  right: 3%;
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
  margin-left: 5%;
  border: 1px solid #63B8FF;
  line-height: 20px;
  display: inline-block;
  width: 20%;
  text-align: center;
  border-radius: 5px;
  color: #63B8FF;
}
/* 取消按钮 */
.cancel {
  border: 1px solid #DEDEDE;
  line-height: 20px;
  display: inline-block;
  width: 20%;
  text-align: center;
  border-radius: 5px;
  color: #DEDEDE;
}
</style>
