<template>
  <div class="l-flex-vhc l-fgray" style="height:100%;">
    <img width="260" src="~assets/imgs/404.jpg">
    <p>哎呀呀，友好页面的小船说翻就翻了...</p>
    <p class="l-fsize-sm"><span v-text="timeout">3</span>s&nbsp;后自动跳转到上一页...</p>
    <br>
    <x-button mini @click="back">返回上一页</x-button>
    <br><br><br><br><br>
  </div>
</template>

<script>
import { XButton } from 'vux-components'
export default {
  components: {
    XButton
  },
  ready() {
    const self = this
    let timeid = setInterval(()=>{
      if(--self.timeout <= 0){
        clearInterval(timeid)
        self.back()
      }
    }, 1000)
  },
  data() {
    return {
      timeout: 3
    }
  },
  methods: {
    back() {
      window.history.back()
    }
  }
}
</script>

