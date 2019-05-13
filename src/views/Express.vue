<template>
<div class="express-body">
    <div class="express-content">
        <div class="title" @click="selectAddress()">地址选择</div>
        <div class="currentAddress">{{address}} {{tel}}</div>
        <div class="express-title">
            <div class="title">配送选择</div>
            <ul>
                <li> > 顺丰</li>
                <li> > 闪送</li>
            </ul>
        </div>
        <div class="express-price">
            <span class="title">运费计算:</span>
            <span></span>
        </div>
    </div>
    <!-- 地图部分 -->
    <div class="map">
      <!-- vue-amap的标签 -->
      <el-amap ref="map" vid="amap" :zoom="zoom" :plugin="plugin" :events="events" class="amap-demo">
        <!-- marker标记的点 -->
        <el-amap-marker vid="component-marker"  ></el-amap-marker>

      </el-amap>
    </div>
</div>
</template>
<script>
// import VueAMap from "vue-amap";
export default {
  name: 'express',
  data () {
    return {
      address: sessionStorage.getItem('currentAddress'),
      tel: sessionStorage.getItem('currentTel'),
      zoom: 12, // 地图层级
      // marker标记的点
      markers:[{
        visible: true,// 点标记是否可见
      }],
      events: {
        init: (o) => {
          console.log(o.getCenter())
          console.log(this.$refs.map.$$getInstance())
          o.getCity(result => {
            console.log(result)
            })
          },
          'moveend': () => {
          },
          'zoomchange': () => {
          },
          'click': (e) => {
          //   alert('map clicked');
          }
        },
      plugin: ['ToolBar', {
        pName: 'MapType',
          defaultType: 0,
          events: {
            init(o) {
                console.log(o);
              }
            }
          }]
    }
  },
  methods: {
    // 前往location选择地址
    selectAddress () {
      this.$router.push('location')
    },
    getMap() {
          // amap vue component
          console.log(this.$VueAMap._componentMap);
          // gaode map instance
          console.log(this.$VueAMap._map);
        }
  },
  mounted () {
    //   this.init()
  }
}
</script>
<style lang="css" scoped>
.express-body {
    width: 100%;
    height: 100%;
    background-color: #F0F0F0;
}
.express-content {
    width: 100%;
    height: 50%;
    background-color: #FFFFFF;
    position: relative;
    top: 5%;
}
.currentAddress {
    display: inline-block;
    /* padding-left: 10%; */
    margin-left: 10%;
    line-height: 20px;
    font-size: 15px;
    border: 1px solid #63B8FF;
}
li {
    padding-left: 10%;
    line-height: 20px;
    font-size: 15px;
}
/* 配送选择div */
.express-title {
    width: 100%;
    height: 35%;
}
/* 门店选择与时间选择 */
.title {
    font-size: 16px;
    line-height: 30px;
    padding: 2% 5%;
}
/* 配送价格 */
.express-price {
    width: 100%;
}
.map {
    width: 100%;
    height: 50%;
    margin-top: 20%;
    /* background-color: red; */
}
 .amap-demo {
      height: 300px;
    }
</style>
