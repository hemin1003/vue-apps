<template>
  <div>
    <div class="l-coupon-list">
      <div class="l-flex-hc l-coupon-item-0" v-for="item in list" @click="slt(item)">
        <div class="l-rest par">
          <p v-text="item.couponName"></p>
          <sub class="sign">￥</sub><span v-text="item.couponValue"></span>
          <p class="l-fsize-sm" v-text="item.ruleDesc"></p>
        </div>
        <div class="copy l-flex-vhc">
          <p>有效日期</p>
          <div class="time">
            {{getDate(item.startTime)}}<br>{{getDate(item.endTime)}}
          </div>
        </div>
        <icon class="l-icon-slt" :type="item.slted ? 'success' : 'circle' "></icon>
        <i class="l-decorate"></i>
      </div>
    </div>
    <div v-if="loading" class="l-loading"><br><br><br><br><br></div>
  </div>
</template>
<script>
import {store, getters, actions } from '../vuex'
import server from '../server'
import { Divider, XButton, Icon } from 'vux-components'

export default {
  components: { Divider, XButton, Icon },
  route: {
    data() {
      const self = this
      server.coupon.getList(self.userinfo.mobilePhone).then( list => {
        self.list = list.map( item => {
          if(self.coupon.id === item.id){
            item.slted = true  
          }else{
            item.slted = false
          }
          return item
        })
        self.loading = false
      })
    }
  },
  store,
  vuex: {
    getters, actions
  },
  data() {
    return {
      loading: true,
      list: []
    }
  },
  methods: {
    getDate(datetime) {
      if(!datetime) return ''
      return datetime.split(' ')[0]
    },
    slt(coupon) {
      coupon.slted = !coupon.slted
      this.list = this.list.map((item)=>{
        if(item.id !== coupon.id){
          item.slted = false  
        }
        return item
      })

      this.acSelectCoupon(coupon)
      window.history.back()
    }
  }
}
</script>
<style scoped lang="less">
.l-coupon-list{
  box-sizing: border-box;
  padding: 0 0.75rem;
}

[class*=l-coupon-item] button{
  border-radius: 2px;
  position: relative;
  z-index: 2;
}
[class*=l-coupon-item] button:after{
  display: none;
}

[class*=l-coupon-item] {
  background: #F39B00;
  margin: 0.75rem 0;
  box-sizing: border-box;
  width: 100%;
  min-height: 3.413333rem;
  padding: 0 10px;
  position: relative;
  overflow: hidden;
  i.l-decorate {
    position: absolute;
    left: -20%;
    top: 20%;
    height: 100%;
    width: 200%;
    background-color: rgba(255, 255, 255, .15);
    transform: rotate(-30deg);
    z-index: 1;
  }
  .par {
    padding: 10px;
    border-right: 2px dashed rgba(255, 255, 255, .3);
    text-align: left;
    p {
      color: #fff;
      font-size: 16px;
      line-height: 21px;
    }
    span {
      font-size: 30px;
      color: #fff;
      margin-right: 5px;
      line-height: 1.6rem;
    }
    .sign {
    }
    sub {
      position: relative;
      top: -5px;
      color: rgba(255, 255, 255, .8);
    }
  }
  .copy {
    width: 35%;
    max-width: 4.0rem;
    color: rgb(255, 255, 255);
    .time{
      line-height: 1.6;
      text-align: center;
      font-size: 12px;
      margin: 10px;
    }
  }
  .l-icon-slt:before{
    color: #fff;
  }
}

[class*=l-coupon-item]:before, [class*=l-coupon-item]:after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 6px;
  background:radial-gradient(rgb(235, 235, 235) 0, rgb(235, 235, 235) 5px, transparent 5px) repeat-y;
  background-size: 16px 16px;
}
[class*=l-coupon-item]:before{
  left: 0;
  background-position: -8px top;
  // display: none;
}
[class*=l-coupon-item]:after{
  right: 0;
  background-position: -2px top;
}

.l-coupon-item-used{
  background-color: #999;
}
.l-coupon-item-used button{
  display: none;
}
.l-coupon-item-0{
  background-color: #F39B00;
}
.l-coupon-item-1{
  background-color: #D24161;
}
.l-coupon-item-2{
  background-color: #7EAB1E;
}
.l-coupon-item-3{
  background-color: #50ADD3;
}
</style>
