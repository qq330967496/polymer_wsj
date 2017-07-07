<template>

<!-- 有无特权卡 -->
    <div class="card-list-box">
    <!-- 有特权卡 -->
        <ul class="card-list-cont" v-if="isCard">
            <li v-for="lists in cardlists" >
               <img :src="lists.list_skin" alt="九折卡" :id="lists.card_id" @click="liClick(lists)"/>
               <div class="card-list-type-icon" v-if="lists.status ==1"><img src="../images/state1.png" alt="生效中" /></div>
               <div class="card-list-type-icon" v-else-if="lists.status ==2"><img src="../images/state2.png" alt="待激活" /></div>
               <div class="card-list-type-icon" v-else-if="lists.status ==3"><img src="../images/state3.png" alt="已转赠" /></div>
               <div class="card-list-type-icon" v-else-if="lists.status ==4"><img src="../images/state4.png" alt="已过期" /></div>
               <div class="card-list-type-icon" v-else-if="lists.status ==51 || lists.status ==52 || lists.status ==53 || lists.status ==54"><img src="../images/state5.png" alt="已作废" /></div>
            </li>  
        </ul>
        <!-- 没有特权卡 -->

        <!-- 没有特权卡 -->
        <div class="card-list-none" v-else>
            <img src="../images/nocard.jpg" alt="" />
            <span>你暂时还没有特权卡</span>
        </div>
        <!-- 没有特权卡 -->

    </div>
<!-- 有无特权卡 -->

</template>

<style lang="sass">
    img{
        display:block;
    }
    .card-list-box{
        width:100%;
        height:100%;
        background-color: #efefef;

        .card-list-none{
            width:100%;
            height:100%;
            padding-top:36%;
            text-align:center;
            font-size:.6rem;
            color:#999;
            background-color: #fff;
            box-sizing:border-box;
            img{
                width:50%;
                display:block;
                margin: 0 auto 1rem auto;
            }
        }

        .card-list-cont{
            /*width:94%;*/
            padding:.5rem 3% 0 3%;

            li{
                width:100%;
                height:4.65rem;
                margin-bottom:.4rem;
                position:relative;


                img{
                    width:100%;
                    height:100%;
                    border-radius:.25rem;
                }

                .card-list-type-icon{
                    width:2.25rem;
                    height:2.25rem;
                    position:absolute;
                    right:0;
                    top:0;

                    img{
                        width:100%;
                    }
                }
            }
        }

    }
    [v-cloak]{
        display:none;
    }
</style>

<script>

var utils = require('utils');

export default {
  data () {
    return {
      isCard:false,
      cardlists:[],
    }
  },
  beforeCreate: function() {
      utils.adaptive();
  },
  mounted: function() {
      
      var token = utils.queryString('token');
      let _self = this;

      $.ajax({
        type: "POST",
        url: "http://api-card.etcchebao.com/privilege/card-packet/my-card-list?token="+token,
        dataType: 'jsonp',
        success: function(json) {

          if (json.code == 0 && json.data!='') {
            var data = json.data;
            
            _self.isCard=true;

            _self.cardlists = data;

            console.log(_self.cardlists)

          }else if(json.code==-2002){
            alert("网络迟缓，强刷新重试~");
          }
        }
      });


  },
  methods:{
    liClick : function(lists){
        var token = utils.queryString('token');

        window.location.href = '/privilege_card/view/card_detail.html?card_id='+lists.card_id+'&token='+token;

    }
  }
} 
</script>
