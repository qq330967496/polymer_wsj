/**
 * Created by wendy-pc on 2016/7/26.
 */
Polymer({
    is: 'customer-edit',
    behaviors:[CustomerCompanyBehavior],
    properties: {
        propertyItem: {
            type: Array,
            value: [{
                value: '0',
                label: "民营企业"
            }, {
                value: '1',
                label: "国企"
            }, {
                value: '2',
                label: "上市公司"
            }]
        },
        setUpDate: {
            type: Array,
            value: [{
                value: '0',
                label: "2016"
            }, {
                value: '1',
                label: "2015"
            }, {
                value: '1',
                label: "2014"
            }]
        }
    }
});