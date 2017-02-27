<template>
  <div style="height:100%;">
    <scroller height="100%" v-ref:scroller lock-x scrollbar-y use-pullup use-pulldown
      @pullup:loading="loadMore" @pulldown:loading="refresh" 
      :pulldown-config="{height: 100}" :pulldown-status.sync="scroller.pulldownStatus"
      :pullup-config="{pullUpHeight: 100}" :pullup-status.sync="scroller.pullupStatus">
      <div class="l-list-box">
        <div class="l-card-item vux-tap-active" v-for="item in scroller.list" track-by="$index" @click="view(item.id)">
          <div class="l-card-item-hd">
            <h1 v-text="item.title"></h1>
            <p>{{item.startTime.split(' ')[0]}} - {{item.endTime.split(' ')[0]}}</p>
          </div>
          <div class="l-card-item-bd">
            <img v-if="item.url" :src="$image.thumb(item.url, 400, 320)">
            <p v-text="item.summary"></p>
          </div>
          <div class="l-card-item-ft l-border-t">
            <i class="iconfont icon-arrow l-fr">&#xe601;</i>
            <span>查看详情123</span>
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
import server from '../server'
export default {
  components: {
    Scroller, Spinner
  },
  route: {
    data() {
      const self = this
      server.activity.getList().then( listEntity => {
        self.listEntity = listEntity
        listEntity.callback = function(){
          self.scroller.pullupStatus = 'up'
          self.scroller.list = listEntity.alldata
          self.scroller.isNull = listEntity.isNull
          self.$nextTick(() => {
            self.$refs.scroller.reset()
          })
        }
        listEntity.init()
      })
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
    view(id) {
      this.$router.go(`/activity/info?id=${id}`)
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
  computed:{
    startDate() {
      if(!this.info.startTime) return ''
      return this.info.startTime.split(' ')[0]
    },
    endDate() {
      if(!this.info.endTime) return ''
      return this.info.endTime.split(' ')[0]
    }
  }
}
</script>
<style scoped lang="less">
.l-card-item {
  margin:0.75rem 0.75rem 0;
  padding: 0.75rem;
  background-color: #fff;
  border-radius: 5px;
  border:1px solid #ccc;
}
.l-card-item-hd{
  h1 {
    font-size: 16px;  
  }
  p {
    font-size: 14px;
    color: #999;
  }
}
.l-card-item-bd{
  padding: 0.5rem 0;
  img{
    width: 100%;
    height: 8.0rem;
    background-color: #ebebeb;
  }
  p {
    font-size: 14px;
    color: #999;
    line-height: 1.4;
    margin-top: 0.5rem;
  }
}
.l-card-item-ft{
  padding-top: 0.5rem;
  font-size: 14px;
  .icon-arrow{
    font-size: inherit;
    margin-top: 4px;
  }
}
</style>
