<template>

<!-- 特权卡详情 banner状态 -->  
<div> 
    <ul class="card-info-information">
        <p class="card-info-information-tit">个人信息</p>
        <li>
            <p class="info-icon info-icon1">关联车牌</p>
            <span>粤A55555</span>
        </li>
        <li>
            <p class="info-icon info-icon2">关联粤通卡</p>
            <span>421022119999998888</span>
        </li>
        <li>
            <p class="info-icon info-icon3">剩余返还次数</p>
            <span>3次&gt;</span>
        </li>
        <li>
            <p class="info-icon info-icon4">到期时间</p>
            <span>2016-12-12</span>
        </li>
    </ul> 
    <p class="card-info-tips">如有疑问，请联系客服电话：<span>4009306000</span></p>
</div> 
<!-- 特权卡详情 banner状态-->

</template>

<style lang="sass">
  .card-info-information{
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
     li{
         width:96%;
         height:2rem;
         line-height: 2rem;
         float:right;
         border-bottom:1px solid #e4e4e4;

         p.info-icon{
             width:44%;
             height:100%;
             float:left;
             position:relative;
             padding-left:1.1rem;
         }
         p.info-icon:before{
            width: .825rem;
            height: 100%;
            display: inline-block;
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            background-size: contain;        
         }
         p.info-icon1:before{
            background: url(../images/list1.jpg) no-repeat center center;
            background-size: contain;
         }
         p.info-icon2:before{
            background: url(../images/list2.jpg) no-repeat center center;
            background-size: contain;
         }
         p.info-icon3:before{
            background: url(../images/list3.jpg) no-repeat center center;
            background-size: contain;
         }
         p.info-icon4:before{
            background: url(../images/list4.jpg) no-repeat center center;
            background-size: contain;
         }
         span{
             width:56%;
             height:100%;
             float:right;
             text-align:right;
             padding-right:4%;
             color:#333;
         }
     }
     li:last-child{
        border-bottom:none;
     }
  }
  .card-info-information:after{
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
