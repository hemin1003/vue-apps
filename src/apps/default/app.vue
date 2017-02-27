<template>
  <div style="height:100%;">
    <view-box v-ref:view-box class="l-body" :class="{'l-no-header': $device.isWechat, 'l-no-footer': !route.mainPage}">
      <!--header slot-->
      <div class="l-header-box" slot="header">
        <x-header :left-options="leftOptions" :transition="headerTransition" :title="route.title" @on-click-title="scrollTop"></x-header>
      </div>
      <!--default slot-->
      <router-view :transition="'vux-pop-' + direction"></router-view>
      <!--bottom slot-->
      <div class="l-tabbar-box" slot="bottom" v-show="route.mainPage">
        <tabbar icon-class="vux-center">
          <tabbar-item v-link="{path:'/home', replace: true}" :selected="route.path === '/home'">
            <i slot="icon" class="iconfont">&#xe774;</i>
            <span slot="label">品牌中心</span>
          </tabbar-item>
          <tabbar-item v-link="{path:'/activity', replace: true}" :selected="route.path === '/activity'">
            <i slot="icon" class="iconfont">&#xe6d3;</i>
            <span slot="label">活动中心</span>
          </tabbar-item>
          <tabbar-item v-link="{path:'/product', replace: true}" :selected="route.path === '/product'">
            <i slot="icon" class="iconfont">&#xe61c;</i>
            <span slot="label">产品中心</span>
          </tabbar-item>
          <tabbar-item v-link="{path:'/user', replace: true}" :selected="route.path === '/user'">
            <i slot="icon" class="iconfont">&#xe6b7;</i>
            <span slot="label">个人中心</span>
          </tabbar-item>
        </tabbar>
      </div>
    </view-box>
  </div>
</template>
<script>
import $ from 'sprint-js'
import { Tabbar, TabbarItem, ViewBox, XHeader } from 'vux-components'
import { store, getters, actions } from './vuex'
import server from './server'

export default {
  components: {
    Tabbar, TabbarItem, ViewBox, XHeader
  },
  events: {
    'hook:created': function() { 
      console.log('app components created!')
    },
    'hook:ready': function() {
      console.log('app components ready!')
      // setTimeout(()=> $('#app-loader').addClass('app-loaded'), 3000)
      // setTimeout(() => {
      //   $('#app-loader').remove()
      //   $('#app-loader-css').remove()
      // }, 5000)
    }
  },
  store,
  vuex: {
    getters, actions
  },
  data() {
    return {
      
    }
  },
  methods: {
    scrollTop() {
      this.$refs.viewBox.$els.viewBoxBody.scrollTop = 0
    }
  },
  computed: {
    leftOptions() {
      return {
        showBack: !this.route.mainPage
      }
    },
    headerTransition() {
      if (!this.direction) return ''
      return this.direction === 'out' ? 'vux-header-fade-in-left' : 'vux-header-fade-in-right'
    }
  }
}
</script>
<style>
/*全局样式*/
.l-header-box {
  z-index: 999;
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
}

.l-tabbar-box .weui_tabbar {
  backdrop-filter: blur(10px);
  background-color: none;
  background: rgba(247, 247, 250, 0.9);
}

.l-tabbar-box [slot=icon] {
  color: #888;
}

.l-tabbar-box .weui_bar_item_on .iconfont {
  color: #09BB07;
}

.weui_tabbar_icon + .weui_tabbar_label {
  margin-top: 0!important;
}

.l-body .weui_tab_bd {
  padding-top: 46px;
  padding-bottom: 50px;
}

.l-no-header .l-header-box {
  display: none;
}

.l-no-header .weui_tab_bd {
  padding-top: 0;
}

.l-no-footer .weui_tab_bd {
  padding-bottom: 0;
}
</style>
