/**
 * Created by Sever on 2017/7/7.
 */
var utils = require('utils');

const app = new Vue({
    el: '#app',
    data: {
        nickname:'',//昵称
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
        submit(){
            let _self = this;
            console.log('提交');
            if(!_self.nickname){
                utils.alert('请输入昵称');
                return;
            }

            //异常处理


        },
        clearInput(type){
            let _self = this;
            $('#'+type).focus();
            switch (type){
                case 'nickname':
                    _self.nickname = '';
                    break;
            }
        }
    }
});
