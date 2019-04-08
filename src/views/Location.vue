<template>
<div class="location-body">
  <!-- 如果当前获取的list地址数组<0，说明用户没有地址，提示用户显示添加收货地址 -->
  <div v-if="addressList.length < 0" class="tip">
    {{tip}}
  </div>
  <div v-else class="list-body" v-for="(item,index) in num" :key="index">
      <ul class="list-ul">
        <li>陈{{tel[index]}}</li>
        <li>{{addressList[index]}}</li>
        <li class="choose">
            <span>
              <input class="checkbox" type="checkbox">
              <span class="checkbox-content">选择地址</span>
            </span>
            <span class="edit">编辑</span>
            <span class="remove">删除</span>
        </li>
     </ul>
  </div>
  <!-- menu -->
  <div class="foot">
    <span class="add-address" @click="addAddress()">添加新地址</span>
    <span class="sure">确定</span>
  </div>
</div>
</template>
<script>
export default {
  name: 'location',
  data () {
    return {
      tip: '请添加你的收货地址', // 如果没有收货地址就提示用户
      tel: this.$store.state.location.locationTel,
      addressList: this.$store.state.location.locationAddress
    }
  },
  // 初始化vue之前先去捞一把
  created () {
    this.getAddressList()
  },
  methods: {
    // 获取地址列表
    getAddressList () {
      this.$store.dispatch('getLocationLists')
    },
    // 添加新地址
    addAddress () {
      this.$router.push('addlocation')
    }
  },
  computed: {
    num: function () {
      return this.$store.state.location.locationNum
    }
  }
}
</script>
<style lang="css" scoped>
/* 整个页面的大小 */
.location-body {
  width: 100%;
  height: 100%;
  background-color: #F0F0F0;
  font-size: 0.6rem;
}
/* 如何当前addresslist没有元素就显示tip */
.tip {
  font-size: 0.8rem;
  position:absolute;
  left:50%;
  top:50%;
  /* 设置元素的相对于自身的偏移度为负50% */
  transform:translate(-50%,-50%);
}
/* 地址的内容 */
.list-body {
  width: 100%;
  background-color: #FFFFFF;
  line-height: 50px;
  margin-bottom: 5%;
}
ul{
  margin-left: 5%;
  /* border: 1px solid red; */
}
/*  checkbox选中的颜色 */
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
/* 内容相聚checkbox */
.checkbox-content {
  margin-left: 2%;
}
/* 编辑 */
.edit {
  display: inline-block;
  width: 50%;
  text-align: right;
}
/* 删除 */
.remove {
  display: inline-block;
  width: 15%;
  text-align: right;
  color: #FF4040;
}
/* 底部操作栏 */
.foot{
  height: 6%;
  width: 100%;
  background-color: #F8F8FF;
  position: fixed;
  bottom: 0;
  line-height:35px;
  padding-top: 1%;
}
.add-address {
  border:1px solid #636363;
  color: #636363;
  display: inline-block;
  width: 45%;
  text-align: center;
  margin-left: 2%;
  border-radius: 5px;
}
.sure {
  display: inline-block;
  width: 45%;
  text-align: center;
  margin-left: 4%;
  border-radius: 5px;
  background-color: #63B8FF;
  color: #FFFFFF;
  border: 1px solid#63B8FF;
}
</style>
