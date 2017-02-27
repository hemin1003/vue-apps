// 应用配置
const _PAGE = './page'
export default {
  '*': {
    title: '找不到页面',
    component: (resolve) => require([_PAGE + '/404'], resolve)
  },
	'/login': {
    title: '登录',
    component: (resolve) => require([_PAGE + '/login'], resolve)
  },
  '/register': {
    title: '注册',
    component: (resolve) => require([_PAGE + '/register'], resolve)
  },
  '/news/list': {
    title: '艾臣资讯',
    component: (resolve) => require([_PAGE + '/news-list'], resolve)
  },
  '/news/list/info': {
    title: '资讯详情',
    component: (resolve) => require([_PAGE + '/news-info'], resolve)
  },
  '/home': {
    title: '首页',
    mainPage: true,
    component: (resolve) => require([_PAGE + '/home'], resolve)
  },
  '/order/tracking': {
    title: '订单跟踪',
    component: (resolve) => require([_PAGE + '/order-tracking'], resolve)
  },
  '/wellife': {
    title: '智慧生活',
    component: (resolve) => require([_PAGE + '/wellife'], resolve)
  },
  '/welfare': {
    title: '新人福利',
    component: (resolve) => require([_PAGE + '/welfare'], resolve)
  },
  '/welfare/gift': {
    title: '领取奖品',
    component: (resolve) => require([_PAGE + '/welfare-gift'], resolve)
  },
  '/australia': {
    title: '澳式风情',
    component: (resolve) => require([_PAGE + '/australia'], resolve)
  },
  '/company': {
    title: '企业简介',
    component: (resolve) => require([_PAGE + '/company'], resolve)
  },
  '/store/list': {
    title: '门店展示',
    component: (resolve) => require([_PAGE + '/store-list'], resolve)
  },
  '/store/list/info': {
    title: '门店详情',
    component: (resolve) => require([_PAGE + '/store-info'], resolve)
  },
  '/booking': {
    title: '在线预约',
    component: (resolve) => require([_PAGE + '/booking'], resolve)
  },
  '/activity': {
    title: '活动中心',
    mainPage: true,
    component: (resolve) => require([_PAGE + '/activity'], resolve)
  },
  '/activity/info': {
    title: '活动详情',
    component: (resolve) => require([_PAGE + '/activity-info'], resolve)
  },
  '/product': {
    title: '产品中心',
    mainPage: true,
    component: (resolve) => require([_PAGE + '/product'], resolve)
  },
  '/product/list': {
    title: '产品列表',
    component: (resolve) => require([_PAGE + '/product-list'], resolve)
  },
  '/product/list/info': {
    title: '产品详情',
    component: (resolve) => require([_PAGE + '/product-info'], resolve)
  },
  '/user': {
    title: '个人中心',
    mainPage: true,
    component: (resolve) => require([_PAGE + '/user'], resolve)
  },
  '/user/info': {
    title: '个人信息',
    auth: true,
    component: (resolve) => require([_PAGE + '/user-info'], resolve)
  },
  '/user/appointment': {
    title: '我的预约',
    auth: true,
    component: (resolve) => require([_PAGE + '/user-appointment'], resolve)
  },
  '/user/appointment/info': {
    title: '预约详情',
    auth: true,
    component: (resolve) => require([_PAGE + '/user-appointment-info'], resolve)
  },
  '/user/order': {
    title: '我的订单',
    auth: true,
    component: (resolve) => require([_PAGE + '/user-order'], resolve)
  },
  '/user/order/info': {
    title: '订单详情',
    auth: true,
    component: (resolve) => require([_PAGE + '/user-order-info'], resolve)
  },
  '/user/coupon/': {
    title: '我的优惠券',
    auth: true,
    component: (resolve) => require([_PAGE + '/user-coupon'], resolve)
  },
  '/user/coupon/select': {
    title: '选择优惠券',
    auth: true,
    component: (resolve) => require([_PAGE + '/user-coupon-select'], resolve)
  },
  '/user/coupon/info': {
    title: '优惠券详情',
    auth: true,
    component: (resolve) => require([_PAGE + '/user-coupon-info'], resolve)
  },
  '/user/pwd': {
    title: '重置密码',
    auth: true,
    component: (resolve) => require([_PAGE + '/user-pwd'], resolve)
  },
  '/user/faq': {
    title: '常见问题',
    auth: true,
    component: (resolve) => require([_PAGE + '/user-faq'], resolve)
  },
  '/user/faq/info': {
    title: '常见问题',
    auth: true,
    component: (resolve) => require([_PAGE + '/user-faq-info'], resolve)
  },
  '/user/faq/add': {
    title: '我要反馈',
    auth: true,
    component: (resolve) => require([_PAGE + '/user-faq-add'], resolve)
  },
  '/user/faq/feedback': {
    title: '反馈详情',
    auth: true,
    component: (resolve) => require([_PAGE + '/user-faq-feedback'], resolve)
  }
}

