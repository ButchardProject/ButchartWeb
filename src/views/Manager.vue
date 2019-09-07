<!-- 个人中心管理页 -->
<template>
  <div class="content">
    <div class="title">
      <img class="t-icon" :src=" avatar == '' ? defaultIcon : avatar" @click="editIcon()"/>
      <div class="username" @click="editName()">
        <span>{{name}}</span>
        <!-- <img class="e-icon" src="../assets/logo/edit.png"/> -->
      </div>
    </div>
    <div class="order-info">
      <div class="myOrder" @click="link('1')">我的订单</div><hr>
      <div class="option">
        <span class="option-span" @click="link('2')">
          <!-- <mt-badge type="primary">{{unPayed.length}}</mt-badge> -->
          <img class="option-image" src="../assets/logo/pending-payment.png"/>
          <span>待付款</span>
        </span>
        <span class="option-span" @click="link('3')">
          <!-- <mt-badge type="primary">{{payed.length}}</mt-badge> -->
          <img class="option-image" src="../assets/logo/pending-send.png"/>
          <span>待发货</span>
        </span>
        <span class="option-span" @click="link('4')">
          <!-- <mt-badge type="primary">{{send.length}}</mt-badge> -->
          <img class="option-image" src="../assets/logo/pending-receive.png"/>
          <span>待收货</span>
        </span>
        <span class="option-span" @click="link('5')">
          <!-- <mt-badge type="primary">{{afterSales.length}}</mt-badge> -->
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
// import axios from 'axios'
import config from '@/config'
export default {
  name: 'manager',
  data () {
    return {
      name: JSON.parse(sessionStorage.getItem('userInfo')).phone, // 用户昵称
      defaultIcon: config.default_icon, // 默认头像
      avatar: '' // 头像
      // unPayed: [], // 未付款的订单
      // payed: [], // 待发货
      // send: [], // 已发货
      // afterSales: [] // 已完成
    }
  },
  methods: {
    // 前往主页
    home () {
      this.$router.push('/?code=' + sessionStorage.getItem('code'))
    },
    /* 修改头像 */
    editIcon () {
      // this.sheetVisible = true
    },
    // 个人设置
    editName () {
      //  message,title
      // MessageBox.prompt(' ', '请输入昵称').then(({ value, action }) => {
      //   if (value.length > 11) {
      //     MessageBox.alert('长度不能超过11个字').then(action => {
      //     })
      //   } else {
      //     this.name = value // 更新到本地，但是没有更新到云端
      //     MessageBox.alert('修改成功')
      //   }
      // })
    },
    // 前往订单页
    link (number) {
      this.$router.push({
        path: 'allorder',
        query: {
          selected: number
        }
      })
    },
    // 获取用户所有订单
    getUserOrder () {
      // let that = this
      // axios.get(config.url + '/user/' + JSON.parse(sessionStorage.getItem('userInfo')).phone + '/getUserOwnedTransactions?access_token=' + sessionStorage.getItem('token'))
      //   .then(function (res) {
      //     console.log(res)
      //     for (let index in res.data) {
      //       if (res.data[index].status === 'Unpayed') {
      //         that.unPayed.push(res.data[index]) // 所有未付款的
      //       }
      //       if (res.data[index].status === 'Payed') {
      //         that.payed.push(res.data[index]) // 待发货的
      //       }
      //       if (res.data[index].status === 'Send') {
      //         that.send.push(res.data[index]) // 待收货
      //       }
      //       if (res.data[index].status === 'AfterSales') {
      //         that.afterSales.push(res.data[index]) // 已完成
      //       }
      //     }
      //   })
      //   .catch(function (error) {
      //     console.log(error)
      //   })
    }
  },
  mounted () {
    // this.getUserOrder()
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
  width: 3.5rem;
  height: 3.5rem;
  border-radius:50%;
  position: absolute;
  left: 1.5rem;
  top: 2rem;
}
/* 未读数background */
.mint-badge.is-primary {
  position: relative;
  left: .1rem;
  /* top: 50%; */
  width: .8rem;
  line-height: .5rem;

}
/* 未读数数字 */
.mint-badge.is-primary {
  font-size: 10px;
}
/* 文字 */
.username > span{
  font-size: 0.6rem;
  color: #FFFFFF;
  display: inline-block;
  width: 4.2rem;
  overflow: hidden;
  position: absolute;
  right: 5rem;
  top: 3.4rem;
}
/* 编辑图标 */
.e-icon {
  display: inline-block;
  width: 1.2rem;
  height: 1.2rem;
  position: absolute;
  right: 4.5rem;
  top: 3rem;
}
/* 整个订单信息 */
.order-info{
  height: 30%;
  width: 90%;
  margin-left: 5%;
  background-color: #FFFFFF;
  position: relative;
  top: -6%;
  border-radius: 5%;
  color:#8F8F8F;
}
/* 我的订单 */
.myOrder{
  margin-left: 10%;
  height: 16%;
  line-height: 2rem;
}
/* 订单选项 */
.option{
  width: 90%;
  display: inline-block;
  margin-left: 10%;
  padding: 2% 0;
  line-height: 1.2rem;;
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
input[type="file"] {
  position: absolute;
  left: 0;
  top: 0;
  /* bottom: 0; */
  width: 200px;
  height: 200px;
  z-index: 9;
  opacity: 0;
  /* border: 1px solid red; */
}
</style>
