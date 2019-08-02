module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  // 输出文件目录
  outputDir: 'dist',
  // eslint-loader 是否在保存的时候检查
  lintOnSave: process.env.NODE_ENV !== 'production',
  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
  assetsDir: 'static',
  // 指定生成index.html的路径，相对于（outputDir)。也可以是一个绝对路径
  indexPath: 'index.html',
  devServer: {
    port: 8080, // 端口号
    // host: 'www.thebutchart.cn',
    open: true, // 配置自动启动浏览器
    proxy: {
      '/api': { // 碰到/的就当作暗号接头
        target: 'https://www.thebutchart.cn', // 真实地址
        secure: false, // 如果是https接口，需设置secure为false
        changeOrigin: true, // 是否跨域
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  },
  // 生产环境是否生成 sourceMap 文件，一般情况不建议打开
  productionSourceMap: true
}
