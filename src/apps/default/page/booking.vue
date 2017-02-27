<template>
  <div>
    <img src="~assets/imgs/temp-006.jpg">
    <img src="~assets/imgs/temp-007.jpg">
    <div style="background-color:#fff;padding:0.8rem 0;">
      <img src="~assets/imgs/temp-008.jpg">
    </div>
    <div class="l-margin-tb" style="background-color:#fff;padding:0.8rem 0;">
      <img class="l-center" style="width:80%;" src="~assets/imgs/temp-009.jpg">
      <group class="l-booking-form">
        <x-input placeholder="请输入姓名" :value.sync="formData.name" is-type="china-name"></x-input>
        <x-input placeholder="请输入手机号码" :value.sync="formData.mobilePhone" keyboard="number" is-type="china-mobile"></x-input>
        <address title="" :value.sync="address.value" raw-value :list="address.data" placeholder="请选择地区"></address>
      </group>
    </div>
    <div class="l-btn-area">
      <x-button type="primary" @click="submit">马上预约</x-button>
    </div>
  </div>
</template>
<script>
import { XButton, Group, XInput, Cell, Address, AddressChinaData } from 'vux-components'
import name2value from 'vux/src/filters/name2value'
import value2name from 'vux/src/filters/value2name'
import { store, getters } from '../vuex'
import server from '../server'

export default {
  components: {
    XButton, Group, XInput, Cell, Address, AddressChinaData
  },
  store,
  vuex: { getters },
  route: {
    data() {
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
      this.formData.name = this.userinfo.realName || this.userinfo.wxNickName || ''
      this.formData.mobilePhone = this.userinfo.mobilePhone || ''
    }
  },
  data() {
    return {
      formData: {
        name: '',
        mobilePhone: ''
      },
      address: {
        data: AddressChinaData,
        value: []
      }
    }
  },
  methods: {
    submit() {
      const self = this
      if(!self.formData.name){
        self.$vux.toptips.show('请输入您的姓名')
        return  
      }
      if(!self.$regexp.mobile.test(self.formData.mobilePhone)){
        self.$vux.toptips.show('请输入正确手机号码')
        return  
      }
      if(self.address.value.length === 0){
        self.$vux.toptips.show('请选择所在地区')
        return
      }
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

      self.$vux.loading.show('预约中')
      self.$http.post('owner/visitor/addAppoint', self.formData)
        .then((response) => {
          self.$vux.loading.hide()
          if(response.body.success){
            self.$vux.toast.show({
              time: 3000,
              text: '预约成功！您可以在[个人中心-我的预约]查看预约进度',
              width: '80%',
              onHide(){
                self.$router.go(`/user/appointment?phone=${self.formData.mobilePhone}`)
              }
            })
          }else{
            self.$vux.toptips.show(response.body.message || '预约失败')
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
  margin-left: 0.533333rem;
  margin-right: 0.533333rem;
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
