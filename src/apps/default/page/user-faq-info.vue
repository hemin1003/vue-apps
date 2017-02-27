<template>
  <div>
    <l-article v-if="info" :title="info.question" time="2016-12-12">
      <div v-html="info.answer"></div>
      <!-- <div slot="footer" class="l-btn-area">
        <x-button mini>已解决</x-button>
        &nbsp;&nbsp;
        <x-button mini>未解决</x-button>  
      </div> -->
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
      server.faq.getHelpDetail(to.query.id).then( info => {
        self.info = info
        self.$vux.loading.hide()
      })
      self.$vux.loading.show()
    }
  },
  data() {
    return {
      info: {}
    }
  }
}
</script>
