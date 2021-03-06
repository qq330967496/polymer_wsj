/**
 * Created by Sever on 2017/7/7.
 */
var utils = require('utils');

const app = new Vue({
    el: '#app',
    data: {
        msg:''
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

            //请求
            $.ajax({
                url:'/wsj_server/customers/getLoginCustomerInfo.do',
                data:{
                    
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
                        utils.prompt('登录成功');
                    }else{
                        utils.prompt(json.message);
                    }
                },
                error:function(){
                    utils.prompt('网络错误，请重试');
                }
            });
        },
    }
});
