<template>
<div class="allOrder-body">
  <div class="tabbar">
    <mt-navbar class="page-part" v-model="selected">
      <mt-tab-item id="1">全部</mt-tab-item>
      <mt-tab-item id="2">待付款</mt-tab-item>
      <mt-tab-item id="3">待发货</mt-tab-item>
      <mt-tab-item id="4">待收货</mt-tab-item>
      <mt-tab-item id="5">已完成</mt-tab-item>
    </mt-navbar>
    <!-- tab-container -->
    <mt-tab-container v-model="selected">
      <mt-tab-container-item id="1">
        <WaitPay :unPayed="unPayed"/>
        <WaitDelivery :payed="payed"/>
        <WaitReceive :send="send"/>
        <Completed :afterSales="afterSales"/>
      </mt-tab-container-item>
      <!-- 待付款 -->
      <mt-tab-container-item id="2">
        <WaitPay :unPayed="unPayed"/>
      </mt-tab-container-item>
      <!-- 待发货 -->
      <mt-tab-container-item id="3">
        <WaitDelivery :payed="payed"/>
        <!-- :waitDeliveyList="waitDeliveyList" -->
      </mt-tab-container-item>
      <!-- 待收货 -->
      <mt-tab-container-item id="4">
        <WaitReceive :send="send"/>
      </mt-tab-container-item>
      <!-- 已完成 -->
      <mt-tab-container-item id="5">
        <Completed :afterSales="afterSales"/>
      </mt-tab-container-item>
    </mt-tab-container>
  </div>
  <!-- menu -->
  <div class="foot">
    <span class="f-img">
      <img src="../assets/logo/index.png" @click="home()"/>
    </span>
    <span class="f-img">
      <img src="../assets/logo/personal.png" @click="manager()"/>
    </span>
  </div>
</div>
</template>
<script>
import WaitPay from '@/components/WaitPay'
import WaitDelivery from '@/components/WaitDelivery'
import WaitReceive from '@/components/WaitReceive'
import Completed from '@/components/Completed'
import config from '@/config'
import axios from 'axios'
export default {
  name: 'allorder',
  components: {
    WaitPay,
    WaitDelivery,
    WaitReceive,
    Completed
  },
  data () {
    return {
      selected: '1',
      name: [],
      price: [],
      quantity: [],
      id: [], // 订单id
      unPayed: [], // 未付款的订单
      payed: [], // 待发货
      send: [], // 已发货
      afterSales: [] // 已完成
    }
  },
  created () {
    // 获取用户所有订单
    this.getUserOrder()
  },
  // 在vue加载完之后，去获取传过来的选中值
  mounted () {
    this.selected = this.$route.query.selected
  },
  methods: {
    // 获取用户所有订单
    getUserOrder () {
      let that = this
      axios.get(config.url + '/user/' + JSON.parse(sessionStorage.getItem('userInfo')).phone + '/getUserOwnedTransactions?access_token=' + sessionStorage.getItem('token'))
        .then(function (res) {
          console.log(res)
          if (res.status === 200) {
            for (let index in res.data) {
              if (res.data[index].status === 'Unpayed') {
                that.unPayed.push(res.data[index]) // 所有未付款的
              }
              if (res.data[index].status === 'Payed') {
                that.payed.push(res.data[index]) // 待发货的
              }
              if (res.data[index].status === 'Send') {
                that.send.push(res.data[index]) // 待收货
              }
              if (res.data[index].status === 'AfterSales') {
                that.afterSales.push(res.data[index]) // 已完成
              }
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    // 前往主页
    home () {
      this.$router.push('/')
    },
    manager () {
      this.$router.push('/manager')
    }
  }
}
</script>
<style lang="css" scoped>
.allOrder-body {
  height: 100%;
  width: 100%;
  background: #F0F0F0;
  font-size: 0.6rem;
}
.tabbar {
  background: #F0F0F0;
  padding-bottom: 1.2rem;
  margin-bottom: 1.2rem;
}
/* 修改tabbar的字体和颜色 */
.mint-navbar .mint-tab-item.is-selected {
  color: #87CEFF;
  border-bottom: 2px solid #87CEFF;
}
/* 修改标题的颜色 */
.mint-tab-item-label {
  font-size: 0.6rem;
}
/* 底部操作栏 */
.foot{
  width: 100%;
  background-color: #F8F8FF;
  position: fixed;
  bottom: 0;
  padding: 1% 0;
  display: flex;
  justify-content: space-around;
  line-height: 1.2rem;
}
/* 底部logo图片 */
.f-img {
  width: 50%;
  display: inline-block;
  text-align: center;
}
</style>
