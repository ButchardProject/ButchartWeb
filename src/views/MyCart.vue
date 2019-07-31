<template>
  <div>
    <Navigation/>
    <!-- 编辑页 -->
    <!-- 如果当前获取的list地址数组<0，说明用户没有地址，提示用户显示添加收货地址 -->
    <div v-if="num < 1" class="tip">
      {{tip}}
    </div>
    <div class="func" v-else>
      <span class="edit" @click="edit()">编辑</span>
      <span class="save" @click="save()">保存</span>
    </div>
    <div class="content" v-for="(item,index) in num" :key="index">
    <!-- <div class="content"> -->
        <!-- 选中checkbox -->
        <input :class="['checkbox', opened ? 'div-swiper-open' : 'div-swiper-close']" type="checkbox" @click="select(index)" v-model="checkList" :value="index">
        <img class="photo" src="../assets/images/list01.png"/>
        <div class="content-2">
          <div class="name">{{name[index]}}</div>
          <div class="div-cal">
            <span class="price">¥{{price[index]}}</span>
            <span class="calculator">
              <span class="add-remove left" v-on:click="remove(index)" :class="{type: isEdit}">-</span>
              <input id="number" v-model="quantity[index]" disabled/>
              <span class="add-remove right" v-on:click="add(index)" :class="{type: isEdit}">+</span>
            </span>
          </div>
        </div>
    </div>
    <!-- 底部fixed foot -->
    <div :class="['foot', opened ? 'div-swiper-open' : 'div-swiper-close']">
        <!-- 选中checkbox -->
        <div class="select" @click="allSelect()">
            <input class="checkbox" type="checkbox" v-model="checked">
            <span>全选</span>
        </div>
        <div class="total">
          <span>合计：</span>
          <span>¥{{total}}</span>
        </div>
        <span class="buy" @click="purchase()">结算</span>
    </div>
  </div>
</template>
<script>
import Navigation from '@/components/Navigation.vue'
import axios from 'axios'
import config from '@/config'
import { MessageBox } from 'mint-ui'
export default {
  name: 'mycart',
  components: {
    Navigation
  },
  data () {
    return {
      tip: '请先添加购物车', // 如果没有收货地址就提示用户
      quantity: [], // 当前购物车购买的数量，可修改
      name: [], // 购物车中的名称
      num: '', // 购物车中的数量
      price: [], // 购物车中产品的单价
      productId: [], // 购物车的产品id
      total: 0, // 当前总价
      checked: false, // 是否选中
      checkList: [], // 全选的框框
      isEdit: false, // 是否给编辑
      index: [], // 当前编辑的
      type: [] // 购物车中商品的type
    }
  },
  methods: {
    // 编辑当前购物车的信息
    edit () {
      this.isEdit = true
    },
    // 保存，请求服务器
    save () {
      if (this.isEdit) {
        let info = []
        for (let i = 0; i < this.num; i++) {
          let editInfo = {
            'productId': this.productId[i],
            'quantity': this.quantity[i],
            'price': this.price[i],
            'type': this.type[i]
          }
          info.push(editInfo)
        }
        let that = this
        axios.put(config.url + '/user/' + JSON.parse(sessionStorage.getItem('userInfo')).phone + '/updateShoppingList?access_token=' + sessionStorage.getItem('token'), info)
          .then(function (res) {
            console.log(res)
            if (res.status === 200) {
              that.num = res.data.length
              sessionStorage.setItem('unread', that.num)
              for (let index in res.data) {
                that.name.push(res.data[index].name)
                that.price.push(res.data[index].price)
                that.quantity.push(res.data[index].quantity)
                that.productId.push(res.data[index].productId)
              }
              that.isEdit = false // 先取消编辑
              that.getShoppingList() // 在重新获取服务器数据
            }
          })
          .catch(function (error) {
            console.log(error)
          })
      }
    },
    // 选择购物车的元素
    select (index) {
      // 先去查询下当前checkList里面是否有这个元素
      let checkbox = this.checkList.indexOf(index)
      // 元素不存在
      if (checkbox === -1) {
        this.checkList.push(index) // 先往数组里面推
        // 总价
        this.total = this.total + this.price[index] * this.quantity[index]
      } else {
        // 遍历数组存在的元素
        for (let i = 0; i <= this.checkList.length; i++) {
          // 如果当前数组中存在的元素不等于现在推进来的，就是直接剔除
          if (this.checkList[i] === index) {
            // 如果当前数组中的元素被剔除了，就直接总价去掉
            this.total = this.total - this.price[this.checkList[i]] * this.quantity[this.checkList[i]]
            // 直接从当前数组中剔除
            this.checkList.splice(i, 1)
          }
        }
      }
    },
    // 增加数量
    add (index) {
      if (this.isEdit) {
        // 如果用单独数组单个对象增加，是不会增加数据的更新，受限制，需要增加新属性
        this.$set(this.quantity, index, this.quantity[index] + 1)
      }
    },
    // 减少
    remove (index) {
      if (this.isEdit) {
        if (this.quantity[index] < 2) {
        } else {
          this.$set(this.quantity, index, this.quantity[index] - 1)
        }
      }
    },
    // 全选
    allSelect () {
      // 如果是非全选
      if (this.checked) {
        this.checkList = []
        this.total = 0
      } else { // 全选
        this.checkList = []
        for (let i = 0; i < this.num; i++) {
          this.checkList.push(i) // 全部加入到选中集合中
          this.total = this.total + this.price[i] * this.quantity[i] // 算总账
        }
      }
    },
    // 结算
    purchase () {
      // 判断下当前需要结算时候是否有商品
      if (this.checkList.length) {
        let cart = []
        let uncart = []
        for (let i = 0; i < this.checkList.length; i++) {
          // 筛选未被选中的，不跟选中后的那个元素与父元素比较，会导致重复比并添加到信息
          for (let j = i + 1; j < this.productId.length; j++) {
            if (this.productId[j] !== this.productId[this.checkList[i]]) {
              uncart.push({
                'productId': this.productId[j],
                'flowerName': this.name[j],
                'price': this.price[j],
                'flowerNum': this.quantity[j],
                'type': this.type[j]
              })
            }
          }
          // 保存当前购物车信息
          cart.push({
            'productId': this.productId[this.checkList[i]],
            'flowerName': this.name[this.checkList[i]],
            'price': this.price[this.checkList[i]],
            'flowerNum': this.quantity[this.checkList[i]],
            'type': this.type[this.checkList[i]]
          })
        }
        // 将当前选中购物车的数据提交到确认订单页
        sessionStorage.setItem('cart', JSON.stringify(cart))
        this.$router.push('/confirmorder')
        let that = this
        // 将当前未选中的数据更新到服务器
        axios.put(config.url + '/user/' + JSON.parse(sessionStorage.getItem('userInfo')).phone + '/updateShoppingList?access_token=' + sessionStorage.getItem('token'), uncart)
          .then(function (res) {
            if (res.status === 200) {
              that.num = res.data.length
              sessionStorage.setItem('unread', that.num)
              for (let index in res.data) {
                that.name.push(res.data[index].name)
                that.price.push(res.data[index].price)
                that.quantity.push(res.data[index].quantity)
                that.productId.push(res.data[index].productId)
                that.type.push(res.data[index].type)
              }
            }
          })
          .catch(function (error) {
            console.log(error)
          })
      } else {
        MessageBox('提示', '请选择结算商品')
      }
    },
    // 从服务器获取购物车数据
    getShoppingList () {
      let that = this
      axios.get(config.url + '/user/' + JSON.parse(sessionStorage.getItem('userInfo')).phone + '/getShoppingList?access_token=' + sessionStorage.getItem('token'))
        .then(function (res) {
          if (res.status === 200) {
            that.num = res.data.length
            sessionStorage.setItem('unread', that.num)
            for (let index in res.data) {
              that.name.push(res.data[index].name)
              that.price.push(res.data[index].price)
              that.quantity.push(res.data[index].quantity)
              that.productId.push(res.data[index].productId)
              that.type.push(res.data[index].type)
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  },
  created () {
    this.getShoppingList() // 获取购物车中的数据
  },
  computed: {
    // 控制层级
    opened: function () {
      return this.$store.state.opened
    }
  },
  // 观察当前这个选中集合
  watch: {
    'checkList': function () {
      // 如果当前选中的集合是all的话，直接设置全选为true
      if (this.checkList.length === this.num) {
        this.checked = true
      } else {
        this.checked = false
      }
    }
  }
}
</script>

<style lang="css" scoped>
/* 如何当前addresslist没有元素就显示tip */
.tip {
  font-size: 0.8rem;
  position:absolute;
  left:50%;
  top:50%;
  /* 设置元素的相对于自身的偏移度为负50% */
  transform:translate(-50%,-50%);
}
.func {
  margin: 0 auto;
  margin-top: 2.0rem;
  width: 85%;
  margin-bottom: .2rem;
  font-size: 0.8rem;
}
/* 编辑按钮 */
.edit {
  display: inline-block;
  width: 45%;
  padding-left: 0.5rem;
}
/* 保存按钮 */
.save {
  display: inline-block;
  width: 45%;
  text-align: right;
}
/* 下属内容的div */
.content {
  width: 85%;
  margin: 0 auto;
  background-color: #FFFFFF;
  border-radius: 15px;
  padding: 2% 5%;
  border: 1px solid #63B8FF;
  display: flex;
  flex: 1;
  align-items: center;
  margin-bottom: .2rem;
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
/* 两边的补白距离 */
.content-2 {
  padding-left: .3rem;
}
/* 购买的图片 */
.photo {
  display: inline-block;
  /* 图片自适应 */
  width: 4rem;
  height: 3rem;
  padding-left: .2rem;
}
/* 花的名称 */
.name {
  font-size: 0.6rem;
  display: inline-block;
  word-wrap: break-word;
  vertical-align: top;
  align-items: flex-start;
  height: 2rem;
}
/* 价格与数量计算模块 */
.div-cal {
  vertical-align: bottom;
  height: 1rem;
}
.price {
  font-size: 0.6rem;
  color: #63B8FF;
  padding-right: 3rem;
}
/* 设置父元素来取消span和input之间的间隙，font-size子元素在重新设置 */
.calculator {
  font-size: 0;
  vertical-align: bottom;
  align-items: flex-end;
}
/* 添加减少 */
.add-remove{
  display: inline-block;
  font-size: 0.5rem;
  background-color: #FFFAFA;
  width: 25px;
  height: 20px;
  line-height: 20px;
  text-align: center;
}
/* 可编辑的样式 */
.type {
  background-color: #F0F0F0;
}
/* 选择当前的value */
#number{
  font-size: 0.5rem;
  width: 30px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  box-sizing: border-box;
}
/* 页脚 */
.foot{
  width: 100%;
  position: fixed;
  bottom: 0;
  font-size: 0.5rem;
  line-height: 2rem;
  background-color: #F0F0F0;
}
/* 全选 */
.select {
  display: inline-block;
  text-align: center;
  width: 20%;
  height: 100%;
}
.select > span {
  margin-left: .2rem;
}
/* 总价 */
.total {
  display: inline-block;
  width: 50%;
  text-align: center;
  line-height: 2rem;
}
/* 立即购买 */
.buy {
  display: inline-block;
  width: 30%;
  background-color: #63B8FF;
  color: #ffffff;
  text-align: center;
}
</style>
