/**
 * 支持拼音搜索的客户选择组件
 *
 * @author caiwb
 */
(function () {
    angular.module('ks.customerKeywordPicker', ['ks', 'ks.cache'])
        .directive('ksCustomerKeywordPicker', ["$compile", 'ksCache', '$http', 'k', function ($compile, ksCache, $http, k) {

            // 检测输入字符串的正则表达式特殊字符
            var regSpec = /\$|\(|\)|\*|\+|\.|\[|\]|\\|\^|\{|\}|\|/g;

            return {
                require: 'ngModel',
                scope: {
                    width: '@',
                    customerCompanyName: '=?',
                    onSelected: "&",
                    disabled: '=?',
                    displayField: '@',
                    disableIfFieldNull: '@?',
                    flag: '@?',
                    requestParams:'=?',
                    queryType:'=?'//查询类型 0:全部客户，1：查询自己的采购商客户， 2：自己可以帮忙发布需求的客户
                },
                restrict: 'E',
                replace: true,
                transclude: true,
                template: '<div><ks-auto-complete-kw tip="支持全拼、简拼搜索,空格分词" placeholder="客户姓名" column-infos="columnInfos"   url="url" ng-model="ngModel" select-only="true" selected-item="selectedItem" display-field="{{displayField}}" value-field="id" enable-multi="false" readonly="disabled" input-width="width"  flag="{{flag}}" disable-item="disableItem(row)"></ks-auto-complete-kw></div>',

                link: function (scope, element, attrs, ngModel) {
                    var me = scope;

                    me.$watch("selectedItem",function(newVal){
                        if(newVal.length > 0){
                            ngModel.$setViewValue(newVal[0].id);
                            me.onSelected({selectedItem: newVal[0]})
                        } else {
                            me.selectedItem = [];
                            ngModel.$setViewValue(null);
                        }
                    }, true)
                    me.$watch("queryType",function(newVal){
                        if(!newVal){
                            me.url=window.webRoot + '/crm/crmcustomers/findBuyersByKeyword.do';
                        } else  if(newVal==1){
                            me.url=window.webRoot + '/crm/crmcustomers/findBuyersByKeyword.do?allocatedStaffId=1';
                        }else  if(newVal==2){
                            me.url=window.webRoot + '/crm/crmcustomers/findBuyersByKeyword.do?allocatedStaffId=1&queryPermissions=ROLE_UC_ADD_ANY_REQUIREMENTS';
                        }
                    }, true)

                    ngModel.$render = function () {
                        var value = ngModel.$viewValue;
                        //if(value==undefined){
                        //    return;
                        //}
                        if (value) {
                            var url = window.webRoot + '/crm/buyers/' + value + '.do';
                            $http.get(url).success(function (data) {
                                data.name = data.name;
                                me.selectedItem.push(data);
                            });
                        } else {
                            me.selectedItem = [];
                        }
                    }

                    //function initParams(){
                    //    var params = '';
                    //    if (!angular.isObject(me.requestParams)){
                    //        return params;
                    //    }
                    //    for (var key in me.requestParams) {
                    //        params += key + '=' + me.requestParams[key] + '&';
                    //    }
                    //
                    //    if(params.length > 0){
                    //        params = '?' + params.substring(0,params.length - 1);
                    //    }
                    //    return params;
                    //}

                    $.extend(scope, {
                        displayField: 'name',
                        columnInfos: [{field: 'name', label: '客户姓名', width: '80'},
                            {field: 'phone', label: '客户联系方式', width: '100'},
                            {field: 'companyName', label: '客户公司名称', width: '180'},
                            {field: 'salesOperatorNames', label: '交易员', width: '160'},
                            {field: 'virtualized', label: '是否内部客户', width: '80',render:function(row){
                                if(!row){
                                    return;
                                }
                                var value="否"
                                if(row.virtualized==1){
                                    value= "是"
                                }
                                return value;
                            }}
                            ],

                        url: window.webRoot + '/crm/crmcustomers/findBuyersByKeyword.do',

                        selectedItem: [],

                        disableItem:function(row){
                            if(me.requestParams && me.requestParams.staffId){
                                if(row.virtualized == me.requestParams.virtualized){
                                    return false;
                                }else return $.inArray(me.requestParams.staffId, row.staffIds) == -1;
                            }

                            if(me.disableIfFieldNull){
                                return row[me.disableIfFieldNull] == null || row[me.disableIfFieldNull] === undefined
                            }
                            return false
                        }

                    }, true);

                }

            }
        }]);
})();
