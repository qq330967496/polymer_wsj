/**
 * 支持拼音搜索的快塑供应商银行组件
 *
 * @author pengjukai
 */
(function () {
    angular.module('ks.supplierBankPicker', ['ks', 'ks.cache'])
        .directive('ksSupplierBankPicker', ["$compile", 'ksCache', '$http', 'k', function ($compile, ksCache, $http, k) {

            return {
                require: 'ngModel',
                scope: {
                    width: '@',
                    type:'@',//输入框显示内容，1 开会银行 2 银行账号
                    onSelected: "&",
                    disabled: '=?',
                    displayField: '@'
                },
                restrict: 'E',
                replace: true,
                transclude: true,
                template: '<div><ks-auto-complete-kw tip="支持全拼、简拼搜索,空格分词,如无数据请输入完整的银行账户" placeholder="银行账户" column-infos="columnInfos"   url="url" business-code="order" ng-model="ngModel" select-only="true" selected-item="selectedItem" display-field="bank" value-field="idOrderNo" enable-multi="false" readonly="disabled" input-width="width" format-keyword="formatKeyword(keyword)"></ks-auto-complete-kw></div>',

                link: function (scope, element, attrs, ngModel) {
                    var me = scope;
                   me.$watch("selectedItem", function (newVal) {
                        if (newVal.length > 0) {

                            if(!newVal[0].bank){
                                ngModel.$setViewValue(newVal[0].bank);
                            }else{
                                ngModel.$setViewValue(newVal[0].bank);
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
                        displayField: 'bank',
                        columnInfos: [{field: 'bank', label: '开户银行', width: '150', align: "center"},
                            {field: 'cardNo', label: '卡号', width: '100', align: "center"},
                            {field: 'customerCompanyName', label: '客户公司名称', width: '180', align: "left"}],

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
