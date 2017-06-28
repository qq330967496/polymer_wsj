/**
 * Created by wendy-pc on 2016/7/22.
 */
Polymer({
    is: "finance-index",
    behaviors: [OBaseBehavior, OCrudBehavior],
    properties: {
        tabindex: {
            type: Number,
            value: 0
        },
        staff: {
            type: Object,
            value: function () {
                return {
                    name: ""
                };
            },
            notify: true
        }
    },
    ready:function(){
        this.async(this._getStaffName.bind(this), 100);
    },
    /**
     * 打开金融服务页面
     * @param e
     * @private
     */
    _openFinancialPage: function (e) {
        var self = this;
        var id = e.currentTarget.id;
        this._openPage(id);
        /**
         * approval:待审核
         * pendingPayment:待放款
         * dueToday:本日到期
         * pendingReceipt:进行中
         * overdue:逾期
         * historyOrder:历史订单
         */
        var eleName;
        switch (id) {
            case "approval":
                eleName = "financial-business-check-pending";
                break;
            case "pendingPayment":
                eleName = "financial-business-obligation";
                break;
            case "dueToday":
                eleName = "financial-business-due-today";
                break;
            case "pendingReceipt":
                eleName = "financial-business-ongoing";
                break;
            case "overdue":
                eleName = "financial-business-overdue";
                break;
            case "historyOrder":
                eleName = "financial-business-past-records";
                break;
        }
        setTimeout(
            function () {
                $(self).find(eleName)[0]._init()
            }, 100
        );
    },
    /**
     * 打开客户页面
     * @param e
     * @private
     */
    _openCustomerPage: function (e) {
        var id = e.currentTarget.id;
        this._openPage(id);
    },
    /**
     * 打开其他页面,1.0版本不开发
     * @param e
     * @private
     */
    _openOtherPage: function (e) {
        this._openPage();
    },
    _openPage: function (pageId) {
        var mainIndex = $(this).find("#mainIndex")[0];
        mainIndex._showTabPage(pageId);
    },
    _logout: function () {
        var self = this;
        this.query("/staff/logout.do", {}, function (data) {
            data.success ? document.location.href = self.getResourceRoot() + "/login/login.html" : "";
        });
    },
    _getStaffName: function () {
        var self = this;
        this.query("/staff/loginUser.do", {}, function (data) {
            if (data.success) {
                self.set("staff", data.bean);
                return;
            }
            document.location.href = self.getResourceRoot() + "/login/login.html";
        });
    },
    showTabIndex: function (index, tabindex) {
        return index == tabindex;
    }
});
