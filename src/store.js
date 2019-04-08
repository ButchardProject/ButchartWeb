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
    // 用户地址
    location: {
      locationId: [], // 地址id
      locationAddress: [], // 用户地址
      locationTel: [], // 用户Tel，与登陆的phone一致，为了测试先保留
      locationNum: '' // 用户地址的数量
    }
  },
  getters: {
    getSeriesId: state => {
      return state.seriesId
    }
  },
  mutations: {
    // 存储用户的手机
    setUser (state, phone) {
      state.user.phone = phone
    },
    // 添加鲜花系列
    increment (state, data) {
      console.log(data._id)
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
    // 获取地址列表
    addAddress (state, data) {
      state.location.locationId.push(data._id)
      state.location.locationAddress.push(data.address)
      state.location.locationTel.push(data.tel)
    },
    // 获取地址列表的数量
    addAddressNum (state, num) {
      state.location.locationNum = num
    }
  },
  actions: {
    // 存储phone
    setUser (context, phone) {
      context.commit('setUser', phone)
    },
    // 异步请求花的信息
    getProducts (context) {
      axios.get(config.url + '/getProductSeries')
        .then((res) => {
          for (let data in res.data) {
            context.commit('increment', res.data[data])
          }
        })
    },
    // 通过id获取该系列产品的list
    getProductBySeries (context, index) {
      axios.get(config.url + '/seriesId/' + (context.state.seriesId)[index] + '/getProductsBySeries')
        .then((res) => {
          context.commit('addSeriesNum', res.data.length)
          for (let data in res.data) {
            context.commit('addProduct', res.data[data])
          }
        })
    },
    // 通过userid获取用户地址，这里请求的号码先写死，服务器未进行校验,context.state.user.phone
    getLocationLists (context, index) {
      axios.get(config.url + '/userId/18042507588/getAddress')
        .then((res) => {
          context.commit('addAddressNum', res.data.length)
          for (let data in res.data) {
            context.commit('addAddress', res.data[data])
          }
        })
    }
  }
})
