<template>
  <div class="l-select-none">
    <blur class="l-user-avatar l-flex-hc" :blur-amount="15" :height="120" :url="defaultVal.avatarBg" v-link="'/user/info'">
      <div class="avatar" :style="{'background-image': 'url('+ (userinfo.photo || defaultVal.avatar) +')'}"></div>
      <div v-if="userinfo.mobilePhone" class="l-rest">
        <h3 v-text="userinfo.realName || '未设置姓名'"></h3>
        <p v-text="userinfo.mobilePhone">13800138000</p>
      </div>
      <div v-else class="l-rest">
        <p>您还没登录</p>
      </div>
      <div style="width:40px;text-align:center;"><i class="iconfont icon-arrow">&#xe601;</i></div>
    </blur>
    <group class="l-group">
      <!-- <cell title="个人信息" link="/user/info">
        <i slot="icon" class="iconfont" style="background-color:#1ab9cf;">&#xe6b7;</i>
      </cell> -->
      <cell title="我的预约" link="/user/appointment">
        <i slot="icon" class="iconfont" style="background-color:#2ea748;">&#xe6d0;</i>
      </cell>
      <cell title="我的订单" link="/user/order">
        <i slot="icon" class="iconfont" style="background-color:#535fe0;">&#xe653;</i>
      </cell>
      <cell title="我的优惠劵" link="/user/coupon">
        <i slot="icon" class="iconfont" style="background-color:#f19824;">&#xe625;</i>
      </cell>
      <cell title="重置密码" link="/user/pwd">
        <i slot="icon" class="iconfont" style="background-color:#f96827;">&#xe613;</i>
      </cell>
      <cell title="意见反馈" link="/user/faq">
        <i slot="icon" class="iconfont" style="background-color:#41af58;">&#xe64d;</i>
      </cell>
      <cell title="400-816-2882" value="09:00-24:00" :is-link="true" @click="callPhone('400-816-2882')">
        <i slot="icon" class="iconfont" style="background-color:#fe486e;">&#xe652;</i>
      </cell>
      <cell v-if="userinfo.mobilePhone" title="退出登录" :is-link="true" @click="logout">
        <i slot="icon" class="iconfont" style="background-color:#999999;">&#xe7c7;</i>
      </cell>
    </group>
  </div>
</template>
<script>
import { utils, storage } from 'assets/lib'
import { Blur, Group, Cell } from 'vux-components'
import { store, getters, actions } from '../vuex'
import config from '../config'

export default {
  components: {
    Blur, Group, Cell
  },
  store,
  vuex: {
    getters,
    actions
  },
  data() {
    return {
      defaultVal: config.defaultVal
    }
  },
  methods: {
    callPhone(phone) {
      window.location.href = 'tel://' + phone;
    },
    logout() {
      let self = this
      self.$vux.confirm.show({
        title: '确定退出登录？',
        onConfirm() {
          self.acClearUserInfo()
          self.$router.replace('/login')
          // self.$router.replace('/login?redirect=' + self.$route.path)
          // self.$router.go({
          //   path: 'login?redirect=' + self.$route.path,
          //   replace: true
          // })
        }
      })
    }
  }
}
</script>
<style lang="less">
.l-user-avatar {
  z-index: 0;
  background-color: #35495e;
  color: #fff;
  h3{
    font-weight: 400;
  }
}

.l-user-avatar .avatar {
  width: 3.0rem;
  height: 3.0rem;
  margin:0 0.75rem;
  border-radius: 50%;
  border: 2px solid #ececec;
  background: no-repeat 50% 50%;
  background-size: cover;
}
</style>
