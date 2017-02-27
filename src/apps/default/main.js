import { Vue, utils, storage } from 'assets/lib'
import Router from 'vue-router'
import { sync } from 'vuex-router-sync'
import RouterMap from './router-map'
import store from './vuex/store'
import config from './config'
import App from './app'

// https://github.com/ftlabs/fastclick/
import FastClick from 'fastclick'
FastClick.attach(document.body)

// plugins
import ToastPlugin from 'plugins/toast'
import AlertPlugin from 'plugins/alert'
import ConfirmPlugin from 'plugins/confirm'
import ToptipsPlugin from 'plugins/toptips'
import LoadingPlugin from 'plugins/loading'
Vue.use(ToastPlugin)
Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)
Vue.use(ToptipsPlugin)
Vue.use(LoadingPlugin)

// ---------
Vue.http.options.root = config.getServerPath()

// https://github.com/vuejs/vue-router/tree/1.0/docs/zh-cn
Vue.use(Router)
const router = new Router({
	history: true,
  root: config.getPath(),
  saveScrollPosition: true,
  // suppressTransitionError: true,
  transitionOnLoad: false
})

// 设置路由
router.map(RouterMap)
// 默认跳转home页面
router.redirect({
  '/': '/home',
  '/index.html': '/home'
})

// keep vue-router and vuex store in sync
// store.state.route.path 
// store.state.route.params 
// store.state.route.query
sync(store, router)

// 记录首次进入app的路径，用于微信授权登录
storage.session.set('wx_url', window.location.href)

// 跳转站外链接
router.beforeEach(({to, next, abort}) => {

  let url = to.path.substring(config.getPath().length)
  if(/^http(s?)/i.test(url)){
    window.location.assign(url)
    abort()
  }else{
    setTimeout(next, 50)  
  }
})

// 验证登陆
router.beforeEach((transition) => {
  if(transition.to.auth){
    let userInfo = storage.local.get('userinfo')
    if( !(userInfo && userInfo.mobilePhone) ){
      transition.redirect('/login')
    }
    return true
  }
  setTimeout(transition.next, 50)
})

// 记录页面浏览顺序，用来判断动画方向
let _history = {  count: 0 , prevPath: '/', currPath: '' }

// 调用发生在整个切换流水线之前。如果此钩子函数拒绝了切换，整个切换流水线根本就不会启动
router.beforeEach(({ to, from, next }) => {
  console.log('%s router beforeEach!', to.path)
  // 记录当前地址和上一页地址
  _history.prevPath = from.path
  _history.currPath = to.path
  
  // 判断页面进场方向
  let toIndex = _history[to.path]
  let fromIndex = _history[from.path]
  
  
  if(!toIndex){
    Vue.$vux.loading.show()
    _history[to.path] = ++_history.count
  }

  if(!from.path || (from.mainPage && to.mainPage)){
    store.dispatch('APP_DIRECTION', '')
  }else if(!from.mainPage && to.mainPage){
    store.dispatch('APP_DIRECTION', 'out') 
  }else if(from.mainPage && !to.mainPage){
    store.dispatch('APP_DIRECTION', 'in') 
  }else if(!(toIndex < fromIndex)){
    store.dispatch('APP_DIRECTION', 'in')
  }else{
    store.dispatch('APP_DIRECTION', 'out')
  }

  if(to.query && to.query.direction){
    store.dispatch('APP_DIRECTION', to.query.direction)
  }

  // from.path.startsWith(to.path) 安卓微信报错
  if(from.path){
    if(from.path.indexOf(to.path) === 0){
      store.dispatch('APP_DIRECTION', 'out')
    }else if(to.path.indexOf(from.path) === 0){
      store.dispatch('APP_DIRECTION', 'in')
    }
  }

  storage.session.set('_history', _history)
  setTimeout(next, 100)
})

// 此钩子函数一个类型为切换对象的参数，但是你只能访问此参数的 to 和 from 属性, 这两个属性都是路由对象。在这个后置钩子函数里不能调用任何切换函数。
router.afterEach(({ to , from }) => {
  console.log('%s router afterEach!', to.path)
  Vue.$vux.loading.hide()
  utils.setTitle(to.title)
  storage.session.set('_history', _history)
})

router.start(App, '#app')