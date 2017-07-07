/**
 * Created by Sever on 2017/7/7.
 */
var utils = require('utils');

const app = new Vue({
    el: '#app',
    data: {
        phone_num:'',//手机号
        captcha:'',//验证码
        time:0,
    },
    beforeCreate: function () {
        utils.adaptive();
    },
    mounted: function () {
        let _self = this;
        _self.init();
    },
    methods: {
        init(){
            let _self = this;
        },
        sendSms(){
            let _self = this;
            console.log('发送验证码');
            _self.time = 60;
            var inte = setInterval(function(){
                _self.time--;
                if(_self.time<=0){
                    clearInterval(inte);
                }
            },1000)
        },
        toLogin(){
            let _self = this;
            console.log('去登录');
            if(!_self.phone_num){
                utils.alert('请输入手机号');
                return;
            }
            if(!_self.captcha){
                utils.alert('请输入验证码');
                return;
            }

        },
        toWechatLogin(){
            let _self = this;
            console.log('微信登录');
        }
    }
});
