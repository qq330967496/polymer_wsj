/**
 * Created by wendy-pc on 2016/7/26.
 */
Polymer({
    is: 'financial-business-return',
    behaviors: [OCrudBehavior],
    properties: {
        entity: {
            type: Object,
            notify: true
        }
    },
    /**
     * 确认回款
     * @private
     */
    _receipted: function (e) {
        /**
         * 状态改为已回款
         */
        var self = this;
        this.updateEntity(
            "/financialOrder/updateOrder.do?",
            {id: self.entity.id, status: 6, remark: ""},
            function () {
                self.hTip.success("回款成功");
                self.cancel();
            },
            function () {
                self.hTip.error("回款失败");
            }
        );
    },
    /**
     * 逾期状态的数据在回款时展示罚息
     */
    _isOverDue: function (status) {
        return status == 5 ? true : false;
    },
    /**
     * 计算总额(本金+利息+罚息)
     * @private
     */
    _sumTotal: function (amount, interest, penaltyInterest) {
        if (!penaltyInterest) {
            return amount + interest;
        }
        return amount + interest + penaltyInterest;
    }
});