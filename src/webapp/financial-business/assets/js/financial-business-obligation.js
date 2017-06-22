/**
 * Created by wendy-pc on 2016/7/26.
 */
Polymer({
    is: "financial-business-obligation",
    behaviors: [OCrudBehavior, FinancialBusinessBehavior],
    properties: {
        status: {
            type: Number,
            value: 2
        }
    },
    /**
     * 更新数据状态的时候,应该重新查询一次当前页面的分页数据
     */
    listeners: {
        "data-change": "loadOrders"
    },
    _init: function () {
        this.reset();
        this.loadOrderNo();
        this.loadCustomerName();
    }
});
