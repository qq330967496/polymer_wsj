/**
 * Created by wendy-pc on 2016/7/28.
 */
Polymer({
    is: 'financial-business-purchaser-info',
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