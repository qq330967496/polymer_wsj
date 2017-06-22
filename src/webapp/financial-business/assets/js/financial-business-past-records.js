/**
 * Created by wendy-pc on 2016/7/26.
 */
Polymer({
    is: "financial-business-past-records",
    behaviors: [OCrudBehavior, FinancialBusinessBehavior],
    properties: {
        status: {
            type: Number,
            value: 6
        },
        orderStatus: {
            type: Array,
            value: [{
                value: "0",
                label: "全部"
            }, {
                value: "6",
                label: "已回款"
            }, {
                value: "7",
                label: "已取消"
            }, {
                value: "2",
                label: "已驳回"
            }]
        }
    },
    _init: function () {
        this.reset();
        this.loadOrderNo();
        this.loadCustomerName();
    }
});
