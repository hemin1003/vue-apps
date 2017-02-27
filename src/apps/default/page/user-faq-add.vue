<template>
  <div>
    <group title="请填写您的反馈信息">
      <x-input placeholder="简单写个标题" :value.sync="formData.title"></x-input>
      <x-textarea :max="200" :value.sync="formData.content" placeholder="请详细描述您的问题，客服妹子会尽快回复您的~"></x-textarea>
    </group>
    <div class="l-btn-area">
      <x-button type="primary" @click="submit">提交</x-button>  
    </div>
  </div>
</template>

<script>
import { store, getters, actions } from '../vuex'
import { Group, Cell, XButton, XTextarea, XInput } from 'vux-components'

export default {
  components: {
    Group, Cell, XButton, XTextarea, XInput
  },
  data () {
    return {
      formData: {
        clientId: '',
        title: '',
        content: ''
      }
    }
  },
  store,
  vuex: {
    getters
  },
  methods: {
    submit() {
      const self = this
      self.formData.clientId = self.userinfo.id 
      if(!self.formData.title){
        self.$vux.toptips.show('标题不能为空')
        return
      }
      if(!self.formData.content){
        self.$vux.toptips.show('请详细描述您的问题')
        return
      }

      const promise = self.$http.post('owner/addFeedBack', self.formData)
      promise.then((response)=>{
        if(response.body.success){
          self.$vux.toast.show({
            text: '提交成功',
            onHide() {
              window.history.back()
            }
          })
        }else{
          self.$vux.toast.show(response.body.message || '提交失败')
        }
      })
    }
  }
}
</script>

<style>

</style>
