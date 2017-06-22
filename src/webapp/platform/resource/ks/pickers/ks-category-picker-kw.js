/**
 * 支持拼音搜索的分类选择组件
 *
 * @author wangyansong
 */
(function () {
    angular.module('ks.categoryKwPicker', ['ks', 'ks.cache'])
        .directive('ksCategoryKwPicker', ["$compile", 'ksCache', '$http', 'k', function ($compile, ksCache, $http, k) {

            // 检测输入字符串的正则表达式特殊字符
            var regSpec = /\$|\(|\)|\*|\+|\.|\[|\]|\\|\^|\{|\}|\|/g;

            return {
                require: 'ngModel',
                scope: {
                    width: '@',
                    onSelected: "&",
                    readonly: '=?',
                    displayField: '@',
                    checkedItem:'=?'
                },
                restrict: 'E',
                replace: true,
                transclude: true,
                template: '<div style="display: inline-block"><ks-auto-complete-kw tip="支持全拼、简拼搜索,空格分词" placeholder="分类" column-infos="columnInfos"   url="url" ng-model="ngModel" select-only="true" selected-item="selectedItem" display-field="category" value-field="category" enable-multi="false" readonly="readonly" input-width="width" business-code="category" format-keyword="formatKeyword(keyword)"></ks-auto-complete-kw></div>',

                link: function (scope, element, attrs, ngModel) {
                    var me = scope;

                    me.$watch("selectedItem", function (newVal) {
                        if (newVal && newVal.length > 0) {
                            ngModel.$setViewValue(newVal[0].category);
                            me.checkedItem = newVal[0];

                            me.onSelected({selectedItem: newVal[0]})
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
                            $http.get(url,{params:{businessCode:"category",primaryKey:value}}).success(function (data) {
                                me.selectedItem = data
                            });
                        } else {
                            me.selectedItem = [];
                            me.checkedItem = [];
                        }
                    }


                    $.extend(scope, {

                        displayField: 'category',
                        columnInfos: [{field: 'category', label: '名称', width: '100', align: "center"},
                            {field: 'nameCn', label: '中文名称', width: '120', align: "center"}],

                        //url: window.webRoot + '/pdm/categories/findByKeyword.do',

                        selectedItem: [],

                        formatKeyword:function(keyword){
                            return keyword ? keyword.toUpperCase() : keyword;
                        }

                    }, true);

                }

            }
        }]);
})();
