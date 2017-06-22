/**
 * 支持拼音搜索的快塑订单编号选择组件
 *
 * @author wangyansong
 */
(function () {
    angular.module('ks.ordernoPicker', ['ks', 'ks.cache'])
        .directive('ksOrdernoPicker', ["$compile", 'ksCache', '$http', 'k', function ($compile, ksCache, $http, k) {

            return {
                require: 'ngModel',
                scope: {
                    width: '@',
                    customerCompanyName: '=?',
                    onSelected: "&",
                    disabled: '=?',
                    displayField: '@'
                },
                restrict: 'E',
                replace: true,
                transclude: true,
                template: '<div><ks-auto-complete-kw tip="支持全拼、简拼搜索,空格分词,如无数据请输入完整的订单编号" placeholder="订单编号" column-infos="columnInfos"   url="url" business-code="order" ng-model="ngModel" select-only="true" selected-item="selectedItem" display-field="orderNo" value-field="idOrderNo" enable-multi="false" readonly="disabled" input-width="width" format-keyword="formatKeyword(keyword)"></ks-auto-complete-kw></div>',

                link: function (scope, element, attrs, ngModel) {
                    var me = scope;

                    me.$watch("selectedItem", function (newVal) {
                        if (newVal.length > 0) {

                            if(!newVal[0].idOrderNo){
                                ngModel.$setViewValue(newVal[0].orderNo);
                            }else{
                                ngModel.$setViewValue(newVal[0].idOrderNo);
                            }

                            me.onSelected({selectedItem: newVal[0]})
                        } else {
                            me.selectedItem = [];
                            ngModel.$setViewValue(null);
                        }
                    }, true)

                    ngModel.$render = function () {
                        var value = ngModel.$viewValue;
                        if (value) {
                            var url = window.webRoot + '/sys/memcache/fetchByPrimaryKey.do';
                            $http.get(url,{params:{businessCode:"order",primaryKey:value}}).success(function (data) {
                                me.selectedItem = data
                            });
                        } else {
                            me.selectedItem = [];
                        }
                    }


                    $.extend(scope, {


                        displayField: 'orderNo',
                        columnInfos: [{field: 'orderNo', label: '订单编号', width: '150', align: "center"},
                            {field: 'customerName', label: '客户名称', width: '100', align: "center"},
                            {field: 'customerCompanyName', label: '客户公司名称', width: '180', align: "left"},
                            {field: 'totalAmount', label: '总金额', width: '100', align: "right",type:'CNY'},
                            {field: 'createdByName', label: '下单人', width: '80', align: "center"}],
                        
                        //url: window.webRoot + '/mall/kuaisuorderreform/findOrderNoByKeyword.do',

                        selectedItem: [],

                        formatKeyword:function(keyword){
                            //return keyword ? keyword.toUpperCase() : keyword;
                        }

                    }, true);

                }

            }
        }]);
})();
