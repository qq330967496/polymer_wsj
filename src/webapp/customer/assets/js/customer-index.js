/**
 * Created by wendy-pc on 2016/7/26.
 */
Polymer({
    is: "customer-index",
    behaviors: [CustomerCompanyBehavior],
    properties: {
        creditRating: {
            type: Array,
            value: [{
                value: 0,
                label: "无"
            }, {
                value: 1,
                label: "A"
            }, {
                value: 2,
                label: "AA"
            }, {
                value: 3,
                label: "AAA"
            }, {
                value: 4,
                label: "AAAA"
            }, {
                value: 5,
                label: "AAAAA"
            }]
        },
        sourceItem: {
            type: Array,
            value: [{
                value: 0,
                label: "全部"
            }, {
                value: 1,
                label: "快塑网"
            }, {
                value: 2,
                label: "其他"
            }]
        },
        // 客户名数组
        customerNames: {
            type: Array,
            notify: true
        },
        // 客户名下拉搜索框表头
        customerCols: {
            type: Array,
            value: [{field: 'label', label: '客户公司名称', width: '100'}]
        },
    },
    listeners:{
        "data-change":'resetFormSmsQC',
    },
    ready: function () {
        this.findSimpleCompanies();
        this.loadCustomerName();
    }
});
