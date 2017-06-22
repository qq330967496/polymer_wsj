/**
 * Created by wendy-pc on 2016/7/29.
 */
Polymer({
    is: "fund-reserve-fund",
    behaviors:[OBaseBehavior],
    properties: {
        tabindex:{
            type:Number,
            value:0
        }
    },

    showTabIndex:function(index,tabindex){
        console.log(tabindex);
        return index==tabindex;
    }
});
