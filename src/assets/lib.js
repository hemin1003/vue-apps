// import 'vux/dist/vux.css'
import 'vux/src/styles/index.less'
import 'assets/global.less'
import Vue from 'vue'
import Resource from 'vue-resource'
import { utils, storage } from 'assets/utils'

// mixin 合并策略
const strategies = Vue.config.optionMergeStrategies
strategies.route = strategies.methods

// 配置是否允许 vue-devtools 检查代码
// Vue.config.devtools = true
Vue.mixin({ // 设备检测
  created: function () {
    this.$device = utils.device
    this.$regexp = utils.regexp
    this.$image = utils.image
  }
})

// https://github.com/pagekit/vue-resource/blob/master/docs/http.md
Vue.use(Resource)
Vue.http.options.emulateJSON = true
// Vue.http.options.xhr = { withCredentials: true }
// Vue.http.headers.common['Authorization'] = 'Basic YXBpOnBhc3N3b3Jk'
// Vue.http.options.emulateHTTP = true

module.exports = { Vue, utils, storage }

