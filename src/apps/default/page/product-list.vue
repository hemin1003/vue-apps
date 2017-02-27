<template>
  <div class="l-flex-v" style="height:100%;">
    <tab :line-width="2" :index.sync="tab.index">
      <tab-item 
        v-for="item in tab.data | limitBy 5" 
        :selected="tab.index === $index" 
        @click="tabClick($index)">{{item.dicName}}</tab-item>
    </tab>
    <!-- <scroller class="l-rest" v-ref:scroller height="100%"
      lock-x scrollbar-y use-pullup :use-pulldown="false"
      :pullup-config="scroller.config" @pullup:loading="scrollerLoad"> -->
      <div class="l-scrolling l-rest">
        <div class="l-product-list"
          v-for="(index, category) in tab.data | limitBy 5"
          v-show="tab.index === index">
          <div class="l-flex-hc l-product-item l-border-b" v-for="item in tab.list[index]" @click="view(item.id)">
            <div class="l-thumb">
              <img :src="$image.thumb(item.thumbnail, 60, 60)">
            </div>
            <div class="l-rest l-content">
              <h4 class="l-text-wrap" v-text="item.productName"></h4>
              <p class="l-text-clamp2" v-text="item.videoDesc"></p>
            </div>
            <div>
              <i class="iconfont icon-arrow">&#xe601;</i>
            </div>  
          </div>
        </div>
        <div v-if="loading" class="l-loading"><br><br><br><br><br></div>
      </div>
    <!-- </scroller> -->
  </div>
</template>
<script>
import { Panel, Group, Tab, TabItem, Sticky, Scroller } from 'vux-components'
import server from '../server'
export default {
  components: {
    Panel, Group, Tab, TabItem, Sticky, Scroller
  },
  route: {
    data(transition) {
      const self = this
      server.product.getCategory().then( list => {
        self.tab.data = list
        self.tabClick(0)
        self.$vux.loading.hide()
      })
    }
  },
  data() {
    return {
      loading: false,
      tab: {
        direction: 'vux-pop-in',
        index: -1,
        data: [],
        list: [[],[],[],[],[]]
      },
      scroller: {
        config: {
          content: '',
          downContent: '松开进行加载',
          upContent: '上拉加载更多',
          loadingContent: '加载中...'
        }
      }
    }
  },
  methods: {
    tabClick(index) {
      const self = this
      if(self.tab.index === index) return
      self.tab.direction =  index < self.tab.index ? 'vux-pop-out' : 'vux-pop-in'
      self.tab.index = index

      if(self.tab.list[index].length === 0){
        self.loading = true
        server.product.getList(self.tab.data[index].id).then( list => {
          self.loading = false
          self.tab.list.$set(index, list)
          self.$nextTick(() => {
            // setTimeout(self.$refs.scroller.reset, 500)
          })
        })
      }
    },
    view(id) {
      this.$router.go(`/product/list/info?id=${id}`)
    },
    scrollerLoad(uuid) {
      const self = this
      this.$broadcast('pullup:done', uuid)
      // this.$broadcast('pullup:reset', uuid)
    }
  }
}
</script>
<style scoped lang="less">
.l-product-list{
  // margin: 0.75rem 0;
}
.l-product-item{
  background-color: #fff;
  padding: 0.75rem;
  .l-thumb{
    margin-right: 0.5rem;
    width: 3.0rem;
    height: 3.0rem;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .l-content{
    h4{
      font-weight: 400;
      font-size: 17px;
      margin-bottom: 5px;
    }
    p{
      color: #999;
      font-size: 13px;
    }
  }
  .icon-arrow{
    margin-right: -0.133333rem;
  }
}
.l-product-item:active{
  background-color: #ebebeb;
}
</style>
