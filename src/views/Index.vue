<!-- 主页 -->
<template>
  <div>
    <!-- 导航栏 -->
    <Navigation/>
    <!-- 资源图片 -->
    <div class="list">
      <ul>
        <li v-for="(item,index) in imgList" v-bind:key="index" class="li-imglist">
          <img v-bind:src="item" @click="getImageInfo(index)"/>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import config from '@/config'
import Navigation from '@/components/Navigation.vue'
import axios from 'axios'
export default {
  name: 'index',
  components: {
    Navigation // 导航栏组件
  },
  data () {
    return {
      imgList: [], // banner图片
      imgId: [], // banner图片id
      code: '' // 验证之后code
    }
  },
  methods: {
    // 获取微信支付code
    getCode (name) {
      return decodeURIComponent(
        (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ''])[1].replace(/\+/g, '%20')) || null
    },
    getHomePics () {
      let self = this
      // 获取首页图片
      axios.get('https://www.thebutchart.cn/api/WorkspaceFacadeAPIs/getHomePagePics')
        .then(function (res) {
          for (let i in res.data) {
            self.imgId.push(i)
            self.imgList.push(res.data[i])
          }
        }).catch(function (error) {
          console.log(error)
        })
    },
    // 点击跳转到common页，获取信息
    getImageInfo (index) {
      this.$router.push({ name: 'common', query: { id: index } })
    }
  },
  created () {
    this.getHomePics()
    if (JSON.parse(sessionStorage.getItem('userInfo'))) {
      this.code = this.getCode('code')
      // 验证登陆
      axios.put(config.url + '/user/' + JSON.parse(sessionStorage.getItem('userInfo')).phone +
       '/getOpenIdByCode?code=' + this.code + '&access_token=' + sessionStorage.getItem('token'))
        .then(function (res) {
          console.log(res)
        }).catch(function (error) {
          console.log(error)
        })
      sessionStorage.setItem('code', this.code)
    }
  }
}
</script>

<style lang="css" scoped>
/* 图片的div  */
.list {
  margin-top: 2.4rem;
  width: 100%;
}
.li-imglist > img {
  display: inline-block;
  width: 100%;
  padding-bottom: 5%;
  height: 12rem;
  list-style-type: none;
  object-fit: cover;
}
li {
  background-color: #F0F0F0
}
</style>
