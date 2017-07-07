var utils = require('utils');

const app = new Vue({
    el: '#app',
    components: {
        "comp-header":require('../components/header.vue'),
    },
    data : {
        id:'',
        token: '',
        platform: '',
        card_num:'100011',
        phone:'',

        json_data:null,
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

        _self.id = utils.queryString('id')
    },
    methods:{
        submit:function(){
            var _self = this;
            if(_self.card_num.length<=6){
                utils.alert('油卡卡号有误，请重新输入');
                return;
            }
            if(!_self.phone){
                utils.alert('手机号不能为空');
                return;
            }

            utils.confirm({
                content: '\
                    <div class="confirm-head">再次确认是您的卡号</div>\
                        <div class="clearfix">\
                            <span class="row-hd">油卡类型: </span>\
                            <span class="row-bd">中国石化</span>\
                        </div>\
                    <div class="clearfix">\
                        <span class="row-hd">卡号: </span>\
                        <span class="row-bd">'+_self.card_num+'</span>\
                    </div>'
                },
                function(flag){
                    if (flag) {
                        try {
                            _hmt.push(['_trackEvent', '点击确认添加油卡', 'click', '点击确认添加油卡']);
                        } catch(e) {
                            //
                        }
                        var dataObj = {
                            token: _self.token,
                            cardNumber: _self.card_num,
                            phone: _self.phone
                        };
                        if ( _self.card_num && _self.phone && _self.id ) {
                            dataObj.id = _self.id;
                        }
                        utils.commonAjax({
                            url: 'https://api-fuel'+utils.getPrefix()+'.etcchebao.com/card/bind',
                            dataType: 'jsonp',
                            data: dataObj,
                            success: function(response) {
                                //假数据
                                /*response = {
                                    code:0,
                                }*/

                                if ( response.code === 0 ) {
                                    /*utils.alert("绑定成功",function(){
                                        if ( utils.isFromFlash() ) {
                                            window.location.href = "/html/index.html?padding=true&token=" + token;
                                        } else {
                                            window.location.href = "/html/index.html?token=" + token;
                                        }

                                    });*/
                                    utils.alert("绑定成功",function(){
                                        window.history.go(-1);
                                    });
                                } else {
                                    utils.prompt(response.msg);
                                }
                            }
                        });
                    } else {
                        try {
                            _hmt.push(['_trackEvent', '点击取消添加油卡', 'click', '点击取消添加油卡']);
                        } catch(e) {
                            //
                        }
                    }
                });
        },
        inputToString:function(e){
            let _self = this;
            _self.card_num = e.currentTarget.value+'';
            // console.log(e.currentTarget.value);
        }
    }
});
