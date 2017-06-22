/**
 * Created by wendy-pc on 2016/7/29.
 */
Polymer({
    is: 'fund-asset-transfer-receipt',
    behaviors:[OBaseBehavior],
    properties: {
        buttonItems: {
            type: Array,
            value: [{
                value: '0',
                label: "弹窗A",
                contentElement: 'element-name'
            }, {
                value: '1',
                label: "弹窗B",
                contentElement: 'element-name'
            }]
        }
    }
});