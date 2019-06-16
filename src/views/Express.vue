<template>
<div class="express-body">
    <div class="express-content">
        <div class="address">
          <span class="title">地址选择</span>
          <span v-if="flag" class="currentAddress" @click="selectAddress()">{{address}} {{tel}}</span>
          <span v-else class="choose" @click="selectAddress()">请选择</span>
        </div>
        <hr style="height:1px;border: none;border-top:1px solid #ddd;margin:15px 0;"/>
        <div class="express-title">
            <div class="title">配送选择</div>
            <ul>
                <li> > 顺丰</li>
            </ul>
        </div>
        <hr style="height:1px;border: none;border-top:1px solid #ddd;margin:15px 0;"/>
        <div class="express-price">
            <span class="title">运费计算:</span>
            <span class="title">{{money}}¥</span>
        </div>
        <hr style="height:1px;border: none;border-top:1px solid #ddd;margin:15px 0;"/>
        <div class="store-time">
        <div class="title">送达时间</div>
        <span @click="chooseDate()">日期 {{date}}</span>
        <mt-datetime-picker type="date" ref="datePicker" @confirm="handleDateConfirm"
            year-format="{value} 年" month-format="{value} 月" date-format="{value} 日">
            </mt-datetime-picker>
        <span @click="chooseTime()">时间 {{time}}</span>
        <mt-datetime-picker ref="timePicker" type="time" @confirm="handleTimeConfirm">
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
export default {
  name: 'express',
  data () {
    return {
      date: '', // 日期
      time: '', // 时间
      money: 20, // 当前运费
      flag: false, // 当前是否显示已选择
      address: '',
      tel: sessionStorage.getItem('currentTel')
    }
  },
  mounted () {
    this.handleMoney() // 处理当前费用
  },
  methods: {
    // 前往location选择地址
    selectAddress () {
      this.$router.push('location')
    },
    // 打开datetime组件
    chooseDate () {
      this.$refs.datePicker.open()
    },
    chooseTime () {
      this.$refs.timePicker.open()
    },
    // 获取日期
    handleDateConfirm (data) {
      this.date = this.getDate(data)
    },
    // 获取时间
    handleTimeConfirm (data) {
      this.time = data
    },
    // 处理日期
    getDate (date) {
      var nowYear = date.getFullYear()
      var nowMonth = date.getMonth() + 1 // 注意getMonth从0开始，getDay()也是(此时0代表星期日)
      var nowDay = date.getDate()
      var str = nowYear + '年' + nowMonth + '月' + nowDay + '日'
      var expressDate = nowYear + '-' + nowMonth + '-' + nowDay
      sessionStorage.setItem('expressMainDate', JSON.stringify(expressDate))
      return str
    },
    // 处理当前的快递费用,
    handleMoney () {
      // 如果没有的话，我就不去变更，地址的UI
      if (this.$route.query.flag) {
        this.flag = this.$route.query.flag
        this.address = sessionStorage.getItem('currentAddress')
        // 如果不是浙江区域的，运费就为30¥
        if (this.address.substring(0, 2) !== '浙江') {
          this.money = 30
        }
      }
      // 表示当前不是第一次过来
      if (this.$route.query.isFirst === 1) {
        this.date = JSON.parse(sessionStorage.getItem('expressDate')) // 日期先取了
        this.time = JSON.parse(sessionStorage.getItem('expressTime')) // 时间先取了
        this.flag = true
        this.address = sessionStorage.getItem('currentAddress')
        // 如果不是浙江区域的，运费就为30¥
        if (this.address.substring(0, 2) !== '浙江') {
          this.money = 30
        }
      }
    },
    // 保存当前门店自取的信息
    save () {
      // 对当前选中的门店进行判断，如果没有选择门店就提示
      if (!(this.address)) {
        MessageBox('提示', '您还未选择收货地址')
      }
      // 对当前自取时间进行判断
      if (!(this.date && this.time)) {
        MessageBox('提示', '您还未选择配送时间')
      }
      sessionStorage.setItem('expressDate', JSON.stringify(this.date))
      sessionStorage.setItem('expressTime', JSON.stringify(this.time))
      // 存下vuex中以及sessionStorage中

      // 清空self数据
      sessionStorage.removeItem('takeDate')
      sessionStorage.removeItem('takeTime')
      sessionStorage.removeItem('takeSelect')
      // 判断之后返回上一层
      this.$router.push(
        {
          name: 'confirmorder',
          query: {
            ship: 'express',
            money: this.money
          }
        })
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
    height: 50%;
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
    width: 40%;
    margin-left:10%;
}
/* popup中的 */
.storeInfo {
    margin: 0% 5%;
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
    bottom: 0;
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
