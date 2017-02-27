// 应用配置
const _HOST = window.location.origin
const _PATH = '/'
let _qrcode = require('assets/imgs/yz-qrcode-online.jpg')
let _appid = 'wx5afd32ac14c76152'
let _serverPath = 'http://ktz.aylsonclub.com/service'

// 测试环境
if(_HOST.indexOf('http://ktz.aylsonclub.com') === -1){
  _qrcode = require('assets/imgs/yz-qrcode-test.jpg')
  _appid = 'wxc8123454324da8b0'
  _serverPath = 'https://test.aylsonclub.com/dc-web'
}

export default {
  getHost: () => _HOST,
  getPath: () => _PATH,
  getServerPath: () => _serverPath,
  getAppid: () => _appid,
  defaultVal: {
    avatar: require('assets/imgs/avatar.png'),
    avatarBg: require('assets/imgs/avatar-bg.jpg'),
    qrcode: _qrcode
  },
  // 组件生命周期 http://vuejs.org.cn/guide/instance.html#生命周期图示
  vueHook: {
  	'hook:created': function() { 
      console.log('%s components created!', this.$route.path)
    },
    'hook:ready': function() {
      console.log('%s components ready!(loadingRouteData:%s)' , this.$route.path, this.$loadingRouteData)
    }
  },
  // 路由生命周期 https://github.com/vuejs/vue-router/blob/1.0/docs/zh-cn/pipeline/hooks.md
  routeHook: { 
    // waitForData: true,
    data(transition) {
      // 每次路由变动时都会被调用
      // 在此异步获取数据，此时界面已可见
      console.log('%s data ready!(loadingRouteData:%s)' , transition.to.path, this.$loadingRouteData)
    },
    canActivate(transition) {
      // 在此验证页面授权
      console.log('%s canActivate!' , transition.to.path)
      transition.next()
    },
    activate(transition) { 
      // 当组件被创建而且将要切换进入的时候被调用，(组件可重用时不调用)
      // 在此异步获取数据，此时界面不可见
      console.log('%s activate!' , transition.to.path)
      transition.next()
    },
    canDeactivate(transition){
      console.log('%s canDeactivate!' , transition.to.path)
      transition.next()
    },
    deactivate(transition) { 
      // 当一个组件将要被禁用和移除之时被调用
      console.log('%s deactivate!' , transition.to.path)
      transition.next()
    }
  }
}

