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
                utils.prompt('请输入昵称');
                return;
            }

            //请求
            $.ajax({
                url:'',
                data:{

                },
                type:'POST',
                success:function(json){

                },
                error:function(){
                    utils.prompt('网络错误，请重试');
                }
            });
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
