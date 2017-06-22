/**
 * Created by wendy-pc on 2016/7/26.
 */
Polymer({
    is: 'financial-business-check-pass',
    behaviors: [FinancialBusinessBehavior, OCrudBehavior],
    properties: {
        entity: {
            type: Object,
            notify: true
        },
        // 双向绑定的附件对象
        dialogParam: {
            type: Object
        }
    },
    /**
     * 审核通过
     * @private
     */
    _passCheck: function (e) {
        if (!this.dialogParam) {
            this.hTip.error("请上传合同附件");
            return;
        }
        /**
         * 状态改为待放款
         */
        var self = this;
        var remark = $(this).find("#remark").val();
        this.updateEntity(
            "/financialOrder/updateOrder.do",
            {id: self.entity.id, status: 3, remark: remark},
            function (data) {
                console.log("审核通过");
                self.uploadAttachment();
            },
            function () {
                self.hTip.error("审核失败");
            }
        );
    },
    /**
     * 更新订单详情的合同附件
     */
    uploadAttachment: function () {
        var self = this;
        var url = "/financialOrder/uploadAttament.do";
        var param = {
            id: this.entity.id,
            imgData: this.dialogParam
        };
        var imgFields = ['imgData'];
        this.uploadMultiFile(
            url,
            param,
            imgFields,
            function () {
                // 审核通过时刷新审核列表页面数据
                self.refreshPendingOrderList();

                self.hTip.success("保存成功");
                self.cancel();
            }, function (err) {
                var errInfo = err.responseText;
                if (!errInfo) {
                    errInfo = "连接超时";
                }
                self.hTip.error(errInfo);
            }
        );
    }
});