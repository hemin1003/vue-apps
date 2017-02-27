<template>
  <div>
    <sticky>
      <tab :line-width="2" :index="tab.index">
        <tab-item @click="tabClick(0)">产品特性</tab-item>
        <tab-item @click="tabClick(1)">实景展示</tab-item>
        <tab-item @click="tabClick(2)">视频介绍</tab-item>
      </tab>
    </sticky>

    <div class="l-product-props" v-show="tab.index === 0">
      <div v-if="info.productProp" class="l-props-item l-border-b">
        <div class="l-flex-hc l-title">
          <i class="iconfont">&#xe640;</i>
          <h4 class="l-rest l-border-b">产品特性</h4>
        </div>
        <div class="l-content" v-html="info.productProp"></div>  
      </div>
      <div v-if="info.application" class="l-props-item l-border-b">
        <div class="l-flex-hc l-title">
          <i class="iconfont">&#xe638;</i>
          <h4 class="l-rest l-border-b">使用范围</h4>
        </div>
        <div class="l-content" v-html="info.application"></div>  
      </div>
      <div v-if="info.params" class="l-props-item l-border-b">
        <div class="l-flex-hc l-title">
          <i class="iconfont">&#xe68e;</i>
          <h4 class="l-rest l-border-b">技术参数</h4>
        </div>
        <div class="l-content" v-html="info.params"></div>  
      </div>
    </div>
    <div class="l-product-realshow" v-show="tab.index === 1">
      <div v-for="(index, item) in realShow" @click="$refs.previewer.show(index)">
        <img class="previewer-img" :src="item.src"/>  
      </div>
    </div>
    <div class="l-product-video" v-show="tab.index === 2">
      <p class="l-fsize-s" v-text="info.videoDesc"></p>
      <div class="l-video-player">
        <video id="video-player" x-webkit-airplay="true" webkit-playsinline="true" controls="controls"
        :poster="$image.thumb(info.videoThum, 640, 400)" :src="info.videoUrl"></video>
      </div>
    </div>
    <previewer :list="realShow" v-ref:previewer :options="options"></previewer>
  </div>
</template>
<script>
import { Tab, TabItem, Previewer, Sticky } from 'vux-components'
import server from '../server'
export default {
  components: {
    Tab, TabItem, Previewer, Sticky
  },
  route: {
    data({ to }) {
      const self = this
      let id = to.query.id 
      server.product.getInfo(id).then( info => {
        if(info.pictureShows){
          let realShow = []
          info.pictureShows.split('<;>').forEach((item)=>{
            if(item){
              realShow.push({
                w: 640,
                h: 400,
                src: self.$image.thumb(item, 640, 400)
              })
            }
          })
          self.realShow = realShow
        }
        self.info = info
        self.$vux.loading.hide()
      })
      self.$vux.loading.show()
    }
  },
  data() {
    return {
      tab: {
        direction: 'vux-pop-in',
        index: 0
      },
      info: {},
      realShow: [],
      options: {
        getThumbBoundsFn (index) {
          let thumbnail = document.querySelectorAll('.previewer-img')[index]
          let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
          let rect = thumbnail.getBoundingClientRect()
          return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
        }
      }
    }
  },
  methods: {
    tabClick(index) {
      const self = this
      self.tab.direction =  index < self.tab.index ? 'vux-pop-out' : 'vux-pop-in'
      self.tab.index = index
      index !== 2 && self.play(false)
    },
    play(isPlay) {
      let video = document.getElementById('video-player')
      if(this.info.videoUrl){
        if(isPlay && video.paused){
          video.play()
        }else{
          video.pause()
        }
      }
    }
  }
}
</script>
<style scoped lang="less">
.l-product-realshow{
  >div{
    margin: 0.75rem;
    border: 1px solid #ebebeb;
    border-radius: 3px;
    padding: 0.75rem;
    background-color: #fff;
  }
  img{
    display: block;
  }
}

.l-product-props{
  background-color: #fff;
  .iconfont{
    width: 2.0rem;
    text-align: center;
    color: #4083c7;
  }
  .l-props-item{
    margin: 0.75rem 0 0 0;
    padding: 0.375rem 0.75rem 0.375rem 0 ;
    border-radius: 3px;
  }
  .l-title{
    h4{
      color: #4083c7;
      font-weight: 400;
      padding: 0.375rem 0;
    }
  }
  .l-content{
    font-size: 14px;
    padding: 0.5rem 0 0.5rem 2rem;
  }
}

.l-product-video{
  padding: 0.75rem;
  background-color: #fff;
  p {
    color: #999;
  }
  .l-video-player{
    margin: 0.75rem 0 0 0;
    background-color: #000;
    video{
      width: 100%;
      height: 12.0rem;
      display: block;
    }
  }

}
</style>
