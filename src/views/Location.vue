<template>
<div class="location-content">
  <!-- 如果当前获取的list地址数组<0，说明用户没有地址，提示用户显示添加收货地址 -->
  <div v-if="num < 1" class="tip">
    {{tip}}
  </div>
  <div v-else class="list-body" v-for="(item,index) in num" :key="index">
    <ul class="list-ul">
      <li>{{tel[index]}}</li>
      <li>{{addressList[index]}}</li>
      <li class="choose">
        <span @click="select(index)">
          <input class="checkbox" type="checkbox">
          <span class="checkbox-content">选择地址</span>
        </span>
        <span class="edit" @click="edit(index)">编辑</span>
        <span class="remove" @click="remove(index)">删除</span>
      </li>
    </ul>
  </div>
  <!-- menu -->
  <div class="foot">
    <span class="add-address" @click="addAddress()">添加新地址</span>
    <span class="commit" :class="{sure : isSure}" @click="confirm()">确定</span>
  </div>
</div>
</template>
<script>
import axios from 'axios'
import config from '@/config'
export default {
  name: 'location',
  data () {
    return {
      tip: '请添加你的收货地址', // 如果没有收货地址就提示用户
      isSure: false, // 是否选中相应的地址
      tel: this.$store.state.location.locationTel,
      addressList: this.$store.state.location.locationAddress,
      current:'' // 当前选中的值
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
    },
    //  确定选择的地址，传递到地址选择页
    confirm () {
      if (this.current === '') {
      } else {
        sessionStorage.setItem('currentTel', this.tel[this.current])
        sessionStorage.setItem('currentAddress', this.addressList[this.current])
        this.$router.push(
          {
            name: 'express',
            query: {
              current: this.current
            }
          })
      }
    },
    // 选择地址
    select (index) {
      // 判断当前是否已经选中相应地址
      // 如果是已经true的，执行操作，在变成false，为了下次点击
      if (this.isSure) {
        this.current = ''
        this.isSure = false
        sessionStorage.removeItem('current') // 删除当前地址数值
      } else {
        // 如果是false，先设置为true，在执行操作
        this.isSure = true
        this.current = index // 把当前的index赋值给current
        sessionStorage.setItem('current', this.current) // 当前地址数值
      }
    },
    // 删除地址
    remove (index) {
      // 判断下当前是否被选中的
      if (!this.isSure) {
        this.current = index
      }
      // 如果当前选中删除的index与current一致，就删除本地库的数据
      if (this.current === index) {
        sessionStorage.removeItem('currentTel')
        sessionStorage.removeItem('currentAddress')
        this.current = ''
      }
      this.isSure = false
      let self = this
      if (this.$store.state.user.phone !== '') {
        axios.delete(config.url + '/userId/' + this.$store.state.user.phone + '/deleteAddress',
          {
            data: [
              (this.$store.state.location.locationId)[index]
            ]
          }).then(function (res) {
          self.$store.dispatch('getLocationLists')
        }).catch(function (error) {
          console.log(error)
        })
      } else {
        axios.delete(config.url + '/userId/' + sessionStorage.getItem('phone') + '/deleteAddress',
          {
            data: [
              JSON.parse(sessionStorage.getItem('locationId'))
            ]
          }).then(function (res) {
          console.log('2:'+res)
          self.$store.dispatch('getLocationLists')
        }).catch(function (error) {
          console.log(error)
        })
      }
    },
    // 编辑地址
    edit (index) {
      this.$router.push(
        {
          name: 'addlocation',
          query: {
            index: index,
            tel: (this.tel)[index],
            addressList: (this.addressList)[index]
          }
        })
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
.location-content {
  width: 100%;
  height: 100%;
  background-color: #F0F0F0;
  font-size: 0.6rem;
  padding-top: 2%;
  overflow: scroll;
  padding-bottom: 15%;
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
  margin-top: 3%;
  width: 100%;
  background-color: #FFFFFF;
  line-height: 50px;
}
ul{
  margin-left: 5%;
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
/* 添加地址button */
.add-address {
  border:1px solid #636363;
  color: #636363;
  display: inline-block;
  width: 45%;
  text-align: center;
  margin-left: 2%;
  border-radius: 5px;
}
/* 确认button */
.commit {
  display: inline-block;
  width: 45%;
  text-align: center;
  margin-left: 4%;
  border-radius: 5px;
  background-color: #DEDEDE;
  color: #FFFFFF;
  border: 1px solid #DEDEDE;
}
/* 是否选中相应的地址 */
.sure {
  background-color: #63B8FF;
}
</style>
