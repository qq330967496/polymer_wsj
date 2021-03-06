/**
 * Created by Sever on 2017/7/7.
 */
var utils = require('utils');

const app = new Vue({
    el: '#app',
    data: {
        phone:'',//手机号
        captcha:'',//验证码
        time:0,
        isWechat:utils.queryString('isWechat'),
        isSuccess:utils.queryString('isSuccess'),
        message:decodeURIComponent(utils.queryString('message')),
    },
    beforeCreate: function () {
        utils.adaptive();
    },
    mounted: function () {
        /*alert('document.documentElement.clientWidth：'+document.documentElement.clientWidth+ '\n'
                +'document.body.clientWidth:'+document.body.clientWidth+ '\n'
                +'window.innerWidth:'+window.innerWidth+ '\n'
                + 'html：'+$("html").width()+ '\n'
                + 'body：'+$("body").width()+ '\n'
                + 'app：'+$("#app").width());*/
        let _self = this;
        if(_self.isSuccess=="false"&&_self.message!=null){
            utils.prompt(_self.message);
        }
        _self.init();
    },
    methods: {
        init(){
            let _self = this;
        },
        clearError(type){
            $('#'+type).parents('.row').removeClass('error');
        },
        sendSms(){
            let _self = this;
            console.log('发送验证码');
            
            //请求
            $.ajax({
                url:'/wsj_server/sms/login/sendIdentifyingCode.do',
                data:{
                    mobile:_self.phone,
                },
                type:'GET',
                success:function(json){
                    //假数据
                    /*json={
                        success:true,
                        message:'发送短信成功'
                        // success:false,
                        // message:'发送短信失败，请输入正确的手机号码'
                    }*/
                    if (json.success) {
                        utils.prompt(json.message);
                        _self.time = 60;//短信发送等待秒数
                        var inte = setInterval(function(){
                            _self.time--;
                            if(_self.time<=0){
                                clearInterval(inte);
                            }
                        },1000);
                    }else{
                        utils.prompt(json.message);
                        if(json.message=='发送短信失败，请输入正确的手机号码'){
                            $('#phone').parents('.row').addClass('error');
                            $('#phone').focus();
                        }
                    }
                },
                error:function(){
                    utils.prompt('网络错误，请重试');
                }
            });

        },
        toLogin(){
            let _self = this;
            console.log('登录');
            if(_self.phone.length!=11){
                utils.prompt('请输入正确的手机号');
                return;
            }
            if(!_self.phone){
                utils.prompt('请输入手机号');
                return;
            }
            if(!_self.captcha){
                utils.prompt('请输入验证码');
                return;
            }

            //请求
            $.ajax({
                url:'/wsj_server/sms/login/validateCode.do',
                data:{
                    mobile:_self.phone,
                    code:_self.captcha,
                },
                type:'GET',
                success:function(json){
                    //假数据
                    /*json={
                        "message":"账号被禁用",
                        "success":false
                    }*/
                    if (json.success) {
                        if(json.message=='注册成功'){
                            // location.href='change_nickname.html?cur_nickname='+json.bean.name;
                            location.href='change_nickname.html';
                        }else if(json.message=='登陆成功' || json.message=='登录成功'){
                            location.href='../index.html';
                        }
                    }else{
                        utils.prompt(json.message);
                        $('#captcha').parents('.row').addClass('error');
                        $('#captcha').focus();
                    }
                },
                error:function(){
                    utils.prompt('网络错误，请重试');
                }
            });
        },
        toWechatLogin(){
            let _self = this;
            console.log('微信登录');
            location.href='/wsj_server/wechat/thirdPartLogin.do';
        },

        clearInput(type){
            let _self = this;
            $('#'+type).focus();
            switch (type){
                case 'phone':
                    _self.phone = '';
                    break;
                case 'captcha':
                    _self.captcha = '';
                    break;
            }
        }
    }
});
