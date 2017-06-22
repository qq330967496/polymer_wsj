/**
 * Created by wendy-pc on 2016/7/27.
 */
Polymer({
    is: "customer-info-financing-order",
    behaviors:[OBaseBehavior,OCrudBehavior, FinancialBusinessBehavior],
    properties: {
        status:{
            type:Number,
            value:0
        },
        companyId:{
            type:Number,
            notify:true
        }
    },
    //重置融资订单查询条件
    _init: function () {
        this.reset();
    }
});
