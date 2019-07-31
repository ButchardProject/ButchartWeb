<template>
  <div class="comment-body">
      <div class="title">
        <span v-for="(item,index) in comment" :key="index" @click="select(index)" :class="active === index+1+'' ? 'active' : ''">{{item}}</span>
      </div>
      <div class="container">
        <mt-tab-container v-model="active">
          <mt-tab-container-item id="1">
          </mt-tab-container-item>
          <mt-tab-container-item id="2">
          </mt-tab-container-item>
          <mt-tab-container-item id="3">
          </mt-tab-container-item>
         </mt-tab-container>
       </div>
       <div class="good">
              <textarea rows="5" cols="30" maxlength="100" :placeholder="placeholder" @input="input()" v-model="desc" />
              <div class="sum">{{remnant}}/100</div>
            </div>
            <div class="takePhoto">
              <ul class="upload-imgs">
                <li v-if="imgLen >= 3 ? false : true">
                  <input type="file" class="upload" @change="addImg" ref="inputer" multiple accept="image/png,image/jpeg,image/jpg"/>
                  <a class="add">
                    <img :src="addImage"/>
                    <p>添加图片</p>
                  </a>
                </li>
                <li v-for='(value, key) in imgcode' :key="key">
                  <p class="img">
                    <img :src="value">
                    <a class="close" @click="delImg(key)">×</a>
                  </p>
                </li>
              </ul>
            </div>
       <hr/>
       <!-- 页脚保存按钮 -->
       <div class="commint">
         <span class="commint-button" @click="submit()">确认提交</span>
       </div>
  </div>
</template>
<script>
import { TabContainer, TabContainerItem, MessageBox } from 'mint-ui'
import config from '@/config'
import axios from 'axios'
export default {
  name: 'comment',
  data () {
    return {
      addImage: config.add,
      comment: ['好评', '中评', '差评'],
      active: "1", // 当前活跃的
      placeholder: '您对收到的鲜花还满意吗？您有任何意见都可以填写在这里，小布下次会做得更好。若您收到的鲜花有问题，还请上传图片作为凭证',
      remnant: 100, // 剩余字数
      desc: '', // textarea描述
      formData:new FormData(),
      imgLen: 0, // 图片的数量
      imgcode: [] // 图片的base64
    }
  },
  methods: {
    // 切换画布
    select (index) {
      this.active = index + 1 + '' // 转成string
    },
    // 计算字数
    input () {
      this.remnant = 100 - this.desc.length
    },
    // 添加图片
    addImg () {
      this.files = this.$refs.inputer.files; // 通过refs获取DOM文件数据,是个数组的形式
      let len = this.files.length + this.imgLen; // 拿到当前图片数量长度
      if (len > 3) {
        alert('最多可上传3张，您还可以上传' + (3 - this.imgLen) + '张')
        return false;
      }
      // 判断是否超过5M
      for (let i = 0; i < this.files.length; i++) {
        let size = Math.floor(this.files[i].size / 1024)
        if (size > 5 * 1024 * 1024) {
          alert('请选择5M以内的图片！')
          return false
        }
        this.imgLen++; // 当前数量增加
        // 创建一个reader
        let self = this
        let reader = new FileReader()
        // 将图片转成base64格式
        reader.readAsDataURL(this.files[i])
        // 读取成功后的回调
        reader.onloadend = function (e) {
          self.imgcode.push(e.target.result)
        }
      }
    },
    // 删除图片
    delImg (key) {
      this.$delete(this.imgcode, key)
      this.imgLen--
    },
    // 提交评价
    submit () {
      let that = this
      if (JSON.parse(sessionStorage.getItem('comment')) && JSON.parse(sessionStorage.getItem('userInfo'))) {
        if (this.active === '1') {
          let info = JSON.stringify({
            'comment': this.desc,
            'pics': this.imgcode,
            'appraisal': this.comment[0]
          })
          axios.put(config.url + '/customer/' + JSON.parse(sessionStorage.getItem('userInfo')).phone + '/transactionId/' + JSON.parse(sessionStorage.getItem('comment')) + '/afterSales?access_token=' + sessionStorage.getItem('token'), info)
          .then(function (res) {
            console.log(res)
            if (res.status === 200) {
              MessageBox.alert('操作成功').then(action => {
                that.$router.push({
                  'name': 'allorder',
                  query: {
                    'selected': '5'
                  }
                })
              })
            }
          })
          .catch(function (error) {
            console.log(error)
          })
        }
        if (this.active === '2') {
          if (!this.desc) {
            MessageBox('提示', '麻烦写下您的意见或者建议哦')
          }
          if (!this.imgcode.length) {
            MessageBox('提示', '需要上传您有问题的花束图片')
          }
          if (this.desc && this.imgcode) {
            let info = JSON.stringify({
              'comment': this.desc,
              'pics': this.imgcode,
              'appraisal': this.comment[1]
            })
            axios.put(config.url + '/customer/' + JSON.parse(sessionStorage.getItem('userInfo')).phone + '/transaction/' + JSON.parse(sessionStorage.getItem('comment')) + '/afterSales?access_token=' + sessionStorage.getItem('token'), info)
              .then(function (res) {
                console.log(res)
                if (res.status === 200) {
                  MessageBox.alert('操作成功').then(action => {
                    that.$router.push({
                      'name': 'allorder',
                      query: {
                        'selected': '5'
                      }
                    })
                  })
                }
               })
              .catch(function (error) {
                console.log(error)
              })
          }
        }
        if (this.active === '3') {
          if (!this.desc) {
            MessageBox('提示', '麻烦写下您的意见或者建议哦')
          }
          if (!this.imgcode.length) {
            MessageBox('提示', '需要上传您有问题的花束图片')
          }
          if (this.desc && this.imgcode) {
            let info = JSON.stringify({
              'comment': this.desc,
              'pics': this.imgcode,
              'appraisal': this.comment[2]
            })
            axios.put(config.url + '/customer/' + JSON.parse(sessionStorage.getItem('userInfo')).phone + '/transaction/' + JSON.parse(sessionStorage.getItem('comment')) + '/afterSales?access_token=' + sessionStorage.getItem('token'), info)
              .then(function (res) {
                console.log(res)
                if (res.status === 200) {
                  MessageBox.alert('操作成功').then(action => {
                    that.$router.push({
                      'name': 'allorder',
                      query: {
                        'selected': '5'
                      }
                    })
                  })
                }
               })
              .catch(function (error) {
                console.log(error)
              })
          }
        }
      }
    }
  }
}
</script>
<style lang="css" scoped>
.comment-body {
  height: 100%;
  width: 100%;
}
/* 标题栏 */
.title {
  display: flex;
  width: 80%;
  flex-grow:1;
  border-bottom: 1px solid #DEDEDE;
  line-height: 2.4rem;
  padding: 0 10%;
}
/* 被选中的 */
.active {
  color: #63B8FF !important;
}
/* 当前标题span的样式 */
.title > span {
  display: inline-block;
  width: 33%;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: #DEDEDE;
}
.good {
  overflow: hidden;
  text-align: center;
}
/* 评论 */
textarea {
  width: 90%;
  font-size: 14px;
  resize:none;
  border-style:none
}
/* 添加图片区域 */
.takePhoto {
  /* border: 1px solid red; */
  /* width: 30%; */
}
/* 计数 */
.sum {
  font-size: 12px;
  color: #DEDEDE;
  text-align: right;
  padding-right: 10%;
}
/* 底部的固定导航栏 */
.commint {
  width: 100%;
  position: absolute;
  bottom: 0%;
  line-height:1.5rem;
  text-align: center;
}
/* 保存按钮 */
.commint-button {
  font-size: 16px;
  border: 1px solid #63B8FF;
  background-color: #63B8FF;
  color: #FFFFFF;
  display: inline-block;
  width: 100%;
  text-align: center;
}
/* ul的模块 */
.upload-imgs {
  margin: 10px 0 30px 0;
  overflow: hidden;
  font-size: 0;
}
/* 添加的图片 */
li {
  position: relative;
  width: 80px;
  height: 80px;
  font-size: 14px;
  display: inline-block;
  padding: 8px;
  margin-right: 2px;
  border: 1px dashed #ccc;
  text-align: center;
  vertical-align: middle;
  margin-left: 5%;
}
/* 挡在上面这一层 */
.add {
  line-height: 40px;
}
/* 中文字 */
.add p {
  color: #DEDEDE;
}
/* 相机图片 */
.add img {
  display: inline-block;
  width: 36px;
  height: 36px;
}
/* input的上传本源 */
.upload {
  position: absolute;
  top: 5%;
  bottom: 0;
  left: 5%;
  right: 0;
  width: 90px;
  height: 90px;
  opacity: 0; /* 隐藏掉 */
}
/* 上传的图片 */
.img {
  position: relative;
  width: 80px;
  height: 80px;
  line-height: 60px;
}
/* 相机图片 */
.img img {
  vertical-align: middle;
  display: inline-block;
  width: 80px;
  height: 80px;
}
.close {
  display: none;
}
li:hover .img .close {
  display: block;
  position: absolute;
  right: -10px;
  top: -15px;
  line-height: 1;
  font-size: 22px;
  color: #aaa;
}
</style>
