<template>
  <div>
    <swiper :list="banner" loop auto height="9.0rem"></swiper>
    <div class="l-margin-tb l-flex-hc" style="background-color:#fff;padding:0.75rem;">
      <div class="l-rest">
        <masker class="l-masker-item" :opacity="0.5" v-link="{path:'/booking'}">
          <div class="l-img" :style="{backgroundImage: 'url(' + images.img1 + ')'}"></div>
          <div class="l-title" slot="content">在线预约</div>
        </masker>  
      </div>
      <div class="l-rest" style="margin-left:0.75rem;">
        <masker class="l-masker-item" :opacity="0.5" v-link="{path:'/welfare'}">
          <div class="l-img" :style="{backgroundImage: 'url(' + images.img2 + ')'}"></div>
          <div class="l-title" slot="content">新人领福利</div>
        </masker>
      </div>
    </div>
    <div class="l-flex-wrap l-grid">
      <div class="l-flex-vhc l-grid-item" v-link="{path: '/company'}">
        <img src="~assets/imgs/icon-001.jpg">
        <p>企业简介</p>
      </div>
      <!-- <div class="l-flex-vhc l-grid-item">
        <img src="~assets/imgs/icon-002.jpg">
        <p>企业荣誉</p>
      </div> -->
      <div class="l-flex-vhc l-grid-item" v-link="{path: '/store/list'}">
        <img src="~assets/imgs/icon-003.jpg">
        <p>门店展示</p>
      </div>
      <!-- <div class="l-flex-vhc l-grid-item">
        <img src="~assets/imgs/icon-004.jpg">
        <p>案列分享</p>
      </div> -->
      <div class="l-flex-vhc l-grid-item" v-link="{path: '/product/list'}">
        <img src="~assets/imgs/icon-005.jpg">
        <p>产品展示</p>
      </div>
      <div class="l-flex-vhc l-grid-item" v-link="{path: '/wellife'}">
        <img src="~assets/imgs/icon-006.jpg">
        <p>智慧生活</p>
      </div>
      <div class="l-flex-vhc l-grid-item" v-link="{path: '/australia'}"> 
        <img src="~assets/imgs/icon-007.jpg">
        <p>澳式风情</p>
      </div>
      <div class="l-flex-vhc l-grid-item" v-link="{path: 'http://www.hzzx3d.com/news/aylson/index.html'}">
        <img src="~assets/imgs/icon-008.jpg">
        <p>720展厅</p>
      </div>
      <div class="l-flex-vhc l-grid-item" v-link="{path: '/order/tracking'}">
        <img src="~assets/imgs/icon-014.jpg">
        <p>订单跟踪</p>
      </div>
    </div>

    <div class="l-flex-hc l-title-hd" v-link="{path: '/news/list'}">
      <h3 class="l-rest">艾臣资讯</h3>
      <a class="l-fsize-sm"><i class="iconfont">&#xe602;</i></a>
    </div>
    <news-list :list="news.list" :loading="news.loading"></news-list>
  </div>
</template>
<script>
import { Swiper, Masker, Flexbox, FlexboxItem } from 'vux-components'
import NewsList from '../components/news-list'
import config from '../config'
import server from '../server'

export default {
  components: {
    Swiper, Masker, Flexbox, FlexboxItem, NewsList
  },
  route: {
    data() {
      const self = this
      server.news.getList(2).then( listEntity => {
        listEntity.callback = function(){
          self.news.loading = !listEntity.isAjax
          self.news.list = listEntity.alldata
        }
        listEntity.init()
      })
    }
  },
  data() {
    return {
      images: {
        img1: require('assets/imgs/booking.png'),
        img2: require('assets/imgs/fuli.png')
      },
      banner: [{
        url: 'javascript:;',
        img: require('assets/imgs/temp-016.jpg'),
        title: ''
      }],
      news: {
        list: [],
        loading: true
      }
    }
  }
}
</script>
<style scoped lang="less">
.l-grid{
  margin: 0.75rem 0;
  background-color: #fff;
  font-size: 12px;
  padding: 0.375rem 0;
}
.l-grid-item{
  box-sizing: border-box;
  width: 25%;
  padding: 0.375rem;
  img{
    width: 80%;
  }
  p{
    margin-top: 5px;
  }
}
.l-masker-item{
  border-radius: 5px;
  .l-img{
    padding-bottom: 33%;
    display: block;
    position: relative;
    max-width: 100%;
    background-size: cover;
    background-position: center center;
    cursor: pointer;
    border-radius: 2px;
  }
  .l-title {
    color: #fff;
    text-align: center;
    text-shadow: 0 0 2px rgba(0,0,0,.5);
    font-weight: 500;
    font-size: 16px;
    position: absolute;
    left: 0;
    right: 0;
    width: 100%;
    text-align: center;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
