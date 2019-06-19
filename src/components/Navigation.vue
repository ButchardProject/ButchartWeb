<template>
    <div class="nav">
        <span class="category" v-on:click="option()">
          <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 20 20" fill="#707070" preserveAspectRatio="xMidYMid meet">
            <rect x="2" y="4" width="16" height="2"></rect>
            <rect x="2" y="9" width="16" height="2"></rect>
            <rect x="2" y="14" width="16" height="2"></rect>
          </svg>
        </span>
        <div v-show="isActive" class="layer-box" v-on:click="hidden($event)" v-bind:class="{active: isActive}">
          <div v-show="isActive" v-bind:class="{active: isActive}">
            <ul>
              <li v-for="(item,index) in content" v-bind:key="index" :class="{'item':current === index}" @click="select(item,index)">
                {{item}}
              </li>
            </ul>
          </div>
        </div>
        <span v-show="!flag">
          <img class="smallLogo" v-bind:src="logo" id="smallLogo"/>
        </span>
        <span class="title" v-show="flag">{{title}}</span>
        <span class="info">
          <img class="personal" v-bind:src="myself" @click="go()"/>
          <img class="car" v-bind:src="car"/>
          <span class="number" @click="to()">{{badge}}</span>
        </span>
    </div>
</template>

<script>
import config from '@/config'

export default {
  name: 'navigation',
  data () {
    return {
      logo: config.smallLoginLogo, // 小logo
      myself: config.myself, // 个人中心
      car: config.car, // 购物车
      content: this.$store.state.seriesName, // 系列内容
      isActive: false, // 是否需要渲染flag
      current: '', // 当前选中的li元素
      title: '', // 当前title显示信息
      flag: false, // 存储当前title信息
      selected: '2' // 传递到allorder的值
    }
  },
  // 在vue创建之前先获取
  created () {
    this.getSeries() // 获取系列信息
  },
  methods: {
    getSeries () {
      // 判断下当前state是否是空的，减少网络请求
      if (this.content.length === 0) {
        this.$store.dispatch('getProducts')
      }
    },
    // 显示当前花园系列
    option () {
      this.isActive = !this.isActive
      this.$store.dispatch('toggleSideabar')
    },
    // 隐藏遮罩
    hidden (e) {
      if (!e.target.classList.contains('isStatic active')) {
        this.isActive = false
        this.$store.dispatch('toggleSideabar')
      }
    },
    // 选择titie路由到相应的页面
    select (item, index) {
      this.$router.push({ name: 'common', query: { id: index } })
    },
    // 前往个人中心
    go () {
      console.log('store', this.$store.state.user.phone)
      console.log('local', sessionStorage.getItem('phone'))
      if (this.$store.state.user.phone === '' && sessionStorage.getItem('phone') === null) {
        this.$router.push('login')
      } else {
        this.$router.push('manager')
      }
    },
    // 前往购物未读
    to () {
      if (this.$store.state.user.phone === '' && sessionStorage.getItem('phone') === null) {
        this.$router.push('login')
      } else {
        this.$router.push({
          name: 'allorder',
          query: {
            selected: this.selected
          }
        })
      }
    }
  },
  computed: {
    badge: function () {
      if (this.$store.state.unread) {
        return this.$store.state.unread
      }
      if (sessionStorage.getItem('unread')) {
        return parseInt(sessionStorage.getItem('unread'))
      } else {
        return 0
      }
    }
  }
}
</script>

<style lang="css" scoped>
/* 导航栏 */
  .nav {
    width: 100%;
    background: #F5F5F5;
    position: fixed;
    top: 0;
    height: 1.8rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  /* svg的位置 */
  .category {
    display: inline-block;
    text-align: left;
    width: 45%;
    padding-left: 0.5rem;
  }
  /* 中间小logo */
  #smallLogo {
    display: inline-block;
    width: 1.8rem;
    height: 1.8rem;
    margin: 0 auto;
    padding-top: 0.1rem;
  }
  /* 花艺标题 */
  .title {
    font-size: 0.6rem;
    width: 100%;
    display: inline-block;
    text-align: center;
  }
  /* 个人信息和购物车 */
  .info {
    display: inline-block;
    width: 45%;
    text-align: right;
    padding:0 0.8rem;
  }
  /* 与svg大小保持一致 */
  .info > img {
    display: inline-block;
    height: 1rem;
    width: 1rem;
  }
  /* 购物车number */
  .number {
    background-color: #63B8FF;
    border-radius: 1.5rem;
    line-height: 14px;
    display: inline-block;
    width: 0.7rem;
    color: #FFFFFF;
    font-size: 0.3rem;
    text-align: center;
    position: absolute;
    right: 0.6rem;
  }
  /* 活跃的 */
  .active {
    width: 50%;
    background-color: #FFFFFF;
    font-size: 0.5rem;
    text-align: center;
    line-height: 50px;
  }
  li {
    border-bottom: 1px solid #F2F2F2;
  }
  /* 遮罩层 */
  .layer-box {
    position: fixed;
    width: 100%;
    height: 100%;
    right: 0;
    bottom: 0;
    left: 0;
    top: 1.8rem;
    background: rgba(0,0,0,.7);
    z-index:999;
    transition: all .2s;
  }
</style>
