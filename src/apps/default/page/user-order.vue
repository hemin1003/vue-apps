<template>
  <div style="height:100%;">
    <scroller height="100%" v-ref:scroller lock-x scrollbar-y use-pullup use-pulldown
      @pullup:loading="loadMore" @pulldown:loading="refresh" 
      :pulldown-config="{height: 100}" :pulldown-status.sync="scroller.pulldownStatus"
      :pullup-config="{pullUpHeight: 100}" :pullup-status.sync="scroller.pullupStatus">
      <order-list :list="scroller.list"></order-list>
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
import OrderList from '../components/order-list'
import { store, getters, actions } from '../vuex'
import server from '../server'
export default {
  components: {
    OrderList, Scroller, Spinner
  },
  route: {
    data() {
      const self = this
      server.order.getList(self.userinfo.mobilePhone).then( listEntity => {
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
  store,
  vuex: {
    getters
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
  }
}
</script>
