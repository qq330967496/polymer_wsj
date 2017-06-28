/**
 * Created by wendy-pc on 2016/7/26.
 */
Polymer({
    is: "customer-index",
    behaviors: [CustomerCompanyBehavior],
    properties: {
        customerList: {
            type: Array,
            value: function () {
                return []
            },
            notify: true
        }
    },
    listeners: {
        "data-change": 'findCustomers',
    },
    ready: function () {
        var self = this;
        setTimeout(function () {
            self.findCustomers();
        },100);
    }
});
