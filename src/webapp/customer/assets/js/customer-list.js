/**
 * Created by SkyLin on 2017/6/23.
 */
Polymer({
    is: "customer-list",
    behaviors: [OTipBehavior, CustomerCompanyBehavior],
    properties: {
        entity: {
            type: Object
        },
        resetPaging: {
            type: Boolean
        },
        customerList: {
            type: Array,
            notify: true
        }
    },
    _disableCustomer: function () {
        var self = this;
        this.hTip.confirm(
         "确定禁用该用户吗？",
         function () {
         self.hTip.success("禁用成功！",2000);
         });
    },
    _enableCustomer: function () {
        var self = this;
        this.hTip.confirm(
            "确定启用该用户吗？",
            function () {
                self.hTip.success("启用成功！", 2000);
            });
    }
});
