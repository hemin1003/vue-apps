<template>
  <div>
    <l-article :title="info.title" time="">
      <div class="l-border-b" style="padding-bottom:0.75rem;margin-bottom:0.75rem;color:#666;">
        <p>活动时间：{{startDate}} - {{endDate}}</p>
        <p>活动地点：{{info.location}}</p>
      </div>
      <div v-html="info.content"></div>
    </l-article>
    <div class="l-btn-area">
      <x-button type="primary" @click="receiveCoupon">我要领券</x-button>
    </div>
  </div>
</template>

<script>
import LArticle from 'components/l-article'
import { XButton } from 'vux-components'
import { store, getters } from '../vuex'
import server from '../server'

export default {
  components: {
    LArticle, XButton
  },
  route: {
  	data({ to }) {
      server.activity.getInfo(to.query.id).then( info =>{
        this.info = info
        this.$vux.loading.hide()
      })
  	}
  },
  store,
  vuex: {
    getters
  },  
  methods: {
    receiveCoupon() {
      const self = this
      if( !(self.userinfo && self.userinfo.mobilePhone) ){
        self.$vux.toast.show({
          text: '请先登录',
          type: 'cancel',
          onHide() {
            self.$router.go('/login')    
          }
        })
      }else{
        self.$vux.loading.show('领取中')
        server.activity.receive(self.userinfo.mobilePhone, self.info.id, self.info.couponFkid)
        .then( body => {
          self.$vux.loading.hide()
          self.$vux.toast.show({
            text: body.message || '领取成功',
            onHide() {
              self.$router.replace('/user/coupon?direction=in')
            }
          })
        })
      }
    }
  },
  data() {
  	return {
  		info: {}
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
