<!-- 个人中心管理页 -->
<template>
  <div class="content">
    <div class="title">
      <img class="t-icon" :src=" avatar == '' ? defaultIcon : avatar" @click="editIcon()"/>
      <!-- <mt-actionsheet :actions="data" v-model="sheetVisible"></mt-actionsheet> -->
      <!-- <input ref="photoref" type="file" accept="image/*" capture="camera" @change="getCamera" style="display: none"/> -->
      <div class="username" @click="editName()">
        <span>{{name}}</span>
        <!-- <img class="e-icon" src="../assets/logo/edit.png"/> -->
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
import axios from 'axios'
import config from  '@/config'
export default {
  name: 'manager',
  data () {
    return {
      name: JSON.parse(sessionStorage.getItem('userInfo')).phone, // 用户昵称
      defaultIcon: config.default_icon, // 默认头像
      avatar: '', // 头像
      // action sheet 选项内容
//       data: [{
//         name: '拍照',
//         method : this.getCamera	// 调用methods中的函数
//       }, {
//         name: '从相册中选择', 
//         method : this.getLibrary	// 调用methods中的函数
//       }],
      // action sheet 默认不显示，为false。操作sheetVisible可以控制显示与隐藏
//       sheetVisible: false
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
    // 打开摄像头
    async getCamera () {
      // console.log(this.$refs.photoref.files)
      // // console.log(file)
      // // 获取图片base64 代码，并存放到 avatar 中
      // this.avatar = await this.FileReader(this.$refs.photoref.files[0])
      // let data = {
      //   'avatar': this.avatar,
      // }
      // // 更新用户信息
      // axios.put(config.url + '/user/' + JSON.parse(sessionStorage.getItem('userInfo')).phone + '/updateUserInfo?access_token=' + sessionStorage.getItem('token'), data, {
      //   headers: {
      //     'Content-Type': 'application/json'
      //   }
      // })
      //   .then(function (res) {
      //     console.log(res)
      //     // 子组件给父组件传递数据
      //     self.$emit('setUserInfo', data)
      //   }).catch(function (error) {
      //     console.log(error)
      //   })
    },
    /**
     * 返回用户拍照图片的base64
     */
    // FileReader (FileInfo) {
    //   // FileReader 方法参考地址：https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader
    //   let reader = new FileReader()
    //   // readAsDataURL 方法参考地址：https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader/readAsDataURL
    //   reader.readAsDataURL(FileInfo)
    //   // 监听读取操作结束
    //   /* eslint-disable */
    //   return new Promise(resolve => reader.onloadend = () => resolve(reader.result))
    // },
    // // 打开相册
    // getLibray () {
    // }
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
