var utils = require('utils');
require('../css/global.css');

const app = new Vue({
    el: '#app',
    components: {
        "comp-header": require('../components/header.vue'),
    },
    data: {
        token: '',
        platform: '',
        card_id:utils.queryString('card_id'),
        json_data:{},
        telephone: '400-6688-005',
    },
    beforeCreate: function () {
        utils.adaptive();
    },
    mounted: function () {
        let _self = this;

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
        init:function(){
            let _self = this;
            utils.commonAjax({
                url: "/vipcard/vip/getUserCard",
                data:{
                    token:_self.token,
                    mycard_id:_self.card_id,
                },
                beforeSend:function(){
                    utils.prompt_nodelay("加载中...");
                },
                complete:function(){
                    $(".dialog-prompt-nodelay").remove();
                },
                success: function (json) {
                    //TODO 假装卡详情
                    /*json = {
                        "code": 0,
                        "data": {
                            "user_card_id": "5042",//用户的卡ID
                            "card_id":18,//所属卡类型的id
                            "detail_img": "https://image.etcchebao.com/20170608100451VFWJiS.jpg",
                            "status": "3",//2待激活 / 3使用中 /4已过期
                            "activate_expire_time": "2017-06-29",
                            "activate_time": "2017-06-19 16:50:06",
                            "expire_time": "2018-06-19",
                            "detail_type": "2",
                            "detail_url": "http://www.baidu.com",
                            "detail_icons": [
                                {
                                    "detail": "微信支付",
                                    "icon": "https://image.etcchebao.com/20170602095157OgiXvM.png",
                                    "order_type": "8"
                                },
                                {
                                    "detail": "银联62折",
                                    "icon": "https://image.etcchebao.com/20170605084541JLJAJJ.png",
                                    "order_type": "8"
                                },
                                {
                                    "detail": "建行什么的",
                                    "icon": "https://image.etcchebao.com/20170605084543PoJrpU.png",
                                    "order_type": "8"
                                },
                                {
                                    "detail": "直接送元宝",
                                    "icon": "https://image.etcchebao.com/20170608095448IoNTwd.png",
                                    "order_type": "0"
                                },
                                {
                                    "detail": "每天送铜钱",
                                    "icon": "https://image.etcchebao.com/20170608095501MJrSAr.png",
                                    "order_type": "33"
                                }
                            ],
                            "coupon": {
                                "count": 55,
                                "count_money": 550.01
                            }
                        },
                        "msg": "success"
                    }*/


                    if (json.code == 0) {
                        _self.json_data = json.data;
                    } else if (json.code == -2002) {
                        utils.alert("网络延迟，请稍后再试~");
                    } else {
                        utils.alert(json.msg);
                    }
                }
            });
        },
        //获取状态的中文
        get_status_cn:function(ind){
            switch (ind){
                case 0:
                    return '待领取';
                case 1:
                    return '待激活';
                case 2:
                    return '使用中';
                case 3:
                    return '已过期';
                case 99:
                    return '已作废';
            }
        },
        //打开优惠券
        open_coupon:function(){
            console.log('打开优惠券');
            let _self = this;
            location.href='car_coupon_list.html?card_id='+_self.card_id;
        },
        //激活车主卡
        activeCard:function(e){
            let _self = this;
            console.log('激活车主卡',_self.card_id);
            utils.commonAjax({
                url:'/vipcard/vip/activeCard',
                data:{
                    token:_self.token,
                    mycard_id:_self.card_id,
                },
                success:function(json){
                    //TODO 假装激活成功
                    /*json = {
                        "code": 0,
                        "data": [
                            "success",
                        ],
                        "msg": "success"
                    };*/

                    console.log(json);
                    if (json.code == 0) {
                        utils.alert('激活成功',function(){
                            location.reload();
                        });
                    } else if (json.code == -2002) {
                        utils.alert("网络延迟，请稍后再试~");
                    } else {
                        utils.alert(json.msg);
                    }
                }
            })
        },
        //车主卡说明
        toStatement : function(){
            let _self = this;
            if(_self.json_data.detail_type==1){
                window.location.href='car_statement.html?card_id='+_self.json_data.card_id;
            }else if(_self.json_data.detail_type==2){
                utils.goToApp("openWithApp","url==" + encodeURIComponent(_self.json_data.detail_url) + "||title==特权卡说明");
            }

        },
    }
});
