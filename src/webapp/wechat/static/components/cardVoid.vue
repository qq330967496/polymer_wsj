<template>

<!-- 特权卡详情 banner状态 -->    
    <div class="card-donation-invalid">
        <p class="card-info-information-tit">作废说明</p>
        <div class="card-void-cont">
            <p class="card-void-cont-hd">此卡所关联车牌变更为营运车辆，不符返还规则</p>
            <p class="card-void-cont-bd">2017/12/12</p>
        </div>

        <!-- <p class="card-info-information-tit">转赠记录</p>
        <div class="card-void-cont">
            <p class="card-void-cont-hd">您的微信好友xxx 领取了您的九折卡</p>
            <p class="card-void-cont-bd">2017/12/12</p>
        </div> -->
        
    </div> 
<!-- 特权卡详情 banner状态-->

</template>

<style lang="sass">
  .card-donation-invalid{
     width:100%;
     margin-top:0.5rem;
     background-color: #fff;
     color:#666;
     font-size:.6rem;
     
     .card-info-information-tit{
         padding-left: 4%;
         height:2.0rem;
         line-height: 2.0rem;
         border-bottom:1px solid #e4e4e4;
         font-weight:bold;
     }

     .card-void-cont{
        /*width:92%;*/
        padding:.5rem 4%;

        .card-void-cont-hd{
            color:#333;
            font-size:.65rem;
            line-height: 150%;
        }

        .card-void-cont-bd{
            color:#999;
            font-size:.5rem;
        }
     }

       
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
