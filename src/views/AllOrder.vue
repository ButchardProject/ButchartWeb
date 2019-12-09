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
        <div>
          <ul class="pagination" >
            <li v-show="current != 1" @click="current-- && goto(current)" ><a href="#">上一页</a></li>
            <li v-for="index in pages" @click="goto(index)" :class="{'active':current == index}" :key="index">
              <a href="#" >{{index}}</a>
            </li>
            <li v-show="sum != current && sum != 0 " @click="current++ && goto(current++)"><a href="#" >下一页</a></li>
          </ul>
        </div>
      </mt-tab-container-item>
      <!-- 待付款 -->
      <mt-tab-container-item id="2">
        <WaitPay :unPayed="unPayed" :unPayedSum="unPayedSum"/>
      </mt-tab-container-item>
      <!-- 待发货 -->
      <mt-tab-container-item id="3">
        <WaitDelivery :payed="payed" :payedSum="payedSum"/>
        <!-- :waitDeliveyList="waitDeliveyList" -->
      </mt-tab-container-item>
      <!-- 待收货 -->
      <mt-tab-container-item id="4">
        <WaitReceive :send="send" :sendSum="sendSum"/>
      </mt-tab-container-item>
      <!-- 已完成 -->
      <mt-tab-container-item id="5">
        <Completed :afterSales="afterSales" :afterSalesSum="afterSalesSum"/>
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
import { Indicator } from 'mint-ui'
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
      page: 1,
      id: [], // 订单id
      unPayed: [], // 未付款的订单
      payed: [], // 待发货
      send: [], // 已发货
      afterSales: [], // 已完成
      unPayedSum: 0, // 未付款订单总数
      payedSum: 0, // 待发货订单总数
      sendSum: 0, // 已发货订单总数
      afterSalesSum: 0, // 已完成订单总数
      sum: 0, // 所有订单数
      current: 1, // 当前页
      showItem: 5 // 显示当前几个项目
    }
  },
  created () {
    this.getAllOrder()
    this.getUnpay()
    this.getPayed()
    this.getSend()
    this.getAfterSales()
  },
  // 在vue加载完之后，去获取传过来的选中值
  mounted () {
    this.selected = this.$route.query.selected
  },
  methods: {
    getAllOrder () {
      let self = this
      let info = {
        'userId': JSON.parse(sessionStorage.getItem('userInfo')).phone
      }
      Indicator.open('加载中...')
      axios.post(config.url + '/user/' + JSON.parse(sessionStorage.getItem('userInfo')).phone + '/searchTransactionWithAddress?access_token=' + sessionStorage.getItem('token'), info)
        .then(function (res) {
          self.sum = res.data.length
          // 为了不影响下次使用效果
          self.unPayedSum = 0
          self.payedSum = 0
          self.sendSum = 0
          self.afterSalesSum = 0
          // 如果当前数据是有的就继续操作
          for (let index in res.data) {
            if (res.data[index].status === 'Unpayed') {
              self.unPayedSum++
            }
            if (res.data[index].status === 'Payed') {
              self.payedSum++
            }
            if (res.data[index].status === 'Send') {
              self.sendSum++
            }
            if (res.data[index].status === 'AfterSales') {
              self.afterSalesSum++
            }
          }
          Indicator.close()
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    // 分页跳转
    goto (index) {
      if (index === this.current) return
      this.current = index
      // 这里可以发送ajax请求
      Indicator.open('加载中...')
      let self = this
      let info = {
        'userId': JSON.parse(sessionStorage.getItem('userInfo')).phone
      }
      axios.post(config.url + '/user/' + JSON.parse(sessionStorage.getItem('userInfo')).phone + '/searchTransactionWithAddress?page=' + this.current + '&access_token=' + sessionStorage.getItem('token'), info)
        .then(function (res) {
          // console.log(res)
          // 如果当前数据是有的就继续操作
          if (res.data.length > 0) {
            // 把之前的先清空，保证在查询的时候，不会重复推
            self.$parent.unPayed = []
            for (let index in res.data) {
              self.$parent.unPayed.push(res.data[index]) // 所有未付款的
            }
            Indicator.close()
          } else { // 没有直接把表格数据置位0
            self.$parent.unPayed = []
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    // 获取所有未付款的
    getUnpay () {
      Indicator.open('加载中...')
      let self = this
      let info = {
        'status': 'Unpayed',
        'userId': JSON.parse(sessionStorage.getItem('userInfo')).phone
      }
      axios.post(config.url + '/user/' + JSON.parse(sessionStorage.getItem('userInfo')).phone + '/searchTransactionWithAddress?access_token=' + sessionStorage.getItem('token'), info)
        .then(function (res) {
          // console.log(res)
          // 如果当前数据是有的就继续操作
          if (res.data.length > 0) {
            // 把之前的先清空，保证在查询的时候，不会重复推
            self.unPayed = []
            self.unPayedSum = res.data.length
            for (let index in res.data) {
              self.unPayed.push(res.data[index]) // 所有未付款的
            }
            Indicator.close()
          } else { // 没有直接把表格数据置位0
            self.unPayed = []
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    // 获取所有未发货的
    getPayed () {
      let self = this
      let info = {
        'status': 'Payed',
        'userId': JSON.parse(sessionStorage.getItem('userInfo')).phone
      }
      axios.post(config.url + '/user/' + JSON.parse(sessionStorage.getItem('userInfo')).phone + '/searchTransactionWithAddress?access_token=' + sessionStorage.getItem('token'), info)
        .then(function (res) {
          // console.log(res)
          // 如果当前数据是有的就继续操作
          if (res.data.length > 0) {
            // 把之前的先清空，保证在查询的时候，不会重复推
            self.payed = []
            for (let index in res.data) {
              self.payed.push(res.data[index]) // 所有未付款的
            }
          } else { // 没有直接把表格数据置位0
            self.payed = []
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    // 获取所有已发货的
    getSend () {
      let self = this
      let info = {
        'status': 'Send',
        'userId': JSON.parse(sessionStorage.getItem('userInfo')).phone
      }
      axios.post(config.url + '/user/' + JSON.parse(sessionStorage.getItem('userInfo')).phone + '/searchTransactionWithAddress?access_token=' + sessionStorage.getItem('token'), info)
        .then(function (res) {
          // console.log(res)
          // 如果当前数据是有的就继续操作
          if (res.data.length > 0) {
            // 把之前的先清空，保证在查询的时候，不会重复推
            self.send = []
            for (let index in res.data) {
              self.send.push(res.data[index]) // 所有未付款的
            }
          } else { // 没有直接把表格数据置位0
            self.send = []
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    // 获取所有售后的
    getAfterSales () {
      let self = this
      let info = {
        'status': 'AfterSales',
        'userId': JSON.parse(sessionStorage.getItem('userInfo')).phone
      }
      axios.post(config.url + '/user/' + JSON.parse(sessionStorage.getItem('userInfo')).phone + '/searchTransactionWithAddress?access_token=' + sessionStorage.getItem('token'), info)
        .then(function (res) {
          // console.log(res)
          // 如果当前数据是有的就继续操作
          if (res.data.length > 0) {
            // 把之前的先清空，保证在查询的时候，不会重复推
            self.afterSales = []
            for (let index in res.data) {
              self.afterSales.push(res.data[index]) // 所有未付款的
            }
          } else { // 没有直接把表格数据置位0
            self.afterSales = []
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    // 前往主页
    home () {
      this.$router.push('/?code=' + sessionStorage.getItem('code'))
    },
    manager () {
      this.$router.push('/manager')
    }
  },
  computed: {
    pages () {
      var pag = []
      if (this.current < this.showItem) { // 如果当前的激活的项 小于要显示的条数
        // 总页数和要显示的条数那个大就显示多少条
        var i = Math.min(this.showItem, this.sum)
        while (i) {
          pag.unshift(i--)
        }
      } else { // 当前页数大于显示页数了
        var middle = this.current - Math.floor(this.showItem / 2) // 从哪里开始
        i = this.showItem
        if (middle > (this.sum - this.showItem)) {
          middle = (this.sum - this.showItem) + 1
        }
        while (i--) {
          pag.push(middle++)
        }
      }
      return pag
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
/* 分页相关  */
li {
  list-style:none;
}
a {
  text-decoration:none;
}
.pagination {
  position: relative;
  margin-top: 5%;
  text-align: right;
}
.pagination li{
  display: inline-block;
  margin:0 .2rem;
}
.pagination li a{
  padding:.2rem .4rem;
  display:inline-block;
  border:1px solid #ddd;
  background:#fff;
  color:#0E90D2;
}
.pagination li a:hover{
  background:#eee;
}
.pagination li.active a{
  background:#0E90D2;
  color:#fff;
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
