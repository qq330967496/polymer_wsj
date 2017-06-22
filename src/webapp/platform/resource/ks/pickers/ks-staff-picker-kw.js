/**
 * 支持拼音搜索的员工选择组件
 *
 * @author wangyansong
 */
(function () {
    angular.module('ks.staffKwPicker', ['ks'])
        .directive('ksStaffKwPicker', ['$http', function ($http){

            return {
                require: 'ngModel',
                scope: {
                    width: '@',
                    onSelected: "&",
                    readonly: '=?',
                    checkedItem:'=?',
                    entity: '@',
                    isQryAll:'=?'
                },
                restrict: 'E',
                replace: true,
                transclude: true,
                template: '<div style="display: inline-block;"><ks-auto-complete-kw datas="datas"  placeholder="员工" column-infos="columnInfos"   url="url" ng-model="ngModel" select-only="true" selected-item="selectedItem" display-field="name" value-field="id" enable-multi="false" readonly="readonly" input-width="width" ></ks-auto-complete-kw></div>',

                link: function (scope, element, attrs, ngModel) {
                    var me = scope;

                    me.$watch("selectedItem", function (newVal) {
                        if (newVal && newVal.length > 0) {
                            ngModel.$setViewValue(newVal[0].id);
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
                            var url = window.webRoot + '/uc/user/staffs/' + value + '.do';
                            $http.get(url).success(function (data) {
                                me.selectedItem.push(data);
                            });
                        } else {
                            me.selectedItem = [];
                            me.checkedItem = [];
                        }
                    }


                    if(me.entity){
                        me.datas = {}
                        me.datas.rows = $.parseJSON(me.entity);
                        me.datas.total = me.datas.rows.length;
                    }


                    $.extend(scope, {

                        columnInfos: [{field: 'name', label: '员工名称', width: '150', align: "center"}],

                        url: window.webRoot + '/uc/user/staffs/findByKeyword.do?useAuth=' + isQryAll(),

                        selectedItem: []

                    }, true);

                    function isQryAll(){
                        return me.isQryAll ? false:true;
                    }

                }

            }
        }]);
})();
