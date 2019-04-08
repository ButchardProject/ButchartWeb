<template>
<div class="content">
  <div class="p-info">
    <div class="p-setting" @click="setNick()">
      <span class="p-common">昵称</span>
      <span class="common">></span>
    </div>
    <div class="p-setting" @click="setAddress()">
      <span class="p-common">收货地址</span>
      <span class="common">></span>
    </div>
  </div>
</div>
</template>
<script>
import { MessageBox } from 'mint-ui'

export default {
  name: 'personal',
  data () {
    return {
      popupVisible: false
    }
  },
  methods: {
    // 设置用户nick
    setNick () {
      //  message,title
      MessageBox.prompt(' ', '请输入昵称').then(({ value, action }) => {
        if (value.length > 10) {
          MessageBox.alert('长度不能超过10个字').then(action => {
          })
        }
      })
    },
    // 设置用户地址
    setAddress () {
      this.$router.push('location')
    }
  }
}
</script>
<style lang="css" scoped>
.content {
  width: 100%;
  height: 100%;
  background-color: #F0F0F0;
  font-size: 0.8rem;
}
.p-info {
  width: 100%;
  height: 60%;
  position: absolute;
  top: 5%;
}
.p-setting {
  width: 100%;
  line-height: 40px;
  background-color: #FFFFFF;
  margin-bottom: 5%;
}
.p-common {
  display: inline-block;
  width: 88%;
  margin-left: 5%;
}
.common {
  color: #CFCFCF;
}
</style>
