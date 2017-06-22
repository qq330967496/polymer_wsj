/**
 * Created by wendy-pc on 2016/7/26.
 */
Polymer({
    is: "financial-business-order",
    behaviors: [OCrudBehavior, FinancialBusinessBehavior, CustomerCompanyBehavior],
    properties: {
        order: {
            type: Object,
            notify: true
        },
        imgSrc: {
            type: String,
            notify: true
        },
        imgData: {
            type: Object,
            notify: true
        }
    },
    observers: [
        "_orderChange(order)"
    ],
    listeners: {
        "data-change": "_refreshOrder"
    },
    _init: function (orderId) {
        this._queryOrderById(orderId);
    },
    /**
     * 审核成功或驳回成功时,刷新金融订单详情
     * @private
     */
    _refreshOrder: function () {
        this._queryOrderById(this.order.financeOrderEx.id);
    },
    /**
     * 查询订单详情
     * @private
     */
    _queryOrderById: function (id) {
        var self = this;
        this.query(
            "/financialOrder/queryOrderById.do",
            {id: id},
            function (data) {
                self.set("order", data);
                console.log("查询订单详情成功");
            },
            function () {
                console.log("查询订单详情失败");
            }
        );
    },
    /**
     * 订单详情数据查询出来之后,设置附件的url
     * @private
     */
    _orderChange: function (order) {
        if (!order || !order.financeOrderEx) {
            return;
        }
        if (this.order.financeOrderEx.attachmentId) {
            this.set("imgSrc", this.getRoot() + '/financialOrder/' + this.order.financeOrderEx.attachmentId + ".do");
        }
    },
    /**
     * 状态为审核中的时候显示处理按钮
     * @param status
     * @returns {boolean}
     * @private
     */
    _showDealBtn: function (status) {
        return status == 1 ? true : false;
    },
    /**
     * 待回款,逾期,已回款状态的都显示还款信息
     * @param status
     * @returns {boolean}
     * @private
     */
    _showRepaymentInfo: function (status) {
        return status == 4 || status == 5 || status == 6 ? true : false;
    },
    /**
     * 驳回,待回款,逾期,已回款,待放款状态的都显示审批信息
     * @param status
     * @returns {boolean}
     * @private
     */
    _showApprovedInfo: function (status) {
        return status == 2 || status == 3 || status == 4 || status == 5 || status == 6 ? true : false;
    },
    /**
     * 待回款,逾期,已回款状态的都显示放款信息
     * @param status
     * @returns {boolean}
     * @private
     */
    _showMakeLoanAtInfo: function (status) {
        return status == 4 || status == 5 || status == 6 ? true : false;
    }
});
