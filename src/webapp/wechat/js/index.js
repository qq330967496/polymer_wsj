webpackJsonp([0],[
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Vue, $) {'use strict';

	var utils = __webpack_require__(75);

	var app = new Vue({
	    el: '#app',
	    data: {
	        msg: ''
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

	            $.ajax({
	                url: '/wsj_server/customers/getLoginCustomerInfo.do',
	                data: {},
	                type: 'GET',
	                success: function success(json) {
	                    if (json.success) {
	                        utils.prompt('登录成功');
	                    } else {
	                        utils.prompt(json.message);
	                    }
	                },
	                error: function error() {
	                    utils.prompt('网络错误，请重试');
	                }
	            });
	        }
	    }
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(2)))

/***/ })
]);