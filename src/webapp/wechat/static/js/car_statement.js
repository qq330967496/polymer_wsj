var utils = require('utils');
require('../css/global.css');

const app = new Vue({
    el: '#app',
    components: {
        "comp-header":require('../components/header.vue'),
    },
    data: {
        token: '',
        platform: '',
        card_id:utils.queryString('card_id'),
        json_data:{},
    },
    beforeCreate: function() {
        utils.adaptive();
    },
    mounted: function() {
        let _self = this;
        _self.token = utils.queryString('token') || utils.getCookie('token');
        if (_self.token) {
            utils.setCookie('token', _self.token, 30);
        }
        _self.platform = utils.queryString('platform') || utils.getCookie('platform');
        if (_self.platform) {
            utils.setCookie('platform', _self.platform, 30);
        }
        utils.commonAjax({
            url: "/vipcard/vip/getCardDetailText",
            data:{
                card_id:_self.card_id,
            },
            success: function (json) {
                //TODO 假数据
                /*json={
                    "code": 0,
                    "data": "<p>哎呀</p>",
                    "msg": "success"
                }*/
                console.log(json);

                if (json.code == 0) {
                    _self.json_data = json.data;
                } else if (json.code == -2002) {
                    utils.alert("网络延迟，请稍后再试~");
                } else {
                    utils.alert(json.msg);
                }
            }
        });
    },
    methods: {

    }
});
