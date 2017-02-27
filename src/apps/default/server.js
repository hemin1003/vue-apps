import { Vue, utils, storage } from 'assets/lib'
import config from './config'

Vue.http.options.root = config.getServerPath()
const ERROR_MSG = {
  api: '服务器繁忙，请稍后重试！'
}

// 分页数据类
class List {
  constructor(type){
    this._type = type
    this.isLoading = false          // 正在请求数据
    this.isNull = false             // 表示后台已无数据返回，无需再发送请求
    this.isAjax = false             // 是否已请求过数据
    this.alldata = []               // 累计分页已返回数据
    this.data = []                  // 当前分页数据
    this.page = 0                   // 当前页数
    this.gotoPage = 1               // 跳转到第几页
    this.pageList = [1]             // 分页数组
    this.rowsList = [10, 20, 50]    // 每页条数
    this.total = 1                  // 总条数
    this.totalPage = 1              // 总页数

    this.rows = 10                  // 条数
    this.isPage = true              // 是否分页
    this.params = {}                // 异步发送数据
    this.beforeAjax = utils.noop
    this.callback = utils.noop

  }
  init() {
    this.isAjax = false
    this.isNull = false
    this.data = []
    this.alldata = []
    this.goto(1)
  }
  next() {
    if(!this.isLoading && this.page < this.totalPage){
      this.page = Math.min(++this.page, this.totalPage)
      this.ajax()  
    }
    return this
  }
  prev() {
    if(!this.isLoading && this.page > 1){
      this.page = Math.min(--this.page, 1)
      this.ajax()  
    }
    return this
  }
  goto(index = 1) {
    if(utils.isNumber(index) && !this.isLoading){
      index = Math.min(Math.max(index, 1), this.totalPage)  
      this.page = index
      this.ajax()
    }
    return this
  }
  ajax() {
    if(this.isLoading){ return this }
    let url = ''
    switch (this._type) {
      case 'news':              // 新闻列表
        url = 'owner/visitor/getPublishList'
        break
      case 'activity':          // 活动列表
        url = 'owner/visitor/getCouponActivity'
        break
      case 'appointment':       // 预约列表
        url = 'owner/visitor/getAppointList'
        break
      case 'order':             // 订单列表
        url = 'owner/visitor/getOrderList'
        break
      case 'faq':               // 常见问题列表
        url = 'owner/visitor/getHelpList'
        break
      case 'feedback':          // 反馈问题列表
        url = 'owner/getMyFeedBackList'
        break
      case 'feedbackReply':     // 反馈详情回复列表
        url = 'owner/getMyFeedBackReply'
        break
      case 'store':             // 门店列表
        url = 'owner/visitor/getStoreList'
        break
    }
    this.params.page = this.page
    this.params.rows = this.rows
    this.isLoading = true
    this.beforeAjax(this.isLoading)
    Vue.http.get(url, {
      params: this.params
    }).then(function({ body }){
      this.isAjax = true
      this.isLoading = false
      if(body.success && body.data){
        this.gotoPage = this.page
        
        this.total = body.data.total
        this.totalPage = body.data.totalPage

        // 分页数组 [1,2,3,'...',10,11,12]
        let pageList = []
        for (let i = Math.max(this.page - 3, 1); i <= Math.min(this.page + 3, this.totalPage); i++) {
          pageList.push(i)
        }
        if(this.totalPage > 10 && (this.totalPage - this.page) > 3){
          pageList.push('...')
          pageList.push(this.totalPage)
        }

        let data = body.data.rowsObject ? body.data.rowsObject : []
        this.data = data
        this.alldata = this.alldata.concat(this.data)
        if(body.data.page >= body.data.totalPage){
          this.isNull = true
        }
        
      }
      this.callback(this.alldata)
    }.bind(this), function(error){
      this.isAjax = true
      this.isLoading = false
      this.callback(this.alldata)
    }.bind(this))
  }
}

export default {
  // 获取微信授权路径 url为绝对路径
  getGrantUrl(url, params) {
    if(!url) return ''

    let appid = config.getAppid()
    url = utils.url.setArgs(url, params)
    utils.device.isWechat && (url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${url}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`)
    return url
  },
  // 获取微信信息
  getWxByCode(code) {
    let ret = {}
    let promise = new Promise( (resolve) => {
      if(!code){
        resolve(ret)
      }else{
        Vue.http.get('owner/getByCode', {
          params: { code }
        }).then(({ body })=>{
          if(body.success && body.data){
            resolve(body.data)
          }else{
            resolve(ret)
            utils.alert.call(Vue, body.message)
          }
        }, (error)=>{
          resolve(ret)
          utils.alert.call(Vue, ERROR_MSG.api)
        })
      }
    })
    return promise
  },
  // 获取jssdk授权配置
  getWxConfig(url) {
    url = url || storage.session.get('wx_url')
    let self = this
    let config = {
      debug: false,
      appId: '',
      timestamp: '',
      nonceStr: '',
      signature: '',
      jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'openLocation', 'getLocation', 'hideOptionMenu', 'showOptionMenu']
    }

    let promise = new Promise((resolve) => {
      if(!window.wx){
        utils.alert.call(Vue, '没有引入jweixin')
        resolve({})
      }else{
        window.wx._ready = false
        Vue.http.get('wx/frame/getWxSignature', {
          params: { url, t: new Date().getTime() }
        }).then(({ body })=>{
          if(body.success){
            config.appId = body.data.appId
            config.timestamp = body.data.timestamp
            config.nonceStr = body.data.noncestr
            config.signature = body.data.signature

            window.wx.config(config)

            window.wx.ready(()=>{
              wx.checkJsApi({
                jsApiList: config.jsApiList,
                success(res) {
                  utils.debug(res)
                  config.jsApiList.forEach((item)=>{
                    if(window.wx._try){
                      resolve(window.wx)
                    }

                    if(res.checkResult[item]){
                      window.wx._ready = true
                      window.wx._try = false
                      resolve(window.wx)
                      return true
                    }
                  })
                }
              })
            })

            window.wx.error((error)=>{
              window.wx._ready = false
              utils.debug(error)
              if(!window.wx._try){
                window.wx._try = true
                self.getWxConfig(window.location.href)
              }else{
                resolve(window.wx) 
              }
            })

            if(!utils.device.isWechat){
              resolve(window.wx)
            }
          }else{
            resolve(window.wx)
          }
        }, (error)=>{
          resolve(window.wx)
        })
      }
    })
    return promise
  },
  // 获取临时二维码
  getWxTempQrCode(inviterWxOpenId, inviterWxUnionId, channel = 'NewWelfare') {
    let ret = ''
    let promise = new Promise((resolve) => {
      if(!inviterWxOpenId || !inviterWxUnionId){
        resolve(ret)
      }else{
        Vue.http.get('wx/frame/getActivityQrCodeUrl', { 
          params: {
            channel,
            inviterWxOpenId,
            inviterWxUnionId  
          }
        }).then(({ body })=>{
          if(body.success && body.data){
            resolve(body.data)
          }else{
            resolve(ret)
            utils.alert.call(Vue, body.message)
          }
        }, (error)=>{
          resolve(ret)
          utils.alert.call(Vue, ERROR_MSG.api)
        })
      }
    })
    return promise
  },
  // 发送手机验证码
  sendMobiCode(phone, btn) {
    let promise = new Promise((resolve) => {
      if(!utils.regexp.mobile.test(phone)){
        utils.alert.call(Vue, '请输入正确手机号码')
        resolve()
      }else{
        btn.setAttribute('disabled', true)
        let time = 30
        let oldtext = btn.textContent
        let timeid = setInterval(()=>{
          if(--time >= 0){
            btn.textContent = `${time}s`
          }else{
            clearInterval(timeid)
            btn.removeAttribute('disabled')
            btn.textContent = oldtext
          }
        }, 1000)

        Vue.http.get('common/getPhoneVerifyCode', {
          params: {
            phone: phone 
          }
        }).then(({ body }) => {
          if(!body.success){
            clearInterval(timeid)
            btn.removeAttribute('disabled')
            btn.textContent = oldtext
            utils.alert.call(Vue, body.message)
          }else{
            utils.alert.call(Vue, '手机验证码已发送成功')
          }
          resolve()
        }, (error) => {
          clearInterval(timeid)
          btn.removeAttribute('disabled')
          btn.textContent = oldtext
          utils.alert.call(Vue, ERROR_MSG.api)
          resolve()
        })
      }
    })

    return promise
  },
  // 获取当前经纬度
  getPosition() {
    // let position = storage.local.get('position') || {}
    let position = {}
    // 方圆E时光
    // position = { 
    //   latitude: 23.1292,
    //   longitude: 113.3671,
    //   speed: -1,
    //   accuracy: 105.7295
    // }
    storage.local.set('position', position, 1000 * 1800)

    let promise = new Promise((resolve)=>{
      if(position.latitude){
        resolve(position)
      }else{
        if(utils.device.isWechat){
          this.getWxConfig().then((wx)=>{
            wx.getLocation({
              type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
              success(res) {
                position = res
                storage.local.set('position', position, 1000 * 1800)
                resolve(position)
              }
            })
            if(wx._try && !wx._ready){
              resolve(position)
            }
          })
        }else{
          navigator.geolocation.getCurrentPosition( (response) => {
            position.latitude = response.coords.latitude
            position.longitude = response.coords.longitude
            storage.local.set('position', position, 1000 * 1800)
            resolve(position)
          }, error => {
            let errHtml = ''
            switch(error.code){ 
              case error.PERMISSION_DENIED: 
                errHtml = "用户拒绝对获取地理位置的请求。" 
                break
              case error.POSITION_UNAVAILABLE: 
                errHtml = "位置信息是不可用的。" 
                break
              case error.TIMEOUT: 
                errHtml = "请求用户地理位置超时。" 
                break
              case error.UNKNOWN_ERROR: 
                errHtml = "未知错误。" 
                break
            } 
            console.log('获取当前地理位置失败:'+ errHtml)
            position.error = errHtml
            resolve(position)
          })
        }
      }
    })

    return promise
  },
  // 获取当前地址 使用腾讯地图WebService API
  getAddress() {
    const self = this
    let ret = {}
    let promise = new Promise((resolve) => {
      let address = storage.local.get('address')
      if(address){
        resolve(address)
      }else{
        self.getPosition().then( position => {
          Vue.http.jsonp('http://apis.map.qq.com/ws/geocoder/v1/', {
            params: {
              location: position.latitude + ',' + position.longitude,
              key: 'GPIBZ-V7YH3-CD735-3HDQM-CNM3F-4PFQP',
              output: 'jsonp'
            }
          }).then(({ body })=>{
            if(body.status == 0){
              storage.local.set('address', body.result, 1000 * 1800);
              resolve(body.result)
            }else{
              resolve(ret)
            }
          }, (error) => {
            console.log('获取当前地址失败', error)
            resolve(ret)
          })
        })
      }
    })
    return promise
  },
  // 获取两个经纬度的距离
  getDistance({ lng1 = 0, lat1 = 0 }, { lng2 = 0, lat2 = 0 }) {
    let EARTH_RADIUS = 6378137.0    //单位M
    let PI = Math.PI
    let getRad = function(d){
      return d*PI/180.0
    }

    let f = getRad((lat1 + lat2)/2)
    let g = getRad((lat1 - lat2)/2)
    let l = getRad((lng1 - lng2)/2)
    
    let sg = Math.sin(g)
    let sl = Math.sin(l)
    let sf = Math.sin(f)
    
    let s,c,w,r,d,h1,h2
    let a = EARTH_RADIUS
    let fl = 1/298.257
    
    sg = sg*sg
    sl = sl*sl
    sf = sf*sf
    
    s = sg*(1-sl) + (1-sf)*sl
    c = (1-sg)*(1-sl) + sf*sl
    
    w = Math.atan(Math.sqrt(s/c))
    r = Math.sqrt(s*c)/w
    d = 2*w*a
    h1 = (3*r -1)/2/c
    h2 = (3*r +1)/2/s
    
    let m = d*(1 + fl*(h1*sf*(1-sg) - h2*(1-sf)*sg))

    if(Number.isNaN(m)){
      return 0
    }

    return Number((m/1000).toFixed(2))
  },
  // 新人福利
  welfare: {
    // 登记参加人信息
    addShare(wxOpenId, wxUnionId, wxHeadPhoto = '', wxNickName = '') {
      let ret = false
      let promise = new Promise((resolve) => {
        if(!wxOpenId || !wxUnionId){
          resolve(ret)
        }else{
          Vue.http.post('owner/visitor/addShare', {
            channel: 'NewWelfare',
            wxOpenId,
            wxUnionId,
            wxHeadPhoto,
            wxNickName
          }).then(({ body })=>{
            if(body.success){
              resolve(true)
            }else{
              resolve(ret)
              utils.alert.call(Vue, body.message)
            }
          }, (error)=>{
            resolve(ret)
            utils.alert.call(Vue, ERROR_MSG.api)
          })
        }
      })
      return promise
    },
    // 获取新人福利分享信息
    getShareList(wxOpenId) {
      let ret = {}
      let promise = new Promise((resolve) => {
        if(!wxOpenId){
          resolve(ret)
        }else{
          Vue.http.get('owner/visitor/getShareList', {
            params: {
              channel: 'NewWelfare',
              inviterWxOpenId: wxOpenId,
              rows: 100
            }
          }).then(({ body })=>{
            if(body.success && body.data){
              resolve(body.data)
            }else{
              resolve(ret)
              utils.alert.call(Vue, body.message)
            }
          }, (error)=>{
            resolve(ret)
            utils.alert.call(Vue, ERROR_MSG.api)
          })
        }
      })
      return promise
    },
    // 获取活动礼品列表
    getGiftList(wxOpenId = 'opILHvwh76lIxO5xo3S6CoO-jNy0') {
      let ret = []
      let promise = new Promise((resolve) => {
        if(!wxOpenId){
          resolve(ret)
        }else{
          Vue.http.get('owner/visitor/getGiftList', {
            params: {
              matchActivityCode: 'NewWelfare',
              wxOpenId
            }
          }).then(({ body })=>{
            if(body.success && body.data){
              resolve(body.data)
            }else{
              resolve(ret)
              utils.alert.call(Vue, body.message)
            }
          }, (error)=>{
            resolve(ret)
            utils.alert.call(Vue, ERROR_MSG.api)
          })
        }
      })
      return promise
    },
    // 获取获奖名单列表
    getWinner() {
      let ret = []
      let promise = new Promise((resolve) => {
        Vue.http.get('owner/visitor/getWinningGiftList', {
          params: {
            channel: 'NewWelfare',
            rows: 50
          }
        }).then(({ body })=>{
          if(body.success && body.data){
            resolve(body.data.rowsObject)
          }else{
            resolve(ret)
            utils.alert.call(Vue, body.message)
          }
        }, (error)=>{
          resolve(ret)
          utils.alert.call(Vue, ERROR_MSG.api)
        })
      })
      return promise
    }
  },
  // 艾臣资讯
  news: {
    getList(rows = 10) {
      let promise = new Promise((resolve) => {
        let list = new List('news')
        list.rows = rows
        resolve(list)
      })
      return promise
    },
    getInfo(publishId) {
      let ret = {}
      let promise = new Promise((resolve)=>{
        if(!publishId){
          resolve(ret)
        }else{
          Vue.http.get('owner/visitor/getPublishDetail', {
            params: {
              publishId
            }
          }).then(({ body })=>{
            if(body.success && body.data){
              resolve(body.data)
            }else{
              resolve(ret)
              utils.alert.call(Vue, body.message)
            }
          }, (error)=>{
            resolve(ret)
            utils.alert.call(Vue, ERROR_MSG.api)
          })
        }
      })
      return promise
    }
  },
  // 优惠活动
  activity: {
    getList() {
      let promise = new Promise((resolve) => {
        let list = new List('activity')
        resolve(list)
      })
      return promise
    },
    getInfo(id) {
      let ret = {}
      let promise = new Promise((resolve) => {
        if(!id){
          resolve(ret)
        }else{
          let list = new List('activity')
          list.params.id = id
          list.callback = function(data){
            resolve(data[0] || ret)
          }
          list.init()
        }
      })
      return promise
    },
    receive(phoneNum, activityFkid, couponFkid) {
      let ret = {}
      let promise = new Promise((resolve) => {
        if(!phoneNum || !activityFkid || !couponFkid){
          resolve(ret)
        }else{
          Vue.http.post('owner/visitor/addCouponUserRelations', {
            phoneNum,  activityFkid, couponFkid
          }).then(({ body })=>{
            if(body.success){
              resolve(body)
            }else{
              resolve(body)
              utils.alert.call(Vue, body.message)
            }
          }, (error)=>{
            resolve(ret)
            utils.alert.call(Vue, ERROR_MSG.api)
          })
        }
      })

      return promise
    }
  },
  // 我的预约
  appointment: {
    getList(mobilePhone) {
      let promise = new Promise((resolve) => {
        let list = new List('appointment')
        list.params.mobilePhone = mobilePhone
        resolve(list)
      })
      return promise
    },
    getInfo(appointId) {
      let ret = {}
      let promise = new Promise((resolve, reject)=>{
        if(!appointId){
          resolve(ret)
        }else{
          Vue.http.get('owner/visitor/getAppointDetail', {
            params: {
              appointId
            }
          }).then(({ body })=>{
            if(body.success && body.data){
              resolve(body.data)
            }else{
              resolve(ret)
              utils.alert.call(Vue, body.message)
            }
          }, (error)=>{
            resolve(ret)
            utils.alert.call(Vue, ERROR_MSG.api)
          })
        }
      })
      return promise
    }
  },
  // 我的订单
  order: {
    getList(phoneOrNo) {
      let promise = new Promise((resolve) => {
        let list = new List('order')
        list.params.phoneOrNo = phoneOrNo
        resolve(list)
      })
      return promise
    },
    getInfo(orderId) {
      let ret = {}
      let promise = new Promise((resolve, reject)=>{
        if(!orderId){
          resolve(ret)
        }else{
          Vue.http.get('owner/visitor/getOrderDetail', {
            params: {
              orderId
            }
          }).then(({ body })=>{
            if(body.success && body.data){
              resolve(body.data)
            }else{
              resolve(ret)
              utils.alert.call(Vue, body.message)
            }
          }, (error)=>{
            resolve(ret)
            utils.alert.call(Vue, ERROR_MSG.api)
          })
        }
      })
      return promise
    }
  },
  // 优惠券
  coupon: {
    getList(phoneNum, type = 0) {
      switch(type){
        case 1:
          type = 1
          break
        case 2:
          type = -1
          break
        default:
          type = 0
      }

      let ret = []
      let promise = new Promise((resolve) => {
        if(!phoneNum){
          resolve(ret)
        }else{
          Vue.http.get('owner/visitor/getCouponUserRelations', {
            params: {
              phoneNum,
              isUsed: type
            }
          }).then(({ body })=>{
            if(body.success && body.data){
              resolve(body.data)
            }else{
              resolve(ret)
              utils.alert.call(Vue, body.message)
            }
          }, (error)=>{
            resolve(ret)
            utils.alert.call(Vue, ERROR_MSG.api)
          })
        }
      })
      return promise
    },
    getInfo(id) {
      let ret = {}
      let promise = new Promise((resolve) => {
        if(!id){
          resolve(ret)
        }else{
          Vue.http.get('owner/visitor/getCouponDetail', {
            params: {
              id
            }
          }).then(({ body })=>{
            if(body.success && body.data){
              resolve(body.data)
            }else{
              resolve(ret)
              utils.alert.call(Vue, body.message)
            }
          }, (error)=>{
            resolve(ret)
            utils.alert.call(Vue, ERROR_MSG.api)
          })
        }
      })
      return promise
    }
  },
  // 产品展示
  product: {
    getCategory() {
      let ret = []
      let promise = new Promise((resolve) => {
        Vue.http.get('owner/visitor/getProductCategory').then(({ body })=>{
          if(body.success && body.data){
            resolve(body.data)
          }else{
            resolve(ret)
            utils.alert.call(Vue, body.message)
          }
        }, (error)=>{
          resolve(ret)
          utils.alert.call(Vue, ERROR_MSG.api)
        })
      })
      return promise
    },
    getList(type) {
      let ret = []
      let promise = new Promise((resolve) => {
        if(!type){
          resolve(ret)
        }else{
          Vue.http.get('owner/visitor/getProductList', {
            params: {
              category: type
            }
          }).then(({ body })=>{
            if(body.success && body.data){
              resolve(body.data.rowsObject)
            }else{
              resolve(ret)
              utils.alert.call(Vue, body.message)
            }
          }, (error)=>{
            resolve(ret)
            utils.alert.call(Vue, ERROR_MSG.api)
          })
        }
      })
      return promise
    },
    getInfo(id) {
      let ret = {}
      let promise = new Promise((resolve) => {
        if(!id){
          resolve(ret)
        }else{
          Vue.http.get('owner/visitor/getProductDetail', {
            params: {
              productId: id
            }
          }).then(({ body })=>{
            if(body.success && body.data){
              resolve(body.data)
            }else{
              resolve(ret)
              utils.alert.call(Vue, body.message)
            }
          }, (error)=>{
            resolve(ret)
            utils.alert.call(Vue, ERROR_MSG.api)
          })
        }
      })
      return promise
    }
  },
  // 我的反馈
  faq: {
    // 常见问题列表
    getHelpList() {
      let promise = new Promise((resolve) => {
        let list = new List('faq')
        resolve(list)
      })
      return promise
    },
    // 常见问题详情
    getHelpDetail(id){
      let ret = {}
      let promise = new Promise((resolve, reject)=>{
        if(!id){
          resolve(ret)
        }else{
          Vue.http.get('owner/visitor/getHelpDetail', {
            params: {
              helpId: id
            }
          }).then(({ body })=>{
            if(body.success && body.data){
              resolve(body.data)
            }else{
              resolve(ret)
              utils.alert.call(Vue, body.message)
            }
          }, (error)=>{
            resolve(ret)
            utils.alert.call(Vue, ERROR_MSG.api)
          })
        }
      })
      return promise
    },
    // 反馈列表
    getFeedBackList(userId) {
      let promise = new Promise((resolve) => {
        let list = new List('feedback')
        list.params.clientId = userId
        resolve(list)
      })
      return promise
    },
    // 反馈详情
    getFeedBackDetail(feedBackId){
      let ret = {}
      let promise = new Promise((resolve)=>{
        if(!feedBackId){
          resolve(ret)
        }else{
          Vue.http.get('owner/getMyFeedBackDetail', {
            params: {
              feedBackId
            }
          }).then(({ body })=>{
            if(body.success && body.data){
              resolve(body.data)
            }else{
              resolve(ret)
              utils.alert.call(Vue, body.message)
            }
          }, (error)=>{
            resolve(ret)
            utils.alert.call(Vue, ERROR_MSG.api)
          })
        }
      })
      return promise
    },
    // 反馈详情回复列表
    getFeedBackReply(feedBackId){
      let promise = new Promise((resolve) => {
        let list = new List('feedbackReply')
        list.params.feedBackId = feedBackId
        resolve(list)
      })
      return promise
    },
    // 反馈设置已读
    getEditFeedBack(id){
      let ret = {}
      let promise = new Promise((resolve, reject)=>{
        if(!id){
          resolve(ret)
        }else{
          Vue.http.post('owner/editFeedBack', {
            id
          }).then(({ body })=>{
            if(body.success && body.data){
              resolve(body.data)
            }else{
              resolve(ret)
            }
          }, (error)=>{
            resolve(ret)
          })
        }
      })
      return promise
    }
  },
  // 门店列表
  store: {
    getList() {
      let promise = new Promise((resolve) => {
        let list = new List('store')
        resolve(list)
      })
      return promise
    },
    getInfo(storeId) {
      let ret = {}
      let promise = new Promise((resolve)=>{
        if(!storeId){
          resolve(ret)
        }else{
          Vue.http.get('owner/visitor/getStoreDetail', {
            params: {
              storeId
            }
          }).then(({ body })=>{
            if(body.success && body.data){
              resolve(body.data)
            }else{
              resolve(ret)
              utils.alert.call(Vue, body.message)
            }
          }, (error)=>{
            resolve(ret)
            utils.alert.call(Vue, ERROR_MSG.api)
          })
        }
      })
      return promise
    }
  }
}
