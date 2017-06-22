/**
 * 支持拼音搜索的分类选择组件
 *
 * @author wangyansong
 */
(function () {
    angular.module('ks.designationKwPicker', ['ks'])
        .directive('ksDesignationKwPicker', ['$http', function ( $http ) {


            return {
                require: 'ngModel',
                scope: {
                    //width: '@',
                    onSelected: "&",
                    readonly: '=?',
                    displayField: '@',
                    valueField:'@',
                    checkedItem:'=?',
                    placeholder:'@',
                    businessCode:'@'
                },
                restrict: 'E',
                replace: true,
                transclude: true,
                template: '<div style="display: inline-block"><ks-auto-complete-kw tip="支持全拼、简拼搜索,空格分词" placeholder="{{placeholder}}" column-infos="columnInfos"   url="url" ng-model="ngModel" select-only="true" selected-item="selectedItem" display-field="{{displayField}}" value-field="{{valueField}}" enable-multi="false" readonly="readonly" input-width="width" business-code="{{businessCode}}" format-keyword="formatKeyword(keyword)"></ks-auto-complete-kw></div>',

                link: function (scope, element, attrs, ngModel) {
                    var me = scope;

                    me.$watch("selectedItem", function (newVal) {
                        if (newVal && newVal.length > 0) {

                            var viewValue = "";

                            if(me.valueField.indexOf('|') != -1){
                                var valueFields = me.valueField.split("|");
                                for(var i in valueFields){
                                    viewValue += newVal[0][valueFields[i]] + '|';
                                }

                                if(viewValue.length > 0)viewValue = viewValue.substring(0,viewValue.length - 1);
                            }else{
                                viewValue = newVal[0][me.valueField];
                            }

                            ngModel.$setViewValue(viewValue);
                            me.checkedItem = newVal[0];

                        } else {
                            me.selectedItem = [];
                            me.checkedItem = [];
                            ngModel.$setViewValue(null);
                        }
                    }, true)

                    ngModel.$render = function () {
                        var value = ngModel.$viewValue;
                        if (value) {
                            var url = window.webRoot + '/sys/memcache/fetchByPrimaryKey.do';
                            $http.get(url,{params:{businessCode:me.businessCode,primaryKey:value}}).success(function (data) {
                                me.selectedItem = data
                            });
                        } else {
                            me.selectedItem = [];
                            me.checkedItem = [];
                        }
                    }

                    $.extend(scope, {

                        columnInfos: [
                            {field: 'designation', label: '牌号', width: '150', align: "left"},
                            {field: 'verified', label: '认证状态', width: '100', align: "left",render : function(value){
                                if(value.verified == 1){ return '已认证' } else { return '' }
                            }}],

                        //businessCode:"designation",

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
