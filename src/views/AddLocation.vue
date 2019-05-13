<template>
<div class="addlocation-body">
    <div class="location-form">
        <ul>
            <li>
                <span class="property">联系人</span>
                <input type="text" v-model="name" placeholder="请填写收货人的姓名"/>
            </li>
            <li>
                <span class="chooselist">
                  <!-- 从当前用户资料中选择状态 -->
                  <span class="man woman" v-for="(item,index) in items" :key="index">
                    <input type="checkbox" value="item" id="index" @click="select(index)" :checked="items[index].checked"/>
                    <label for="index">{{items[index].name}}</label>
                  </span>
                </span>
            </li>
            <li>
                <span class="property">手机号</span>
                <input type="text" v-model="phone"  maxlength="11" oninput = "value=value.replace(/[^\d]/g,'')" placeholder="请填写收货人手机号"/>
            </li>
            <li>
                <span class="property">收货地址</span>
                <span v-if="flag" @click="choose()">{{myAddressProvince}} {{myAddressCity}} {{myAddresscounty}}</span>
                <span v-else  @click="choose()" class="defaultAddress">请选择地址</span>
                <!-- 使用mint-ui来实现省市区三级联动 -->
                <mt-popup v-model="popupVisible" position="bottom">
                  <mt-picker :slots="myAddressSlots" @change="onValuesChange"></mt-picker>
                </mt-popup>
             </li>
            <li>
                <span class="property">门牌号</span>
                <input type="text" v-model="address" placeholder="例：水印城A座8楼801室"/>
            </li>
        </ul>
    </div>
    <div class="save">
        <span class="save-button" @click="saveAddress()">保存</span>
    </div>
</div>
</template>
<script>
import { MessageBox } from 'mint-ui'
import addresslist from '@/assets/address.json'
import config from '@/config'
import axios from 'axios'

export default {
  name: 'addlocation',
  data () {
    return {
      name: '', // 姓名
      phone: '', // 手机号
      address: '', // 详细地址
      popupVisible: false, // 控制popup展示和隐藏
      flag: false, // 控制显示地址
      items: [{ name: '先生', checked: false }, { name: '女士', checked: false }], // label中显示的值以及状态
      // slot
      myAddressSlots: [
        {
          flex: 1,
          defaultIndex: 1,
          values: Object.keys(addresslist), // 省市县区数组
          className: 'slot1',
          textAlign: 'center'
        },
        {
          divider: true,
          content: '-',
          className: 'slot2'
        },
        {
          flex: 1,
          values: [],
          className: 'slot3',
          textAlign: 'center'
        },
        {
          divider: true,
          content: '-',
          className: 'slot4'
        },
        {
          flex: 1,
          values: [],
          className: 'slot5',
          textAlign: 'center'
        }],
      myAddressProvince: '省',
      myAddressCity: '市',
      myAddresscounty: '区/县',
      // 从location页面编辑过来的数据
      receiveAddress: {
        index: this.$route.query.index,
        tel: this.$route.query.tel,
        addressList: this.$route.query.addressList
      }
    }
  },
  mounted() {
    // 解析传递过来的信息
    this.handleInfo(this.receiveAddress.tel, this.receiveAddress.addressList)
  },
  methods: {
    // 保证checkbox只能选择其一
    select (index) {
      switch (index) {
        case 0 :
          this.items[index].checked = true
          this.items[index + 1].checked = false
          break
        case 1 :
          this.items[index].checked = true
          this.items[index - 1].checked = false
      }
    },
    // 省市区联动，获取数组中的数据
    onValuesChange (picker, values) {
      // 判断下当前是否已经需要显示
      if (this.flag) {
        picker.setSlotValues(1, Object.keys(addresslist[values[0]])) // Object.keys()会返回一个数组，当前省的数组
        picker.setSlotValues(2, addresslist[values[0]][values[1]]) // 区/县数据就是一个数组
        this.myAddressProvince = values[0]
        this.myAddressCity = values[1]
        this.myAddresscounty = values[2]
      }
    },
    // 选择省市区三级联动的popup显示
    choose () {
      this.flag = true // 需要显示地址
      this.popupVisible = true // 需要显示控件
      this.myAddressSlots[0].defaultIndex = 0 // 默认为第一项
    },
    // 保存用户地址
    saveAddress () {
      // 判断手机号是否正确
      if (!(/^1[3|5|7|8|9][0-9]\d{8}$/.test(this.phone))) {
        MessageBox('提示', '请输入正确手机号')
        return
      }
      // 均不允许为空
      if (!(this.phone && this.name && this.address && (this.items[0].checked || this.items[1].checked))) {
        MessageBox('提示', '请填写正确资料')
      } else {
        // 防止刷新之后当前vuex中的数据没了
        if (this.$store.state.user.phone !== '') {
          // 将省市区三级和详细地址合并到一起
          let local = this.myAddressProvince + this.myAddressCity + this.myAddresscounty + this.address
          // 转成json
          let addressData = JSON.stringify(
            { 'address': local,
              'tel': this.phone,
              'postcode': 'string',
              'isDefault': 'true'
            })
          // 请求服务器
          axios.put(config.url + '/userId/' + this.$store.state.user.phone + '/addAddress?', addressData)
            .then(function (res) {
              console.log(res)
              if (res.status === 200) {
                this.$router.push('location')
              }
            }).catch(function (error) {
              console.log(error)
            })
        } else {
          let local = this.myAddressProvince + this.myAddressCity + this.myAddresscounty + this.address
          let addressData = JSON.stringify(
            { 'address': local,
              'tel': this.phone,
              'postcode': 'string',
              'isDefault': 'true'
            })
          // then中无法访问this对象
          let self = this
          // 添加请求header
          axios.put(config.url + '/userId/' + sessionStorage.getItem('phone') + '/addAddress', addressData, {
            headers: {
              'Content-Type': 'application/json'
            }
          })
            .then(function (res) {
              console.log(res)
              if (res.status === 200) {
                self.$router.push('location')
              }
            }).catch(function (error) {
              console.log(error)
            })
        }
      }
    },
    // 处理编辑页传递过来的信息
    handleInfo(tel, addAddressList){
      console.log(tel, addAddressList)
      if (!tel) {
        return 
      } else {
        this.flag = true // 先把默认的去掉,展示当前信息
        this.phone = tel // 先拿用户号码

        let index = 0
        // 当前检索省的标记
        let currentProvice = addAddressList.indexOf("省")
        if (currentProvice == -1) { // 如果没有检索到省
          index = addAddressList.indexOf("自治区") // 继续检索自治区
          if (index != -1) { // 如果已经找到自治区
            console.log('自治区:'+index)
            this.myAddressProvince = addAddressList.substring(0, index + 3)
            console.log('1:'+this.myAddressProvince)
          } else { // 否则就是直辖市
            console.log('直辖市:'+index)
            this.myAddressProvince = addAddressList.substring(0, index + 4)
            console.log('2:'+this.myAddressProvince)
          }
        } else { // 检索到省
          console.log('省:'+index)
          this.myAddressProvince = addAddressList.substring(0, currentProvice + 1)
          console.log('3:'+this.myAddressProvince)
        }

        // 当前检索市的标记
        let currentCity = addAddressList.indexOf("市辖区") // 市辖区
        if (currentCity != -1) { //检索到市辖区
          // 因为上面已经检索到是直辖市，这边index就是上面的值为-1,当前市辖区已经找到，currentCity就是3
          this.myAddressCity = addAddressList.substring(index + 4, currentCity + 3)  // 就是市辖区的
          console.log('4:'+this.myAddressCity)
        } else { // 如果不是市辖区，那说明是，省或者自治区打头
          var city = addAddressList.indexOf('市') // 在从里面去获取市
          if (index == 0) { // 省
            this.myAddressCity = addAddressList.substring(index + 3, city + 1)
            console.log('5:'+this.myAddressCity)
          } else { // 自治区
            this.myAddressCity = addAddressList.substring(index + 3, city + 1)
            console.log('6:'+this.myAddressCity)
          }
        }

        // 当前检索区县的标记
        let currentCounty = addAddressList.lastIndexOf("区")
        if (currentCounty == -1) { // 不是区
          currentCounty = addAddressList.indexOf("县")
          this.myAddresscounty = addAddressList.substring(city + 1, currentCounty + 1)
          this.address = addAddressList.substring(currentCounty + 1)
          console.log('7-1:'+this.address)
          console.log('7:'+this.myAddresscounty)
        } else { // 是区
          this.myAddresscounty = addAddressList.substring(city + 1, currentCounty + 1)
          this.address = addAddressList.substring(currentCounty + 1)
          console.log('8-1:'+this.address)
          console.log('8:'+this.myAddresscounty)
        }
      }
    }
  }
}
</script>
<style lang="css" scoped>
/* 整个页面的大小 */
.addlocation-body {
  width: 100%;
  height: 100%;
  background-color: #F0F0F0;
  font-size: 0.6rem;
}
/* 添加的整个form */
.location-form {
  width: 100%;
  background-color: #FFFFFF;
  line-height: 40px;
  position: relative;
  top: 2%;
}
/* li的底部 */
li {
  border-bottom: 1px solid #EBEBEB;
}
/* li中的文字 */
.property {
  display: inline-block;
  width: 20%;
  margin-left: 5%;
}
/* 输入框 */
input {
  width: 60%;
  border: none;
}
/* man与woman的选择 */
.chooselist {
  margin-left: 25%;
}
/* checkbox的框 */
.man > input {
  width: 5%;
}
/* 先生的span */
.man {
  margin-right: 5%;
}
/* 错误提示 */
.errorMsg {
  color: #FF0000;
  font-size: 0.3rem;
}
.defaultAddress {
  color: #DEDEDE
}
/* 修改mint-ui的样式popup的宽度为100% */
.mint-popup-bottom {
  width: 100%;
}
/* 底部的固定导航栏 */
.save {
  height: 6%;
  width: 100%;
  /* background-color: #F8F8FF; */
  position: relative;
  top: 3%;
  line-height:35px;
  padding-top: 1%;
  text-align: center;
}
/* 保存按钮 */
.save-button {
    border: 1px solid #63B8FF;
    background-color: #63B8FF;
    color: #FFFFFF;
    display: inline-block;
    width: 90%;
    text-align: center;
    border-radius: 6px;
    /* 字间距 */
    letter-spacing: 20px;
}
</style>
