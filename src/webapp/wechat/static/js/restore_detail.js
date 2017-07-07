var utils = require('utils');

const app = new Vue({
    el: '#app',
    components: {
        "comp-header":require('../components/header.vue'),
    },
    data: {
        token: '',
        platform: '',
        card_id:utils.queryString('card_id'),
        page:utils.queryString('page')?utils.queryString('page'):1,
        page_size:utils.queryString('page_size')?utils.queryString('page_size'):20,
        json_data:'',
    },
    beforeCreate: function() {
        utils.adaptive();

    },
    mounted: function() {
        var _self = this;

        _self.token = utils.queryString('token') || utils.getCookie('token');
        if (_self.token) {
            utils.setCookie('token', _self.token, 30);
        }
        _self.platform = utils.queryString('platform') || utils.getCookie('platform');
        if (_self.platform) {
            utils.setCookie('platform', _self.platform, 30);
        }


        _self.load_data();
        _self.page++;



        utils.scrollToBottom(function(){
            $(".loading").css('opacity',1);
            _self.load_data(function(isLast){
                if(isLast){
                    $(".loading").html('已加载全部');
                    $(window).unbind("scroll");
                }else{
                    _self.page++;
                    $(".loading").css('opacity',0);
                }
            });
        });

    },
    //各种方法
    methods: {
        //圈存
        toTransference:function(order_id){
            console.log("圈存:app订单详情"+order_id);
            utils.goToApp("unitollCardOrderDetail","orderType==11||orderId=="+order_id);
        },
        //打开客服指引
        showCustomService:function(){
            console.log('打开客服热线指引');
            utils.getHotLine(function(hotLine){
                // utils.alert('热线电话：<a href="tel:'+hotLine+'">'+hotLine+'</a>');

                location.href='tel:'+hotLine;
            });

        },
        //跳转
        toSkip:function(item){
            var _self = this;
            if(_self.canSkip(item)){
                if(item.order_id){
                    _self.toTransference(item.order_id);
                }else if(item.status != 99){
                    _self.showCustomService();
                }
            }
        },
        //是否可以跳转，未圈存，已圈存，返还失败可以跳转
        canSkip:function(item){
            if(item){
                //存在订单号都是未圈存或已圈存；status!=99 返还失败
                if(item.order_id || item.status != 99){
                    return true;
                }
            }
            return false;
        },
        //加载数据
        load_data:function(cb){
            var _self = this;

            utils.commonAjax({
                url: '/privilege/card-packet/get-card-bill',
                data: {
                    token: _self.token,
                    card_id: _self.card_id,
                    page: _self.page,
                    page_size: _self.page_size,
                },
                beforeSend:function(){
                    utils.prompt_nodelay("加载中...");
                },
                complete:function(){
                    $(".dialog-prompt-nodelay").remove();
                },
                success: function (json) {
                    console.log(json);

                    //模拟数据
                    /*json = {
                        "code": 0,
                        "data": {
                            "total": "80.02",
                            "bill_list": [
                                {
                                    "bill_date": "2017-02-13",
                                    "type": 3,
                                    "amount": "0.00",
                                    "order_id": "",
                                    "order_status": -1,
                                    "tips": "未知",
                                    "status": 35,
                                },
                                {
                                    "bill_date": "2017-02-13",
                                    "type": 2,
                                    "amount": "0.00",
                                    "order_id": "",
                                    "order_status":"",
                                    "tips": "返还U币失败",
                                    "status": 25,
                                },
                                {
                                    "bill_date": "2017-02-01",
                                    "type": 3,
                                    "amount": "20.02",
                                    "order_id": "",
                                    "order_status": "",
                                    "tips": "已到账",
                                    "status": 99,
                                },
                                {
                                    "bill_date": "2016-12-01",
                                    "type": 1,
                                    "amount": "30.00",
                                    "order_id": "1606242022062615",
                                    "order_status": 0,
                                    "tips": "未圈存",
                                    "status": 99,
                                },
                                {
                                    "bill_date": "2016-11-01",
                                    "type": 1,
                                    "amount": "30.00",
                                    "order_id": "1606242020299568",
                                    "order_status": 25,
                                    "tips": "已圈存",
                                    "status": 99,
                                }
                            ]
                        },
                        "msg": "success"
                    };

                    if(_self.page>2){
                        json = {
                            code: 0,
                            data: {
                                total: '100.23',
                                bill_list: [
                                ]
                            },
                            msg: 'success',
                        };
                    }*/

                    if (json.code == 0) {
                        var isLast = false;
                        if (_self.json_data.bill_list) {
                            if(json.data.bill_list.length>0){
                                _self.json_data.bill_list = _self.json_data.bill_list.concat(json.data.bill_list);
                                console.log(_self.json_data.bill_list);
                            }else{
                                isLast = true;
                            }
                        } else {
                            _self.json_data = json.data;
                        }
                        cb?cb(isLast):'';
                    } else {
                        utils.alert(json.msg);
                    }
                }
            });
        }
    }
});
