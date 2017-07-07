<template>

<!-- 特权卡详情 banner状态 --> 
<div>   
    <ul class="card-activated">
        <li>
            <p>激活截止日</p>
            <span>2017/12/12</span>
        </li>
        <li>
            <p>操作指南</p>
            <span>&gt;</span>
        </li> 
    </ul> 
    <p class="card-info-tips">如有疑问，请联系客服电话：<span>4009306000</span></p>

    <div class="btn-card-share">转赠好友&gt;&gt;</div>
    <div class="btn-activated-box">
        <div class="btn-card-act">激活特权卡</div>
    </div>
</div>
<!-- 特权卡详情 banner状态-->

</template>

<style lang="sass">
  .card-activated{
     width:100%;
     margin-top:0.5rem;
     background-color: #fff;
     color:#666;
     font-size:.6rem;

     li{
         width:96%;
         height:2rem;
         line-height: 2rem;
         float:right;
         border-bottom:1px solid #e4e4e4;

         p{
             width:44%;
             height:100%;
             float:left;
         }
         span{
             width:56%;
             height:100%;
             float:left;
             text-align:right;
             padding-right:4%;
             color:#333;
         }
     }
     li:last-child{
        border-bottom:none;
     }
  }
  .card-activated:after{
    display:block; 
    content:""; 
    height:0; 
    clear:both; 
    overflow:hidden; 
    visibility:hidden;
  }
  .btn-activated-box{
    width:100%;
    height:2.75rem;
    line-height: 285%;
    padding:.4rem 4%;
    position:fixed;
    bottom:0;
    left:0;
    background-color: #fff;
    border-top:1px solid #dcdcdc;

    .btn-card-act{
        width:100%;
        height:100%;
        background-color: #eabf50;
        text-align:center;
        color:#8e4d00;
        font-size:.65rem;
        margin:0 auto;
    }
  }
  .btn-card-share{
    width:40%;
    height:2rem;
    line-height: 2rem;
    color:#d27e00;
    font-size:.6rem;
    margin:0 auto 4rem auto;
    text-align:center;
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
