import ConfirmComponent from 'vux-components/confirm'

let $vm
let watcher

export default {
  install (vue) {

    if (!$vm) {
      const Confirm = vue.extend(ConfirmComponent)
      $vm = new Confirm({
        el: document.createElement('div'),
        propsData: {
          title: '确认提示',
          confirmText: '确定',
          cancelText: '取消'
        }
      })
      document.body.appendChild($vm.$el)
    }

    const confirm = {
      show (options) {
        // destroy watcher
        watcher && watcher()
        if (typeof options === 'object') {
          for (let i in options) {
            if (i !== 'content') {
              $vm[i] = options[i]
            } else {
              $vm.$el.querySelector('.weui_dialog_bd').innerHTML = options['content']
            }
          }
          options.onCancel && $vm.$on('on-cancel', options.onCancel)
          options.onConfirm && $vm.$on('on-confirm', options.onConfirm)
          
        } else if (typeof options === 'string') {
          $vm.$el.querySelector('.weui_dialog_bd').innerHTML = options
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
        $vm.show = false
      }
    }

    // all Vux's plugins are included in this.$vux
    if (!vue.$vux) {
      vue.$vux = {
        confirm
      }
    } else {
      vue.$vux.confirm = confirm
    }

    vue.mixin({
      created: function () {
        this.$vux = vue.$vux
      }
    })
  }
}
