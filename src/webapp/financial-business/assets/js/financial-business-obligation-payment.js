/**
 * Created by wendy-pc on 2016/7/26.
 */
Polymer({
    is: 'financial-business-obligation-payment',
    behaviors: [FinancialBusinessBehavior, OCrudBehavior],
    properties: {
        entity: {
            type: Object,
            notify: true
        }
    },
    /**
     * 确认放款
     * @private
     */
    _commitLoan: function (e) {
        /**
         * 放款成功将本条金融订单状态改为进行中
         */
        var self = this;
        this.updateEntity(
            "/financialOrder/updateOrder.do?",
            {id: self.entity.id, status: 4, remark: ""},
            function () {
                self.hTip.success("放款成功");
                self.cancel();
            },
            function () {
                self.hTip.error("放款失败");
            }
        );
    }
});