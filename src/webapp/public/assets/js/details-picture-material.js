/**
 * Created by wendy-pc on 2016/7/29.
 */
Polymer({
    is: "details-picture-material",
    behaviors: [OBaseBehavior],
    properties: {
        imgSrc: {
            type: String,
            notify: true
        },
        imgData: {
            type: Object,
            notify: true
        }
    }
});
