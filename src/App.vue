<template>
  <div id="app">
      <router-view/>
  </div>
</template>
<script>
export default {
  name: 'app',
  mounted () {
    /** 初始化，规定字体rem
     *  计算方法：尺寸/40
     *  单位：rem
     */
    (function (doc, win) {
      var docEl = doc.documentElement
      var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'
      var recalc = function () {
        var clientWidth = Math.max(docEl.clientWidth, window.innerWidth || 0)
        if (!clientWidth) return
        if (clientWidth > 640) { clientWidth = 640 }
        docEl.style.fontSize = 40 * (clientWidth / 640) + 'px'
      }
      win.addEventListener(resizeEvt, recalc, false)
      doc.addEventListener('DOMContentLoaded', recalc, false)
    })(document, window)
  },
  watch: {
    // '$router': beforeEach((to, from, next) => { //to:即将前往的页面,from:从哪个页面来,next:下一步操作
    //   console.log(to.meta.requireAuth)
    //   console.log(sessionStorage.getItem('userInfo'))
    //   if (to.meta.requireAuth) {
    //     //判断该路由是否需要登录权限
    //     if (sessionStorage.getItem('userInfo')) {
    //         //通过封装好的cookies读取token，如果存在，name接下一步如果不存在，那跳转回登录页
    //         next()//不要在next里面加"path:/",会陷入死循环
    //     }
    //     else {
    //         next({
    //             path: '/login',
    //             query: {redirect: to.fullPath}//将跳转的路由path作为参数，登录成功后跳转到该路由
    //         })
    //     }
    // }
    // else {
    //     next()
    // }
    // })
  }
}
</script>

<style lang="css">
@import '../src/assets/css/reset.css';
@import '../src/assets/css/common.css';
html,body, #app {
  height: 100%;
  width: 100%;
}
</style>
