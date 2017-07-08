webpackJsonp([0],[
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Vue) {/**
	 * Created by Sever on 2017/7/7.
	 */
	var utils = __webpack_require__(2);

	const app = new Vue({
	    el: '#app',
	    data: {
	        msg: ''
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
	        }
	    }
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ })
]);