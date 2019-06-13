import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import config from '@/config'

Vue.use(Vuex)
/*
1、series开头都是系列
2、product开头都是系列下的产品信息
*/
export default new Vuex.Store({
  state: {
    token: '', // 登陆之后保存鉴权token，后续都会用到
    user: {
      _id: '', // 用户id
      phone: '' // 用户手机号
      // code: '' // 用户验证码
    },
    seriesId: [], // 鲜花系列的id
    seriesName: [], // 鲜花系列的主题内容
    // 系列产品信息
    product: {
      productId: [], // 系列产品的id
      productName: [], // 系列产品的名称
      productPrice: [], // 系列产品的价格
      productDesc: [], // 系列产品的描述
      productNum: '' // 系列产品的数量
    },
    opened: false, // nav默认关闭
    // 店铺
    storeLists: {
      storeNum: '', // 店铺数量
      storeId: [], // 店铺id
      storeName: [], // 店铺名字
      storeTel: [], // 店铺电话
      storeProvince: [], // 店铺省份
      storeCity: [], // 店铺城市
      storeDistrict: [], // 店铺区域
      storeStreet: [], // 店铺地址
      storeStatus: [] // 店铺状态
    },
    // 门店自取
    takeSelf: {
      storeName: '', // 店铺名称
      dateTime: '' // 自取时间
    },
    // 购物车信息
    unReadInfo: {
      seriesId: [], // 购物车的系列id
      productId: [], // 购物车的产品id
      value: [] // 当前系列产品的数量
    },
    // 未读
    unread: '', // 购物车未读
    // 所有订单信息
    carOrder: {
      price: []
    }
  },
  getters: {
    getSeriesId: state => {
      return state.seriesId
    }
  },
  mutations: {
    // nav是否开启关闭
    toggleSideabar (state, data) {
      state.opened = !state.opened
    },
    // 存储用户的手机
    setUser (state, phone) {
      state.user.phone = phone
      console.log(phone)
      console.log(state.user.phone)
    },
    saveToken (state, token) {
      state.token = token
      console.log(token)
    },
    // 添加鲜花系列
    increment (state, data) {
      // console.log(data._id)
      state.seriesId.push(data._id)
      state.seriesName.push(data.name)
    },
    // 添加系列产品的各项信息
    addProduct (state, data) {
      state.product.productId.push(data._id)
      state.product.productName.push(data.name)
      state.product.productDesc.push(data.description)
      state.product.productPrice.push(data.price)
    },
    // 获取系列产品的数量
    addSeriesNum (state, num) {
      state.product.productNum = num
    },
    // 获取店铺列表
    addStoreLists (state, data) {
      state.storeLists.storeId.push(data._id)
      state.storeLists.storeName.push(data.name)
      state.storeLists.storeTel.push(data.tel)
      state.storeLists.storeProvince.push(data.province)
      state.storeLists.storeCity.push(data.city)
      state.storeLists.storeDistrict.push(data.district)
      state.storeLists.storeStreet.push(data.street)
      state.storeLists.storeStatus.push(data.status)
    },
    // 获取店铺的数量
    addStoreListsNum (state, num) {
      state.storeLists.storeNum = num
    },
    // 添加门店自取的信息
    addStore (state, data) {
      state.takeSelf.storeName = data.storeName
      state.takeSelf.dateTime = data.dateTime
    },
    // 添加购物车
    addCar (state, data) {
      state.unReadInfo.seriesId.push(data.seriesId)
      state.unReadInfo.productId.push(data.productId)
      state.unReadInfo.value.push(data.value)
    },
    // 添加购物车未读数
    addUnread (state, data) {
      state.unread = data
    },
    // 添加当前未付款的价格
    addCarOrder (state, data) {
      state.carOrder.price.push(data)
      sessionStorage.setItem('priceArray', state.carOrder.price)
    }
  },
  actions: {
    // 修改当前的nav状态
    toggleSideabar (context, data) {
      context.commit('toggleSideabar', data)
    },
    // 存储phone
    setUser (context, phone) {
      context.commit('setUser', phone)
    },
    // 存储token
    saveToken (context, token) {
      context.commit('saveToken', token)
    },
    // 异步请求花的信息
    getProducts (context) {
      axios.get(config.url + '/getProductSeries?access_token=' + sessionStorage.getItem('token'))
        .then((res) => {
          console.log(res)
          for (let data in res.data) {
            context.commit('increment', res.data[data])
          }
        })
    },
    // 通过id获取该系列产品的list
    getProductBySeries (context, index) {
      // 先判断当前是否有id，如果没有id，则从sessionStorage去获取
      if (context.state.seriesId.length < 1) {
        var sidArray = sessionStorage.getItem('seriesId')
        axios.get(config.url + '/seriesId/' + sidArray + '/getProductsBySeries?access_token=' + sessionStorage.getItem('token'))
          .then((res) => {
            context.commit('addSeriesNum', res.data.length)
            for (let data in res.data) {
              context.commit('addProduct', res.data[data])
            }
          })
      } else {
        // 有当前的seriesId，直接去服务器请求
        sessionStorage.setItem('seriesId', (context.state.seriesId)[index])
        axios.get(config.url + '/seriesId/' + (context.state.seriesId)[index] + '/getProductsBySeries?access_token=' + sessionStorage.getItem('token'))
          .then((res) => {
            context.commit('addSeriesNum', res.data.length)
            for (let data in res.data) {
              context.commit('addProduct', res.data[data])
            }
          })
      }
    },
    // 通过userid获取店铺地址
    getStoreLists (context) {
      axios.get(config.url + '/getStoreList?access_token=' + sessionStorage.getItem('token'))
        .then((res) => {
          console.log(res)
          context.commit('addStoreListsNum', res.data.length)
          for (let data in res.data) {
            context.commit('addStoreLists', res.data[data])
          }
        })
    },
    // 保存当前门店自取的店铺信息及时间
    saveStore (context, data) {
      context.commit('addStore', JSON.parse(data))
    },
    // 添加当前购物车的内容
    getAddCar (context, data) {
      context.commit('addCar', data)
    },
    // 添加购物车数量
    getAddUnread (context, data) {
      context.commit('addUnread', data)
    },
    // 购物车请求服务器获取数据
    getCarOrder (context, data) {
      let id = data.productId // 防止在axios无法获取到当前productid
      axios.get(config.url + '/seriesId/' + data.seriesId + '/getProductsBySeries?access_token=' + sessionStorage.getItem('token'))
        .then((res) => {
          for (let data in res.data) {
            if (res.data[data]._id === id) {
              console.log(res.data[data].price)
              context.commit('addCarOrder', res.data[data].price)
            }
          }
        })
    }
  }
})
