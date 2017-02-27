<template>
  <div class="l-welfare">
    <img class="l-block" src="~assets/imgs/temp-038.jpg">
    <img class="l-block" style="margin-top:-20px; max-width:90%;" src="~assets/imgs/temp-039.png">

    <div class="l-welfare-1">
      <img style="width: 6.8rem; position: absolute; top: -3.0rem; left: 0; z-index: -1;" src="~assets/imgs/temp-040.png">
      <img style=" width: 2.0rem;" class="l-block" src="~assets/imgs/temp-042.png">
      <!-- 好友助力显示 -->
      <div class="l-box-1" v-if="route.query.isFriend">
        <div class="vux-center" v-if="sharer.wxNickName">
          <!-- <img style="width:1.066667rem;height:1.066667rem;border: 1px solid #ebebeb;margin:0 15px 0 0;" 
            :src="sharer.wxHeadPhoto || defaultVal.avatar"> -->
          您的好友 {{sharer.wxNickName}} 邀请您帮他拼人脉
          <br>
        </div>
        <div class="l-flex-h l-chat-item">
          <div class="l-thumb">
            <img :src="sharer.wxHeadPhoto || defaultVal.avatar">  
          </div>
          <div class="l-rest">
            <div class="l-chat-msg">
              我正在参加艾臣智能家居，‘新人福利’免费领取礼品活动，我要让新家变的更美，快来帮帮我吧ಥ_ಥ~~
            </div>
          </div>
        </div>
        <div class="l-flex-h l-chat-item">
          <div class="l-thumb">
            <img :src="sharer.wxHeadPhoto || defaultVal.avatar">  
          </div>
          <div class="l-rest">
            <div class="l-chat-msg">
              已有 <b>{{shareList.length}}</b> 位好友助力，把大奖拿回家就差你是观音手啦~~
            </div>
          </div>
        </div>
        <img v-if="route.query.isFriend" @click="dialog.qrcode=true" class="l-block" style="width: 7.5rem;" src="~assets/imgs/temp-065.png">
      </div>
      <!-- 自己分享显示 活动规则 -->
      <div v-else>
        <p class="l-box-1" v-if="shareList.length === 0">规则：查看物品，点击“领取礼品”呼唤伙伴获得助力，好友越多得到奖品越多，让我们一起来享受礼品界的饕餮盛宴吧！</p>
        <div class="l-box-1" v-else>
          <p>人品大爆发！已经有{{shareList.length}}位小伙伴使出了洪荒之力为您助力。</p>
          <p>再加把劲，一人富不如众人富！让更多的小伙伴加入进来，把所有礼品装回家！</p>
          <ul class="l-winner-list">
            <li v-for="item in shareList" :style="{backgroundImage: 'url('+item.wxHeadPhoto+')'}"></li>
          </ul>
        </div>
        <img class="l-block" style="max-width:85%;" src="~assets/imgs/temp-043.jpg">
      </div>
      <br>
    </div>
    
    <!-- 自己分享显示 奖品列表 -->
    <div class="l-welfare-2" v-if="!route.query.isFriend">
      <div class="l-step-first">
        <img style="top: -2.75rem; left: 1.2rem;" class="l-prize" src="~assets/imgs/temp-051.png">
        <img src="~assets/imgs/temp-045.jpg">
      </div>
      <div class="l-step-2" :class="{'l-can-get': giftList[0].whetherExchange, 'l-got': giftList[0].isExchanged}">
        <img class="l-prize" :src="giftList[0].imgUrl" @click="showGift(0)">
        <img src="~assets/imgs/temp-046.jpg">
        <div class="l-tip l-flex-vc" v-if="giftList[0].show" @click="showGift(0)">
          <p>礼品名称：{{giftList[0].giftName}}</p>
          <p>领取条件：需要{{giftList[0].integral}}好友助力完成</p>
        </div>
      </div>
      <div class="l-step-1" :class="{'l-can-get': giftList[1].whetherExchange, 'l-got': giftList[1].isExchanged}">
        <img class="l-prize" :src="giftList[1].imgUrl" @click="showGift(1)">
        <img src="~assets/imgs/temp-047.jpg">
        <div class="l-tip l-flex-vc" v-if="giftList[1].show" @click="showGift(1)">
          <p>礼品名称：{{giftList[1].giftName}}</p>
          <p>领取条件：需要{{giftList[1].integral}}好友助力完成</p>
        </div>
      </div>
      <div class="l-step-2" :class="{'l-can-get': giftList[2].whetherExchange, 'l-got': giftList[2].isExchanged}">
        <img class="l-prize" :src="giftList[2].imgUrl" @click="showGift(2)">
        <img src="~assets/imgs/temp-048.jpg">
        <div class="l-tip l-flex-vc" v-if="giftList[2].show" @click="showGift(2)">
          <p>礼品名称：{{giftList[2].giftName}}</p>
          <p>领取条件：需要{{giftList[2].integral}}好友助力完成</p>
        </div>
      </div>
      <div class="l-step-1" :class="{'l-can-get': giftList[3].whetherExchange, 'l-got': giftList[3].isExchanged}">
        <img class="l-prize" :src="giftList[3].imgUrl" @click="showGift(3)">
        <img src="~assets/imgs/temp-049.jpg">
        <div class="l-tip l-flex-vc" v-if="giftList[3].show" @click="showGift(3)">
          <p>礼品名称：{{giftList[3].giftName}}</p>
          <p>领取条件：需要{{giftList[3].integral}}好友助力完成</p>
        </div>
      </div>
      <img class="l-block" style="width: 80%; margin-top: -0.96rem; z-index: 1; position: relative;" src="~assets/imgs/temp-050.png">
    </div>

    <!-- 获奖名单 -->
    <div class="l-welfare-3" v-if="winnerList.length > 0">
      <img class="l-block" style="max-width:85%;" src="~assets/imgs/temp-056.jpg">
      <div class="l-name-list">
        <table>
          <tbody>
            <tr v-for="item in winnerList">
              <td v-text="item.consignee"></td>
              <td v-text="item.consigneePhone"></td>
              <td v-text="item.giftName"></td>
            </tr>
          </tbody>
        </table>
      </div>
      <br>
    </div>

    <!-- 活动规则 -->
    <div class="l-welfare-4">
      <img class="l-block" src="~assets/imgs/temp-057.jpg">
      <br>
      <img class="l-block" style="max-width:85%;" src="~assets/imgs/temp-058.jpg">
      <p class="l-box-1">邀请小伙伴助力，小伙伴越多得到的礼品也越多。最终全部通关的用户，可领取全部礼品！就是这么壕！</p>
      <img style=" width: 2.5rem;" class="l-block" src="~assets/imgs/temp-042.png">
      <img class="l-block" style="max-width:90%;" src="~assets/imgs/temp-059.jpg">
      <img style=" width: 2.5rem;" class="l-block" src="~assets/imgs/temp-042.png">
      <div class="l-box-1">
        <ol style="margin-left: 1.0rem;">
          <li>活动时间：2016-12-01 00:00:00至2016-12-12 23:59:59；</li>
          <li>同一用户可领取多个礼品，同一用户指：同一手机号、身份证号、收货地址等；</li>
          <li>领取奖品的用户点击“领取礼品”填写个人信息，即可等待回访电话获得奖品。</li>
        </ol>
      </div>
      <br>
      <img v-if="!route.query.isFriend" @click="receiveGift" class="l-block" style="width:7.5rem" src="~assets/imgs/temp-060.jpg">
      <br>
    </div>
    <!-- 好友助力二维码 -->
    <dialog :show.sync="dialog.qrcode" :scroll="dialog.scroll" @click="dialog.qrcode=false">
      <div v-if="route.query.isFriend" style="padding: 0.75rem; text-align:center;">
        <img style="width:7.5rem; height:7.5rem; " :src="tempQrCode || defaultVal.qrcode">
        <p style="color:#d29504; font-size:14px; ">这是一个友好的二维码，请长按或扫描关注我们，完成为好友助力壮举！同时我们也会将最新优惠资讯发送给您。</p>
      </div>
    </dialog>
    <!-- 奖品详情 -->
    <!-- <dialog :show.sync="dialog.show" :scroll="dialog.scroll" @click="dialog.show=false">
      <div style="padding:0.5rem; background-color:#fff;">
        <img height="200" :src="$image.thumb(dialog.itemInfo.imgUrl, 640, 400)">
        <div style="text-align:left;margin-top:0.5rem;">
          <p>礼品名称：{{dialog.itemInfo.giftName}}</p>
          <p>领取条件：需要{{dialog.itemInfo.integral}}好友助力完成</p>    
        </div>
      </div>
    </dialog> -->
    <!-- 分享提示 -->
    <dialog class="l-share-dialog" :show.sync="dialog.share" :scroll="dialog.scroll" @click="dialog.share=false">
      <img src="~assets/imgs/share-arrow.png">
    </dialog>
  </div>
</template>
<script>
import { Dialog, Loading } from 'vux-components'
import { utils, storage } from 'assets/lib'
import { store, actions, getters } from '../vuex'
import config from '../config'
import server from '../server'
// import wx from 'weixin-js-sdk'

export default {
  components: {
    Dialog
  },
  route: {
    data() {
      const self = this
      const wxinfo = storage.session.get('wxinfo') || {}
      const promises = []

      // 获取奖品列表
      let promise1 = server.welfare.getGiftList(wxinfo.wxOpenId).then( list => {
        self.giftList = list
      })
      // 获取分享人数
      let promise2 = server.welfare.getShareList(wxinfo.wxOpenId).then( data =>{
        self.shareList = data.shareList.rowsObject
        self.sharer = data.sharer
      })
      // 获取中奖名单
      let promise3 = server.welfare.getWinner().then( list => {
        self.winnerList = list
      })
      // jssdk授权
      let promise4 = server.getWxConfig().then((wx)=>{
        let url = utils.url.setArgs(window.location.href, {
          isFriend: new Date().getTime(),
          wxOpenId: wxinfo.wxOpenId,
          wxUnionId: wxinfo.wxUnionId
        })
        const shareConfig = {
          title: '考验友谊的时候到了，来帮我拼人脉吧~',                     // 分享标题
          desc: '我正在参加艾臣安全智能门窗新人领福利活动，速来围观！',     // 分享描述
          link: url,                                                        // 分享链接
          imgUrl: require('assets/imgs/temp-064.jpg'),                      // 分享图标
          type: 'link',                                                     // 分享类型,music、video或link，不填默认为link
          dataUrl: '',                                                      // 如果type是music或video，则要提供数据链接，默认为空
          success: function() {
            server.welfare.addShare(wxinfo.wxOpenId, wxinfo.wxUnionId, wxinfo.wxHeadPhoto, wxinfo.wxNickName)
            .then( success => {
              self.dialog.share = false
              if(success){
                console.log('分享成功')
                // self.$vux.toast.show('分享成功')
              }else{
                console.log('分享失败')
                self.$vux.toast.show('分享失败')
              }
            })
          }
        }
        // 分享到朋友圈/好友
        wx.onMenuShareTimeline(shareConfig)
        wx.onMenuShareAppMessage(shareConfig)
      })

      promises.push(promise1)
      promises.push(promise2)
      promises.push(promise3)
      promises.push(promise4)

      // 好友助力二维码
      if(self.route.query.isFriend){
        let promise5 = server.getWxTempQrCode(wxinfo.wxOpenId, wxinfo.wxUnionId).then( qrcode => {
          self.tempQrCode = qrcode
        })
        promises.push(promise5)
      }
      
      self.$vux.loading.show()
      Promise.all(promises).finally(()=>{
        self.$vux.loading.hide()
      })
    },
    canActivate({ to, next, abort }) {
      let promise = new Promise((resolve, reject)=>{
        let { code, wxOpenId, wxUnionId }  = to.query
        const userinfo = storage.local.get('userinfo')  
        if(wxOpenId && wxUnionId){
          resolve({wxOpenId, wxUnionId})
        }else if(userinfo && userinfo.wxOpenId && userinfo.wxUnionId){
          resolve(userinfo)
        }else{
          if(!code){ // 跳转授权
            let absUrl = utils.url.join(config.getHost(), config.getPath(), '/welfare')
            absUrl = server.getGrantUrl(absUrl)
            if(!/\d+.\d+.\d.\d+/.test(window.location.hostname) && utils.device.isWechat){
              utils.url.replace(absUrl)
              reject('跳转授权中')
            }else{
              resolve({})
            }
          }else{ // 通过code获取微信信息
            server.getWxByCode(code).then( info =>{
              if(info.wxOpenId && info.wxUnionId){
                resolve(info)
              }else{
                reject('授权失败，没有获取到微信信息')
              }
            })
          }
        }
      }).then(wxinfo => {
        storage.session.set('wxinfo', wxinfo)
        setTimeout(next, 50)
      }).catch( error => {
        setTimeout(abort, 50)
      })
    }
  },
  store,
  vuex: {
    getters
  },
  data() {
    return {
      tempQrCode: '',
      isFriend: false,
      defaultVal: config.defaultVal,
      dialog: {
        itemInfo: {},
        show: false,
        scroll: false,
        share: false,
        qrcode: false
      },
      shareList: [],
      sharer: {},
      giftList: [{},{},{},{},{}],
      winnerList: []
    }
  },
  methods: {
    showGift(index) {
      this.giftList[index].show = !this.giftList[index].show
      this.giftList.$set(index, this.giftList[index])
    },
    receiveGift() {
      const wxinfo = storage.session.get('wxinfo')
      let hasGift = false
      this.giftList.forEach((item)=>{
        if(item.whetherExchange){
          hasGift = true
          return false
        }
      })
      if(hasGift){
        this.$router.go(`/welfare/gift?wxOpenId=${wxinfo.wxOpenId}&wxUnionId=${wxinfo.wxUnionId}`)  
      }else{
        this.dialog.share = true 
      }
    }
  }
}
</script>
<style lang="less">
.l-share-dialog{
  .weui_dialog{
    background-color: transparent;
    margin-top: -35%;
  }
  .weui_mask{
    background-color: rgba(0,0,0,0.8)
  }
}
</style>
<style scoped lang="less">
.l-winner-list{
  overflow:hidden;
  margin-left: -0.375rem;
}
.l-winner-list li{
  list-style: none;
  float: left;
  width: 2.0rem;
  height: 2.0rem;
  margin: 0.375rem;
  background: #ebebeb url('~assets/imgs/avatar.png') no-repeat 50% 50%;
  background-size: contain;
}
.l-welfare{
  min-height: 100%;
  background-color: #fdd400;
  overflow: hidden;
  img.l-block{
    display: block;
    margin: auto;
  }
}
.l-box-1, .l-name-list{
  margin: auto 0.75rem;
  text-align: left;
  color: #5a4c05;
  padding: 0.75rem;
  border:2px solid #000;
  border-radius: 3px;
  background-color: #fff;
}
.l-welfare-1{
  position: relative;
  text-align: center;
  z-index: 0;
}
.l-welfare-2{
  margin: 0.75rem 0;
  padding: 2rem 0.8rem;
  background: #fdd400 url('~assets/imgs/temp-044.jpg') no-repeat center top;
  background-size: 100% 100%;
  >[class^=l-step-]{
    position: relative;
    margin: 0.5rem 0;
  }
  .l-prize{
    position: absolute;
    top: -1.2rem;
    width: 6.0rem;
    height: 6.0rem;
  }
  .l-step-1{
    .l-prize {
      left: 0;
      filter: grayscale(100%)
    }
  }
  .l-step-2{
    .l-prize {
      right: 0;
      filter: grayscale(100%)
    }
  }
  .l-tip{
    position: absolute;
    top: 0;
    left: 0;
    height: 70%;
    width: 100%;
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    border-radius: 3px;
    padding: 0 0.5rem;
    box-sizing: border-box;
    font-size: 14px;
  }
}
.l-name-list{
  max-height: 7.5rem;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  table, td{
    padding: 0 0.375rem;
    border:none;
  }
}
.l-welfare-4{
  background-color: #4083c7;
}
.l-can-get .l-prize{
  filter: none !important;
}
.l-got{
  filter: grayscale(100%) !important;
}
</style>
