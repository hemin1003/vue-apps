<template>
  <div class="l-wellife" >
    <div class="swiper-container swiper-container-v">
      <div class="swiper-wrapper">
        <div class="swiper-slide" style="background-color:#ebebeb;">
          <img class="ani" ani-effect="fadeInDown" ani-duration="0.8s" ani-delay="0.3s" src="~assets/imgs/temp-091.png">
          <img class="ani l-rel" ani-effect="fadeInUp" ani-duration="0.6s" ani-delay="0.3s" style="margin-top: -6.5rem;" src="~assets/imgs/temp-090.png">
          <div class="l-abs l-center ani" ani-effect="fadeIn" ani-duration="0.5s" ani-delay="1s" style="top:2.75rem;">
            <img style="width: 3.75rem;" src="~assets/imgs/temp-083.png">
            <h3 style="color:#fff;margin-top: 0.75rem;">艾臣云家 — 智慧生活</h3>
          </div>
          <div class="l-abs ani" style="top: 10.5rem; left: 0.75rem;" 
            ani-effect="fadeInLeft" ani-duration="0.5s" ani-delay="1.3s">
            <img style="width:6.5rem;" src="~assets/imgs/temp-084.png">
          </div>
          <div class="l-abs ani" style="top: 15.0rem; width: 10.0rem; left: 8.0rem;" 
            ani-effect="fadeInRight" ani-duration="0.5s" ani-delay="1.3s">
            <p>作为一款智能家居APP软件，艾臣云家APP是一个全方位关注安全、健康、舒适和便捷的智能系统，帮助人们拥有更好的生活方式。</p>
          </div>
          <div class="ani" style="background-color:#fff; padding: 0 0.75rem;" ani-effect="fadeIn" ani-duration="0.5s" ani-delay="1.5s">
            <div class="swiper-container swiper-container-h">
              <div class="swiper-wrapper">
                <div class="swiper-slide">
                  <img src="~assets/imgs/temp-105.jpg">
                </div>
                <div class="swiper-slide">
                  <img src="~assets/imgs/temp-106.jpg">
                </div>
                <div class="swiper-slide">
                  <img src="~assets/imgs/temp-107.jpg">
                </div>
                <div class="swiper-slide">
                  <img src="~assets/imgs/temp-108.jpg">
                </div>
                <div class="swiper-slide">
                  <img src="~assets/imgs/temp-109.jpg">
                </div>
                <div class="swiper-slide">
                  <img src="~assets/imgs/temp-110.jpg">
                </div>
                <div class="swiper-slide">
                  <img src="~assets/imgs/temp-111.jpg">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="swiper-slide">
          <br><br><br><br><br>
          <img class="ani" ani-effect="fadeInRight" ani-duration="0.5s" ani-delay="0.5s" src="~assets/imgs/temp-089.png">
          <div class="l-abs ani" style="top: 1.5rem;left: 1.5rem;" class="ani" ani-effect="fadeInLeft" ani-duration="0.5s">
            <h3>智能家居，享受科技铸就的安全生活</h3>
            <p>让科技改变生活，用科技加固精神乐园</p>
            <p>下载艾臣云家APP，可通过手机远程控</p>
            <p>制家庭设备，一键开启离家安全模式</p>
          </div>
          <img class="l-abs ani" style="top: 12.5rem;left: 0.5rem;width:6.5rem;" src="~assets/imgs/temp-087.jpg"
            ani-effect="fadeIn" ani-duration="1s" ani-delay="1.5s">
          <!-- 开关按钮 -->
          <div class="l-abs ani" style="left: 7.25rem; top:17.5rem;"
            ani-effect="zoomIn" ani-duration="1s" ani-delay="2.5s">
            <img style="width:9.2rem;" src="~assets/imgs/temp-116.png">
            <div class="l-door-btn">
              <p @click="openDoor(1)" :class="{'l-on': isOpen, 'l-slted': type === 1}">
                <i class="iconfont ani infinite" ani-effect="flash" ani-duration="5s" ani-delay="1.5s">&#xe6da;</i>
              </p>
              <p @click="openDoor(2)" :class="{'l-on': isOpen, 'l-slted': type === 2}">
                <i class="iconfont ani infinite" ani-effect="flash" ani-duration="5s" ani-delay="1.5s">&#xe6da;</i>
              </p>
              <p>
                <i class="iconfont ani infinite" ani-effect="flash" ani-duration="5s" ani-delay="1.5s">&#xe6da;</i>
              </p>
            </div>
          </div>
          <div class="ani" ani-effect="fadeIn" ani-duration="1s" ani-delay="1.5s">
            <!-- 阳台门 -->
            <div v-show="type === 1" class="l-abs l-door-1 ani" style="top: 7.5rem;left: 7.25rem;">
              <img style="width:11.125rem;" src="~assets/imgs/temp-088.jpg">
              <img class="l-abs l-door-left" :class="{'l-door-open': isOpen && type === 1}" style="width: 4.1rem; top: 0.45rem; left: 1.6rem; height: 8.15rem;" src="~assets/imgs/temp-112.png">
              <img class="l-abs l-door-right" :class="{'l-door-open': isOpen && type === 1}" style="width: 4.1rem; top: 0.45rem; left: 5.4rem; height: 8.15rem;" src="~assets/imgs/temp-113.png">
              <img class="l-abs" style="width: 3.625rem; bottom: 0; left: 2.0rem;" src="~assets/imgs/temp-114.png">
              <img class="l-abs" style="width: 4.15rem; bottom: 0; left: auto; right: 0.35rem;" src="~assets/imgs/temp-115.png">
            </div>
            <!-- 客房门 -->
            <div v-show="type === 2" class="l-abs l-door-2" style="top: 7.5rem;left: 7.25rem;">
              <img style="width:11.15rem;" src="~assets/imgs/temp-117.jpg">
              <img class="l-abs l-door-left" :class="{'l-door-open': isOpen && type === 2}" style="width: 3.35rem; top: 0.35rem; left: 1.5rem;" src="~assets/imgs/temp-118.png">
              <img class="l-abs l-door-right" :class="{'l-door-open': isOpen && type === 2}" style="width: 3.35rem; top: 0.35rem; left: 4.5rem;" src="~assets/imgs/temp-119.png">
            </div>
          </div>
          <div class="l-abs" style=" text-align: right; top: 27.0rem; right: 0.75rem; color: #fff;">
            <h3 class="ani" ani-effect="fadeInRight" ani-duration="0.5s" ani-delay="3.5s">行万里路，不如打开手机屏幕</h3>
            <p class="ani" ani-effect="fadeInRight" ani-duration="0.5s" ani-delay="4s">你与家之间只隔着屏幕的距离</p>
            <p class="ani" ani-effect="fadeInRight" ani-duration="0.5s" ani-delay="4.5s">随时随地查看家庭情况</p>
            <p class="ani" ani-effect="fadeInRight" ani-duration="0.5s" ani-delay="5s">记录你与爱家的点滴</p>
          </div>
        </div>
        <div class="swiper-slide">
          <div style="padding:0 0.75rem;">
            <h3 class="ani" ani-effect="fadeInDown" ani-duration="0.5s">亲密共享、互动化的有趣世界</h3>
            <p class="ani" ani-effect="fadeInDown" ani-duration="0.5s" ani-delay="0.5s">解放双手，说出你想说的，让人工智能来替你操作。</p>
          </div>
          <div class="l-center" style="margin:0.5rem 0;">
            <img class="ani" ani-effect="rotateInDownLeft" ani-duration="0.5s" ani-delay="1.5s" style="width:6.25rem;vertical-align: bottom;" src="~assets/imgs/temp-093.jpg">
            <img class="ani" ani-effect="fadeInRight" ani-duration="0.5s" ani-delay="1s" style="width:6.5rem; margin-left: 0.5rem;" src="~assets/imgs/temp-092.jpg">  
          </div>
          <p class="l-margin l-center ani" ani-effect="fadeInDown" ani-duration="0.5s" ani-delay="2s">
            在APP里互动，让亲朋好友共同参与家庭安全“保卫战</p>
          <div class="l-center" style="margin:0.5rem 0;">
            <img class="ani" ani-effect="fadeInLeft" ani-duration="0.5s" ani-delay="2.5s" style="width:6.5rem;" src="~assets/imgs/temp-094.jpg">
            <img class="ani" ani-effect="rotateInDownRight" ani-duration="0.5s" ani-delay="3s" style="width:6.25rem;vertical-align: bottom;" src="~assets/imgs/temp-095.jpg">
          </div>
        </div>
        <div class="swiper-slide" style="z-index:1;">
          <div class="l-shape-1">
            <div class="l-center l-margin">
              <img class="ani" ani-effect="fadeIn" ani-duration="0.5s" 
                style="width:6.75rem;margin:2.5rem 1.0rem 0 0" src="~assets/imgs/temp-096.jpg"> 
              <img class="ani" ani-effect="fadeIn" ani-duration="0.5s" ani-delay="0.5s" 
                style="width:6.75rem;" src="~assets/imgs/temp-097.jpg">
              <div class="l-text-right ani" ani-effect="fadeInDown" ani-duration="0.5s" ani-delay="1s">
                <h3>设备信息</h3>
                <p>这里可以看到操作记录和设备状态</p>
              </div>
            </div>
            <div class="l-margin l-text-right ani" ani-effect="fadeIn" ani-duration="0.5s" ani-delay="1.5s">
              <img style="width: 11.75rem;" src="~assets/imgs/temp-098.jpg">
            </div>
            <div class="l-margin ani" ani-effect="fadeInDown" ani-duration="0.5s" ani-delay="2s">
              <h3>设备管理</h3>
              <p>在这里，可以进入设备列表、解除绑定、</p>
              <p>分享给朋友还可以邀请其他人来管理设备。</p>
            </div>
            <br>
          </div>
        </div>
        <div class="swiper-slide">
          <div style="margin: 0.75rem 1.0rem; overflow:hidden;">
            <img class="ani" ani-effect="fadeInLeft" ani-duration="0.5s"
              style="width:6.75rem;float:right;" src="~assets/imgs/temp-099.jpg">
            <div style="margin-top:5.0rem;" class="ani" ani-effect="fadeInRight" ani-duration="0.5s">
              <h3>监控消息</h3>
              <p>通过监控消息</p>
              <p>可以看到设备的详细信息哟！</p>  
            </div>
          </div>
          <img class="ani" ani-effect="fadeIn" ani-duration="0.5s" ani-delay="0.5s" src="~assets/imgs/temp-100.png">
          <div class="l-center ani" ani-effect="fadeIn" ani-duration="0.5s" ani-delay="1s">
            <img style="width:9.25rem;" src="~assets/imgs/temp-101.jpg">  
          </div>
          <div class="l-margin l-center ani" ani-effect="fadeIn" ani-duration="0.5s" ani-delay="1.5s">
            <h3>联系我们 关于我们</h3>
            <p>这里可以了解我们，还可以联系我们噢！</p>
          </div>
          <img class="ani" ani-effect="fadeIn" ani-duration="0.5s" ani-delay="2s" src="~assets/imgs/temp-102.jpg">
        </div>
        <div class="swiper-slide">
          <img src="~assets/imgs/temp-103.jpg">
          <div class="l-rel">
            <img src="~assets/imgs/temp-104.jpg">
            <div class="l-shape-circle ani" ani-effect="fadeInDown" ani-duration="0.5s" style="top: 8.0rem;left:0.5rem;">微电商</div>
            <div class="l-shape-circle ani" ani-effect="fadeInDown" ani-duration="0.5s" ani-delay="0.5s" style="top: 4rem;left: 1.5rem;background-color:#37bee5;">IM</div>
            <div class="l-shape-circle ani" ani-effect="fadeInDown" ani-duration="0.5s" ani-delay="1s" style="top: 4rem;left: 5.5rem;background-color:#fa7f1b;">大数据分析</div>
            <div class="l-shape-circle ani" ani-effect="fadeInDown" ani-duration="0.5s" ani-delay="1.5s"  style="top: 7rem;left: 8.5rem;background-color:#8cbe36;">智慧生活</div>
            <div class="l-shape-circle ani" ani-effect="fadeInDown" ani-duration="0.5s" ani-delay="2s"  style="top: 0;left:7.5rem;background-color:#f9bf00;">智慧城市</div>
            <div class="ani" ani-effect="fadeInRight" ani-duration="0.5s" ani-delay="2s" style="position:absolute;top:0;right:0.5rem;font-size:12px;color:#80ae31;">
              <h3 style="color:#f08519;">大数据中心总体计划</h3>
              <p style="color:#f08519;">1、物联网</p>
              <p>2、IM</p>
              <p>3、物联网+手表</p>
              <p>4、物联网+汽车</p>
              <p>5、机器学习</p>
              <p>6、微电商</p>
            </div>
            <div class="l-shape-rect ani" ani-effect="fadeInUp" ani-duration="0.5s" ani-delay="2.5s" style="left: 0.5rem;bottom:4.0rem;">
              <strong>智慧城市</strong><br>
              BI商业智能<br>
              工业4.0<br>
              云计算<br>
              物联网<br>
              互联网+<br>
            </div>
            <div class="l-shape-rect ani" ani-effect="fadeInUp" ani-duration="0.5s" ani-delay="3s" style="left: 6.5rem;bottom:0;">
              <strong>大数据分析</strong><br>
              推荐系统<br>
              实时采集<br>
              数据存储算<br>
              数据挖掘<br>
              机器学习<br>
              深度学习<br>
              神经网络<br>
            </div>
            <div class="l-shape-rect ani" ani-effect="fadeInUp" ani-duration="0.5s" ani-delay="3.5s" style="right: 0.5rem;bottom:3.0rem;">
              <strong>智慧生活</strong><br>
              智能门窗<br>
              智能家电<br>
              智能安防<br>
              智能手表<br>
              智能汽车<br>
            </div>
          </div>
          <div class="l-center" style="background-color:#4a90d8;color:#fff; font-size: 30px;padding: 0.75rem 0;">
            YES,WE ARE READY!<br>
            WE ARE COMING!<br><br>
            <p style="font-size: 20px;">THANK YOU FOR COMING！</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import 'animate.css'
import 'swiper/dist/css/swiper.css'
import Swiper from 'swiper'
import swiperAnimate from 'assets/swiper.animate'

export default {
  route: {
    data() {
      this.$nextTick(()=>{
        let swiperV = new Swiper('.swiper-container-v', {
          freeMode: true,
          freeModeMomentumBounce: false,
          direction: 'vertical',
          slidesPerView: 'auto',
          spaceBetween: 0,
          autoHeight: true,
          onInit(swiper) {
            swiperAnimate.cache()
            swiperAnimate.animate(swiper, true);
          },
          onSliderMove(swiper) {
            swiperAnimate.animate(swiper, true);
          }
        })

        let swiperH = new Swiper('.swiper-container-h', {
          // freeMode: true,
          slidesPerView: 'auto',
          autoplay: 3000,
          // loop: true,
          spaceBetween: 10        
        })

      })
    }
  },
  data() {
    return {
      isOpen: false,
      type: 1
    }
  },
  methods: {
    openDoor(type = 1) {
      this.type = type;
      this.isOpen = !this.isOpen;
    }
  }
}
</script>
<style scoped lang="less">
.l-door-btn{
  top: 1.35rem;
  position: absolute;
  left: 1.5rem;
}
.l-door-btn .iconfont{
  position: absolute;
  right: -1.05rem;
  top: 0.5rem;
  color: #4a90d8;
  font-size: 36px;
  opacity: 0.8;
  display: none;
}
.l-door-btn p{
  width: 6.5rem;
  text-align: right;
  margin: 0.2rem 0 1.05rem 0;
  position: relative;
}
.l-door-btn p:before{
  content: 'OFF';
  width: 2.2rem;
  border: 1px solid #0574c6;
  color: #0574c6;
  border-radius: 3px;
  display: inline-block;
  text-align: center;
  vertical-align: top;
}
.l-door-btn p.l-slted .iconfont{
  display: block;
}

.l-door-btn p.l-slted.l-on:before{
  background-color: #0574c6;
  color: #fff;
  content: 'ON';
}

.l-door-1, .l-door-2{
  // transform-style: preserve-3d;
  -webkit-perspective:600; /* Safari and Chrome */
  perspective:600px;
  
}
.l-door-left, .l-door-right{
  -webkit-transition: all 1s linear 0.2s;transition: all 1s linear 0.2s;
}
/* 阳台门 */
.l-door-1{
  .l-door-left, .l-door-right{
    -webkit-transform: rotateY(0);transform: rotateY(0);
  }
  .l-door-left{
    -webkit-transform-origin: 0 40%;transform-origin: 0 40%;
  }
  .l-door-right{
    -webkit-transform-origin: 100% 40%;transform-origin: 100% 40%;
  }
  .l-door-left.l-door-open{
    -webkit-transform: rotateY(70deg);transform: rotateY(70deg);
  }
  .l-door-right.l-door-open{
    -webkit-transform: rotateY(-70deg);transform: rotateY(-70deg);
  }
}
/* 客房门 */
.l-door-2{
  .l-door-left, .l-door-right{
    -webkit-transform: translatex(0);transform: translatex(0);
  }
  .l-door-left.l-door-open{
    
  }
  .l-door-right.l-door-open{
    -webkit-transform: translatex(-87%); transform: translatex(-87%);
  }
}

.l-shape-circle{
  position: absolute;
  width: 3.0rem;
  height: 3.0rem;
  line-height: 3.0rem;
  border-radius: 50%;
  background-color: #0691e1;
  text-align: center;
  font-size: 12px;
  color: #fff;
}
.l-shape-rect{
  border: 3px solid #f0861a;
  padding: 0.375rem 0.75rem;
  text-align: center;
  position: absolute;
  background: #fff;
  font-size: 12px;
  color: #80ae31;
  strong{
    color: #f0861a;
  }
}

.l-wellife{
  height: 100%;
}
.swiper-container {
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
}

.swiper-slide{
  color: #4083c7;
  background-color: #fff;
  position: relative;
  .l-abs{
    position: absolute;
    left:0;right:0;
  }
  .l-rel{
    position: relative;
  }
  p{font-size: 14px;}
}

.swiper-container-h{
  .swiper-slide{
    height: 13.5rem;
    width: 7.5rem;
  }
  img {
    max-width: 100%;
    height: 100%;
  }
}
.l-shape-1{
  position: relative;
  z-index: 0;
  color: #fff;
  padding: 0.75rem 0;
  margin: 2.0rem 0;
}
.l-shape-1:before{
  content: '';
  position: absolute;
  top:0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #4a90d8;
  z-index: -1;
  -webkit-transform: skewy(-20deg);transform: skewy(-20deg);
}

</style>
