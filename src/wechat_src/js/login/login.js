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
        init:function(){
            let _self = this;
            _self.msg='123';
        }
    }
});
