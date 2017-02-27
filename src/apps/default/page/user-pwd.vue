<template>
  <div>
    <group title="请填写以下信息" class="weui_cells_form">
      <x-input placeholder="请输入手机号码" :value.sync="formData.mobilePhone" class="weui_vcode" keyboard="number" is-type="china-mobile">
        <button v-el:send-btn slot="right" class="weui-vcode-btn" @click="sendCode">发送验证码</button>
      </x-input>
      <x-input placeholder="请输入手机验证码" :value.sync="formData.validCode" :max="6" keyboard="number"></x-input>
      <x-input placeholder="请输入新密码" type="password" :value.sync="formData.newPwd"></x-input>
      <x-input placeholder="请再次输入新密码" type="password" :value.sync="formData.confirmPwd"></x-input>
    </group>
    <div class="l-btn-area">
      <x-button type="primary" @click="submit">提交</x-button>  
    </div>
  </div>
</template>
<script>
import { utils } from 'assets/lib'
import { Group, XInput, XButton } from 'vux-components'
import { store, actions } from '../vuex'
import server from '../server'

export default {
  components: {
    Group, XInput, XButton 
  },
  store,
  vuex: { actions },
  data() {
    return {
      formData: {
        mobilePhone: '',
        validCode: '',
        newPwd: '',
        confirmPwd: ''
      }
    }
  },
  methods: {
    sendCode() {
      server.sendMobiCode(this.formData.mobilePhone, this.$els.sendBtn)
    },
    submit() {
      const self = this
      if(!utils.regexp.mobile.test(self.formData.mobilePhone)){
        self.$vux.toptips.show('请输入正确手机号码')
        return  
      }
      if(!self.formData.validCode){
        self.$vux.toptips.show('请输入手机验证码')
        return  
      }
      if(!self.formData.newPwd){
        self.$vux.toptips.show('密码不能为空')
        return 
      }
      if(self.formData.newPwd !== self.formData.confirmPwd){
        self.$vux.toptips.show('两次密码不一致')
        return
      }

      self.$vux.loading.show('提交中')
      self.$http.post('owner/visitor/modifyPwd', self.formData)
        .then((response) => {
          self.$vux.loading.hide()
          if(response.body.success){
            self.$vux.toast.show({
              text: '重置密码成功',
              onHide(){
                self.$router.go('/user')
              }
            })
          }else{
            self.$vux.toptips.show(response.body.message || '重置密码失败')
          }
        }, (error) => {
          self.$vux.loading.hide()
          self.$vux.toptips.show('服务器繁忙，请稍后重试！')
        })
    }
  }
}
</script>
