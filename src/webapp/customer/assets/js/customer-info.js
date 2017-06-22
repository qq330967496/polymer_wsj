/**
 * Created by wendy-pc on 2016/7/26.
 */
Polymer({
    is: "customer-info",
    behaviors:[OBaseBehavior,OCrudBehavior],
    properties: {
        tabindex:{
            type:Number,
            value:0
        },
        customer: {
            type: Object,
            notify: true
        },
        company: {
            type: Object,
            notify: true
        },
        companyId: {
            type: Number,
            notify: true
        },
        queryCondition: {
            type: Object,
            value: function () {
                return {
                    start: 0,
                    limit: 10,
                    results: 0,
                    pageIndex: 1
                }
            },
            notify: true
        },
        // 订单数组
        orders: {
            type: Array,
            notify: true
        },
    },
    observers:[
        "_tabindexChange(tabindex)"
    ],
    showTabIndex:function(index,tabindex){
        return index==tabindex;
    },
    _tabindexChange:function(tabindex){
        switch(tabindex){
            case 0:
                if(this.companyId){
                    this._swichCompanyInfoTab();
                }else{
                    this._swichCompanyInfoTab1();
                }
                break;
            case 1:
                this._swichFinanceOrderTab();
                break;
            case 2:
                this._swichPurchaseRecordTab();
                break;
        }
    },

    /**
     * 查询企业资料
     * @private
     */
    _swichCompanyInfoTab:function(){
        this._findCompanyById(this.companyId);
        this._customers(this.companyId);
    },
    /**
     * 查询企业资料（第一次查询）
     * @private
     */
    _swichCompanyInfoTab1:function(){
        var self = this;
        setTimeout(function(){
            self._findCompanyById(self.companyId);
            self._customers(self.companyId);
        },100);
    },
    /**
     * 查询融资订单
     * @private
     */
    _swichFinanceOrderTab:function(){
        var self = this;
        self._customers(self.companyId);
        setTimeout(
            function(){
                $(self).find('customer-info-financing-order')[0]._init();
        }, 100);
    },
    /**
     * 查询采购记录
     * @private
     */
    _swichPurchaseRecordTab:function(){
        this._customers(this.companyId);
        this._findOrders(this.companyId);
    },


    _init: function (companyId) {
        this.set("companyId",companyId);
    },
    /**
     * 查询客户详情
     * @private
     */
    _findCompanyById: function (id) {
        var self = this;
        this.query(
            "/customer/findCompanyById.do",
            {id: id},
            function (data) {
                self.set("company", data);
                //console.log("查询客户详情成功");
            },
            function () {
                //console.log("查询客户详情失败");
            }
        );
    },
    /**
     * 查询客户信息
     * @private
     */
    _customers: function (companyId) {
        var self = this;
        var param={
            companyId:companyId,
            customerType:1
        };
        this.query(
            "/customer/queryCustomers.do",
            param,
            function (data) {
                self.set("customer", data[0]);
                //console.log("查询客户信息成功");
            },
            function () {
                //console.log("查询客户信息失败");
            }
        );
    },

    _findOrders: function (tradingCompanyId) {
        var self = this;
        var param={
            start:this.queryCondition.start,
            limit:this.queryCondition.limit,
            tradingCompanyId:tradingCompanyId
        };
        this.query(
            "/customer/findOrders.do",
            param,
            function (data) {
                //console.log("查询订单成功");
                if (data && data.orders) {
                    self.set("orders", data.orders);
                    self.set("queryCondition.results", data.pageRespone.results);
                } else {
                    self.set("orders", []);
                }
            },
            function () {
                //console.log("查询订单失败");
            }
        );
    },
});
