<template>

<!-- 特权卡详情 banner状态 -->
    <div class="card-list-info-box">
        <img src="../images/cardinfo.jpg" alt="" />


       <!--  <div class="card-list-info-icon" v-if="lists.status ==1"><img src="../images/state1.png" alt="生效中" /></div>
               <div class="card-list-info-icon" v-else-if="lists.status ==2"><img src="../images/state2.png" alt="待激活" /></div>
               <div class="card-list-info-icon" v-else-if="lists.status ==3"><img src="../images/state3.png" alt="已转赠" /></div>
               <div class="card-list-info-icon" v-else-if="lists.status ==4"><img src="../images/state4.png" alt="已过期" /></div>
               <div class="card-list-info-icon" v-else-if="lists.status ==51 || lists.status ==52 || lists.status ==53 || lists.status ==54"><img src="../images/state5.png" alt="已作废" /></div> -->
        <div class="card-list-info-icon"><img src="../images/state1.png" alt="" /></div>
    </div>
<!-- 特权卡详情 banner状态-->

</template>


<style lang="sass">
    
  .card-list-info-box{
        width:80%;
        height:5.6rem;
        position:relative;
        margin:.9rem auto 0 auto;

        img{
            width:100%;
            height:100%;
        }

        .card-list-info-icon{
            width:2.25rem;
            height:2.25rem;
            position: absolute;
            top:0;
            right:0;
            
            img{
                width:100%;
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
