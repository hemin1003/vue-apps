<template>
  <div>
    <search 
      @on-change="getResult" 
      :results="results" 
      :value.sync="value" 
      placeholder="输入订单号或手机号查询"
      cancel-text="取消"> 
      <order-list :list="orderList"></order-list>
      <div v-if="loaded && orderList.length === 0" style="text-align:center;color:#999;">
        <br><br><br><br><p>找不到相关订单</p><br><br>
      </div>
      <div v-if="loading" class="l-loading"><br><br><br><br><br></div>
    </search>
  </div>
</template>
<script>
import { Search } from 'vux-components'
import OrderList from '../components/order-list'
import server from '../server'
let timeout = 0
export default {
  components: {
    Search, OrderList
  },
  data () {
    return {
      loaded: false,
      loading: false,
      orderList: [],
      value: ''
    }
  },
  methods: {
    getResult (val) {
      let self = this
      self.loaded = false
      if(!val) return
        
      clearTimeout(timeout)
      timeout = setTimeout(()=>{
        self.loading = true
        self.loaded = false

        server.order.getList(val).then( listEntity => {
          self.listEntity = listEntity
          listEntity.rows = 50
          listEntity.callback = function(){
            self.orderList = listEntity.alldata
            self.loaded = true
            self.loading = false
          }
          listEntity.init()
        })
      }, 1000)
    }
  }
}
</script>
