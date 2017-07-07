var utils = require('utils');

const app = new Vue({
    el: '#app',
    components: {
        "comp-header": require('../components/header.vue'),
    },
    data: {
        token: '',
        platform: '',
        total: utils.queryString('total'),
        card_id: utils.queryString('card_id'),
        cards:utils.queryString('cards'),
        selected_car: null,
        selected_fuel: null,
        json_data: {
            cars: {
                car_info: []
            },
            cards: {
                card_info: []
            }
        },
        canSubmit: false,
        isSelecting:false,
    },
    beforeCreate: function () {
        utils.adaptive();
    },
    mounted: function () {
        let _self = this;

        //百度统计
        utils.hmBaidu();
        utils.pull_down('#app>#main',function(){
            _self.init();
        });

        _self.token = utils.queryString('token') || utils.getCookie('token');
        if (_self.token) {
            utils.setCookie('token', _self.token, 30);
        }
        _self.platform = utils.queryString('platform') || utils.getCookie('platform');
        if (_self.platform) {
            utils.setCookie('platform', _self.platform, 30);
        }
        if(_self.platform == 'app_ios'){
            $("#main").css('paddingTop','3.125rem');
        }

        _self.init();

    },
    methods: {
        set_canSubmit: function () {
            let _self = this;

            //为真的情况：绑车又选车而且绑卡又选卡，绑车又选车而且不绑卡又不选卡，不绑车又不选车而且绑卡又选卡
            //整理后：只要绑一样的情况下，绑车和选车的布尔值一样，绑卡和选卡的布尔值一样
            _self.canSubmit = (_self.json_data.cars.need_bind_car || _self.json_data.cards.need_bind_card)
                            &&(_self.json_data.cars.need_bind_car   == !!_self.selected_car)
                            &&(_self.json_data.cards.need_bind_card == !!_self.selected_fuel);
        },

        init: function () {
            let _self = this;
            utils.commonAjax({
                url: '/vipcard/vip/getUserInfo',
                data: {
                    token:_self.token,
                    services:_self.cards,
                },
                success: function (json) {
                    //TODO 假数据
                    /*json = {
                        "code": 0,
                        "data": {
                            "cars": {
                                "need_bind_car": true,
                                "car_info": [
                                    {
                                        "plate_num": "粤SC3K39",
                                        "car_brand": "宝马3系"
                                    },
                                    {
                                        "plate_num": "粤B835AQ",
                                        "car_brand": "宝马Z4"
                                    },
                                    {
                                        "plate_num": "粤BW88M3",
                                        "car_brand": ""
                                    },
                                    {
                                        "plate_num": "粤A3ZE52",
                                        "car_brand": ""
                                    },
                                    {
                                        "plate_num": "粤HYY520",
                                        "car_brand": "本田CR-V"
                                    }
                                ]
                            },
                            "cards": {
                                "need_bind_card": true,
                                "card_info": [
                                   {
                                        "card_number": "1000110000000000005",
                                        "phone": "13929586180"
                                   },
                                   {
                                        "card_number": "1000114400000000098",
                                        "phone": "15888888888"
                                   }
                                ]
                            }
                        },
                        "msg": "success"
                    }*/
                    console.log(json);
                    if (json.code == 0) {
                        _self.json_data = json.data;

                        var firstCar = json.data.cars.need_bind_car&&json.data.cars.car_info[0] ? json.data.cars.car_info[0].plate_num : null;
                        var firstCard = json.data.cards.need_bind_card&&json.data.cards.card_info[0] ? json.data.cards.card_info[0].card_number : null;

                        _self.default_select(firstCar, firstCard);

                        if (!json.data.cars.need_bind_car && !json.data.cards.need_bind_card) {
                            _self.to_pay();
                        }
                    } else {
                        utils.alert(json.msg);
                    }
                }
            });

            /*_self.json_data = {
             car_list:[],
             fuel_list:[],
             };
             _self.default_select("0",null);*/
        },
        select_car: function (e) {
            var _self = this;
            if(!_self.isSelecting){
                return ;
            }else{
                _self.isSelecting = false;
            }
            _self.selected_car = e.currentTarget.dataset['id'];
            _self.set_canSubmit();
        },
        select_fuel: function (e) {
            var $this = $(e.currentTarget);
            var _self = this;
            if(!_self.isSelecting){
                return ;
            }else{
                _self.isSelecting = false;
            }
            _self.selected_fuel = e.currentTarget.dataset['id'];
            _self.set_canSubmit();
        },
        //默认选择车或卡
        default_select: function (car, fuel) {
            var _self = this;
            _self.selected_car = car;
            _self.selected_fuel = fuel;
            _self.set_canSubmit();
        },
        to_bind_car:function(){
            //绑车跳到违章查询
            utils.goToApp('peccancyQuery','-1');
        },
        to_bind_card:function(){
            location.href='fuel_add.html';
        },
        //确认购买
        to_pay:function(){
            var _self = this;
            console.log('确认购买，直接跳转pay域:'+_self.selected_car,_self.selected_fuel);

            utils.commonAjax({
                url:'/vipcard/vip/prepaid',
                data:{
                    token:_self.token,
                    trade_mode:2,
                    card_id:_self.card_id,
                    services:_self.cards,
                    plate_num:_self.selected_car,
                    card_number:_self.selected_fuel,
                },
                success:function(json){
                    //TODO 假数据
                    /*json = {
                        "code": 0,
                        "data": {
                            "orderId": "1706161148308058",
                            "tradeId": "td2017061600000012"
                        },
                        "msg": "success"
                    }*/
                    console.log(json);
                    if (json.code == 0) {
                        if(json.data.tradeId && json.data.orderId){
                            utils.goToApp('openCheckout','tradeID=='+json.data.tradeId
                                +'||payMoney=='+parseFloat(_self.total)
                                +'||partnerID==24'//车主卡order_type
                                +'||isUbiPay==0'
                            );
                        }
                    } else {
                        utils.alert(json.msg);
                    }
                }
            })

        },
        touchStart:function(){
            var _self = this;
            _self.isSelecting = true;
        },
        touchMove:function(){
            var _self = this;
            _self.isSelecting = false;
        }
    }
});
