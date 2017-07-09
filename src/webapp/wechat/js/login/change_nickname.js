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
	        cur_nickname: utils.queryString('cur_nickname'),
	        nickname: '', //昵称
	        error_msg: ''
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
	            /* $.ajax({
	                 // url:'/wsj_server/customers/getLoginCustomerInfo.do',
	                 data:{
	                     
	                 },
	                 type:'GET',
	                 success:function(json){
	                     //假数据
	                     json={
	                         success:true,
	                         message:'登录成功',
	                     }
	                     if(json.success){
	                         // location.href='../index.html';
	                     }else{
	                         utils.prompt('没有该用户');
	                         // _self.error_msg = '昵称被占用，请重新输入';
	                     }
	                 },
	                 error:function(){
	                     utils.prompt('网络错误，请重试');
	                 }
	             })*/
	        },
	        clearError(type) {
	            $('#' + type).parents('.row').removeClass('error');
	        },
	        submit() {
	            let _self = this;
	            console.log('提交');
	            if (!_self.nickname) {
	                utils.prompt('请输入昵称');
	                return;
	            }

	            //请求
	            $.ajax({
	                url: '/wsj_server/customers/changeCustomerNickName.do',
	                data: {
	                    nickName: _self.nickname
	                },
	                type: 'GET',
	                success: function (json) {
	                    //假数据
	                    /*json={
	                        // success:true,
	                        // message:'修改成功',
	                        success:false,
	                        message:'修改失败',
	                    }*/
	                    if (json.success) {
	                        location.href = '../index.html';
	                    } else {
	                        _self.error_msg = '昵称被占用，请重新输入';
	                        $('#nickname').parents('.row').addClass('error');
	                        $('#nickname').focus();
	                    }
	                },
	                error: function () {
	                    utils.prompt('网络错误，请重试');
	                }
	            });
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