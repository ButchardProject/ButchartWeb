<!-- 个人中心管理页 -->
<template>
  <div class="content">
    <div class="title">
      <img class="t-icon" src="../assets/logo/default_icon.png" @click="editIcon()"/>
      <mt-actionsheet :actions="actions" v-model="sheetVisible"></mt-actionsheet>
      <div class="username" @click="editName()">
        <span>{{name}}</span>
        <img class="e-icon" src="../assets/logo/edit.png"/>
      </div>
    </div>
    <div class="order-info">
      <div class="myOrder" @click="link('1')">我的订单</div><hr>
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
import { MessageBox } from 'mint-ui'
export default {
  name: 'manager',
  data () {
    return {
      name: JSON.parse(sessionStorage.getItem('userInfo')).phone, // 用户昵称
      actions: [{
        name: '拍照',
        method: this.getCamera() // 打开摄像头
      }, {
        name: '从相册中选择',
        method: this.getLibray() // 从相册中获取
      }],
      sheetVisible: false // 调起页面
    }
  },
  methods: {
    // 前往主页
    home () {
      this.$router.push('/')
    },
    /* 修改头像 */
    editIcon () {
      this.sheetVisible = true
      console.log('1')
    },
    // 个人设置
    editName () {
      //  message,title
      MessageBox.prompt(' ', '请输入昵称').then(({ value, action }) => {
        if (value.length > 11) {
          MessageBox.alert('长度不能超过11个字').then(action => {
          })
        } else {
          this.name = value // 更新到本地，但是没有更新到云端
          MessageBox.alert('修改成功')
          console.log(value)
        }
      })
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
    // 打开摄像头
    getCamera () {
    },
    // 打开相册
    getLibray () {
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
  width: 4rem;
  height: 4rem;
  border-radius:50%;
  position: absolute;
  left: 1.5rem;
  top: 2rem;
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
  top: 3.8rem;
}
/* 编辑图标 */
.e-icon {
  display: inline-block;
  width: 1.2rem;
  height: 1.2rem;
  position: absolute;
  right: 4.2rem;
  top: 3.4rem;
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
</style>
