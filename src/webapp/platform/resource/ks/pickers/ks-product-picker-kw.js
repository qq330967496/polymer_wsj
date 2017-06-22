/**
 * 支持拼音搜索的分类选择组件
 *
 * @author wangyansong
 */
(function () {
    angular.module('ks.productKwPicker', ['ks'])
        .directive('ksProductKwPicker', ['$http',  function ($http) {

            return {
                require: 'ngModel',
                scope: {
                    width:'@',
                    disabled:'=?',
                    checkedItem:'=?'
                },
                restrict: 'E',
                replace: true,
                transclude: true,
                template: '<div><ks-auto-complete-kw tip="支持全拼、简拼搜索,空格分词" placeholder="产品" column-infos="columnInfos"   url="url" ng-model="ngModel" select-only="true" selected-item="selectedItem" display-field="category|designation|manufacturerName|originCountryName" value-field="id" enable-multi="false" readonly="readonly" input-width="width" business-code="product2" format-keyword="formatKeyword(keyword)" input-width="width"></ks-auto-complete-kw></div>',

                link: function (scope, element, attrs, ngModel) {
                    var me = scope;

                    me.$watch("selectedItem", function (newVal) {
                        if (newVal && newVal.length > 0) {
                            ngModel.$setViewValue(newVal[0].id);
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
                            $http.get(url,{params:{businessCode:"product",primaryKey:value}}).success(function (data) {
                                me.selectedItem = data
                            });
                        } else {
                            me.selectedItem = [];
                            me.checkedItem = [];
                        }
                    }


                    $.extend(scope, {

                        displayField: 'category',
                        columnInfos: [{field: 'category', label: '分类', width: '100', align: "center"},
                            {field: 'designation', label: '牌号', width: '100', align: "center"},
                            {field: 'manufacturerName', label: '生产商', width: '150', align: "center"},
                            {field: 'originCountryName', label: '产地', width: '100', align: "center"},
                            {field: 'verified', label: '认证状态', width: '100', align: "left",render : function(value){
                                if(value.verified == 1){ return '已认证' } else { return '' }
                            }}],

                        //url: window.webRoot + '/pdm/categories/findByKeyword.do',

                        selectedItem: [],

                        formatKeyword:function(keyword){
                            return keyword ? keyword.toUpperCase() : keyword;
                        },

                        width:300

                    }, true);

                }

            }
        }]);
})();
