<template>
  <div>
    <div class="content" v-for="(item,index) in payed" :key="index">
      <div class="div-text">
        <!-- 选中checkbox -->
        <input class="checkbox" type="checkbox">
        <span class="text">买家已付款</span>
      </div>
      <div class="div-content">
        <img class="photo" :src="img[index]"/>
        <span class="name">【{{name[index]}}】</span>
        <span class="price">¥{{price[index]}}</span>
        <span class="number">x{{quantity[index]}}</span>
      </div>
      <div class="div-sum">
        共<span>x{{quantity[index]}}</span>件商品&nbsp;&nbsp;
        共计:¥<span>{{price[index] * quantity[index]}}</span>
      </div>
    </div>
    <div>
      <ul class="pagination" >
            <li v-show="current != 1" @click="current-- && goto(current)" ><a href="#">上一页</a></li>
            <li v-for="index in pages" @click="goto(index)" :class="{'active':current == index}" :key="index">
              <a href="#" >{{index}}</a>
            </li>
            <li v-show="allpage != current && allpage != 0 " @click="current++ && goto(current++)"><a href="#" >下一页</a></li>
        </ul>
    </div>
  </div>
</template>
<script>
import config from '@/config'
import axios from 'axios'
import { MessageBox, Indicator } from 'mint-ui'
export default {
  name: 'waitdelivery',
  props: {
    payed: {
      type: Array,
    },
    payedSum: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      current: 1, // 当前页
      showItem: 5, // 显示当前几个项目
      allpage: 0, // 分页总数
      img: [], // 花的图片
      name: [], // 花名
      totalPrice: [], // 价格
      quantity: [], // 购买的数量
      price: [], // 花的单价
      transactionsID: [] // 订单ID
    }
  },
  methods: {
    goto(index) {
      if (index === this.current) return
        this.current = index
        // 这里可以发送ajax请求
        Indicator.open('加载中...')
        let self = this
        let info = {
          'status': 'Payed',
          'userId': JSON.parse(sessionStorage.getItem('userInfo')).phone
        }
        axios.post(config.url + '/user/' + JSON.parse(sessionStorage.getItem('userInfo')).phone + '/searchTransactionWithAddress?page=' + this.current + '&access_token=' + sessionStorage.getItem('token'), info)
          .then(function (res) {
            // console.log(res)
            Indicator.close()
            // 如果当前数据是有的就继续操作
            if (res.data.length > 0) {
              // 把之前的先清空，保证在查询的时候，不会重复推
              self.$parent.payed = []
              for (let index in res.data) {
                self.$parent.payed.push(res.data[index]) // 所有未付款的
              }
            } else { // 没有直接把表格数据置位0
              self.$parent.payed = []
            }
          })
          .catch(function (error) {
            console.log(error)
          })
    }
  },
  watch: {
    payed (val, oldVal) {
      if (val) {
        for (let i = 0; i < val.length; i++) {
          this.transactionsID.push(val[i]._id)
          for (let j = 0; j < val[i].productList.length; j++) {
            this.img.push(val[i].productList[j].img)
            this.name.push(val[i].productList[j].name)
            this.price.push(val[i].productList[j].price)
            this.quantity.push(val[i].productList[j].quantity)
          }
        }
      }
    },
    payedSum (val, oldVal) {
      if (val) {
        this.allpage = val
      }
    }
  },
  computed: {
    pages () {
      var pag = []
      if (this.current < this.showItem) { // 如果当前的激活的项 小于要显示的条数
        // 总页数和要显示的条数那个大就显示多少条
        var i = Math.min(this.showItem, this.allpage)
        while (i) {
          pag.unshift(i--)
        }
      } else { // 当前页数大于显示页数了
        var middle = this.current - Math.floor(this.showItem / 2) // 从哪里开始
        i = this.showItem
        if (middle > (this.allpage - this.showItem)) {
          middle = (this.allpage - this.showItem) + 1
        }
        while (i--) {
          pag.push(middle++)
        }
      }
      return pag
    }
  }
}
</script>
<style lang="css" scoped>
/* 下属内容的div */
.content {
  width: 80%;
  margin: 0 auto;
  background-color: #FFFFFF;
  margin-top: 5%;
  border-radius: 15px;
  padding: 2% 5%;
}
/* 分页相关 */
li {
  list-style:none;
}
a {
  text-decoration:none;
}
.pagination {
  position: relative;
  margin-top: 5%;
  text-align: right;
}
.pagination li{
  display: inline-block;
  margin:0 .2rem;
}
.pagination li a{
  padding:.2rem .4rem;
  display:inline-block;
  border:1px solid #ddd;
  background:#fff;
  color:#0E90D2;
}
.pagination li a:hover{
  background:#eee;
}
.pagination li.active a{
  background:#0E90D2;
  color:#fff;
}
/* 第一行的div*/
.div-text {
  line-height: 20px;
  padding-bottom: 1%;
}
/* 第一行中的text，根据tabbar来显示 */
.text {
  display: inline-block;
  width: 92%;
  text-align: right;
  color: #63B8FF;
  padding-bottom: 1%;
}
/* checkbox选中的颜色 */
.checkbox:checked{
  background:#63B8FF;
}
/* checkbox的样式 */
.checkbox {
  width:18px;
  height:18px;
  background-color:#ffffff;
  border:solid 1px #dddddd;
  -webkit-border-radius:50%;
  border-radius:50%;
  font-size:0.8rem;
  margin:0;
  padding:0;
  position:relative;
  display:inline-block;
  vertical-align:middle;
  cursor:default;
  -webkit-appearance:none;
  -webkit-user-select:none;
  user-select:none;
  -webkit-transition:background-color ease 0.1s;
  transition:background-color ease 0.1s;
}
/* 选中的勾 */
.checkbox:checked::after{
  content:'';
  top:3px;
  left:2px;
  position:absolute;
  background:transparent;
  border:#fff solid 2px;
  border-top:none;
  border-right:none;
  height:6px;
  width:10px;
  -moz-transform:rotate(-45deg);
  -ms-transform:rotate(-45deg);
  -webkit-transform:rotate(-45deg);
  transform:rotate(-45deg);
}
/* 购买的图片 */
.photo {
  display: inline-block;
  /* 图片自适应 */
  width: 4rem;
  height: 3rem;
  padding-bottom: 2%;
  object-fit: cover;
}
/* 花的名称 */
.name {
  vertical-align: top;
  display: inline-block;
  width: 40%;
}
/* 单价 */
.price {
  position: relative;
  vertical-align: top;
  font-size: 0.5rem;
  display: inline-block;
  left: 15%;
}
/* 数量 */
.number {
  position: relative;
  font-size: 0.5rem;
  display: inline-block;
  left: 8%;
}
/* 合计价格 */
.div-sum {
  width: 95%;
  text-align: right;
  line-height: 30px;
  font-size: 0.5rem;
  padding-bottom: 1%;
}
</style>
