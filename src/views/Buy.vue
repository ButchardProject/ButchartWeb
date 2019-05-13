<!-- 购买页 -->
<template>
  <div>
    <!-- 导航栏 -->
    <Navigation/>
    <div :class="['div-swiper', opened ? 'div-swiper-open' : 'div-swiper-close']">
        <swiper :options="swiperOption" class="swiper">
      <!-- @someSwiperEvent="callback" -->
        <!-- slides -->
        <swiper-slide v-for="(item,index) in banner_list" v-bind:key="index">
          <img v-bind:src="item.img" class="img"/>
        </swiper-slide>
        <!-- Optional controls 原点，左右切换 -->
        <div class="swiper-pagination"  slot="pagination"></div>
        <div class="swiper-button-prev" slot="button-prev"></div>
        <div class="swiper-button-next" slot="button-next"></div>
      </swiper>
    </div>
    <!-- content -->
    <div class="content">
        <p class="price">
          <span>{{name}}</span>
          <span>¥{{price}}</span>
        </p>
        <p class="add-num">
          <span>请提前{{day}}天预订</span>
          <span>数量:
            <span class="calculator">
              <span class="add-remove left" v-on:click="remove()">-</span>
              <input id="number" v-model="value" disabled/>
              <span class="add-remove right" v-on:click="add()">+</span>
            </span>
          </span>
        </p>
        <p class="product">
          产品内容
          <span class="product-detail">DETAILED</span>
        </p>
        <hr>
        <div class="detail">
          {{detail}}
        </div>
    </div>
    <!-- 底部fixed foot -->
    <div :class="['foot', opened ? 'div-swiper-open' : 'div-swiper-close']" >
        <span class="join-car" @click="addCar()">加入购物车</span>
        <span class="buy" @click="buyNow()">立即购买</span>
    </div>
  </div>
</template>
<script>
import Navigation from '@/components/Navigation.vue'
import config from '@/config'
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
  name: 'buy',
  components: {
    Navigation,
    swiper,
    swiperSlide
  },
  data () {
    return {
      banner_list: config.imgList, // banner的图片集合
      price: sessionStorage.getItem('price'), // 花价
      name: sessionStorage.getItem('name'), // 花名
      day: 1, // 提前预定天数
      value: 1, // 当前添加的数量
      detail: sessionStorage.getItem('desc'), // 描述
      swiperOption: {
        centeredSlides: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      },
      badge:0, // 购物车数量
      carInfo: [],  // 购物车里面的信息
    }
  },
  methods: {
    // 添加当前花数量
    add () {
      this.value += 1
    },
    // 减少当前花数量
    remove () {
      if (this.value < 2) {
      } else {
        this.value -= 1
      }
    },
    // 立即购买
    buyNow () {
      if (sessionStorage.getItem('phone') === null) {
        this.$router.push('login')
      } else {
      // 把当前价格，花名，以及数量一起传递给确认订单页面
      this.$router.push(
        { 'name': 'confirmorder',
          query: {
            value: this.value
          }
        })
      }
    },
    // 加入购物车
    addCar () {
      // 先判断是否登录
      if (sessionStorage.getItem('phone') === null) {
        this.$router.push('login')
      } else {
        if (sessionStorage.getItem('unread')){
          this.badge = parseInt(sessionStorage.getItem('unread'))
          this.badge = this.badge + 1 
          // 收集当前购物车信息
          let info = {
            "seriesId": sessionStorage.getItem('seriesId'),
            "productId": sessionStorage.getItem('productId'),
            "value": this.value // 当前value的数量
          }
          // 判断当前本地db是否存在，如果存在直接拿出来用
          if (this.carInfo) {
            this.carInfo = JSON.parse(sessionStorage.getItem('carInfo'))
            // 将当前购物车的信息存到carInfo里面,用于存本地
            this.carInfo.push(info)
            this.$store.dispatch('getAddCar', info)
            this.$store.dispatch('getAddUnread', this.badge)
            sessionStorage.setItem('carInfo', JSON.stringify(this.carInfo)) // 保存当前购物车的信息到本地
            sessionStorage.setItem('unread', this.badge) // 保存当前未读数到本地
          }
        } else {
          this.badge = this.badge + 1
          // 收集当前购物车信息
          let info = {
            "seriesId": sessionStorage.getItem('seriesId'),
            "productId": sessionStorage.getItem('productId'),
            "value": this.value // 当前value的数量
          }
          // 将当前购物车的信息存到carInfo里面,用于存本地
          this.carInfo.push(info)
          this.$store.dispatch('getAddCar', info)
          this.$store.dispatch('getAddUnread', this.badge)
          sessionStorage.setItem('carInfo', JSON.stringify(this.carInfo)) // 保存当前购物车的信息到本地
          sessionStorage.setItem('unread', this.badge) // 保存当前未读数到本地
        }
      }
    }
  },
  computed: {
    // 观察当前是哪个list的元素路由过来
    index: function () {
      return this.$route.query.index
    },
    opened: function() {
      return this.$store.state.opened
    }
  }
}
</script>
<style lang="css" scoped>
.div-swiper {
  height: 50%;
  width: 100%;
  display: inline-block;
  margin-top: 2rem;
}
.img {
  width: 100%;
  height: 50%;
}
/* 价格一栏 */
.price{
  margin-top: 3%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  padding: 0 4%;
  font-size: 0.6rem;
  font-weight: bold;
}
/* 添加一栏 */
.add-num {
  margin-top: 3%;
  display: flex;
  justify-content: space-between;
  padding: 0 4%;
  vertical-align: bottom;
  font-size: 0.4rem;
}
/* 设置父元素来取消span和input之间的间隙，font-size子元素在重新设置 */
.calculator {
  font-size: 0;
  vertical-align: bottom;
}
/* 添加减少 */
.add-remove{
  display: inline-block;
  font-size: 0.5rem;
  background-color: #f2f2f2;
  width: 25px;
  height: 20px;
  line-height: 20px;
  text-align: center;
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
/* 产品一栏 */
.product {
  display: block;
  margin-top: 5%;
  padding-left: 4%;
  font-size: 0.7rem;
  font-weight: bold;
  text-align: left;
}
.product-detail {
  margin-left:2%;
  font-size: 0.4rem;
  font-weight: normal;
  padding-bottom: 35px;
}
/* 产品详细介绍 */
.detail{
  text-indent: 2em;
  margin-top: 2%;
  font-size: 0.4rem;
  letter-spacing: 2px;
  margin: 0 3%;
}
/* 页脚 */
.foot{
  width: 100%;
  position: fixed;
  bottom: 0;
  font-size: 0.5rem;
  line-height: 35px;
}
/* 加入购物车button */
.join-car {
  display: inline-block;
  background-color: #63B8FF;
  text-align: center;
  width: 50%;
  height: 100%;
}
/* 立即购买 */
.buy {
  display: inline-block;
  background-color: #6495ED;
  text-align: center;
  width: 50%;
  height: 100%;
}
</style>
