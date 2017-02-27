<template>
  <div>
    <div class="vux-center l-fsize-l" style="height: 3.2rem;">
      使用账号和密码登录
    </div>
    <group class="weui_cells_form">
      <x-input title="账号" placeholder="手机号码" keyboard="number" is-type="china-mobile" :value.sync="formData.accountName" ></x-input>
      <x-input type="password" title="密码" placeholder="请填写密码" :value.sync="formData.pwd"  :required="true"></x-input>
    </group>
    <div class="l-btn-area">
      <x-button type="primary" @click="submit">登录</x-button> 
      <x-button @click="wxlogin"><i class="iconfont" style="vertical-align:0; color:#04be02; margin-right:5px;">&#xe60a;</i>微信授权登录</x-button>
      <!-- <x-button v-link="'/register'">快速注册</x-button> -->
    </div>
  </div>
</template>
<script>
import { utils, storage } from 'assets/lib'
import { Group, XInput, XButton } from 'vux-components'
import { store, actions } from '../vuex'
import config from '../config'
import server from '../server'

// 上一页
let prevPath = storage.session.get('_history').prevPath
export default {
  components: {
    Group, XInput, XButton
  },
  store,
  vuex: {
    actions
  },
  data() {
    return {
      formData: {
        accountName: '',
        pwd: ''
      }
    }
  },
  methods: {
    submit() {
      let self = this
      if(!self.formData.accountName){
        self.$vux.toptips.show('账号不能为空')
        return  
      }
      if(!self.formData.pwd){
        self.$vux.toptips.show('密码不能为空')
        return  
      }

      self.$vux.loading.show('登录中')
      self.$http.post('owner/visitor/login', self.formData)
        .then(({ body }) => {
          self.$vux.loading.hide()
          if(body.success){
            body.data.photo = self.$image.wxHead( body.data.photo || body.data.wxHeadPhoto )
            storage.local.set('userinfo', body.data)
            self.acUpdateUserInfo()
            self.$router.replace( prevPath ? prevPath.indexOf('/register') === 0 ? '/' : prevPath : '/' )
          }else{
            self.$vux.toptips.show(body.message || '登录失败')
          }
        }, (error) => {
          self.$vux.loading.hide()
          self.$vux.toptips.show('服务器繁忙，请稍后重试！')
        })
    },
    wxlogin() {
      let absUrl = utils.url.join(config.getHost(), config.getPath(), '/register')
      absUrl = server.getGrantUrl(absUrl)
      if(utils.device.isWechat){
        utils.url.replace(absUrl)
      }else{
        utils.url.assign(absUrl)
      }
    }
  }
}
</script>
