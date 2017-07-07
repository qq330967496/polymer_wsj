webpackJsonp([0],[
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Vue, $) {/**
	 * Created by Sever on 2017/7/7.
	 */
	var utils = __webpack_require__(3);

	const app = new Vue({
	    el: '#app',
	    data: {
	        nickname: '' //昵称
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
	        submit() {
	            let _self = this;
	            console.log('提交');
	            if (!_self.nickname) {
	                utils.alert('请输入昵称');
	                return;
	            }

	            //异常处理

	        },
	        clearInput(type) {
	            let _self = this;
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