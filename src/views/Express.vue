<template>
<div class="express-body">
    <div class="express-content">
        <div class="address">
          <span class="title">地址选择</span>
          <span v-if="flag" class="currentAddress" @click="selectAddress()">{{name}} {{address}}</span>
          <span v-else class="choose" @click="selectAddress()">请选择</span>
        </div>
        <hr style="height:1px;border: none;border-top:1px solid #ddd;margin:15px 0;"/>
        <div class="express-title">
            <div class="title">配送选择</div>
            <ul>
                <li v-for="(method,index) in deliveryMethod" :key="index" @click="select(index)" :class="[current === index ? 'active' : '']"> > {{method}}</li>
            </ul>
        </div>
        <hr style="height:1px;border: none;border-top:1px solid #ddd;margin:15px 0;"/>
        <div class="express-price">
            <span class="title">运费计算:</span>
            <span v-if="isInside" class="title">¥{{normal}}</span>
            <span v-else class="title">¥{{other}}</span>
        </div>
        <hr style="height:1px;border: none;border-top:1px solid #ddd;margin:15px 0;"/>
        <div class="store-time">
        <div class="title">送达日期</div>
        <span @click="chooseDate()">日期 {{date}}</span>
        <mt-datetime-picker type="date" ref="datePicker" @confirm="handleDateConfirm"
            year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" :startDate="startDate" :endDate="endDate">
        </mt-datetime-picker>
      </div>
    </div>
    <!-- 保存 -->
    <div class="div-save">
        <span class="save" @click="save()">保存</span>
    </div>
</div>
</template>
<script>
import { MessageBox } from 'mint-ui'
import config from '@/config'
import axios from 'axios'
export default {
  name: 'express',
  data () {
    return {
      date: '', // 日期
      normal: 0, // 省内正常运费
      other: 0, // 其他运费
      isInside: true, // 是否省内
      flag: false, // 当前是否显示已选择
      address: '',
      name: '',
      discountNormal: '', // 花束价格
      discountOther: '', // 伴手礼价格
      isNormal: true, // 花束是正常，伴手礼是不正常的
      startDate: '', // 当前日期
      endDate: new Date(Date.parse(new Date()) + 1000 * 60 * 60 * 24 * 30), // 一个月后结束日期
      deliveryMethod: [], // 配送方式
      perArea: ['上城区', '下城区', '江干区', '拱墅区', '西湖区', '滨江区'], // 专人配送区域
      current: '' // 当前配送
    }
  },
  created () {
    this.setTime() // 设置起始时间
    this.handleAddress() // 处理地址
    // 获取运费地址
    let that = this
    axios.get(config.url + '/getDeliveryMethods?access_token=' + sessionStorage.getItem('token'), {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function (res) {
      // console.log(res.data)
      for (let index in res.data) {
        // 将当前除自提以外的配送方式加入
        if (res.data[index].deliveryMethod !== '自提') {
          that.deliveryMethod.push(res.data[index].deliveryMethod)
        }
        // 顺丰栏
        if (res.data[index].deliveryMethod === '顺丰') {
          that.other = res.data[index].freight.其他 // 获取其他省份的运费
          that.normal = res.data[index].freight.浙江省
          that.discountNormal = res.data[index].config.discount.花束
          that.discountOther = res.data[index].config.discount.伴手礼
          let discount = JSON.stringify({
            'discountNormal': that.discountNormal,
            'discountOther': that.discountOther
          })
          sessionStorage.setItem('discount', discount)
        }
      }
    }).catch(function (error) {
      console.log(error)
    })
  },
  mounted () {
    this.handleMoney() // 处理当前费用
  },
  methods: {
    // 选择配送方式
    select (index) {
      if (this.address) { // 有了地址才给选
        if (index === 1) { // 如果是专人配送
          if (this.address) { // 当前地址不为空的话
            if (this.address.indexOf('杭州市') !== -1) { // 检索地址是否是杭州市
              for (let i = 0; i < this.perArea.length; i++) { // 检索杭州市内的城市区域
                if (this.address.indexOf(this.perArea[i]) !== -1) { // 没有超过区域
                  this.normal = 20
                  this.current = index
                  break // 找到了就直接跳出循环，不在执行下面
                } else { // 超出区域
                  MessageBox('提示', '专人配送超过区域，请选择其它配送方式')
                  continue // 没找到就继续
                }
              }
            } else { // 不是，直接提示
              MessageBox('提示', '专人配送超过区域，请选择其它配送方式')
            }
          }
        } else { // 如果是顺丰的话直接显示
          this.current = index
        }
      }
    },
    // 如果是听花的话，时间选3天后
    setTime () {
      if (JSON.parse(sessionStorage.getItem('type'))) {
        let type = JSON.parse(sessionStorage.getItem('type'))
        if (type === '听花') {
          this.startDate = new Date(Date.parse(new Date()))
        } else {
          this.startDate = new Date(Date.parse(new Date()) + 1000 * 60 * 60 * 24 * 3)
        }
      }
    },
    // 前往location选择地址
    selectAddress () {
      this.$router.push('location')
    },
    // 打开datetime组件
    chooseDate () {
      this.$refs.datePicker.open()
    },
    chooseTime () {
      if (this.date === '') {
        MessageBox('提示', '请选择送达日期')
      } else {
        this.$refs.timePicker.open()
      }
    },
    // 获取日期
    handleDateConfirm (data) {
      this.date = this.getDate(data)
    },
    // 处理日期
    getDate (date) {
      var nowYear = date.getFullYear()
      var nowMonth = date.getMonth() + 1 // 注意getMonth从0开始，getDay()也是(此时0代表星期日)
      var nowDay = date.getDate()
      if (nowMonth >= 1 && nowMonth <= 9) {
        nowMonth = '0' + nowMonth
      }
      if (nowDay >= 0 && nowDay <= 9) {
        nowDay = '0' + nowDay
      }
      var str = nowYear + '年' + nowMonth + '月' + nowDay + '日'
      var expressDate = nowYear + '-' + nowMonth + '-' + nowDay
      sessionStorage.setItem('expressDate', JSON.stringify(expressDate))
      return str
    },
    // 处理当前地址
    handleAddress () {
      if (sessionStorage.getItem('addressInfo')) {
        let addressInfo = JSON.parse(sessionStorage.getItem('addressInfo'))
        this.address = addressInfo.currentAddress
        this.name = addressInfo.name
      }
    },
    // 处理当前的快递费用,
    handleMoney () {
      // 如果没有的话，我就不去变更，地址的UI
      if (this.$route.query.flag) {
        this.flag = this.$route.query.flag
        // 如果不是浙江区域的，运费就为30¥
        if (this.address.substring(0, 2) !== '浙江') {
          this.isInside = false
        }
      }
      // 表示当前不是第一次过来
      if (this.$route.query.isFirst === 1) {
        this.date = JSON.parse(sessionStorage.getItem('expressDate')) // 日期先取了
        this.flag = true
        // 如果不是浙江区域的，运费就为30¥
        if (this.address.substring(0, 2) !== '浙江') {
          this.isInside = false
        }
      }
    },
    // 保存当前门店自取的信息
    save () {
    // 对当前选中的门店进行判断，如果没有选择门店就提示
      if (!(this.address)) {
        MessageBox('提示', '您还未选择收货地址')
        return
      }
      if (this.current === '') {
        MessageBox('提示', '您还未选择配送方式')
        return
      }
      if (this.date === '') {
        MessageBox('提示', '您还未选择配送时间')
        return
      }
      if (this.address && this.current !== '') {
        // 清空self数据
        sessionStorage.removeItem('takeDate')
        sessionStorage.removeItem('takeSelect')
        // 判断之后返回上一层
        this.$router.push(
          {
            name: 'confirmorder',
            query: {
              ship: 'express',
              isInside: this.isInside
            }
          })
      }
    }
  }
}
</script>
<style lang="css" scoped>
.express-body {
    width: 100%;
    height: 100%;
    background-color: #F0F0F0;
}
.express-content {
    width: 100%;
    height: 60%;
    background-color: #FFFFFF;
    position: relative;
    top: 5%;
}
.currentAddress {
    display: inline-block;
    margin-left: 5%;
    line-height: 20px;
    font-size: 14px;
}
/* 当前地址选择的padding */
.address {
  padding-top: 1%;
}
.choose {
  font-size: 15px;
  color: #DEDEDE;
}
li {
    padding-left: 10%;
    line-height: 20px;
    font-size: 15px;
}
/* 门店选择与时间选择 */
.title {
    font-size: 16px;
    line-height: 20px;
    padding: 2% 5%;
}
/* 配送价格 */
.express-price {
    width: 100%;
}
/* 日期，时间的样式 */
.store-time > span {
    font-size: 14px;
    color: #BDBDBD;
    display: inline-block;
    width: 50%;
    margin-left:10%;
}
/* popup中的 */
.storeInfo {
    margin: 0% 5%;
}
/* 选中之后添加样式 */
.active {
    color: #63B8FF;
}
.popup {
    width: 80%;
    font-size: 14px;
    line-height: 40px;
}
.div-save {
    height: 6%;
    width: 100%;
    background-color: #F8F8FF;
    position: fixed;
    bottom: .2rem;
    line-height:35px;
    text-align: center;
}
.save {
    border: 1px solid #63B8FF;
    background-color: #63B8FF;
    color: #FFFFFF;
    display: inline-block;
    width: 96%;
    text-align: center;
    border-radius: 10px;
    letter-spacing: 20px;
    font-size: 16px;
}
</style>
