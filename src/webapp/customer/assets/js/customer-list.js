/**
 * Created by wendy-pc on 2016/7/26.
 */
Polymer({
    is: "customer-list",
    behaviors:[OBaseBehavior,OCrudBehavior,CustomerCompanyBehavior],
    properties: {
        entity: {
            type: Object
        },
        resetPaging: {
            type: Boolean
        },
        companyList: {
            type: Array,
            value: function () {
                return []
            },
            notify: true
        }
    }
});
