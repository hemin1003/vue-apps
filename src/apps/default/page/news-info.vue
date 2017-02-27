<template>
  <div>
    <l-article v-if="info" :title="info.title" :time="info.createTime">
      <div v-html="info.content"></div>
    </l-article>
  </div>
</template>

<script>
import LArticle from 'components/l-article'
import server from '../server'

export default {
  components: {
    LArticle
  },
  route: {
    data({ to }) {
      const self = this
      server.news.getInfo(to.query.id).then( info => {
        self.info = info
        self.$vux.loading.hide()
      })
      self.$vux.loading.show()
    }
  },
  data() {
    return {
      info: null
    }
  }
}
</script>

