import ToptipsComponent from 'components/toptips'

let $vm
let watcher

export default {
  install (vue) {

    if (!$vm) {
      const Toptips = vue.extend(ToptipsComponent)
      $vm = new Toptips({
        el: document.createElement('div')
      })
      document.body.appendChild($vm.$el)
    }

    const toptips = {
      show (options) {
        // destroy watcher
        watcher && watcher()
        if (typeof options === 'object') {
          for (let i in options) {
            if (i !== 'content') {
              $vm[i] = options[i]
            } else {
              $vm.$el.querySelector('.l-toptips-cont').innerHTML = options['content']
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
        $vm.show = false
      }
    }

    // all Vux's plugins are included in this.$vux
    if (!vue.$vux) {
      vue.$vux = {
        toptips
      }
    } else {
      vue.$vux.toptips = toptips
    }

    vue.mixin({
      created: function () {
        this.$vux = vue.$vux
      }
    })
  }
}
