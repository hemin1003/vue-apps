<template>
  <div>
    <div v-if="!avatar" class="vux-center l-fsize-l" style="height: 3.2rem;">
      填写注册信息
    </div>
    <div v-else class="vux-center" style="padding:0.75rem 0;">
      <img style="width:3.0rem;height:3.0rem;border-radius:50%;border:1px solid #ccc" :src="avatar">
    </div>
    <group class="weui_cells_form">
      <x-input placeholder="请输入手机号码" :value.sync="formData.mobilePhone" class="weui_vcode" keyboard="number" is-type="china-mobile">
        <button v-el:send-btn slot="right" class="weui-vcode-btn" @click="sendCode">发送验证码</button>
      </x-input>
      <x-input placeholder="请输入手机验证码" :value.sync="formData.validCode" :max="6" keyboard="number"></x-input>
      <x-input placeholder="请输入密码" type="password" :value.sync="formData.pwd" :required="true"></x-input>
      <x-input placeholder="请再次输入密码" type="password" :value.sync="formData.confirmPwd"></x-input>
    </group>
    <div class="l-btn-area">
      <x-button type="primary" @click="submit">快速注册</x-button> 
      <x-button @click="$router.replace('/login?direction=out')">返回登录</x-button>
    </div>
  </div>
</template>
<script>
import { Group, XInput, XButton } from 'vux-components'
import { utils, storage } from 'assets/lib'
import { store, actions } from '../vuex'
import server from '../server'

export default {
  components: {
    Group, XInput, XButton
  },
  store,
  vuex: {
    actions
  },
  route: {
    data() {
      let wxinfo = storage.session.get('wxinfo')
      if(wxinfo && wxinfo.wxHeadPhoto){
        this.avatar = utils.image.wxHead(wxinfo.wxHeadPhoto)
      }
    },
    canActivate(transition){
      const code = transition.to.query.code
      if(code){ // 如果页面已授权
        // 获取微信信息及判断是否已注册
        server.getWxByCode(code).then( info =>{
          if(info.mobilePhone){
            info.photo = utils.image.wxHead( info.photo || info.wxHeadPhoto )
            storage.local.set('userinfo', info)
            transition.redirect('/user')  
          }else{
            storage.session.set('wxinfo', info)
          }
          transition.next()
        })
      }else{
        transition.next()
      }
    }
  },
  data() {
    return {
      avatar: '',
      formData: {
        mobilePhone: '',
        validCode: '',
        pwd: '',
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
      let wxinfo = storage.session.get('wxinfo')

      if( !(wxinfo && wxinfo.wxOpenId) ){
        self.$vux.toptips.show('没有获取到微信授权信息，请重新进入页面')
        return  
      }

      if(!utils.regexp.mobile.test(self.formData.mobilePhone)){
        self.$vux.toptips.show('请输入正确手机号码')
        return  
      }
      if(!self.formData.validCode){
        self.$vux.toptips.show('请输入手机验证码')
        return  
      }
      if(!self.formData.pwd){
        self.$vux.toptips.show('密码不能为空')
        return 
      }
      if(self.formData.pwd !== self.formData.confirmPwd){
        self.$vux.toptips.show('两次密码不一致')
        return
      }

      utils.extend(self.formData, wxinfo)

      self.$vux.loading.show('注册中')
      self.$http.post('owner/visitor/register', self.formData)
      .then(({ body }) => {
        self.$vux.loading.hide()
        if(body.success && body.data){
          body.data.photo = utils.image.wxHead( body.data.photo || body.data.wxHeadPhoto )
          storage.local.set('userinfo', body.data)
          self.$router.replace('/user')  
        }else{
          self.$vux.toptips.show(body.message || '注册失败')
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


</style>
