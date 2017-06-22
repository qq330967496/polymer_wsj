/**
 * 支持拼音搜索的客户选择组件
 * 
 * @author caiwb
 */
(function () {
    angular.module('ks.accountCompanyPicker', ['ks','ks.cache'])
        .directive('ksAccountCompanyPicker', ["$compile",'ksCache','$http','k',function ($compile,ksCache,$http,k) {

            // 检测输入字符串的正则表达式特殊字符
            var regSpec = /\$|\(|\)|\*|\+|\.|\[|\]|\\|\^|\{|\}|\|/g;

            return {
                require: 'ngModel',
                scope: {
                    width:'@',
                    customerCompanyName:'=?',
                    onSelected:"&",
                    disabled:'=?',
                    disableIfFieldNull:'@?'
                },
                restrict: 'E',
                replace: true,
                transclude: true,
                template:'<div><ks-auto-complete-kw tip="支持全拼、简拼搜索,空格分词" placeholder="客户公司" column-infos="columnInfos"   url="url" ng-model="ngModel" select-only="true" selected-item="selectedItem" display-field="companyName" value-field="id" enable-multi="false" readonly="disabled" input-width="width"  disable-item="disableItem(row)"></ks-auto-complete-kw></div>',

                link: function (scope, element, attrs, ngModel) {
                    var me = scope;

                    me.$watch("selectedItem",function(newVal){
                        if(newVal.length == 1){
                            ngModel.$setViewValue(newVal[0].id);

                            me.onSelected({selectItem:newVal[0]});
                        }else{
                            me.selectedItem = [];
                            ngModel.$setViewValue(null);
                        }
                    },true)

                    ngModel.$render = function(){
                        var value = ngModel.$viewValue;
                        if(value){
                            var url = window.webRoot+'/crm/buyers/'+value+'.do';
                            $http.get(url).success(function(data){
                                data.name = data.name;
                                me.selectedItem.push(data);
                            });
                        }else{
                            me.selectedItem = [];
                        }
                    }


                    $.extend(scope,{

                        columnInfos:[{field:'name',label:'客户姓名',width:'80'},
                            {field:'phone',label:'客户联系方式',width:'100'},
                            {field:'companyName',label:'客户公司名称',width:'180'},
                            {field:'salesOperatorNames',label:'交易员',width:'80'}],

                        url:window.webRoot+'/crm/crmcustomers/findBuyersByKeyword.do?verified=1',

                        selectedItem:[],

                        disableItem:function(row){
                            if(me.disableIfFieldNull){
                                return row[me.disableIfFieldNull] == null || row[me.disableIfFieldNull] === undefined
                            }
                            return false
                        }

                    },true);

                }

            }
        }]);
})();
