<template>
  <div style="height:100%;">
    <scroller height="100%" v-ref:scroller lock-x scrollbar-y use-pullup use-pulldown
      @pullup:loading="loadMore" @pulldown:loading="refresh" 
      :pulldown-config="{height: 100}" :pulldown-status.sync="scroller.pulldownStatus"
      :pullup-config="{pullUpHeight: 100}" :pullup-status.sync="scroller.pullupStatus">
      <div class="l-list-box">
        <div class="l-flex-hc l-appointment-item l-border-b" v-for="item in scroller.list" @click="view(item.id)">
          <div class="l-rest">
            <p>
              <span class="l-fr">{{getDate(item.appointDate)}}</span>
              <i class="iconfont">&#xe6d0;</i>&nbsp;
              <strong>{{item.billCode}}</strong>
            </p>
            <p>
              <b class="l-fr">{{getStatus(item.state)}}</b>
              <span>{{item.name}}</span>&nbsp;&nbsp;&nbsp;
              <span>{{item.mobilePhone}}</span>
            </p>
            <p><span>{{item.province+item.city+item.area+(item.address||'')}}</span></p>
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
import server from '../server'
export default {
  components: {
    Scroller, Spinner
  },
  route: {
    data({ to }) {
      const self = this
      server.appointment.getList(to.query.phone || self.userinfo.mobilePhone).then( listEntity => {
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
    },
    getStatus(code) { 
      switch(code){
        case 1:
        case 2:
          return '正在安排设计师'
        case 3:
        case 4:
        case 41:
        case 5:
        case 51:
          return '正在设计大样图'
        case 6:
        case 61:
        case 7:
        case 71:
          return '正在报价中'
        case 8:
          return '客户确认中'
        case 9:
          return '已确认报价'
        case 91:
          return '待重新报价'
        case 10:
          return '已生成订单'
      }
    },
    getDate(datetime) {
      if(!datetime) return ''
      return datetime.split(' ')[0]
    },
    view(id) {
      this.$router.go(`/user/appointment/info?id=${id}`)
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


<style scoped lang="less">
.l-appointment-item{
  color: #999;
  padding: 0.5rem 0.75rem;
  background-color: #fff;
  font-size: 14px;
  .iconfont{
    font-size: 18px;
  }
  p{
    margin: 5px 0;
  }
  strong {
    font-weight: 400;
    color: #333;
  }
  b{
    font-weight: 400;
    color: #4083c7;
  }
}
.l-appointment-item .icon-arrow{
  margin-right: -0.5rem
}
</style>