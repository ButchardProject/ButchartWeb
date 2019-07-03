// resourse
let config = {
  // login的logo
  loginLogo: require('../assets/logo/logo180.png'),
  smallLoginLogo: require('../assets/logo/logo60.png'),
  // 个人中心logo
  myself: require('../assets/logo/myself.png'),
  // 购物车logo
  car: require('../assets/logo/car.png'),
  // 上传图片logo
  add: require('../assets/logo/takePhoto.png'),
  // index的列表图片资源
  imgList: [{ img: require('../assets/images/list01.png') },
    { img: require('../assets/images/list01.png') },
    { img: require('../assets/images/list01.png') }]
}

let otherConfig = {
  // 请求的header
  url: 'https://47.102.96.102:4000/api/WorkspaceFacadeAPIs/workspace'
  // url: 'https://localhost:4000/api/WorkspaceFacadeAPIs/workspace'
}

config = Object.assign(config, otherConfig)

export default config
