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
        rulecontent : '',
    },
    beforeCreate: function() {
        utils.adaptive();

    },
    mounted: function() {
        var code = utils.queryString('code');

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
            url: "/privilege/card-packet/get-card-instruction?code=" + code,
            beforeSend:function(){
                utils.prompt_nodelay("加载中...");
            },
            complete:function(){
                $(".dialog-prompt-nodelay").remove();
            },
            success: function (json) {
                console.log(json)

                if (json.code == 0) {
                    _self.rulecontent = json.data.detail_content;

                } else if (json.code == -2002) {
                    utils.alert("??网络延迟，请稍后再试~");
                } else {
                    utils.alert(json.msg);
                }
            }
        });
    },
    methods: {

    }
});
