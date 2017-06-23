/**
 * Created by wendy-pc on 2016/7/26.
 */
Polymer({
    is: "customer-index",
    behaviors: [CustomerCompanyBehavior],
    properties: {
        customerList: {
            type: Array,
            value: function () {
                return [{
                    name: "罗三三",
                    sex: "男",
                    phone: "12345678901",
                    createAt: new Date().getTime(),
                    id: 1
                }, {
                    name: "罗三三",
                    sex: "男",
                    phone: "12345678901",
                    createAt: new Date().getTime(),
                    id: 2
                }, {
                    name: "罗三三",
                    sex: "男",
                    phone: "12345678901",
                    createAt: new Date().getTime(),
                    id: 3
                }]
            },
            notify: true
        }
    },
    listeners:{
        "data-change":'findSimpleCompanies',
    },
    ready: function () {
    }
});
