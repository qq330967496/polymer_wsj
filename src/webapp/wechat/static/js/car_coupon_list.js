var utils = require('utils');

const app = new Vue({
    el: '#app',
    components: {
        "comp-header": require('../components/header.vue'),
    },
    data: {
        token: '',
        platform: '',
        card_id: utils.queryString('card_id'),
        json_data: {},
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
        init: function () {
            let _self = this;
            utils.commonAjax({
                url: '/vipcard/vip/getCouponList',
                data: {
                    token: _self.token,
                    mycard_id: _self.card_id,
                },
                success: function (json) {
                    //TODO 假数据
                    /*json = {
                        "code": 0,
                        "data": [
                            {
                                "coupon_type": 33,
                                "name": "加油通用券",
                                "statement":"满99可用",
                                "issue_time": "2017-06-26",
                                "money": "1-10",
                                "status": 1//1已发放 2未发放
                            },
                            {
                                "coupon_type": 33,
                                "name": "加油通用券",
                                "statement":"满99可用",
                                "issue_time": "2017-07-02",
                                "money": "6",
                                "status": 2
                            }
                        ],
                        "msg": "success"
                    }*/

                    console.log(json);
                    if (json.code == 0) {
                        _self.json_data = json.data;
                    } else if (json.code == -2002) {
                        utils.alert("网络延迟，请稍后再试~");
                    } else {
                        utils.alert(json.msg);
                    }
                }
            })
        },
        get_coupon_type:function(ind){
            switch (ind){
                case 0:
                    return '洗车';
                case 8:
                    return '违章';
                case 33:
                    return '加油';
            }
        }
    }
});
