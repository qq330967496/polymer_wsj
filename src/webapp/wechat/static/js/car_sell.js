var utils = require('utils');

const app = new Vue({
    el: '#app',
    components: {
        "comp-header": require('../components/header.vue'),
    },
    data: {
        card_id: '',
        token: '',
        platform: '',
        card_data: {
            defaultCard: {
                detail_img: '',
            }
        },
        cur_page: 1,
        isLastPage: false,
        comment_rows: [],
        total_comments: 0,
    },
    beforeCreate: function () {
        utils.adaptive();

    },
    mounted: function () {
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
        // if (_self.token) {
            _self.init();
            _self.pullToBottom();
        // }
        //百度统计
        utils.hmBaidu();
    },
    methods: {
        init: function () {
            var _self = this;
            utils.commonAjax({
                url: '/vipcard/vip/index',
                data: {
                    token: _self.token,
                },
                success: function (json) {
                    // TODO 假数据
                    /*json = {
                        "code": 0,
                        "data": {
                            "defaultCard": {
                                "id": "18",
                                "card_status": "1",//1 可购买 2已售罄 3可升级 4已升级
                                "detail_img": "https://image.etcchebao.com/20170608100451VFWJiS.jpg",
                                "aging": "12",
                                "detail_type": "2",
                                "detail_url": "http://www.baidu.com",
                                "detail_icon": [
                                    {
                                        "detail": "微信支付",
                                        "icon": "https://image.etcchebao.com/20170602095157OgiXvM.png",
                                        "order_type": "8",
                                        "status": 1//1 可购买 2已购买 3可升级
                                    },
                                    {
                                        "detail": "银联62折",
                                        "icon": "https://image.etcchebao.com/20170605084541JLJAJJ.png",
                                        "order_type": "8",
                                        "status": 1
                                    },
                                    {
                                        "detail": "建行什么的",
                                        "icon": "https://image.etcchebao.com/20170605084543PoJrpU.png",
                                        "order_type": "8",
                                        "status": 1
                                    },
                                    {
                                        "detail": "直接送元宝",
                                        "icon": "https://image.etcchebao.com/20170608095448IoNTwd.png",
                                        "order_type": "0",
                                        "status": 2
                                    },
                                    {
                                        "detail": "每天送铜钱",
                                        "icon": "https://image.etcchebao.com/20170608095501MJrSAr.png",
                                        "order_type": "33",
                                        "status": 3
                                    }
                                ],

                            },
                            "countDriver": 532
                        },
                        "msg": "success"
                    }*/
                    /*json = {
                        "code": 0,
                        "data": null,
                        "msg": "success"
                    }*/

                    console.log(json);
                    if (json.code == 0) {
                        if(json.data){
                            _self.card_id = json.data.defaultCard.id;
                            _self.card_data = json.data;
                        }else{
                            utils.alert('敬请期待',function(){
                                utils.goToApp('closeWebView','-1');
                            });
                        }

                        _self.getComment();
                    } else {
                        utils.alert(json.msg);
                    }
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
                    // TODO 假数据
                    /*json = {
                        "code": 0,
                        "data": {
                            "rows": [
                                {
                                    "avatar": "https://image.etcchebao.com/20170213105009LbDCRS.jpg",
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
                            "total": "50"
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
                            if (!_self.total_comments) {
                                _self.total_comments = json.data.total;
                            }
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
        cannot_upate: function () {
            utils.alert('您的车主卡为最高级');
        },
        sell_out: function () {
            utils.alert('目前车主卡暂停销售，请留意开售公告');
        },
        to_buy: function () {
            location.href = 'car_sell_list.html?card_id=' + this.card_id;
        },
        //车主卡说明
        toStatement : function(){
            let _self = this;
            if(_self.card_data.defaultCard.detail_type==1){
                window.location.href='car_statement.html?card_id='+_self.card_id;
            }else if(_self.card_data.defaultCard.detail_type==2){
                utils.goToApp("openWithApp","url==" + encodeURIComponent(_self.card_data.defaultCard.detail_url) + "||title==特权卡说明");
            }

        },
    }
});
