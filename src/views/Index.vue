<!-- 主页 -->
<template>
  <div>
    <!-- 导航栏 -->
    <Navigation/>
    <!-- 资源图片 -->
    <div class="list">
      <ul>
        <li v-for="(item,index) in imgList" v-bind:key="index" class="li-imglist">
          <img v-bind:src="item.img"/>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import config from '@/config'
import Navigation from '@/components/Navigation.vue'

export default {
  name: 'index',
  components: {
    Navigation // 导航栏组件
  },
  data () {
    return {
      imgList: config.imgList // banner图片
    }
  }
}
</script>

<style lang="css" scoped>
  /* 图片的div  */
  .list {
    margin-top: 2.2rem;
    width: 100%;
  }
  .li-imglist > img {
    display: inline-block;
    width: 100%;
    padding-bottom: 5%;
    height: 12rem;
    list-style-type: none;
  }
</style>
