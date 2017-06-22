/**
 * 支持拼音搜索的供应商选择组件
 * 
 * @author caiwb
 */
(function () {
    angular.module('ks.supplierKeywordPicker', ['ks','ks.cache'])
        .directive('ksSupplierKeywordPicker', ["$compile",'ksCache','$http','k',function ($compile,ksCache,$http,k) {

            // 检测输入字符串的正则表达式特殊字符
            var regSpec = /\$|\(|\)|\*|\+|\.|\[|\]|\\|\^|\{|\}|\|/g;

            return {
                require: 'ngModel',
                scope: {
                    width:'@',
                    supplierCompanyName:'=?',
                    onSelected:"&",
                    validOnly:'@',
                    disabled:'=?',
                    checkedItem:'=?',
                    disableItemIfFieldNull:'@',
                    requestParams:'=?'//请求参数， 如：{auctionFlag:3}
                },
                restrict: 'E',
                replace: true,
                transclude: true,
                template: '<div><ks-auto-complete-kw tip="支持全拼、简拼搜索,空格分词" placeholder="供应商名称" column-infos="columnInfos"   url="url" ng-model="ngModel" select-only="true" selected-item="selectedItem" display-field="companyName" value-field="id" enable-multi="false" readonly="disabled" input-width="width"  disable-item="disableItem(row)"></ks-auto-complete-kw></div>',
                link: function (scope, element, attrs, ngModel) {

                    var me = scope;

                    me.$watch("selectedItem",function(newVal){
                        if(newVal.length > 0){
                            if(angular.isNumber(newVal[0].id)){
                                ngModel.$setViewValue(newVal[0].id);
                                me.checkedItem = newVal[0];
                            }
                            //me.onSelected();

                            me.onSelected({selectedItem: newVal[0]})
                        }else{
                            me.selectedItem = [];
                            me.checkedItem = null
                            ngModel.$setViewValue(null);
                        }
                    },true)

                    ngModel.$render = function(){
                        var value = ngModel.$viewValue;
                        if(value){
                            me.selectedItem = []
                            var url = window.webRoot+'/crm/buyers/'+value+'.do';
                            $http.get(url).success(function(data){
                                me.selectedItem.push(data);
                            });
                        }else{
                            me.selectedItem = [];
                        }
                    }


                    function initParams(){
                        var params = '';
                        if (!angular.isObject(me.requestParams)){
                            return params;
                        }
                        for (var key in me.requestParams) {
                            params += key + '=' + me.requestParams[key] + '&';
                        }

                        if(params.length > 0){
                            params = '?' + params.substring(0,params.length - 1);
                        }
                        return params;
                    }


                    $.extend(scope,{

                        columnInfos:[{field:'companyName',label:'供应商公司名称',width:'180'},
                            {field:'name',label:'供应商联系人',width:'100'},
                            {field:'phone',label:'供应商联系方式',width:'100'},
                            {field:'transOperatorNames',label:'采购员',width:'100'}],

                        url:window.webRoot+'/crm/crmcustomers/findSellersByKeyword.do' + initParams(),

                        selectedItem:[],

                        disableItem:function(row){
                            if(me.disableItemIfFieldNull){
                                return row[me.disableItemIfFieldNull] == null || row[me.disableItemIfFieldNull] === undefined
                            }
                            return false
                        }

                    },true);

                }

            }
        }]);
})();
