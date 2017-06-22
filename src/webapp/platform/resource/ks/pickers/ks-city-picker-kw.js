/**
 * 支持拼音搜索的分类选择组件
 *
 * @author wangyansong
 */
(function () {
    angular.module('ks.cityKwPicker', ['ks', 'ks.cache'])
        .directive('ksCityKwPicker', ["$compile", 'ksCache', '$http', 'k', function ($compile, ksCache, $http, k) {

            // 检测输入字符串的正则表达式特殊字符
            var regSpec = /\$|\(|\)|\*|\+|\.|\[|\]|\\|\^|\{|\}|\|/g;

            return {
                require: 'ngModel',
                scope: {
                    width: '@',
                    onSelected: "&",
                    readonly: '=?',
                    checkedItem:'=?'
                },
                restrict: 'E',
                replace: true,
                transclude: true,
                template: '<div style="display: inline-block;width: 120px;"><ks-auto-complete-kw  placeholder="城市" column-infos="columnInfos"   url="url" ng-model="ngModel" select-only="true" selected-item="selectedItem" display-field="name" value-field="cityCode" enable-multi="false" readonly="readonly" input-width="width" business-code="city"></ks-auto-complete-kw></div>',

                link: function (scope, element, attrs, ngModel) {
                    var me = scope;

                    me.$watch("selectedItem", function (newVal) {
                        if (newVal && newVal.length > 0) {
                            ngModel.$setViewValue(newVal[0].cityCode);
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
                            $http.get(url,{params:{businessCode:"city",primaryKey:value}}).success(function (data) {
                                me.selectedItem = data
                            });
                        } else {
                            me.selectedItem = [];
                            me.checkedItem = [];
                        }
                    }


                    $.extend(scope, {

                        columnInfos: [{field: 'name', label: '城市名称', width: '150', align: "center"}],

                        //url: window.webRoot + '/pdm/cities/findByKeyword.do',

                        selectedItem: []

                    }, true);

                }

            }
        }]);
})();
