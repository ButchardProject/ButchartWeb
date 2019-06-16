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
        <WaitPay/>
        <WaitDelivery/>
        <WaitReceive/>
        <Completed/>
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
import WaitPay from '@/components/WaitPay'
import WaitDelivery from '@/components/WaitDelivery'
import WaitReceive from '@/components/WaitReceive'
import Completed from '@/components/Completed'
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
      selected: '1'
    }
  },
  // 在vue加载完之后，去获取传过来的选中值
  mounted () {
    console.log(this.$route.query.selected)
    this.selected = this.$route.query.selected
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
  padding-bottom: 5%;
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
