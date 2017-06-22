/**
 * 支持拼音搜索的快塑订单编号选择组件
 *
 * @author wangyansong
 */
(function () {
    angular.module('ks.purchaseOrderPicker', ['ks', 'ks.cache'])
        .directive('ksPurchaseOrderPicker', ["$compile", 'ksCache', '$http', 'k', function ($compile, ksCache, $http, k) {

            // 检测输入字符串的正则表达式特殊字符
            var regSpec = /\$|\(|\)|\*|\+|\.|\[|\]|\\|\^|\{|\}|\|/g;

            return {
                require: 'ngModel',
                scope: {
                    width: '@',
                    onSelected: "&",
                    disabled: '=?',
                    displayField: '@',
                    flag: '@?'
                },
                restrict: 'E',
                replace: true,
                transclude: true,

                template: '<div style="display: inline-block"><ks-auto-complete-kw tip="支持全拼、简拼搜索,空格分词" placeholder="采购订单合同编号" column-infos="columnInfos"   url="url" ng-model="ngModel" select-only="true" selected-item="selectedItem" display-field="purchaseContractNo" value-field="purchaseContractNo" enable-multi="false" readonly="disabled" input-width="width" business-code="purchaseOrder" format-keyword="formatKeyword(keyword)"></ks-auto-complete-kw></div>',

                link: function (scope, element, attrs, ngModel) {
                    var me = scope;

                    me.$watch("selectedItem", function (newVal) {
                        if (newVal.length > 0) {
                            ngModel.$setViewValue(newVal[0].purchaseContractNo);

                            me.onSelected({selectedItem: newVal[0]})
                        } else {
                            me.selectedItem = [];
                            ngModel.$setViewValue(null);
                        }
                    }, true)

                    ngModel.$render = function () {
                        var value = ngModel.$viewValue;
                        //if (value === undefined) {
                        //    return;
                        //}
                        if (value) {
                            var url = window.webRoot + '/sys/memcache/fetchByPrimaryKey.do';
                            $http.get(url,{params:{businessCode:"purchaseOrder",primaryKey:value}}).success(function (data) {
                                me.selectedItem = data
                            });
                        } else {
                            me.selectedItem = [];
                        }
                    }


                    $.extend(scope, {

                        displayField: 'purchaseContractNo',
                        columnInfos: [{field: 'purchaseContractNo', label: '合同编号', width: '150', align: "center"},
                            {field: 'supplierCompanyName', label: '供应商公司名称', width: '200', align: "center"},
                            {field: 'totalAmount', label: '采购总金额', width: '120', align: "right",type:'CNY'}],

                        //url: window.webRoot + '/mall/kuaisuorderreform/findPurchaseOrderByKeyword.do',

                        selectedItem: [],

                        formatKeyword:function(keyword){
                            //return keyword ? keyword.toUpperCase() : keyword;
                        }

                    }, true);

                }

            }
        }]);
})();
