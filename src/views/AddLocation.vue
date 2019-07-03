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
                <span v-if="flag" @click="choose()">{{myAddressProvince}} {{myAddressCity}} {{district}}</span>
                <span v-else  @click="choose()" class="defaultAddress">请选择地址</span>
                <!-- 使用mint-ui来实现省市区三级联动 -->
                <mt-popup v-model="popupVisible" position="bottom">
                  <mt-picker :slots="myAddressSlots" @change="onValuesChange"></mt-picker>
                </mt-popup>
             </li>
            <li>
                <span class="property">门牌号</span>
                <input type="text" v-model="street" placeholder="例：水印城A座8楼801室"/>
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
      street: '', // 详细地址
      popupVisible: false, // 控制popup展示和隐藏
      flag: false, // 控制显示地址
      items: [{ name: '先生', checked: false }, { name: '女士', checked: false }], // label中显示的值以及状态
      sex: '', // 性别
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
      district: '区/县',
      locationId: ''
    }
  },
  mounted () {
    // 解析传递过来的信息
    if (sessionStorage.getItem('editLocation')) {
      let editInfo = JSON.parse(sessionStorage.getItem('editLocation'))
      this.locationId = editInfo.locationId
      this.phone = editInfo.tel
      this.name = editInfo.name
      this.myAddressProvince = editInfo.province
      this.myAddressCity = editInfo.city
      this.district = editInfo.district
      this.street = editInfo.street
      this.flag = editInfo.flag
      this.sex = editInfo.sex
      if (this.sex == '先生') {
        this.items[0].checked = true
        this.items[1].checked = false
      } else {
        this.items[0].checked = false
        this.items[1].checked = true
      }
      // 数据全部获取完，在删除
      sessionStorage.removeItem('editLocation')
    }
  },
  methods: {
    // 保证checkbox只能选择其一
    select (index) {
      switch (index) {
        case 0 :
          this.items[index].checked = true
          this.items[index + 1].checked = false
          this.sex = '先生'
          break
        case 1 :
          this.items[index].checked = true
          this.items[index - 1].checked = false
          this.sex = '女士'
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
        this.district = values[2]
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
      if (!(this.phone && this.name && this.street && (this.items[0].checked || this.items[1].checked))) {
        MessageBox('提示', '请填写正确资料')
      } else {
        // then中无法访问this对象
        let self = this
        // 区分是编辑还是新增
        if (this.$route.query.index) {
          // 转成json
          let addressData = JSON.stringify(
          {
            '_id': this.locationId,
            'name': this.name,
            'sex': this.sex,
            'province': this.myAddressProvince,
            'city': this.myAddressCity,
            'district': this.district,
            'tel': this.phone,
            'street': this.street,
            'postcode': 'string',
            'isDefault': true
          })
          // 请求服务器
          axios.put(config.url + '/user/' + JSON.parse(sessionStorage.getItem('userInfo')).phone + '/modifyAddress?access_token=' + sessionStorage.getItem('token'), addressData, {
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(function (res) {
            console.log('update:>'+res)
            if (res.status === 200) {
              self.$router.push('location')
            }
          }).catch(function (error) {
            console.log(error)
          })
        } else {
          let addressData = JSON.stringify(
          {
            'name': this.name,
            'sex': this.sex,
            'province': this.myAddressProvince,
            'city': this.myAddressCity,
            'district': this.district,
            'tel': this.phone,
            'street': this.street,
            'postcode': 'string',
            'isDefault': true
          })
          // 添加请求header
          axios.put(config.url + '/user/' + JSON.parse(sessionStorage.getItem('userInfo')).phone + '/addAddress?access_token=' + sessionStorage.getItem('token'), addressData, {
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(function (res) {
            console.log(res)
            if (res.status === 200) {
              self.$router.push('location')
            }
          }).catch(function (error) {
            console.log(error)
          })
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
