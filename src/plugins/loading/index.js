import LoadingComponent from 'vux-components/loading'

let $vm
let watcher

export default {
  install (vue) {

    if (!$vm) {
      const Loading = vue.extend(LoadingComponent)
      $vm = new Loading({
        el: document.createElement('div'),
        propsData: {
          text: '加载中'
        }
      })
      document.body.appendChild($vm.$el)
    }

    const loading = {
      show (options) {
        // destroy watcher
        watcher && watcher()
        if (typeof options === 'object') {
          for (let i in options) {
            if (i !== 'content') {
              $vm[i] = options[i]
            } else {
              $vm.$el.querySelector('.weui_toast_content').innerHTML = options['content']
            }
          }
        } else if (typeof options === 'string') {
          $vm.text = options
        }
        if (typeof options === 'object' && (options.onShow || options.onHide)) {
          watcher = $vm.$watch('show', (val) => {
            val && options.onShow && options.onShow($vm)
            val === false && options.onHide && options.onHide($vm)  
          })
        }
        $vm.show = true
      },
      hide () {
        $vm.text = '加载中'
        $vm.show = false
      }
    }

    // all Vux's plugins are included in this.$vux
    if (!vue.$vux) {
      vue.$vux = {
        loading
      }
    } else {
      vue.$vux.loading = loading
    }

    vue.mixin({
      created: function () {
        this.$vux = vue.$vux
      }
    })
  }
}
