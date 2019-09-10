<template>
<div class="takeself-body">
    <div class="takeself-content">
      <div class="store-lists">
        <div class="title">门店选择</div>
        <ul>
            <li v-for="(item,index) in num" v-bind:key="index" @click="select(index)" :class="[current === index ? 'active' : '']">
                > {{storeName[index]}}
            </li>
            <mt-popup v-model="visible" popup-transition="popup-fade" class="popup">
                <div class="storeInfo">
                    <div>
                      <span class="titleInfo">店铺名称: </span>
                      <span class="info">{{storeName[flag]}}</span>
                    </div>
                    <div>
                      <span class="titleInfo">店铺地址: </span>
                      <span class="info">{{storeProvince[flag]+storeCity[flag]+storeDistrict[flag]+storeStreet[flag]}}</span>
                    </div>
                    <div>
                      <span class="titleInfo">店铺电话: </span>
                      <span class="info">{{storeTel[flag]}}</span>
                    </div>
                    <div>
                      <span class="titleInfo">营业状态: </span>
                      <span class="info">{{storeStatus[flag]}}</span>
                    </div>
                    <div>
                        <span class="confirm" @click="confirm()">确认</span>
                    </div>
                </div>
            </mt-popup>
        </ul>
      </div>
      <hr/>
      <div class="store-time">
        <div class="title">时间选择</div>
        <span @click="chooseDate()">日期 {{date}}</span>
        <mt-datetime-picker type="date" ref="datePicker" @confirm="handleDateConfirm"
            year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" :startDate="startDate" :endDate="endDate">
            </mt-datetime-picker>
        <span @click="chooseTime()">时间 {{time}}</span>
        <mt-datetime-picker ref="timePicker" type="time" @confirm="handleTimeConfirm" :startHour="startHour" :endHour="endHour">
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
  name: 'takeself',
  data () {
    return {
      date: '', // 日期
      time: '', // 时间
      storeName: this.$store.state.storeLists.storeName, // 店铺名称
      storeProvince: this.$store.state.storeLists.storeProvince, // 店铺省份
      storeCity: this.$store.state.storeLists.storeCity, // 店铺城市
      storeDistrict: this.$store.state.storeLists.storeDistrict, // 店铺区域
      storeStreet: this.$store.state.storeLists.storeStreet, // 店铺街道
      storeTel: this.$store.state.storeLists.storeTel, // 店铺号码
      storeStatus: this.$store.state.storeLists.storeStatus, // 店铺状态
      storeId: this.$store.state.storeLists.storeId, // 店铺id
      visible: false, // popup的显示
      flag: '', // 中转index
      current: '', // 当前选中的门店
      startDate: '', // 当前日期
      endDate: new Date(Date.parse(new Date()) + 1000 * 60 * 60 * 24 * 30), // 一个月后结束日期
      startHour: 9, // 早9
      endHour: 18 // 晚6
    }
  },
  methods: {
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
    // 获取时间
    handleTimeConfirm (data) {
      this.time = data
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
      var takeDate = nowYear + '-' + nowMonth + '-' + nowDay
      sessionStorage.setItem('takeMainDate', JSON.stringify(takeDate))
      return str
    },
    // 点击出现popup
    select (index) {
      this.visible = true // popup显示
      this.flag = index // 把当前index传递给flag
    },
    // 确认当前门店
    confirm () {
      this.visible = false // 先把popup关掉
      this.current = this.flag // 确认了当前哪个门店
      sessionStorage.setItem('takeSelect', JSON.stringify(this.flag))
    },
    // 保存当前门店自取的信息
    save () {
      // 对当前选中的门店进行判断，如果没有选择门店就提示
      if (!this.current && this.current !== 0) {
        MessageBox('提示', '您还未选择门店地址')
      }
      // 对当前自取时间进行判断
      if (!(this.date && this.time)) {
        MessageBox('提示', '您还未选择自取时间')
      }
      if (this.date && this.time && this.current || this.current === 0) {
        // 把当前选择的信息封装起来，并保存
        let storeInfo = {
          'storeId': this.storeId[this.current],
          'storeName': this.storeName[this.current],
          'dateTime': this.date + '' + this.time
        }
        // 存下vuex中以及sessionStorage中
        this.$store.dispatch('saveStore', JSON.stringify(storeInfo))
        sessionStorage.setItem('storeInfo', JSON.stringify(storeInfo))
        sessionStorage.setItem('takeDate', JSON.stringify(this.date))
        sessionStorage.setItem('takeTime', JSON.stringify(this.time))
        // 清空express数据
        sessionStorage.removeItem('expressDate')
        this.$router.push(
          {
            name: 'confirmorder',
            query: {
              ship: 'takeself'
            }
          })
      }
    },
    // 如果是听花的话，时间选3天后
    setTime () {
      if (JSON.parse(sessionStorage.getItem('type'))) {
        let type = JSON.parse(sessionStorage.getItem('type'))
        if (type === '听花') {
          this.startDate = new Date(Date.parse(new Date()) + 1000 * 60 * 60 * 24 * 3)
        } else {
          this.startDate = new Date()
        }
      }
    }
  },
  // vue加载完之后开始获取地址
  mounted () {
    this.$store.dispatch('getStoreLists')
    // 表示当前不是第一次过来
    if (this.$route.query.isFirst === 1) {
      this.date = JSON.parse(sessionStorage.getItem('takeDate')) // 日期先取了
      this.time = JSON.parse(sessionStorage.getItem('takeTime')) // 时间先取了
      this.current = JSON.parse(sessionStorage.getItem('takeSelect'))
    } else {
      sessionStorage.removeItem('takeSelect')
      this.current = ''
    }
  },
  // 计算当前店铺数量
  computed: {
    num: function () {
      return this.$store.state.storeLists.storeNum
    }
  },
  created () {
    this.setTime()
  }
}
</script>
<style lang="css" scoped>
/* 整个body */
.takeself-body {
    width: 100%;
    height: 100%;
    background-color: #F0F0F0;
}
/* 内部content */
.takeself-content {
    width: 100%;
    height: 50%;
    background-color: #FFFFFF;
    position: relative;
    top: 5%;
}
li {
    padding-left: 10%;
    line-height: 20px;
    font-size: 15px;
}
/* 门店选择与时间选择 */
.title {
    font-size: 16px;
    line-height: 30px;
    padding: 2% 5%;
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
.info {
  color: #CDC9C9;
}
.popup {
    width: 80%;
    font-size: 14px;
    line-height: 40px;
}
/* 确认按钮 */
.confirm {
    background: #63B8FF;
    display: inline-block;
    width: 100%;
    line-height: 20px;
    text-align: center;
    border-radius: 15px;
}
/* 选中之后添加样式 */
.active {
    color: #63B8FF;
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
