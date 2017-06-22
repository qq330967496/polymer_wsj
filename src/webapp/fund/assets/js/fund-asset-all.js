/**
 * Created by wendy-pc on 2016/7/29.
 */
Polymer({
    is: "fund-asset-all",
    behaviors:[OBaseBehavior],
    properties: {
        fundType: {
            type: Array,
            value: [{
                value: 0,
                label: "全部"
            }, {
                value: 1,
                label: "备用金"
            }, {
                value: 2,
                label: "铜板街"
            }, {
                value: 3,
                label: "真融宝"
            }]
        },
        fundStatus: {
            type: Array,
            value: [{
                value: 0,
                label: "全部"
            }, {
                value: 1,
                label: "进行中"
            }, {
                value: 2,
                label: "已回款"
            }]
        }
    }


});
