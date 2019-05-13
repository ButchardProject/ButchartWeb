<!-- 个人中心管理页 -->
<template>
  <div class="content">
    <div class="title">
      <img class="t-icon" src="../assets/logo/default_icon.png">
      <span>{{name}}</span>
      <span @click="setting()">设置&nbsp;&nbsp;></span>
    </div>
    <div class="order-info">
      <p class="myOrder" @click="link('1')">我的订单</p><hr>
      <div class="option">
        <span class="option-span" @click="link('2')">
          <img class="option-image" src="../assets/logo/pending-payment.png"/>
          <span>待付款</span>
        </span>
        <span class="option-span" @click="link('3')">
          <img class="option-image" src="../assets/logo/pending-send.png"/>
          <span>待发货</span>
        </span>
        <span class="option-span" @click="link('4')">
          <img class="option-image" src="../assets/logo/pending-receive.png"/>
          <span>待收货</span>
        </span>
        <span class="option-span" @click="link('5')">
          <img class="option-image" src="../assets/logo/finish.png"/>
          <span>已完成</span>
        </span>
      </div>
      <hr>
    </div>
    <!-- menu -->
    <div class="foot">
      <span class="f-img">
        <img src="../assets/logo/index.png" @click="home()"/>
      </span>
      <span class="f-img">
        <img src="../assets/logo/personal.png"/>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'manager',
  data () {
    return {
      name: sessionStorage.getItem('phone') // 用户昵称
    }
  },
  methods: {
    // 前往主页
    home () {
      this.$router.push('/')
    },
    // 个人设置
    setting () {
      this.$router.push('personal')
    },
    // 前往订单页
    link (number) {
      this.$router.push({
        path:'allorder',
        query: {
          selected: number
        }
      })
    }
  }
}
</script>

<style lang="css" scoped>
  .content{
    height: 100%;
    width: 100%;
    font-size: 0.6rem;
    background-color: #F0F0F0;
  }
  /* 背景 */
  .title{
    height: 30%;
    width: 100%;
    background-color: #87CEFA;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  /* 头像  */
  .t-icon{
    display: inline-block;
    width: 100px;
    height: 100px;
    border-radius:50%;
    margin:0 0 10% 6%;
    }
  /* 文字 */
  .title > span{
    font-size: 0.6rem;
    color: #FFFFFF;
    margin:0 0 10% 8%;
    display: inline-block;
    width: 25%;
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
    }
  /* 整个订单信息 */
  .order-info{
    height: 30%;
    width: 90%;
    margin-left: 5%;
    background-color: #FFFFFF;
    position: relative;
    top:-8%;
    border-radius: 5%;
    color:#8F8F8F;
    line-height: 30px;
    }
  /* 我的订单 */
  .myOrder{
    margin-left: 10%;
    line-height: 40px;
    padding-top: 2%;
  }
  /* 订单选项 */
  .option{
    width: 90%;
    display: inline-block;
    margin-left: 10%;
    padding: 2% 0;
  }
  /* 订单选项与文字 */
  .option-span{
    display: inline-block;
    margin-right: 9%;
  }
  /* 订单图标 */
  .option-image{
    display: block;
    padding-left: 10%;
  }
  /* 底部操作栏 */
  .foot{
    height: 5%;
    width: 100%;
    background-color: #F8F8FF;
    position: fixed;
    bottom: 0;
    padding: 1% 0;
    display: flex;
    justify-content: space-around;
  }
  /* 底部logo图片 */
  .f-img {
    width: 50%;
    display: inline-block;
    text-align: center;
  }
</style>
