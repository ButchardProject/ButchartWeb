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
        xxxxx
      </mt-tab-container-item>
      <!-- 待付款 -->
      <mt-tab-container-item id="2">
        <WaitPay/>
      </mt-tab-container-item>
      <!-- 待发货 -->
      <mt-tab-container-item id="3">
        <WaitDelivery/>
      </mt-tab-container-item>
      <!-- 待收货 -->
      <mt-tab-container-item id="4">
        <WaitReceive/>
      </mt-tab-container-item>
      <mt-tab-container-item id="5">
        <Completed/>
      </mt-tab-container-item>
    </mt-tab-container>
  </div>
</div>
</template>
<script>
import { Navbar, TabItem } from 'mint-ui'
import WaitPay from '@/components/WaitPay'
import WaitDelivery from '@/components/WaitDelivery'
import WaitReceive from '@/components/WaitReceive'
import Completed from '@/components/Completed'
export default {
  name: 'allorder',
  components: {
    Navbar,
    TabItem,
    WaitPay,
    WaitDelivery,
    WaitReceive,
    Completed
  },
  data () {
    return {
      selected: '3'
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
/* 修改tabbar的字体和颜色 */
.mint-navbar .mint-tab-item.is-selected {
  color: #87CEFF;
  border-bottom: 2px solid #87CEFF;
}
/* 修改标题的颜色 */
.mint-tab-item-label {
  font-size: 0.6rem;
}
</style>
