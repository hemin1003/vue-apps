// import { INCREMENT, DECREMENT } from './mutation-types'
import { storage } from 'assets/utils'
// getters与actions命名不能相同
const getters = {
	route: (state) => state.route,
	userinfo: (state) => {
		let userinfo = null
		if(state.app_userinfo && state.app_userinfo.mobilePhone){
			userinfo = state.app_userinfo
		}else{
			userinfo = storage.local.get('userinfo') || {}
		}
    console.log(userinfo)
    return userinfo
	},
	coupon: (state) => state.app_coupon,
  direction: (state) => state.app_direction
}

const actions = {
	acUpdateUserInfo: ({ dispatch }) => {
		dispatch('APP_USERINFO', storage.local.get('userinfo') || {})
	},
	acClearUserInfo({ dispatch }) {
		storage.local.set('userinfo', null, 0)
		dispatch('APP_USERINFO', {})
	},
	acSelectCoupon({ dispatch }, coupon = {}) {
		dispatch('APP_COUPON', coupon)
	}
}
module.exports = { getters, actions }

// export default {
// 	getters, actions
// }
