import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

// 应用状态
const state = {
  app_userinfo: {},
  app_coupon: {},
  app_direction: ''  // in or out
}

// 变更函数
const mutations = {
  APP_DIRECTION (state, inOrout = '') {
    state.app_direction = inOrout
  },
  APP_USERINFO(state, userinfo = {}){
    state.app_userinfo = userinfo
  },
  APP_COUPON(state, coupon = {}){
    state.app_coupon = coupon
  }
}

// Store实例
export default new Vuex.Store({
  state,
  mutations
})
