// 检测设备
const ua = navigator.userAgent
const isAndroid = /(Android);?[\s\/]+([\d.]+)?/.test(ua)
const isIpad = /(iPad).*OS\s([\d_]+)/.test(ua)
const isIpod = /(iPod)(.*OS\s([\d_]+))?/.test(ua)
const isIphone = !isIpad && /(iPhone\sOS)\s([\d_]+)/.test(ua)
const isWechat = /micromessenger/i.test(ua)

Promise.prototype.done = Promise.prototype.done || function (onFulfilled, onRejected) {
  this.then(onFulfilled, onRejected)
    .catch(function (reason) {
      // 抛出一个全局错误
      setTimeout(() => { throw reason }, 0)
    })
}

Promise.prototype.finally = Promise.prototype.finally || function (callback) {
  let P = this.constructor
  return this.then(
    value  => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  )
} 


/*========本地存储===========*/
const STORE_PREFIX = '_yz_'
export let storage = {
  getPrefix: () => STORE_PREFIX,
  cookies: {
    get(sKey) {
      if (!sKey) return null
      sKey = STORE_PREFIX + sKey
      return decodeURIComponent(document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null
    },
    set(sKey, sValue, vEnd = 1800, sPath = '/', sDomain = '', bSecure = false) {
      if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey))  return false

      sKey = STORE_PREFIX + sKey
      let sExpires = ''
      if (vEnd) {
        switch (vEnd.constructor) {
          case Number: // 单位秒
            sExpires = vEnd === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : '; max-age=' + vEnd
            break
          case String:
            sExpires = '; expires=' + vEnd
            break
          case Date:
            sExpires = '; expires=' + vEnd.toUTCString()
            break
        }
      }
      document.cookie = encodeURIComponent(sKey) + '=' + encodeURIComponent(sValue) + sExpires + (sDomain ? '; domain=' + sDomain : '') + (sPath ? '; path=' + sPath : '') + (bSecure ? '; secure' : '')
      return true
    },
    remove(sKey, sPath = '/', sDomain = '') {
      if (!this.has(sKey)) return false 

      sKey = STORE_PREFIX + sKey
      document.cookie = encodeURIComponent(sKey) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' + (sDomain ? '; domain=' + sDomain : '') + (sPath ? '; path=' + sPath : '')
      return true
    },
    has(sKey) {
      if (!sKey) return false
      return (new RegExp('(?:^|;\\s*)' + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=')).test(document.cookie)
    },
    keys() {
      let aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, '').split(/\s*(?:\=[^;]*)?;\s*/)
      for (let nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]) }
      return aKeys
    }
  },
  session: {
    set(key, value) {
      if(!key) return false
      window.sessionStorage.setItem(STORE_PREFIX + key, JSON.stringify(value || {}))
    },
    get(key) {
      if(!key) return null
      return JSON.parse(window.sessionStorage.getItem(STORE_PREFIX + key))
    } 
  },
  local: {
    set(key, value, ms = 1000*3600*24*365) {
      if(!key) return false
      
      key = STORE_PREFIX + key
      let newValue = {
        value: value,
        expires: ms,
        time: new Date().getTime()
      }
      window.localStorage.setItem(key, JSON.stringify(newValue))
    },
    get(key) {
      if(!key) return null
      key = STORE_PREFIX + key
      
      let value = JSON.parse(window.localStorage.getItem(key))
      if (value && (new Date().getTime() - value.time < value.expires)) {
        value = value.value
      }else{
        value = null
      }
      return value
    } 
  }
}
/*========utils小工具===========*/
// 参考jq源码
const class2type = (function(){
  let ret = {}
  'Boolean Number String Function Array Date RegExp Object Error'.split(' ').forEach((name) => {
    ret[ '[object ' + name + ']' ] = name.toLowerCase();
  })
  return ret
})()
export let utils = {
  device: { 
    isAndroid,
    isIpad,
    isIpod,
    isIphone,
    isWechat 
  },
  regexp: {
    mobile: /^\s*1\d{10}\s*$/
  },
  noop(){},
  extend(target, ...objs) {
    if(!utils.isPlainObject(target)) return null
    objs.forEach((obj) => {
      if(utils.isPlainObject(obj)){
        Object.keys(obj).forEach((key)=>{
          if(obj[key] !== null && obj[key] !== undefined){
            target[key] = obj[key]
          }
        })
      }
    })
    return target
  },
  type(value) {
    //如果是null或者undefined，直接转成String返回
    if( value == null )  return String( value )
    //RegExp，Array等都属于Object
    //为了精准判断类型，借由Object.prototype.toString跟class2type表
    //这里为什么要用core_toString而不用obj.toString的原因在刚刚试验中说明了
    return typeof value === 'object' || typeof value === 'function' ?
      class2type[ class2type.toString.call(value) ] || 'object' : typeof value
  },
  isPlainObject(obj){
    // Must be an Object.
    // Because of IE, we also have to check the presence of the constructor property.
    // Make sure that DOM nodes and window objects don't pass through, as well
    if ( !obj || utils.type(obj) !== "object" || obj.nodeType || utils.isWindow( obj ) ) {
      return false;
    }
    try {
      // Not own constructor property must be Object
      if ( obj.constructor &&
        !class2type.hasOwnProperty.call(obj, "constructor") &&
        !class2type.hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf") ) {
        return false;
      }
    } catch ( e ) {
      // IE8,9 Will throw exceptions on certain host objects #9897
      return false;
    }
    // Own properties are enumerated firstly, so to speed up,
    // if last one is own, then all properties are own.
    let key = undefined
    for ( key in obj ) {}
    return key === undefined || class2type.hasOwnProperty.call( obj, key );
  },
  isEmptyObject(obj) {
    for ( let key in obj ) {
      return false
    }
    return true
  },
  isFunction(obj){
    return utils.type(obj) === 'function'
  },
  isArray: Array.isArray || function(obj) {
    return utils.type(obj) === 'array'
  },
  isWindow(obj) {
    return obj != null && obj == obj.window
  },
  isString(value) {
    return typeof value === 'string'
  },
  isNumber(value) {
    return !isNaN( parseFloat(value) ) && isFinite( value )
  },
	setTitle(title) {
		document.title = title || '艾臣安全智能门窗'
    // 判断是否为ios设备的微信浏览器，加载iframe来刷新title
    if (isWechat && isIphone) {
    	let iframe = document.createElement('iframe')
		  iframe.setAttribute('src', '/favicon.ico')
		  iframe.addEventListener('load', function() {
		    setTimeout(() => {
	      	iframe.removeEventListener('load')
	        document.body.removeChild(iframe)
	      }, 50)
		  })
		  document.body.appendChild(iframe)
    }
	},
  alert(msg) {
    // window.alert(msg)
    console.log(msg)
  },
  debug(msg = '') {
    // window.alert(window.JSON.stringify(msg))
  },
  url: {
    getArgs(url) {
      if(typeof url !== 'string') url = window.location.href
      url = decodeURIComponent(url)
      let pos = url.indexOf('?'),
        pos2 = url.lastIndexOf('#'),
        qs = pos > -1 ? url.substring(pos+1, pos2 <= pos ? url.length : pos2) : '',
        items = qs.split('&')
      let args = {},
        arg = null, 
        name = null,
        value = null
      for(let i=0, splitPos = 0, item=null; i<items.length; i++){
        item = items[i]
        splitPos = item.indexOf('=')
        name  = item.substring(0, splitPos)
        value  = item.substring(splitPos+1)
        args[name] = value
      }
      return args
    },
    setArgs(url, name, value) {
      if(typeof url !== 'string') return ''
      let urlArgs = utils.url.getArgs(url),
        params = []

      if(utils.isPlainObject(name)){
        Object.assign(urlArgs, name)
      }else if(utils.isString(name)){
        urlArgs[name] = value
      }

      let hash = ''
      for(let key of Object.keys(urlArgs)){
        let val = urlArgs[key]
        if(val != undefined && val !== ''){
          if(key === '_hash'){
            hash = val;
          }else{
            params.push(encodeURIComponent(key) +'=' + encodeURIComponent(val)) 
          }
        }
      }
      params.length > 0 && (url = url.split('?')[0] + '?' + params.join('&'))
      hash && (url += '#'+hash)
      
      return url
    },
    reload(){
      window.location.reload()
    },
    replace(url) {
      window.location.replace(url)
    },
    assign(url) {
      window.location.assign(url)
    },
    join(...paths) {
      let passPath = []
      paths.filter((item) => utils.isString(item))
        .map((item) => {
          item = item.replace(/^\/+|\/+$/g, '')
          if(item){
            passPath.push(item)
          }
        })
      return passPath.join('/')
    }
  },
  image: {
    thumb(src, width, height) {
      width = width || 320
      if(!src){ 
        return ''
        return `http://placeholder.qiniudn.com/${width}/ebebeb/cccccc` 
      }
      // return src += '?imageMogr2/gravity/Center/crop/'+width+'x'+height;
      src += `?imageMogr2/format/jpg/interlace/1/quality/60/gravity/Center/thumbnail/${width}x`
      if(height){
        src += `/crop/x${height}`
      }

      return src
    },
    wxHead(src) {
      if(!src) {
        let avatar = require('assets/imgs/avatar.png')
        return avatar
      }
      if(src.indexOf('wx.qlogo.cn') === -1){
        return src
      }
      return src.replace(/\/0$/, '/64')
    }
  }
  
}

export default utils



