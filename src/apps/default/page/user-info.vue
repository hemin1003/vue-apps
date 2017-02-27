<template>
  <div>
    <group class="l-group l-user-info">
      <cell title="头像">
        <img class="avatar" slot="value" width="50" height="50" :src="formData.photo || defaultVal.avatar">
      </cell>
      <cell title="手机号码" :value="userinfo.mobilePhone"></cell>
      <x-input class="l-input-arrow" title="真实姓名" :value.sync="formData.realName" placeholder="请填写" :show-clear="false" text-align="right"></x-input>
      <x-input class="l-input-arrow" title="电子邮箱" :value.sync="formData.email" placeholder="请填写" :show-clear="false" text-align="right"></x-input>
      <x-input class="l-input-arrow" title="QQ号码" :value.sync="formData.qq" placeholder="请填写" keyboard="number" :show-clear="false" text-align="right"></x-input>
    </group>
    <group class="l-group l-user-info">
      <x-input class="l-input-arrow" title="单位名称" :value.sync="formData.companyName" placeholder="请填写" :show-clear="false" text-align="right"></x-input>
      <address title="所在地区" :value.sync="address.value" raw-value :list="address.data" placeholder="请选择地区"></address>
      <x-input class="l-input-arrow" title="详细地址" :value.sync="formData.address" placeholder="请填写" :show-clear="false" text-align="right"></x-input>
      <!-- <x-textarea placeholder="详细地址" value="天河区科韵路方圆E时光2703"></x-textarea> -->
    </group>
    <div class="l-btn-area">
      <x-button type="primary" @click="submit">保存</x-button>
    </div>
  </div>
</template>
<script>
import { utils, storage } from 'assets/utils'
import { Group, XInput, Cell, XButton, Address, AddressChinaData } from 'vux-components'
import name2value from 'vux/src/filters/name2value'
import value2name from 'vux/src/filters/value2name'
import { store, getters, actions } from '../vuex'
import config from '../config'

export default {
  components: {
    Group, XInput, Cell, XButton, Address, AddressChinaData
  },
  route: {
    data() {
      let valueArr = []
      this.userinfo.provinceId && (valueArr[0] = this.userinfo.provinceId + '')
      this.userinfo.cityId && (valueArr[1] = this.userinfo.cityId + '')
      this.userinfo.areaId && (valueArr[2] = this.userinfo.areaId + '')
      this.address.value = valueArr
    }
  },
  store,
  vuex: { getters, actions },
  data() {
    return {
      defaultVal: config.defaultVal,
      formData: {
        photo: this.userinfo.photo,
        realName: this.userinfo.realName,
        email: this.userinfo.email,
        qq: this.userinfo.qq,
        companyName: this.userinfo.companyName,
        address: this.userinfo.address
      },
      address: {
        data: AddressChinaData,
        value: [],
        name: []
      }
    }
  },
  methods: {
    submit() {
      const self = this
      self.formData.id = self.userinfo.id
      if(self.address.value){
        self.formData.provinceId = self.address.value[0] || ''
        self.formData.cityId = self.address.value[1] || ''
        self.formData.areaId = self.address.value[2] || ''

        self.address.name = value2name(self.address.value, AddressChinaData).split(' ')
        self.formData.province = self.address.name[0] || ''
        self.formData.city = self.address.name[1] || ''
        self.formData.area = self.address.name[2] || ''
      }

      self.$vux.loading.show('保存中')
      self.$http.post('owner/modifyMemPersonalInfo', self.formData)
        .then(({ body }) => {
          self.$vux.loading.hide()
          if(body.success){
            storage.local.set('userinfo', Object.assign(self.userinfo, self.formData))
            self.acUpdateUserInfo()
            self.$vux.toast.show({
              text: '保存成功',
              onHide(){
                self.$router.go('/user')
              }
            })
          }else{
            self.$vux.toptips.show(body.message || '保存失败')
          }
        }, (error) => {
          self.$vux.loading.hide()
          self.$vux.toptips.show('服务器繁忙，请稍后重试！')
        })
    }
  }
}
</script>
<style>
.l-user-info .weui_cell{
  padding-top:11px;
  padding-bottom:11px;
 }
.l-user-info .avatar{
  vertical-align: middle;
  border-radius: 2px;
  border:1px solid #ebebeb;
}

.l-input-arrow:after{
  content: " ";
  display: inline-block;
  transform: rotate(45deg);
  height: 6px;
  width: 6px;
  border-width: 2px 2px 0 0;
  border-color: #C8C8CD;
  border-style: solid;
  position: relative;
  top: -1px;
  margin-left: .6em;
}
.weui_cell_ft .vux-popup-picker-value+span{
  color: #aaa;
}
.vux-popup-picker-value{
  color: #333;
}

</style>
