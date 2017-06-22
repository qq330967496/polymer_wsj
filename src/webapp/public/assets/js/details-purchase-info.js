/**
 * Created by wendy-pc on 2016/7/29.
 */
Polymer({
    is: "details-purchase-info",
    behaviors: [OCrudBehavior],
    properties: {
        orderInfo: {
            type: Object,
            notify: true
        }
    }
});
