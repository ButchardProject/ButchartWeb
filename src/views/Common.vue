<!-- 系列公共页 -->
<template>
 <div>
  <Navigation/>
  <!-- 系列列表 -->
  <div class="product">
    <div class="product-item" v-for="(item,index) in num" :key="index" @click="select(index)">
      <img src="../assets/images/list01.png"/>
      <div class="desc">
        <div class="desc-name">{{name[index]}}</div>
        <p class="desc-desc">{{desc[index]}}</p>
        <div class="desc-price">¥{{price[index]}}</div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import Navigation from '@/components/Navigation.vue'
export default {
  name: 'common',
  components: {
    Navigation
  },
  data () {
    return {
      img: [], // 图片logo
      name: this.$store.state.product.productName, // 花名
      price: this.$store.state.product.productPrice, // 价格
      desc: this.$store.state.product.productDesc, // 花描述
      index: this.$route.query.id, // 当前第几个index
      productId: this.$store.state.product.productId, // 当前productId
      type: this.$store.state.product.productType // 当前productType
    }
  },
  // 在vue加载完之后在去请求
  mounted () {
    this.getProduct(this.index)
  },
  methods: {
    // 通过当前的选取的id来请求服务器，获取相应的系列
    getProduct (index) {
      this.$store.dispatch('getProductBySeries', index)
    },
    // 随便选个先路由过去
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
        'flowerName': (this.name)[index],
        'price': (this.price)[index],
        'desc': (this.desc)[index],
        'type': (this.type)[index]
      }
      sessionStorage.setItem('currentFlowerInfo', JSON.stringify(flowerInfo))
    }
  },
  computed: {
    // 获取num的数量，data里面获取不到？
    num: function () {
      return this.$store.state.product.productNum
    }
  },
  // 监听$route的路由信息，进行数据转换
  watch: {
    '$route': {
      handler (val) {
        this.index = val.query.id // 获取当前路由更新的id
        this.getProduct(this.index) // 重新获取当前数据
      }
    }
  }
}
</script>
<style lang="css" scoped>
/* div的宽度 */
.product{
  margin-top: 2.2rem;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  margin-left: 1%;
  margin-right: 1%;
}
.product-item{
  padding: 1% 1%;
  width: 44%;
  line-height: 20px;
  border-radius: 15px;
  border: 1px solid #F0F0F0;
  text-align: center;
  margin: 1% 1%;
}
.product-item img{
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
