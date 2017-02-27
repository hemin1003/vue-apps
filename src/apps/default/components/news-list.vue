<template>
  <div class="l-news-list l-margin-b">
    <div class="l-flex-hc l-news-item l-border-t" v-for="item in list" track-by="$index" @click="view(item.id)">
      <div class="l-thumb">
        <img :src="$image.thumb(item.thumb, 60, 60)">
      </div>
      <div class="l-rest">
        <h4 class="l-text-wrap" v-text="item.title"></h4>
        <p class="l-text-clamp2" v-text="item.summary"></p>
      </div>
      <div>
        <i class="iconfont icon-arrow">&#xe601;</i>
      </div>
    </div>
    <div v-if="loading" class="l-loading"></div>
  </div>
</template>
<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: []
    }
  },
  methods: {
    view(id) {
      this.$router.go(`/news/list/info?id=${id}`)
    }
  }
}
</script>
<style scoped lang="less">
.l-news-item{
  background-color: #fff;
  padding: 0.75rem;
  .l-thumb{
    width: 2.5rem;
    height: 2.5rem;
    margin-right: 0.5rem;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .l-rest{
    h4{
      font-size: 17px;
      font-weight: 400;
      margin-bottom: 5px;
    }
    p{
      color: #999;
      font-size: 12px;
    }
  }
}
.l-news-item:active{
  background-color: #ebebeb;
}
</style>
