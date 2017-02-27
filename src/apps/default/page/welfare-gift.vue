<template>
  <div class="l-welfare-gift">
    <div class="l-box-1">
      <div class="l-box-2">
        <p class="l-fsize-sm">请放心大胆填写用户信息，工作人员审核后，会安排快递小哥愉快的将礼品送到您的手上哦~</p>
        <div class="l-flex-hc l-gift-list">
          <div class="l-item" v-for="item in giftList">
            <img :src="item.imgUrl">
          </div>
        </div>
      </div>
      <group class="l-booking-form">
        <x-input placeholder="请输入姓名" :value.sync="formData.consignee" is-type="china-name"></x-input>
        <x-input placeholder="请输入手机号码" :value.sync="formData.consigneePhone" keyboard="number" is-type="china-mobile"></x-input>
        <address title="" :value.sync="address.value" raw-value :list="address.data" placeholder="请选择地区"></address>
        <x-input placeholder="请输入详细地址" :value.sync="formData.address"></x-input>
      </group>
      <div class="l-btn-area">
        <x-button type="primary" @click="submit">提交</x-button>
      </div>
    </div>
  </div>
</template>
<script>
import { Dialog, XButton, Group, XInput, Cell, Address, AddressChinaData } from 'vux-components'
import name2value from 'vux/src/filters/name2value'
import value2name from 'vux/src/filters/value2name'
import { utils, storage } from 'assets/lib'
import { store, actions, getters } from '../vuex'
import config from '../config'
import server from '../server'
// import wx from 'weixin-js-sdk'

export default {
  components: {
    Dialog, XButton, Group, XInput, Cell, Address, AddressChinaData
  },
  route: {
    data() {
      const self = this
      const wxOpenId = self.route.query.wxOpenId
      const wxUnionId = self.route.query.wxUnionId
      // 获取奖品列表
      let promise1 = server.welfare.getGiftList(wxOpenId).then( list => {
        let giftList = []
        let ids = []
        let names = []
        list.forEach((item)=>{
          if(item.whetherExchange && !item.isExchanged){
            giftList.push(item)
            ids.push(item.id)
            names.push(item.giftName)
          }
        })
        giftList.ids = ids.join(',')
        giftList.names = names.join(',')
        self.giftList = giftList
      })
      // jssdk授权
      let promise2 = server.getWxConfig().then( wx =>{
        let url = utils.url.setArgs(window.location.href, {
          isFriend: new Date().getTime(),
          wxOpenId,
          wxUnionId
        })
        const shareConfig = {
          title: '考验友谊的时候到了，来帮我拼人脉吧~',                     // 分享标题
          desc: '我正在参加艾臣安全智能门窗新人领福利活动，速来围观！',     // 分享描述
          link: url,                                                        // 分享链接
          imgUrl: require('assets/imgs/temp-053.png')                       // 分享图标
        }
        // 分享到朋友圈/好友
        wx.onMenuShareTimeline(shareConfig)
        wx.onMenuShareAppMessage(shareConfig)
      })

      // 自动定位地址
      server.getAddress().then( address => {
        if(address.address_component){
          let province = address.address_component.province
          let city = address.address_component.city
          let area = address.address_component.district
          let tempValue = name2value([province, city, area], AddressChinaData).split(' ')
          if(tempValue && tempValue[0] !== '__'){
            this.address.value = tempValue
          }
        }
      })

      self.$vux.loading.show()
      Promise.all([promise1, promise2]).finally(()=>{
        self.$vux.loading.hide()
      })
    }
  },
  store,
  vuex: {
    getters
  },
  data() {
    return {
      formData: {
        consignee: '',
        consigneePhone: '',
        address: '',
        channel: 'NewWelfare'
      },
      address: {
        data: AddressChinaData,
        value: []
      },
      giftList: []
    }
  },
  methods: {
    submit() {
      const self = this
      if(self.giftList.length === 0){
        self.$vux.toptips.show('没有奖品可领取')
        return
      }

      if(!self.formData.consignee){
        self.$vux.toptips.show('请输入您的姓名')
        return  
      }
      if(!self.$regexp.mobile.test(self.formData.consigneePhone)){
        self.$vux.toptips.show('请输入正确手机号码')
        return  
      }
      if(self.address.value.length === 0){
        self.$vux.toptips.show('请选择所在地区')
        return
      }
      if(!self.formData.address){
        self.$vux.toptips.show('请输入详细地址')
        return  
      }

      self.formData.detailIds = self.giftList.ids
      self.formData.detailNames = self.giftList.names

      self.formData.provinceId = self.address.value[0] || ''
      self.formData.cityId = self.address.value[1] || ''
      self.formData.areaId = self.address.value[2] || ''
      let addressNames = value2name(self.address.value, AddressChinaData)
      addressNames = addressNames && addressNames.split(' ')
      if(addressNames.length > 0){
        self.formData.province = addressNames[0]
        self.formData.city = addressNames[1]
        self.formData.area = addressNames[2]       
      }
      self.formData.channel = 'NewWelfare'
      self.formData.accountPk = self.route.query.wxOpenId

      self.$vux.loading.show('提交中')
      self.$http.post('owner/visitor/addGiftSend', self.formData)
        .then((response) => {
          self.$vux.loading.hide()
          if(response.body.success){
            self.$vux.toast.show({
              time: 3000,
              text: '提交成功',
              onHide(){
                window.history.back()
              }
            })
          }else{
            self.$vux.toptips.show(response.body.message || '提交失败')
          }
        }, (error) => {
          self.$vux.loading.hide()
          self.$vux.toptips.show('服务器繁忙，请稍后重试！')
        })
    }
  }
}
</script>
<style lang="less">
.l-booking-form{
  margin-left: -0.5rem;
  .weui_cells:after, .weui_cells:before{
    display: none;
  }
  .vux-popup-picker-value{
    float: left;
    color: #333
  }
  .vux-popup-picker-value+span{
    float: left;
    color: #a9a9a9;
  }
}
</style>
<style scoped lang="less">
.l-welfare-gift{
  overflow: hidden;
  min-height: 100%;
  background: #4083c7 url('~assets/imgs/temp-062.jpg') no-repeat 50% top;
  background-size: 100% 100%;
  padding-bottom: 1.0rem;
}

.l-box-1{
  margin: 0.75rem; padding:0.75rem;
  background:#fff url('~assets/imgs/temp-063.jpg') no-repeat center bottom;
  background-size: contain;
}
.l-box-2{
  border-radius: 3px; background:#cfe7fd; padding: 0.75rem;
}

.l-gift-list{
  margin-top: 0.75rem;
  .l-item{
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    overflow:hidden;
    background-color: #fff;
    margin: 0.375rem;
    img{
      width: 100%;
      height: 100%;
    }
  }
}
</style>
