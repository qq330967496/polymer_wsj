/**
 * ks 多选牌号组件
 * @author
 * @date
 */
(function () {
    angular.module('ks.multiDesignationPicker', ['ks','ks.autoSearchKw'])
        .directive('ksMultiDesignationPicker', ["$compile",function ($compile) {

            return {
                require: 'ngModel',
                scope: {
                    width:"@?",
                    readonly:'=',
                    onSelected:'&',
                    selectedItems:'=?'
                },
                restrict: 'E',
                template: '<div style="display: inline-block"><ks-auto-search-kw tip="支持全拼、简拼搜索,空格分词" multi="true" placeholder="{{placeholder}}" column-infos="columnInfos"   select-only="true" selected-items="selectedItems" display-field="designation" value-field="designation" readonly="false" width="{{width}}" business-code="{{businessCode}}" format-keyword="formatKeyword(keyword)"></ks-auto-search-kw></div>',

                link: function (scope, element, attrs, ngModel) {
                    var me = scope;

                    me.$watch("selectedItems", function (newVal,oldVal) {
                        if(!me.loaded || newVal==oldVal){
                            return;
                        }
                        if (angular.isArray(newVal) && newVal.length > 0) {

                            var viewValue = "";
                            for(var i=0;i<newVal.length;i++){
                                viewValue=viewValue+","+newVal[i]['designation']
                            }
                            if(viewValue.length>1){
                                viewValue=viewValue.substring(1);
                            }
                            ngModel.$setViewValue(viewValue);
                        } else {
                            ngModel.$setViewValue(null);
                        }
                    }, true)

                    ngModel.$render = function () {
                        var value = ngModel.$viewValue;
                        if (value) {//由于牌号的键值一样，所以不重新查询
                            var valArr=value.split(",");
                            me.selectedItems = [];
                            for(var i=0;i<valArr.length;i++){
                                var item={designation:valArr[i]}
                                me.selectedItems.push(item);
                            }
                        } else {
                            me.selectedItems = [];
                            me.checkedItem = [];
                        }
                        me.loaded=true;
                    }

                    $.extend(scope, {
                        loaded:false,
                        columnInfos: [
                            {field: 'designation', label: '牌号', width: '150', align: "left"},
                            {field: 'category', label: '分类', width: '100', align: "left"}],

                        businessCode:"designation",

                        selectedItem: [],

                        formatKeyword:function(keyword){
                            return keyword ? keyword.toUpperCase() : keyword;
                        },

                        width:'185'

                    }, true);

                }

            }
        }]);
})();