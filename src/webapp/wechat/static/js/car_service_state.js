/**
 * Created by Sever on 2017/7/5.
 */
var utils = require('utils');

const app = new Vue({
    el: '#app',
    components: {
        "comp-header": require('../components/header.vue'),
    },
    data: {

    },
    beforeCreate: function () {
        utils.adaptive();
    },
    mounted: function () {
        let _self = this;

    },
    methods: {

    }
});
