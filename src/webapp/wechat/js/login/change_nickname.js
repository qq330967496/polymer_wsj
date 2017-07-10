webpackJsonp([1],[
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Vue, $) {'use strict';

	var utils = __webpack_require__(75);

	var app = new Vue({
	    el: '#app',
	    data: {
	        cur_nickname: utils.queryString('cur_nickname'),
	        nickname: '',
	        error_msg: ''
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
	        submit: function submit() {
	            var _self = this;
	            console.log('提交');
	            if (!_self.nickname) {
	                utils.prompt('请输入昵称');
	                return;
	            }

	            $.ajax({
	                url: '/wsj_server/customers/changeCustomerNickName.do',
	                data: {
	                    nickName: _self.nickname
	                },
	                type: 'GET',
	                success: function success(json) {
	                    if (json.success) {
	                        location.href = '../index.html';
	                    } else {
	                        _self.error_msg = '昵称被占用，请重新输入';
	                        $('#nickname').parents('.row').addClass('error');
	                        $('#nickname').focus();
	                    }
	                },
	                error: function error() {
	                    utils.prompt('网络错误，请重试');
	                }
	            });
	        },
	        clearInput: function clearInput(type) {
	            var _self = this;
	            $('#' + type).focus();
	            switch (type) {
	                case 'nickname':
	                    _self.nickname = '';
	                    break;
	            }
	        }
	    }
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(2)))

/***/ })
]);