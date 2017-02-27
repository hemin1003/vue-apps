<template>
  <div class="l-flex-v" style="height:100%;">
    <scroller class="l-rest" v-ref:scroller lock-x scrollbar-y use-pulldown
      @pulldown:loading="loadMore" 
      :pulldown-config="{height: 100}" :pulldown-status.sync="scroller.pulldownStatus">
      <div class="l-chat-list">
        <div class="l-flex-h" v-for="item in scroller.list"
          :class="{'l-chat-item-me': item.replyType == 1, 'l-chat-item-other': item.replyType == 2}" >
          <div class="l-thumb">
            <img :src="item.replyType == 2 ? kefuAvatar : mineAvatar">
          </div>
          <div class="l-rest">
            <div class="l-chat-msg" v-html="item.replyCont"></div>
          </div>
        </div>
      </div>
      <!--pulldown slot-->
      <div slot="pulldown" class="l-pulldown">
        <span v-show="scroller.pulldownStatus === 'loading'"><spinner type="ios-small"></spinner></span>
      </div>
    </scroller>
    <div class="l-chat-send l-flex-hc">
      <div class="l-rest">
        <input type="text" value="" placeholder="您想说点什么" v-model="formData.replyCont">
      </div>
      <div class="l-btn">
        <x-button mini @click="send">发送</x-button>  
      </div>
    </div>
  </div>
</template>

<script>
import { XButton, Scroller, Spinner } from 'vux-components'
import { store, getters, actions } from '../vuex'
import config from '../config'
import server from '../server'

export default {
  components: {
    XButton, Scroller, Spinner
  },
  route: {
    data({ to }) {
      const self = this
      // 反馈详情
      server.faq.getFeedBackDetail(to.query.id).then( info => {
        self.info = info
        self.$vux.loading.hide()
      })
      // 回复列表
      server.faq.getFeedBackReply(to.query.id).then( listEntity => {
        self.listEntity = listEntity
        listEntity.callback = function(){
          self.scroller.pulldownStatus = 'default'
          self.scroller.list = listEntity.alldata
          self.scroller.isNull = listEntity.isNull
          self.$nextTick(() => {
            self.$refs.scroller.reset()
          })
        }
        listEntity.init()
      })
      // 设置回复已读
      server.faq.getEditFeedBack(to.query.id)

      self.$vux.loading.show()
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
        this.$broadcast('pulldown:reset', uuid)
      })
    },
    send() {
      const self = this
      self.formData.clientId = self.userinfo.id 
      self.formData.feedBackId = self.info.id 
      if(!self.formData.replyCont){
        self.$vux.toptips.show('请输入回复内容')
        return
      }

      self.scroller.list.push({
        replyType: 1,
        replyCont: self.formData.replyCont,
        loading: true
      })

      self.$nextTick(() => {
        
      })

      self.$http.post('owner/replyFeedBack', self.formData)
      .then(({ body })=>{
        if(body.success){
          self.$vux.toast.show({
            text: '回复成功',
            onHide() {
              self.formData.replyCont = ''
              self.done(self.scroller.list.length - 1)
            }
          })
        }else{
          self.$vux.toast.show(body.message || '回复失败')
        }
      })
    },
    done(index) {
      
    }
  },
  data() {
    return {
      scroller: {
        isNull: false,
        list: [],
        pulldownStatus: 'loading'
      },
      mineAvatar: this.userinfo.photo || config.defaultVal.avatar,
      kefuAvatar: require('assets/imgs/kefu.jpg') || config.defaultVal.avatar,
      info: {},
      formData: {
        replyCont: ''
      }
    }
  }
}
</script>
