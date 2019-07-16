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
