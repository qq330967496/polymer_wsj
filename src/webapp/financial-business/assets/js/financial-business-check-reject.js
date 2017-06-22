/**
 * Created by wendy-pc on 2016/7/26.
 */
Polymer({
    is: 'financial-business-check-reject',
    behaviors: [OCrudBehavior, FinancialBusinessBehavior],
    properties: {
        entity: {
            type: Object,
            notify: true
        }
    },
    /**
     * 审核驳回
     * @private
     */
    _reject: function (e) {
        /**
         * 状态改为驳回
         */
        var self = this;
        var remark = $(this).find("#remark").val();
        this.updateEntity(
            "/financialOrder/updateOrder.do?",
            {id: self.entity.id, status: 2, remark: remark},
            function () {
                // 驳回成功时刷新审核列表页面数据
                self.refreshPendingOrderList();

                self.hTip.success("驳回成功");
                self.cancel();
            },
            function () {
                self.hTip.error("驳回失败");
            }
        );
    }
});