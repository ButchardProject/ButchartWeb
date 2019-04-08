<template>
<div class="addlocation-body">
    <div class="location-form">
        <ul>
            <li>
                <span class="property">姓名</span>
                <input type="text" v-model="name"/>
            </li>
            <li>
                <span class="property">手机</span>
                <input type="text" v-model="phone"  maxlength="11" oninput = "value=value.replace(/[^\d]/g,'')"/>
                <span class="errorMsg" v-show="errorMsg">{{errorMsg}}</span>
            </li>
            <li>
                <span class="property">地区</span>
                <span @click="choose()">{{myAddressProvince}} {{myAddressCity}} {{myAddresscounty}}</span>
                <!-- 使用mint-ui来实现省市区三级联动 -->
                <mt-popup v-model="popupVisible" position="bottom">
                  <mt-picker :slots="myAddressSlots" @change="onValuesChange"></mt-picker>
                </mt-popup>
             </li>
            <li>
                <span class="property">详细地址</span>
                <input type="text" v-model="address"/>
            </li>
        </ul>
    </div>
    <div class="save">
        <span class="save-button" @click="saveAddress()">保存</span>
    </div>
</div>
</template>
<script>
import { Picker, Popup } from 'mint-ui'
import addresslist from '@/assets/address.json'
import config from '@/config'
import axios from 'axios'

export default {
  name: 'addlocation',
  comments: {
    Picker,
    Popup
  },
  data () {
    return {
      name: '', // 姓名
      phone: '',  // 手机号
      address: '', // 详细地址
      errorMsg: '', // 错误提示
      popupVisible: false, // 控制popup展示和隐藏
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
      myAddresscounty: '区/县'
    }
  },
  methods: {
    // 省市区联动，获取数组中的数据
    onValuesChange (picker, values) {
      if (addresslist[values[0]]) { // 这个判断类似于v-if的效果
        picker.setSlotValues(1, Object.keys(addresslist[values[0]])) // Object.keys()会返回一个数组，当前省的数组
        picker.setSlotValues(2, addresslist[values[0]][values[1]]) // 区/县数据就是一个数组
        this.myAddressProvince = values[0]
        this.myAddressCity = values[1]
        this.myAddresscounty = values[2]
      }
    },
    // 选择省市区三级联动的popup显示
    choose () {
      this.popupVisible = true

    },
    // 保存用户地址
    saveAddress () {
      if (!(/^1[3|5|7|8|9][0-9]\d{8}$/.test(this.phone))) {
        this.errorMsg = '请输入正确手机号'
        return
      }
      // 均不允许为空
      if (!(this.phone && this.name && this.address)) {
      }else {
        // 当前userid为空，this.$store.state.user.phone ，这里写死号码
        axios.put(config.url+ '/userId/'+ '18042507588' + '/addAddress')
         .then(function (res) {
            console.log(res)
            if (res.status === 200) {
              this.$router.push('location')
            }
          }).catch(function (error) {
            console.log(error)
          })
      }
    }
  },
  mounted () {
    // vue里面全部加载好了再执行的函数 （类似于setTimeout）
    this.$nextTick(() => { 
      this.myAddressSlots[0].defaultIndex = 0
      // 这里的值需要和 data里面 defaultIndex 的值不一样才能够初始化
    })
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
    line-height: 50px;
}
/* li中的文字 */
.property {
    display: inline-block;
    width: 20%;
    margin-left: 5%;
}
/* 输入框 */
input {
    border: 1px solid red;
}
/* 错误提示 */
.errorMsg {
  color: #FF0000;
  font-size: 0.3rem;
}
/* 修改mint-ui的样式popup的宽度为100% */
.mint-popup-bottom {
    width: 100%;
}
/* 底部的固定导航栏 */
.save {
  height: 6%;
  width: 100%;
  background-color: #F8F8FF;
  position: fixed;
  bottom: 0;
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
    border-radius: 10px;
    /* 字间距 */
    letter-spacing: 20px;
}
</style>
