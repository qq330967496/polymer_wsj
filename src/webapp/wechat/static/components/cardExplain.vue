<template>

<!-- 特权卡详情 banner状态 -->    
    <ul class="card-list-info-service">
        <a href="javascript:void(0)" class="card-explain">特权说明</a>
        <li>
            <div class="card-info-service-icon"><img src="../images/ex1.jpg" alt="" /></div>
            <p>路费返还</p>
            <span>路费9折优惠</span>
        </li>
        <li>
            <div class="card-info-service-icon"><img src="../images/ex2.jpg" alt="" /></div>
            <p>转赠好友</p>
            <span>支持微信转赠</span>
        </li>
        <li>
            <div class="card-info-service-icon"><img src="../images/ex3.jpg" alt="" /></div>
            <p>转赠好友</p>
            <span>专属客服服务</span>
        </li>
    </ul>
<!-- 特权卡详情 banner状态-->

</template>

<style lang="sass">
  .card-list-info-service{
    width:100%;
    background-color: #fff;
    box-shadow:0 -2px .5rem #d5d5d5;
    text-align:center;
    padding-top:.55rem;

    .card-explain{
      height:0.75rem;
      line-height: 0.75rem;
      font-size:.55rem;
      color:#666;
      display:block;
      position:relative;
      margin-bottom:.85rem;
    }
    .card-explain:after{
      width:.55rem;
      height:.75rem;
      background:url(../images/what.jpg) no-repeat center center;
      display:inline-block;
      content: '';
      position: absolute;
      top: 0;
      background-size: contain;
      margin-left:.4rem;
    }

    li{
        width:33.333%;
        height:100%;
        float:left;
        text-align:center;
        margin-bottom:1rem;

        .card-info-service-icon{
            width:1.75rem;
            height:1.75rem;
            margin:0 auto;

            img{
                width:100%;
                display:block;
            }
        }
        p{
            height:1.25rem;
            line-height: 1.25rem;
            font-size:.6rem;
            color:#333;
        }
        span{
            font-size:.5rem;
            color:#999;
        }
    }
    
  }
  .card-list-info-service:after{
    display:block; 
    content:""; 
    height:0; 
    clear:both; 
    overflow:hidden; 
    visibility:hidden;
  }
  

</style>

<script>
export default {
  data () {
    return {
      msg: 'Hello from vue-loader!',
    }
  },
  ready() {
    
  },
  methods:{
    
  }
} 
</script>
