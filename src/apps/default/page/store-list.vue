<template>
  <div style="height:100%;">
    <scroller height="100%" v-ref:scroller lock-x scrollbar-y use-pullup use-pulldown
      @pullup:loading="loadMore" @pulldown:loading="refresh" 
      :pulldown-config="{height: 100}" :pulldown-status.sync="scroller.pulldownStatus"
      :pullup-config="{pullUpHeight: 100}" :pullup-status.sync="scroller.pullupStatus">
      <div>
        <div class="l-flex-hc l-store-item l-border-t" v-for="item in scroller.list | orderBy 'distance' 1" @click="view(item.id)">
          <div class="l-thumb"><img :src="$image.thumb(item.thumbnail, 80, 80)"></div>
          <div class="l-rest">
            <h3 v-text="item.storeName"></h3>
            <p v-text="item.address"></p>
            <div class="l-bottom">
              <a class="l-fr" @click.stop href="tel:{{item.workPhone}}"><i class="iconfont">&#xe612;</i> 电话</a>
              <a class="l-fr" @click.stop="openMap(item)"><i class="iconfont">&#xe600;</i> 导航</a>
              <a class="l-fgray"><i class="iconfont">&#xe634;</i>{{item.distance}}km</a>
            </div>
          </div>
          <div>
            <i class="iconfont icon-arrow">&#xe601;</i>
          </div>
        </div>
      </div>
      <div class="l-center l-margin l-padding" v-if="scroller.isNull && scroller.list.length === 0">
        <img class="l-center" style="width:3.75rem;" src="~assets/imgs/none.jpg">
        <p class="l-fgray l-fsize-s l-margin-t">暂无内容</p>
      </div>
      <!--pulldown slot-->
      <div slot="pulldown" class="l-pulldown">
        <span v-show="scroller.pulldownStatus === 'down'">下拉刷新</span>
        <span v-show="scroller.pulldownStatus === 'up'">释放刷新</span>
        <span v-show="scroller.pulldownStatus === 'loading'"><spinner type="ios-small"></spinner></span>
      </div>
      <!--pullup slot-->
      <div slot="pullup" class="l-pullup">
        <span v-show="scroller.pullupStatus === 'down'">释放加载更多</span>
        <span v-show="scroller.pullupStatus === 'up' && scroller.list.length > 0">{{scroller.isNull ? '没有更多了' : '上拉加载更多'}}</span>
        <span v-show="scroller.pullupStatus === 'loading'"><spinner type="ios-small"></spinner>正在加载</span>
      </div>
    </scroller>
  </div>
</template>
<script>
import { Scroller, Spinner } from 'vux-components'
import { store, getters, actions } from '../vuex'
import config from '../config'
import server from '../server'

export default {
  components: {
    Scroller, Spinner
  },
  store,
  vuex: {
    getters, actions
  },
  route: {
    data() {
      const self = this
      server.getPosition().then( position => {
        server.store.getList().then( listEntity => {
          self.listEntity = listEntity
          listEntity.callback = function(){
            self.scroller.pullupStatus = 'up'
            self.scroller.list = listEntity.alldata.map( item => {
              item.distance = server.getDistance({
                lng1: position.longitude, 
                lat1: position.latitude
              }, {
                lng2: item.longitude,
                lat2: item.latitude
              })
              return item
            })
            self.scroller.isNull = listEntity.isNull
            self.$nextTick(() => {
              self.$refs.scroller.reset()
            })
          }
          listEntity.init()
        })
      })  
    }
  },
  data() {
    return {
      scroller: {
        isNull: false,
        list: [],
        pulldownStatus: 'default',
        pullupStatus: 'loading'
      }
    }
  },
  methods: {
    loadMore (uuid) {
      this.listEntity.next()
      this.$nextTick(() => {
        this.$broadcast('pullup:reset', uuid)
      })
    },
    refresh (uuid) {
      this.listEntity.init()
      this.$nextTick(() => {
        this.$broadcast('pulldown:reset', uuid)
      })
    },
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
    },
    view(id) {
      this.$router.go(`/store/list/info?id=${id}`)
    }
  }
}
</script>
<style scoped lang="less">
.l-store-item{
  background-color: #fff;
  padding: 0.5rem;
  font-size: 14px;
  p{color: #999; font-size: 12px;}
  .l-thumb {
    margin-right: 0.5rem;
    width: 3.0rem;
    height: 3.0rem;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .iconfont{
    font-size: 16px;
  }
  .l-bottom{
    a{
      margin: 0 0.5rem 0 0;
    }
    a.l-fr{
      margin: 0 0 0 0.5rem;
    }
  }
}
</style>
