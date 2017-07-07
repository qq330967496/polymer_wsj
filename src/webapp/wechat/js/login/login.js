webpackJsonp([1],[
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Vue, $) {/**
	 * Created by Sever on 2017/7/7.
	 */
	var utils = __webpack_require__(3);

	const app = new Vue({
	    el: '#app',
	    data: {
	        phone: '', //手机号
	        captcha: '', //验证码
	        time: 0
	    },
	    beforeCreate: function () {
	        utils.adaptive();
	    },
	    mounted: function () {
	        let _self = this;
	        _self.init();
	    },
	    methods: {
	        init() {
	            let _self = this;
	        },
	        sendSms() {
	            let _self = this;
	            console.log('发送验证码');
	            _self.time = 60;
	            var inte = setInterval(function () {
	                _self.time--;
	                if (_self.time <= 0) {
	                    clearInterval(inte);
	                }
	            }, 1000);
	        },
	        toLogin() {
	            let _self = this;
	            console.log('去登录');
	            if (_self.phone.length != 11) {
	                utils.alert('请输入正确的手机号');
	                return;
	            }
	            if (!_self.phone) {
	                utils.alert('请输入手机号');
	                return;
	            }
	            if (!_self.captcha) {
	                utils.alert('请输入验证码');
	                return;
	            }

	            //异常处理
	        },
	        toWechatLogin() {
	            let _self = this;
	            console.log('微信登录');
	        },

	        clearInput(type) {
	            let _self = this;
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