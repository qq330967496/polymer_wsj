/**
 * Created by SkyLin on 2017/6/23.
 */
Polymer({
    is: "customer-list",
    behaviors: [OTipBehavior, CustomerCompanyBehavior],
    properties: {
        customerList: {
            type: Array,
            notify: true
        }
    },
    _disableCustomer: function (e) {
        var self = this;
        var args = e.currentTarget.dataArgs;
        this.hTip.confirm(
         "确定禁用该用户吗？",
         function () {
             self.updateEntity(
                 "/customers/modifyCustomerStatus.do",
                 {customerId: args.id, status: 0},
                 function(data){
                     data.success?self.hTip.success("禁用成功！",2000):self.hTip.error("禁用失败！", 2000);
                 },function(err){
                     console.log(err);
                     self.hTip.error("服务异常，请重试", 2000);
             });
         });
    },
    _enableCustomer: function (e) {
        var self = this;
        var args = e.currentTarget.dataArgs;
        this.hTip.confirm(
            "确定启用该用户吗？",
            function () {
                self.updateEntity(
                    "/customers/modifyCustomerStatus.do",
                    {customerId: args.id, status: 1},
                    function(data){
                        data.success?self.hTip.success("启用成功！", 2000):self.hTip.error("启用失败！", 2000);
                    },function(err){
                        console.log(err);
                        self.hTip.error("服务异常，请重试", 2000);
                });
        });
    },
    /**
     * sex不存在的时候返回空字符串，1：男，0：女
     * @param sex
     * @returns {string}
     * @private
     */
    _showSex: function (sex) {
        return (sex == undefined || sex === "") ? "" : sex === 1 ? "男" : "女";
    }
});
