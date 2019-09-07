<!-- 系列公共页 -->
<template>
 <div>
  <Navigation/>
  <!-- 听花 -->
  <div class="content">
    <div class="tinghua">
      <div class="title" v-show="thProductId.length < 1 ? false : true">听花系列</div>
      <div class="product">
        <div class="product-item" v-for="(thItem,thIndex) in thProductName.length" :key="thIndex" @click="thSelect(thIndex)">
          <img :src="thProductImg[thIndex]">
          <div class="desc">
            <div class="desc-name">{{thProductName[thIndex]}}</div>
            <p class="desc-desc">{{thProductDesc[thIndex]}}</p>
            <div class="desc-price">¥{{thProductPrice[thIndex]}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="notinghua">
      <div class="title">非听花系列</div>
      <!-- 花束 -->
      <div class="product">
        <div class="product-item" v-for="(item,index) in productName.length" :key="index" @click="select(index)">
          <img :src="productImg[index]"/>
          <div class="desc">
            <div class="desc-name">{{productName[index]}}</div>
            <p class="desc-desc">{{productDesc[index]}}</p>
            <div class="desc-price">¥{{productPrice[index]}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import Navigation from '@/components/Navigation.vue'
import axios from 'axios'
import config from '@/config'
export default {
  name: 'common',
  components: {
    Navigation
  },
  data () {
    return {
      // 花束系列产品信息
      productId: [], // 系列产品的id
      productName: [], // 系列产品的名称
      productPrice: [], // 系列产品的价格
      productDesc: [], // 系列产品的描述
      productType: [], // 系列产品的类型
      productImg: [], // 系列产品的图片
      img: [], // 花束图片
      // 听花系列产品信息
      thProductId: [], // 系列产品的id
      thProductName: [], // 系列产品的名称
      thProductPrice: [], // 系列产品的价格
      thProductDesc: [], // 系列产品的描述
      thProductType: [], // 系列产品的类型
      thProductImg: [], // 系列产品的类型
      thImg: [], // 听花图片
      id: this.$route.query.id // 当前第几个index
    }
  },
  // 在vue加载完之后在去请求
  created () {
    this.getProduct(this.id)
  },
  methods: {
    // 通过当前的选取的id来请求服务器，获取相应的系列
    getProduct (id) {
      let self = this
      let seriesId = JSON.parse(sessionStorage.getItem('seriesId'))
      axios.get(config.url + '/seriesId/' + seriesId[id] + '/getProductsBySeries')
        .then((res) => {
          for (let i in res.data) {
            console.log(res.data[i].pics)
            if (res.data[i].type === '听花') {
              // 听花
              self.thProductId.push(res.data[i]._id)
              self.thProductName.push(res.data[i].name)
              self.thProductPrice.push(res.data[i].price)
              self.thProductDesc.push(res.data[i].description)
              self.thProductType.push(res.data[i].type)
              self.thProductImg.push(res.data[i].pics[0])
              self.thImg.push(res.data[i].pics)
            } else {
              // 非听花
              self.productImg.push(res.data[i].pics[0])
              self.productId.push(res.data[i]._id)
              self.productName.push(res.data[i].name)
              self.productPrice.push(res.data[i].price)
              self.productDesc.push(res.data[i].description)
              self.productType.push(res.data[i].type)
              self.img.push(res.data[i].pics)
            }
          }
        })
    },
    // 随便选个先路由过去，非听花
    select (index) {
      // 路由携带当前序号
      this.$router.push(
        {
          name: 'buy',
          query: {
            index: index
          }
        })
      let flowerInfo = {
        'productId': (this.productId)[index],
        'flowerName': (this.productName)[index],
        'price': (this.productPrice)[index],
        'desc': (this.productDesc)[index],
        'type': (this.productType)[index],
        'img': (this.img)[index],
        'flag': 1 // 标志位，用于提示1还是3
      }
      sessionStorage.setItem('currentFlowerInfo', JSON.stringify(flowerInfo))
    },
    // 选择听花
    thSelect (thIndex) {
      // 路由携带当前序号
      this.$router.push(
        {
          name: 'buy',
          query: {
            index: thIndex
          }
        })
      let flowerInfo = {
        'productId': (this.thProductId)[thIndex],
        'flowerName': (this.thProductName)[thIndex],
        'price': (this.thProductPrice)[thIndex],
        'desc': (this.thProductDesc)[thIndex],
        'type': (this.thProductType)[thIndex],
        'img': (this.thImg)[thIndex],
        'flag': 2 // 标志位，用于提示1还是3
      }
      sessionStorage.setItem('currentFlowerInfo', JSON.stringify(flowerInfo))
    }
  },
  // 监听$route的路由信息，进行数据转换
  watch: {
    '$route': {
      handler (val) {
        // 如果不是同一个id就不去请求了
        if (this.id !== val.query.id) {
          // 先去清空一把当前老的数组
          // 非听花
          this.productId = []
          this.productName = []
          this.productPrice = []
          this.productType = []
          this.productDesc = []
          // 听花
          this.thProductId = []
          this.thProductName = []
          this.thProductPrice = []
          this.thProductType = []
          this.thProductDesc = []
          this.id = val.query.id // 获取当前路由更新的id
          this.getProduct(this.id) // 重新获取当前数据
        }
      }
    }
  }
}
</script>
<style lang="css" scoped>
.content {
  margin-top: 2.2rem;
}
/* 图片 */
img {
  display: inline-block;
  width: 4rem;
  height: 6rem;
}
/* div的宽度 */
.product {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  margin-left: 1%;
  margin-right: 1%;
}
.product-item {
  padding: 1% 1%;
  width: 44%;
  line-height: 20px;
  border-radius: 15px;
  border: 1px solid #F0F0F0;
  text-align: center;
  margin: 1% 1%;
}
/* 标题 */
.title {
  text-align: center;
  font-size: .8rem;
}
.product-item img {
  width: 100%;
}
.desc {
  font-size: 0.6rem;
}
.desc-desc {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #CFCFCF;
  font-size: 0.5rem;
}
.desc-price {
  color: #FFFFFF;
  width: 5rem;
  background: #63B8FF;
  margin: 0 auto;
  text-align: center;
  border-radius: 15px;
}
</style>
