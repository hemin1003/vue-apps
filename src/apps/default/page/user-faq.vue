<template>
  <div>
    <group title="常见问题">
      <cell v-for="item in faqScroller.list" :title="item.question" :link="{path: '/user/faq/info?id='+item.id }">
        <span slot="icon">{{$index+1}}、</span>
      </cell>
    </group>
    <div v-if="faqScroller.loading" class="l-loading"><br></div>
    <group title="我的反馈">
      <cell v-for="item in feedbackScroller.list" :title="item.title" :link="{path: '/user/faq/feedback?id='+item.id }">
        <span slot="icon">{{$index+1}}、</span>
        <span v-if="item.state === 2" class="vux-reddot" slot="after-title">&nbsp;</span>
      </cell>
    </group>
    <div v-if="feedbackScroller.loading" class="l-loading"><br></div>
    <div class="l-btn-area">
      <x-button type="primary" v-link="{path:'/user/faq/add'}">我要反馈</x-button>  
    </div>
  </div>
</template>

<script>
import { Group, Cell, XButton } from 'vux-components'
import { store, getters } from '../vuex'
import server from '../server'

export default {
  components: {
    Group, Cell, XButton
  },
  route: {
    data() {
      const self = this
      server.faq.getHelpList().then( listEntity => {
        listEntity.callback = function(){
          self.faqScroller.pullupStatus = 'default'
          self.faqScroller.list = listEntity.alldata
          self.faqScroller.loading = listEntity.isLoading
          self.faqScroller.isNull = listEntity.isNull
          // self.$nextTick(() => {
          //   self.$refs.faqScroller.reset()
          // })
        }
        listEntity.init()
      })

      server.faq.getFeedBackList(self.userinfo.id).then( listEntity => {
        listEntity.callback = function(){
          self.feedbackScroller.pullupStatus = 'default'
          self.feedbackScroller.list = listEntity.alldata
          self.feedbackScroller.loading = listEntity.isLoading
          self.feedbackScroller.isNull = listEntity.isNull
          // self.$nextTick(() => {
          //   self.$refs.feedbackScroller.reset()
          // })
        }
        listEntity.init()
      })
    }
  },
  store,
  vuex: {
    getters
  },
  data () {
    return {
      faqScroller: {
        loading: true,
        isNull: false,
        list: [],
        pullupStatus: 'loading'
      },
      feedbackScroller: {
        loading: true,
        isNull: false,
        list: [],
        pullupStatus: 'loading'
      }
    }
  }
}
</script>
