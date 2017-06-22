/**
 * Created by author-name on 2015/12/1.
 */
Polymer({
    is: 'element-name',//和组件名一致
    properties: {
        buttonItems: {//下拉按钮组
            type: Array,
            value: [{
                value: '0',
                label: "弹窗A",
                contentElement: 'element-name'//弹窗的内容标签
            }, {
                value: '1',
                label: "弹窗B",
                contentElement: 'element-name',
                count: "27"
            }]
        }
    }
});