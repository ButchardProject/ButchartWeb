// resourse
let config = {
  // login的logo
  loginLogo: require('../assets/logo/logo180.png'),
  smallLoginLogo: require('../assets/logo/logo60.png'),
  // 个人中心logo
  myself: require('../assets/logo/myself.png'),
  default_icon: require('../assets/logo/default_icon.png'),
  // 购物车logo
  car: require('../assets/logo/car.png'),
  // 上传图片logo
  add: require('../assets/logo/takePhoto.png')
}

let otherConfig = {
  // 请求的header
  url: 'https://www.thebutchart.cn/api/WorkspaceFacadeAPIs/workspace',
  manager: 'https://www.thebutchart.cn/api/ManagerFacadeAPIs/manager'
}

config = Object.assign(config, otherConfig)

export default config
