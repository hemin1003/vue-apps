<template>
  <div>
    <div class="l-order-item">
      <p>订<ins class="ins4-1"></ins>单<ins class="ins4-1"></ins>号：<span v-text="info.orderNo"></span></p>
      <p v-if="info.designer">专属客服：<span v-text="info.designer"></span><span>(<a href="tel:{{info.designerPhone}}" v-text="info.designerPhone"></a>)</span></p>
      <p>姓<ins></ins>名：<span v-text="info.name"></span></p>
      <p>手机号码：<span v-text="info.mobilePhone"></span></p>
      <p>楼盘地址：<span v-text="info.province+info.city+info.area+(info.address||'')"></span></p>
    </div>

    <div class="l-status">
      <div class="l-status-item l-flex-h" v-for="item in statusList" :class="{'l-finish': item.done}">
        <div>
          <img :src="item.icon">
          <p v-text="item.datetime"></p>
        </div>
        <div>
          <h4 v-text="item.title"></h4>
          <p v-text="item.remark"></p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import server from '../server'
export default {
  route: {
    data({ to }) {
      const self = this
      let id = to.query.id
      server.order.getInfo(id).then( info => {
        self.$vux.loading.hide()
        let status = null
        self.info = info
        info.scheduleVoList.forEach((item, index)=>{
          status = self.statusList[index]
          status.datetime = item.createTime
          status.remark = item.remark
          status.done = true
          self.statusList.$set(index, status)
        })
      })
      self.$vux.loading.show()
    }
  },
  data() {
    return {
      info: {},
      statusList: [{
        icon: require('assets/imgs/icon-009.png'),
        datetime: '',
        title: '确认订单',
        remark: '',
        done: false
      },{
        icon: require('assets/imgs/icon-010.png'),
        datetime: '',
        title: '已经生产完成',
        remark: '',
        done: false
      },{
        icon: require('assets/imgs/icon-011.png'),
        datetime: '',
        title: '产品入库中',
        remark: '',
        done: false
      },{
        icon: require('assets/imgs/icon-012.png'),
        datetime: '',
        title: '产品出库',
        remark: '',
        done: false
      },{
        icon: require('assets/imgs/icon-013.png'),
        datetime: '',
        title: '已经发货，预计30天后到达',
        remark: '',
        done: false
      }]
    }
  },
  methods: {
    getStatus(code) { 
      switch(code){
        case 1:
          return '确认订单'
        case 2:
          return '生产完成'
        case 3:
          return '产品入库中'
        case 4:
          return '产品出库'
        case 5:
          return '已经发货'
      }
    }
  }
}
</script>

<style scoped lang="less">
.l-order-item{
  padding: 0.75rem;
  background-color: #fff;
  margin: 0 0 0.533333rem 0;
  font-size: 14px;
  p{
    margin:5px 0;
  }
  span{
    color: #999;
  }
}
.l-status{
  background-color: #fff;
}
.l-status-item{
  *{
    box-sizing: border-box;
    word-break: break-all;
  }
  p{
    color: #999;
    font-size: 14px;
    line-height: 1.2;
  }
  >div{
    padding:15px 20px;
  }
  >div:nth-child(1){
    width: 40%;
    border-right: 1px solid #4083c7;
    text-align: right;
    p{
      width: 80px;
      text-align: center;
      float: right;
    }
    img{
      width: 50px;
      margin: 5px 15px;
      filter: grayscale(100%);
      filter: gray;
      opacity: 0.5;
    }
  }
  >div:nth-child(2){
    width: 60%; 
    p{
      margin-top: 5px;
    }
    h4{
      margin-top: 24px;
      position: relative;
      color: #999;
      line-height: 1.2;
    }
    h4:before{
      content: '';
      border: 7px solid #4083c7;
      position: absolute;
      left: -28px;
      width: 0;
      height: 0;
      font-size: 0;
      transform: rotate(45deg);
      top: 1px;
    }
  }
}
.l-finish{
  div:nth-child(1){
    img{
      filter: none;
      opacity: 1;
    }
  }
  div:nth-child(2){
    h4{
      color: inherit;
    }
  }
}
</style>