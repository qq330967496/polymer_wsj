webpackJsonp([2],[
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Vue, $) {'use strict';

	var utils = __webpack_require__(75);

	var app = new Vue({
	    el: '#app',
	    data: {
	        phone: '',
	        captcha: '',
	        time: 0,
	        isWechat: utils.queryString('isWechat')
	    },
	    beforeCreate: function beforeCreate() {
	        utils.adaptive();
	    },
	    mounted: function mounted() {
	        var _self = this;
	        _self.init();
	    },
	    methods: {
	        init: function init() {
	            var _self = this;
	        },
	        clearError: function clearError(type) {
	            $('#' + type).parents('.row').removeClass('error');
	        },
	        sendSms: function sendSms() {
	            var _self = this;
	            console.log('发送验证码');

	            $.ajax({
	                url: '/wsj_server/sms/login/sendIdentifyingCode.do',
	                data: {
	                    mobile: _self.phone
	                },
	                type: 'GET',
	                success: function success(json) {
	                    if (json.success) {
	                        utils.prompt(json.message);
	                        _self.time = 60;
	                        var inte = setInterval(function () {
	                            _self.time--;
	                            if (_self.time <= 0) {
	                                clearInterval(inte);
	                            }
	                        }, 1000);
	                    } else {
	                        utils.prompt(json.message);
	                        if (json.message == '发送短信失败，请输入正确的手机号码') {
	                            $('#phone').parents('.row').addClass('error');
	                            $('#phone').focus();
	                        }
	                    }
	                },
	                error: function error() {
	                    utils.prompt('网络错误，请重试');
	                }
	            });
	        },
	        toLogin: function toLogin() {
	            var _self = this;
	            console.log('登录');
	            if (_self.phone.length != 11) {
	                utils.prompt('请输入正确的手机号');
	                return;
	            }
	            if (!_self.phone) {
	                utils.prompt('请输入手机号');
	                return;
	            }
	            if (!_self.captcha) {
	                utils.prompt('请输入验证码');
	                return;
	            }

	            $.ajax({
	                url: '/wsj_server/sms/login/validateCode.do',
	                data: {
	                    mobile: _self.phone,
	                    code: _self.captcha
	                },
	                type: 'GET',
	                success: function success(json) {
	                    if (json.success) {
	                        if (json.message == '注册成功') {
	                            location.href = 'change_nickname.html';
	                        } else if (json.message == '登陆成功' || json.message == '登录成功') {
	                            location.href = '../index.html';
	                        }
	                    } else {
	                        utils.prompt(json.message.split(',')[1]);
	                        $('#captcha').parents('.row').addClass('error');
	                        $('#captcha').focus();
	                    }
	                },
	                error: function error() {
	                    utils.prompt('网络错误，请重试');
	                }
	            });
	        },
	        toWechatLogin: function toWechatLogin() {
	            var _self = this;
	            console.log('微信登录');
	            location.href = '/wsj_server/wechat/thirdPartLogin.do';
	        },
	        clearInput: function clearInput(type) {
	            var _self = this;
	            $('#' + type).focus();
	            switch (type) {
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
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(2)))

/***/ })
]);