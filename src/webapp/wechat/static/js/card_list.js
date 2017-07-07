var utils = require('utils');
require('../css/global.css');

const app = new Vue({
    el: '#app',
    components: {
        "comp-header":require('../components/header.vue'),
    },
    data : {
        token: '',
        platform: '',
        cardlists:[],
        carCardList:[],
    },
    beforeCreate: function() {
        utils.adaptive();
    },
    mounted: function() {

        //百度统计
        utils.hmBaidu();

        let _self = this;


        if(!utils.queryString('token')){
            utils.removeCookie('token');
        }

        _self.token = utils.queryString('token') || utils.getCookie('token');
        if (_self.token) {
            utils.setCookie('token', _self.token, 30);
        }
        _self.platform = utils.queryString('platform') || utils.getCookie('platform');
        if (_self.platform) {
            utils.setCookie('platform', _self.platform, 30);
        }

        utils.checkLogin(_self.token);

        if (_self.token) {
            _self.init();
            _self.init_car_card();
        }
    },
    methods:{
        //初始化特权卡
        init:function(){
            let _self = this;
            utils.commonAjax({
                // type: "POST",
                url: "/privilege/card-packet/my-card-list?token="+_self.token,
                success: function(json) {
                    //TODO 假数据
                    /*json={
                        code:0,
                        data:[
                            {
                                card_id:1,
                                username:'1388888888',
                                status:1,
                                list_skin:'../images/bg_9card_1.png',
                            },
                            {
                                card_id:2,
                                username:'1388888888',
                                status:2,
                                list_skin:'../images/bg_9card_1.png',
                            },
                            {
                                card_id:3,
                                username:'1388888888',
                                status:3,
                                list_skin:'../images/bg_9card_1.png',
                            }
                        ]
                    }*/
                    console.log(json);
                    if (json.code == 0) {
                        var data = json.data;
                        _self.cardlists = data;

                    }else if(json.code==-2002){
                        utils.alert("网络迟缓，请刷新重试~");
                    }else{
                        utils.alert(json.msg);
                    }
                }
            });
        },

        //初始化车主卡
        init_car_card:function(){
            let _self = this;
            utils.commonAjax({
                url:'/vipcard/vip/getUserCardList' ,
                data:{
                    token:_self.token
                },
                success:function(json){
                    //TODO 假数据
                    /*json = {
                        "code": 0,
                        "data": [
                            {
                                "card_id": "5042",
                                "status": "2",//2待激活 / 3使用中 /4已过期
                                "card_type": 1,
                                "list_img": "../images/bg_9card_1.png"
                            },{
                                "card_id": "5043",
                                "status": "3",
                                "card_type": 1,
                                "list_img": "../images/bg_9card_1.png"
                            },{
                                "card_id": "5044",
                                "status": "4",
                                "card_type": 1,
                                "list_img": "../images/bg_9card_1.png"
                            }
                        ],
                        "msg": "success"
                    }*/
                    console.log(json);
                    if (json.code == 0) {
                        _self.carCardList = json.data;
                    }else if(json.code==-2002){
                        utils.alert("网络迟缓，请刷新重试~");
                    }else{
                        utils.alert(json.msg);
                    }
                }
            });
        },

        //车主卡详情
        carCardDetail:function(item){
            window.location.href = '/view/car_card_detail.html?card_id='+item.card_id;
        },

        //特权卡详情
        liClick : function(lists){
            let _self = this;
            window.location.href = '/view/card_detail.html?card_id='+lists.card_id+'&token='+_self.token;
        }
    }
});
