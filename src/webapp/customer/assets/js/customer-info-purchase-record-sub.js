/**
 * Created by wendy-pc on 2016/8/9.
 */
Polymer({
    is: "customer-info-purchase-record-sub",
    behaviors:[OBaseBehavior, OCrudBehavior, OFormatBehavior],
    properties: {
        subParam: {
            type: Object,
            value: function () {
                return {};
            },
            notify: true,
            observer: "_paramChange"
        },

        // 子订单数组
        orderItems:{
            type: Array,
            notify:true
        },

    },

    //根据订单变化（监听）查询所有子订单
    _paramChange: function (newVal) {
        var self = this;
        if (newVal && newVal.id) {//销售订单页面
            this._findOrderItems(newVal.id);
        }
    },
    /**
     * 当有数据时，做屏蔽设置
     * @param list
     * @private
     */
    _subitemListChange: function(list){
        if(list && list.length > 0) {
            this.loadCurrentConfig(this);   //加载配置
        }
    },

    /**
     * 根据订单id查询所有子订单
     */
    _findOrderItems: function (orderId) {
        var self = this;
        var param={
            orderId:orderId
        };
        this.query(
            "/customer/findOrderItems.do",
            param,
            function (data) {
                //console.log("查询子订单成功");
                if (data) {
                    self.set("orderItems", data);
                } else {
                    self.set("orderItems", []);
                }
            },
            function () {
                //console.log("查询子订单失败");
            }
        );
    }
});
