<template>
  <div>
    <sticky>
      <tab :line-width="2" :index.sync="tabIndex">
        <tab-item :selected="tabIndex === 0" @click="tabClick(0)">未使用</tab-item>
        <tab-item :selected="tabIndex === 1" @click="tabClick(1)">已使用</tab-item>
        <tab-item :selected="tabIndex === 2" @click="tabClick(2)">已过期</tab-item>
      </tab>
    </sticky>
    <div class="l-coupon-list" v-show="tabIndex === 0" >
      <div class="l-flex-h l-coupon-item-0" v-for="item in tabData[tabIndex]">
        <div class="l-rest par">
          <p v-text="item.couponName"></p>
          <p style="margin:0.375rem 0;"><sub class="sign">￥</sub><span v-text="item.couponValue"></span></p>
          <p class="l-fsize-s" v-text="item.ruleDesc"></p>
        </div>
        <div class="copy l-flex-vhc">
          <p>有效日期</p>
          <div class="time">
            {{getDate(item.startTime)}}<br>{{getDate(item.endTime)}}
          </div>
          <!-- <x-button mini v-link="'/booking?direction=in&id=' + item.id">立即使用</x-button> -->
        </div>
        <i></i>
      </div>
    </div>
    <div class="l-coupon-list" v-show="tabIndex === 1">
      <div class="l-flex-h l-coupon-item-used" v-for="item in tabData[tabIndex]">
        <div class="l-rest par">
          <p v-text="item.couponName"></p>
          <p style="margin:0.375rem 0;"><sub class="sign">￥</sub><span v-text="item.couponValue"></span></p>
          <p class="l-fsize-s" v-text="item.ruleDesc"></p>
        </div>
        <div class="copy l-flex-vhc">
          <p>有效日期</p>
          <div class="time">
            {{getDate(item.startTime)}}<br>{{getDate(item.endTime)}}
          </div>
        </div>
        <i></i>
      </div>
    </div>
    <div class="l-coupon-list" v-show="tabIndex === 2">
      <div class="l-flex-h l-coupon-item-used" v-for="item in tabData[tabIndex]">
        <div class="l-rest par">
          <p v-text="item.couponName"></p>
          <p style="margin:0.375rem 0;"><sub class="sign">￥</sub><span v-text="item.couponValue"></span></p>
          <p class="l-fsize-s" v-text="item.ruleDesc"></p>
        </div>
        <div class="copy l-flex-vhc">
          <p>有效日期</p>
          <div class="time">
            {{getDate(item.startTime)}}<br>{{getDate(item.endTime)}}
          </div>
        </div>
        <i></i>
      </div>
    </div>
    <div v-if="loading" class="l-loading"><br><br><br><br><br></div>
  </div>
</template>
<script>
import {store, getters } from '../vuex'
import server from '../server'
import {Tab, TabItem, Divider, XButton, Sticky } from 'vux-components'

export default {
  components: {Tab, TabItem, Divider, Sticky, XButton },
  route: {
    data() {
      this.tabClick(0)
    }
  },
  store,
  vuex: {
    getters
  },
  data() {
    return {
      loading: true,
      tabDirection: 'vux-pop-in',
      tabIndex: -1,
      tabData: [[],[],[]]
    }
  },
  methods: {
    tabClick(index) {
      const self = this
      if(self.tabIndex === index) return
      self.tabDirection =  index < self.tabIndex ? 'vux-pop-out' : 'vux-pop-in'
      self.tabIndex = index

      if(self.tabData[index].length === 0){
        self.loading = true
        server.coupon.getList(self.userinfo.mobilePhone, index).then( list => {
          self.loading = false
          self.tabData.$set(index, list)
        })
      }
    },
    getDate(datetime) {
      if(!datetime) return ''
      return datetime.split(' ')[0]
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
  i {
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
      line-height: 1.4;
    }
    span {
      font-size: 30px;
      color: #fff;
      margin-right: 5px;
      line-height: 1.6rem;
    }
    .sign {
      font-size: 18px;
      margin-right: 0.25rem;
    }
    sub {
      position: relative;
      top: -7px;
      // color: rgba(255, 255, 255, .8);
    }
  }
  .copy {
    width: 35%;
    max-width: 8.0rem;
    color: rgb(255, 255, 255);
    .time{
      line-height: 1.6;
      text-align: center;
      font-size: 12px;
      margin: 10px;
    }
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
