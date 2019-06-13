<template>
<div class="location-content">
  <!-- 如果当前获取的list地址数组<0，说明用户没有地址，提示用户显示添加收货地址 -->
  <div v-if="num < 1" class="tip">
    {{tip}}
  </div>
  <div v-else class="list-body" v-for="(item,index) in num" :key="index">
    <ul class="list-ul">
      <li><span class="name">{{name[index]}}</span>{{tel[index]}}</li>
      <li>{{province[index]+city[index]+district[index]+street[index]}}</li>
      <li class="choose">
        <span @click="select(item)">
          <input class="checkbox" type="checkbox" name="checkbox" :checked="current.indexOf(item)>=0">
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
      tel: [],
      name: [],
      province: [],
      city: [],
      district: [],
      street: [],
      locationId: [], // 地址id
      current: [], // 当前选中
      isSure: false, // 是否选中相应的地址
      num: '' // 当前多少数量地址
    }
  },
  // 初始化vue之前先去捞一把
  created () {
    this.getAddressList()
  },
  methods: {
    // 获取地址列表
    getAddressList () {
      let self = this
      axios.get(config.url + '/user/' + sessionStorage.getItem('phone') + '/getAddress?access_token=' + sessionStorage.getItem('token'))
        .then((res) => {
          console.log(res)
          // 获取的数据量先存起来
          self.num = res.data.length
          if (self.name.length) {
            self.name = []
            self.tel = []
            self.province = []
            self.city = []
            self.district = []
            self.street = []
            self.locationId = []
          }
          for (let index in res.data) {
            self.locationId.push(res.data[index]._id)
            self.name.push(res.data[index].name)
            self.tel.push(res.data[index].tel)
            self.province.push(res.data[index].province)
            self.city.push(res.data[index].city)
            self.district.push(res.data[index].district)
            self.street.push(res.data[index].street)
          }
          sessionStorage.setItem('locationId', JSON.stringify(self.locationId))
        })
    },
    // 添加新地址
    addAddress () {
      this.$router.push('addlocation')
    },
    //  确定选择的地址，传递到地址选择页
    confirm () {
      //  如何当前选中数组存在
      if (this.current.length) {
        // 把所有地址信息合在一起
        let currentAddress = this.province[this.current[0]] + this.city[this.current[0]] + this.district[this.current[0]] + this.street[this.current[0]]
        sessionStorage.setItem('current', this.current[0]) // 当前第几个地址下来
        sessionStorage.setItem('name', this.name[this.current[0]]) // 地址的用户名存在本地
        sessionStorage.setItem('currentAddress', currentAddress) // 地址信息存在本地
        // 前往快递页面
        this.$router.push(
          {
            name: 'express',
            query: {
              current: this.current[0]
            }
          })
      }
    },
    // 选择地址
    select (item) {
      // 判断当前是否已经选中相应地址，实现单选
      // 检索当前元素是否存在
      let checkbox = this.current.indexOf(item)
      // 元素不存在
      if (checkbox === -1) {
        this.current.push(item) // 先往数组里面推
        this.isSure = true // 当前确认按钮修改样式
        // 遍历数组存在的元素
        for (let i = 0; i <= this.current.length; i++) {
          // 如果当前数组中存在的元素不等于现在推进来的，就是直接剔除
          if (this.current[i] !== item) {
            this.current.splice(i, 1)
            console.log(this.current)
          }
        }
      } else { // 检索元素已经存在，为了控制当前button的class
        this.isSure = false
        // 遍历数组存在的元素
        for (let i = 0; i <= this.current.length; i++) {
          // 如果当前数组中存在的元素不等于现在推进来的，就是直接剔除
          if (this.current[i] === item) {
            this.current.splice(i, 1)
          }
        }
      }
    },
    // 删除地址
    remove (index) {
      let self = this
      if (this.$store.state.user.phone !== '') {
        axios.delete(config.url + '/user/' + this.$store.state.user.phone +
        '/deleteAddress?access_token=' + sessionStorage.getItem('token'),
        {
          data: [
            (this.locationId)[index]
          ]
        }).then(function (res) {
          // todo 这里应该需要去从本地库删除当前这个
          self.getAddressList()
        }).catch(function (error) {
          console.log(error)
        })
      } else {
        axios.delete(config.url + '/user/' + sessionStorage.getItem('phone') +
        '/deleteAddress?access_token=' + sessionStorage.getItem('token'),
        {
          data: [
            JSON.parse(sessionStorage.getItem('locationId'))[index]
          ]
        }).then(function (res) {
          self.getAddressList()
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
            name: (this.name)[index],
            tel: (this.tel)[index],
            province: (this.province)[index],
            city: (this.city)[index],
            district: (this.district)[index],
            street: (this.street)[index],
            flag: true
          }
        })
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
.name {
  margin-right: 2%;
}
ul{
  margin-left: 5%;
}
/* checkbox选中的颜色 */
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
