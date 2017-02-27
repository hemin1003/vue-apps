<template>
  <div>
    <div class="m-item" v-for="item in list" v-link="item.url">
      <masker style="border-radius: 2px;" :opacity="0.5">
        <div class="m-img" :style="{backgroundImage: 'url(' + item.img + ')'}"></div>
        <div slot="content" class="m-title">
          <p class="m-circle" v-text="item.title"></p>
        </div>
      </masker>
    </div>
  </div>
</template>
<script>
import { Masker } from 'vux-components'
export default {
  components: {
    Masker
  },
  data() {
    return {
      list: [{
        title: '产品展示',
        img: require('assets/imgs/temp-010.jpg'),
        url: '/product/list'
      }, {
        title: '智慧生活',
        img: require('assets/imgs/temp-013.jpg'),
        url: '/wellife'
      }, {
        title: '澳式风情',
        img: require('assets/imgs/temp-014.jpg'),
        url: '/australia'
      }, {
        title: '720展厅',
        img: require('assets/imgs/temp-015.jpg'),
        url: 'http://www.hzzx3d.com/news/aylson/index.html'
      }]
    }
  }
}
</script>
<style scoped>
.m-item{
  margin:0.75rem;
  overflow: hidden;
}
.m-img {
  padding-top: 40%;
  display: block;
  position: relative;
  max-width: 100%;
  background-size: cover;
  background-position: center center;
  cursor: pointer;
  border-radius: 2px;
}

.m-time {
  font-size: 12px;
  padding-top: 4px;
  border-top: 1px solid #f0f0f0;
  display: inline-block;
  margin-top: 5px;
}

.m-title {
  color: #fff;
  text-align: center;
  /*text-shadow: 0 0 1px rgba(0, 0, 0, .5);*/
  font-weight: 500;
  font-size: 14px;
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  text-align: center;
  top: 50%;
  transform: translateY(-50%);
}

.m-circle{
  width: 4rem;
  height: 4rem;
  line-height: 4rem;
  background-color: rgba(255,255,255, 0.8);
  margin: auto;
  border-radius: 50%;
  color: #333;
}
</style>
