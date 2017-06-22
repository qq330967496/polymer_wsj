/**
 * Created by wendy-pc on 2016/7/29.
 */
Polymer({
    is: "details-repayment-info",
    behaviors: [FinancialBusinessBehavior, OCrudBehavior],
    properties: {
        repayment: {
            type: Object,
            notify: true
        }
    },
    /**
     * 设置偿还状态:只要不是已回款状态的都是待回款
     * @param status
     * @returns {string}
     * @private
     */
    _setRepaymentStatus: function (status) {
        return status == 6 ? "已回款" : "待回款";
    }
});
