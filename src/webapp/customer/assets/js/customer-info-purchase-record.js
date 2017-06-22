/**
 * Created by wendy-pc on 2016/7/27.
 */
Polymer({
    is: "customer-info-purchase-record",
    behaviors:[OBaseBehavior, OCrudBehavior, OFormatBehavior],
    properties: {
        queryCondition: {
            type: Object,
            value: function () {
                return {
                    start: 0,
                    limit: 10,
                    results: 0,
                    pageIndex: 1
                }
            },
            notify: true
        },
        // 订单数组
        orders: {
            type: Array,
            notify: true
        }
    },

});
