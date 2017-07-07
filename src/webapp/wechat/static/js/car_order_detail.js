var utils = require('utils');

const app = new Vue({
    el: '#app',
    components: {
        "comp-header": require('../components/header.vue'),
    },
    data: {
        token: '',
        platform: '',
        card_id: '',
        timeout_cn: '',
        cur_page: 1,
        json_data: null,
        isLastPage: false,
        comment_rows: [],
        order_id: utils.queryString('orderId'),
    },
    beforeCreate: function () {
        utils.adaptive();
    },
    mounted: function () {
        var _self = this;
        //百度统计
        utils.hmBaidu();
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
    methods: {
        init: function () {
            var _self = this;

            utils.commonAjax({
                url:'/vipcard/vip/getOrderDetail',
                data: {
                    token: _self.token,
                    orderId: _self.order_id,
                },
                success: function (json) {
                    //TODO 假数据
                    /*json = {
                        "code":0,
                        "data":{
                            "plate_num":"",
                            "card_number":"",
                            "order_status":"0",//0：已付款；6：代付款；87：已激活；88：已失效；
                            "buy_item":"ETC车主特权卡",
                            "original_amount":"0.01",
                            "service_json":{
                                "55":{
                                    "order_type":"0",
                                    "price":"0.01",
                                    "aging":"1"
                                }
                            },
                            "create_time":"2017-06-22 21:30:19",
                            "trade_time":null,
                            "trade_platform":"待付款",
                            "order_id":"1706221643199352",
                            "trade_id":"1706221643199352",
                            "card_id":"12",
                            "my_card_id":"123",
                        },
                        "msg":"success"
                    }*/


                    if (json.code == 0) {
                        _self.json_data = json.data;
                        _self.card_id = json.data.card_id;

                        if(_self.json_data.order_status==6){//待付款时间进行倒计时
                            var curDate = parseInt(new Date().getTime());
                            var createDate = parseInt(new Date(json.data.create_time.replace(/-/g, "/")).getTime());
                            var timeoutMs = parseInt(30*60*1000 - (curDate - createDate));//30分钟
                            _self.json_data.timeout = timeoutMs;
                            _self.setTimeout();
                        }

                        _self.getComment();
                        _self.pullToBottom();
                    } else if (json.code == -2002) {
                        utils.alert("网络延迟，请稍后再试~");
                    } else {
                        utils.alert(json.msg);
                    }


                    // _self.json_data = {
                    //     status: 1,
                    //     timeout: 3000,
                    // };
                    // _self.setTimeout();
                    //
                    // _self.getComment();
                    // _self.pullToBottom();
                }
            });
        },
        getComment: function () {
            var _self = this;
            utils.commonAjax({
                url: '/vipcard/comment/list',
                data: {
                    card_id: _self.card_id,
                    page: _self.cur_page,
                    page_size: 10,
                },
                success: function (json) {
                    //TODO 假数据
                    /*json = {
                        "code": 0,
                        "data": {
                            "rows": [
                                {
                                    "avatar": "https://image.etcchebao.com/20170316140148ZagSmC.jpg",
                                    "nickname": "博哥的开发号",
                                    "star": "5",
                                    "create_time": "2017-06-06 16:01",
                                    "content": "腻害"
                                },
                                {
                                    "avatar": "images/default_gril.png",
                                    "nickname": "车友VVLYKJX",
                                    "star": "5",
                                    "create_time": "2017-06-06 15:12",
                                    "content": "棒"
                                }
                            ],
                            "total": "2"
                        },
                        "msg": "success"
                    };
                    if (_self.cur_page == 4) {
                        json = {
                            "code": 0,
                            "data": {
                                "rows": [],
                                "total": "0"
                            },
                            "msg": "success"
                        }
                    }*/

                    console.log(json);
                    if (json.code == 0) {
                        if (json.data.rows.length > 0) {
                            _self.comment_rows = _self.comment_rows.concat(json.data.rows);
                        } else {
                            _self.isLastPage = true;
                        }

                    } else {
                        utils.alert(json.msg);
                        _self.isLastPage = true;
                    }
                }
            })
        },
        //获取订单状态的中文
        getOrderStatusCn:function (ind) {
            switch (ind){
                case '0':
                    return '已支付';
                case '6':
                    return '待付款';
                case '87':
                    return '已激活';
                case '88':
                    return '已失效';
            }
        },
        //获取服务项的中文
        getServiceCn:function (ind) {
            switch (ind){
                case '0':
                    return '洗车特权';
                case '8':
                    return '违章特权';
                case '33':
                    return '加油特权';
            }

        },
        pullToBottom: function () {
            var _self = this;
            $(window).scroll(function () {
                if (!_self.isLastPage) {
                    var scrollTop = $(this).scrollTop();    //滚动条距离顶部的高度
                    var scrollHeight = $(document).height();   //当前页面的总高度
                    var clientHeight = $(this).height();    //当前可视的页面高度
                    // console.log("top:"+scrollTop+",doc:"+scrollHeight+",client:"+clientHeight);
                    if (scrollTop + clientHeight >= scrollHeight) {   //距离顶部+当前高度 >=文档总高度 即代表滑动到底部 count++;         //每次滑动count加1
                        console.log('拉到底部');
                        _self.cur_page++;
                        _self.getComment();
                    }
                }
            });

        },

        setTimeout: function () {
            var _self = this;
            _self.timeout_cn = new Date(_self.json_data.timeout).Format("mm分ss秒");

            if (_self.json_data.timeout > 0) {
                var inte = setInterval(function () {
                        _self.json_data.timeout -= 1000;
                        _self.timeout_cn = new Date(_self.json_data.timeout).Format("mm分ss秒");
                        if (_self.json_data.timeout < 1000) {
                            clearInterval(inte);
                        }
                    }
                    , 1000);

            }
        },
        toComment: function () {
            var _self = this;
            utils.common_dialog({
                content: '\
                    <div class="title">\
                        服务评价\
                    </div>\
                    <div class="star_mod">\
                        <div data-val="1" class="star"></div>\
                        <div data-val="2" class="star"></div>\
                        <div data-val="3" class="star"></div>\
                        <div data-val="4" class="star"></div>\
                        <div data-val="5" class="star"></div>\
                    </div>\
                    <div class="content">\
                       <textarea placeholder="写下您对本次服务的评价吧~"></textarea>\
                    </div>\
                    <div class="bottom">\
                       <div class="btn">\
                           提交评价\
                       </div>\
                    </div>\
                    <div class="close"></div>\
                    ',
                boxClass: "comment_dialog",
                dialog_event: function () {
                    $(".comment_dialog").show();
                    var star_val = 0;

                    $(".comment_dialog .close").click(function () {
                        $(".comment_dialog").remove();
                    });
                    $(".star_mod .star").click(function () {
                        $(".star_mod .star").removeClass("checked");
                        star_val = $(this).data("val");
                        for (var i = 0; i < star_val; i++) {
                            $($(this).parent().find(".star")[i]).addClass("checked");
                        }
                    })

                    $(".comment_dialog .btn").click(function () {
                        var comment_content = $(".comment_dialog .content textarea").val();

                        utils.commonAjax({
                            url: '/vipcard/comment/add',
                            data: {
                                token: _self.token,
                                card_id: _self.card_id,
                                star: star_val,
                                content: comment_content,
                            },
                            success: function (json) {
                                //TODO 假数据
                                /*json = {
                                 "code": 0,
                                 "data": null,
                                 "msg": "success"
                                 }*/
                                if (json.code == 0) {
                                    // console.log(star_val, comment_content);
                                    $(".comment_dialog").remove();
                                } else {
                                    utils.alert(json.msg);
                                    _self.isLastPage = true;
                                }
                            }
                        })


                    })
                }
            });
        },

        //跳转收银台
        toSubmit:function(){
            var _self = this;
            utils.goToApp('openCheckout','tradeID=='+_self.json_data.trade_id
                +'||payMoney=='+parseFloat(_self.json_data.original_amount)
                +'||partnerID==24'//车主卡order_type
                +'||isUbiPay==0'
            );
        },
        //查看特权卡
        toCardDetail:function(){
            var _self = this;
            location.href='car_card_detail.html?card_id='+_self.json_data.my_card_id;
        }
    }
});
