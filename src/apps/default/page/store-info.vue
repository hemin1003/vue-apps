<template>
  <div>
    <group class="l-store-info">
      <div class="l-flex-h l-thumb">
        <img :src="$image.thumb(info.thumbnail, 80, 80)">
        <div class="l-rest">
          <span class="l-fr l-fgray l-fsize-sm">{{info.distance}}km</span>
          <h3 v-text="info.storeName"></h3>
        </div>
      </div>
      <cell :title="info.openTime">
        <i class="iconfont" slot="icon">&#xe61f;</i>
      </cell>
      <cell :title="info.workPhone">
        <i class="iconfont" slot="icon">&#xe612;</i>
      </cell>
      <cell :title="info.address" :is-link='true' @click="openMap(info)">
        <i class="iconfont" slot="icon">&#xe600;</i>
      </cell>
    </group>

    <div v-if="info.introduce || storeImgList.length > 0" class="l-margin-tb l-store-details">
      <div v-html="info.introduce"></div>
      <div v-for="(index,item) in storeImgList" @click="$refs.previewer.show(index)">
        <img class="previewer-img" :src="item.src"/>  
      </div>
    </div>
    <previewer :list="storeImgList" v-ref:previewer :options="options"></previewer>
  </div>
</template>
<script>
import { Group, Cell, Previewer, Dialog } from 'vux-components'
import { utils, storage } from 'assets/lib'
import config from '../config'
import server from '../server'
// import wx from 'weixin-js-sdk'

export default {
  components: {
    Group, Cell, Previewer, Dialog
  },
  route: {
    data({ to }) {
      const self = this
      server.store.getInfo(to.query.id).then( info => {
        if(info.storeImgList){
          self.storeImgList = info.storeImgList.map((item) => {
            return {
              w: 640,
              h: 400,
              src: self.$image.thumb(item, 640, 400)
            }
          })
        }
        self.info = info
        self.$vux.loading.hide()
        
        server.getPosition().then( position =>{
          let distance = server.getDistance({
            lng1: position.longitude, 
            lat1: position.latitude
          }, {
            lng2: self.info.longitude,
            lat2: self.info.latitude
          })
          self.$set('info.distance', distance)
        })
      })

      self.$vux.loading.show()
    }
  },
  data() {
    return {
      info: {},
      storeImgList: [],
      options: {
        getThumbBoundsFn (index) {
          // find thumbnail element
          let thumbnail = document.querySelectorAll('.previewer-img')[index]
          // get window scroll Y
          let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
          // optionally get horizontal scroll
          // get position of element relative to viewport
          let rect = thumbnail.getBoundingClientRect()
          // w = width
          return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
          // Good guide on how to get element coordinates:
          // http://javascript.info/tutorial/coordinates
        }
      }
    }
  },
  methods: {
    openMap(storeEntity) {
      server.getWxConfig().then((wx)=>{
        wx.openLocation({
          latitude: storeEntity.latitude,  
          longitude: storeEntity.longitude, 
          name: storeEntity.storeName,
          address: storeEntity.address, 
          scale: 15, // 地图缩放级别,整形值,范围从1~28。默认为最大
          infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
        })
      })
    }
  }
}
</script>
<style type="text/css">
.l-store-info .weui_cells{
  margin-top: 0;
}
</style>
<style scoped lang="less">
.l-store-info {
  [slot=icon]{
    color: #4083c7;
    display: block;
    width: 30px;
    margin-top: -2px;
  }
  .l-thumb{
    padding: 0.75rem;
    h3{
      font-weight: 400;
    }
    img{
      width: 3.0rem;
      height: 3.0rem;
      margin-right: 0.5rem;
    }
  }
}

.l-store-details{
  background-color: #fff;
  padding: 0.75rem;
  img{
    display: block;
    margin: 0.5rem auto;
  }
}
</style>
