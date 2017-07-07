var utils = require('utils');

const app = new Vue({
    el: '#app',
    components: {
        "comp-header":require('../components/header.vue'),
    },
    data : {
        card_id: utils.queryString('card_id'),
        token: '',
        platform: '',
        selected_card:[],
        total:0,//总价
        json_data:null,
        isSelecting:false,
    },
    beforeCreate: function() {
        utils.adaptive();
    },
    mounted: function() {
        //百度统计
        utils.hmBaidu();

        let _self = this;
        _self.token = utils.queryString('token') || utils.getCookie('token');
        if (_self.token) {
            utils.setCookie('token', _self.token, 30);
        }
        _self.platform = utils.queryString('platform') || utils.getCookie('platform');
        if (_self.platform) {
            utils.setCookie('platform', _self.platform, 30);
        }

        _self.init();

    },
    methods:{
        init:function(){
            let _self = this;
            utils.commonAjax({
                url: '/vipcard/vip/getVipServiceList',
                data: {
                    token: _self.token,
                    card_id: _self.card_id,
                },
                success: function (json) {
                    //TODO 假数据
                    /*json = {
                        "code": 0,
                        "data": [
                            {
                                "id": "49",
                                "order_type": "8",
                                "title": "违章9折",
                                "detail": "以文字来表现已经制定的创意策略。",
                                "price": 13.00,
                                "icon": "https://image.etcchebao.com/20170606103556JCNFlK.png",
                                "status": 1,//1.可购买 2. 已购买 3.可升级
                                "aging": "12"
                            },
                            {
                                "id": "50",
                                "order_type": "33",
                                "title": "加油99折",
                                "detail": "加油99折",
                                "price": 0.01,
                                "icon": "https://image.etcchebao.com/20170606110610gTBWSg.png",
                                "status": 1,
                                "aging": "12"
                            },
                            {
                                "id": "51",
                                "order_type": "0",
                                "title": "洗车打折",
                                "detail": "洗车打折",
                                "price": "0.00",
                                "icon": "https://image.etcchebao.com/20170606142526XDxMkh.png",
                                "status": 3,
                                "aging": "12"
                            }
                        ],
                        "msg": "success"
                    };*/

                    console.log(json);
                    if (json.code == 0) {
                        _self.json_data = json.data;
                    } else {
                        utils.alert(json.msg);
                    }
                }
            });
        },

        select_card:function(e){

            var $this = $(e.currentTarget);
            var _self = this;

            if(!_self.isSelecting){
                return ;
            }else{
                _self.isSelecting = false;
            }

            if($this.hasClass("checked")){
                $this.removeClass("checked");
                _self.selected_card.remove(e.currentTarget.dataset.id);
                var result = parseFloat(_self.total) - parseFloat(e.currentTarget.dataset.price);
                _self.total = result.toFixed(2);
            }else{
                $this.addClass("checked");
                _self.selected_card.push(e.currentTarget.dataset.id);
                var result = parseFloat(_self.total) + parseFloat(e.currentTarget.dataset.price);
                _self.total = result.toFixed(2);
            }
        },

        to_buy: function () {
            var _self = this;
            console.log('立即购买');
            if(_self.selected_card.length<1){
                return;
            }

            location.href='car_bind_list.html?total='+_self.total+'&card_id='+_self.card_id+'&cards='+_self.selected_card.toString();
        },

        touchStart:function(){
            var _self = this;
            _self.isSelecting = true;
        },
        touchMove:function(){
            var _self = this;
            _self.isSelecting = false;
        },
        //车主卡说明
        toStatement : function(){
            let _self = this;
            window.location.href='car_service_state.html';
        },
    }
});
