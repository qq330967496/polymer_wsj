/**
 * Created by wendy-pc on 2016/7/28.
 */
Polymer({
    is: "credit-index",
    behaviors:[OBaseBehavior],
    properties: {
        creditRating: {
            type: Array,
            value: [{
                value: 0,
                label: "无",
                count:"100"
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
        registerDate: {
            type: Array,
            value: [{
                value: 0,
                label: "全部"
            }, {
                value: 1,
                label: "近3天"
            }, {
                value: 2,
                label: "近7天"
            }, {
                value: 3,
                label: "近30天"
            }]
        }
    }
});
