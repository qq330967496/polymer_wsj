/**
 * ks 公司选择组件
 */
(function () {
    angular.module('ks.companyKwPicker', ['ks', 'ks.cache'])
        .directive('ksCompanyKwPicker', ["$compile", 'ksCache', '$http', function ($compile, ksCache, $http) {

            return {
                require: '?ngModel',
                scope: {
                    selectedItem:'=?',
                    width: '@',
                    onSelected:'&',
                    readonly:'=?',
                    type:'@' //1 采购商 , 2 供应商 , 3 所有
                },
                restrict: 'E',
                replace: true,
                template: '<div style="display: inline-block"><ks-auto-complete-kw tip="支持全拼、简拼搜索,空格分词" input-width="width" ng-model="ngModel" column-infos="columnInfos" display-field="name" selected-item="selectedItem" url="url" placeholder="{{placeholder}}" select-only="true" value-field="id" readonly="readonly"></ks-auto-complete-kw></div>',

                link: function (scope, element, attrs, ngModel) {


                    var me = scope;

                    me.$watch("selectedItem",function(newVal){
                        if(newVal.length > 0){
                            me.onSelected({selectedItem: newVal[0]})
                            ngModel.$setViewValue(newVal[0].id);
                        }else{
                            me.selectedItem = [];
                            ngModel.$setViewValue(null);
                        }
                    },true)

                    ngModel.$render = function(){
                        var value = ngModel.$viewValue;
                        if(value){
                            var url = window.webRoot+'/crm/findCompanyById/'+value+'.do';
                            $http.get(url).success(function(data){
                                data.customerName = data.name;
                                me.selectedItem.push(data);
                            });
                        }else{
                            me.selectedItem = [];
                        }
                    }


                    function isPurchase(){
                        if(me.type == 1){
                            return '采购商'
                        }else if(me.type == 2){
                            return '供应商'
                        }else{
                            return '所有公司'
                        }
                    }


                    $.extend(scope,{

                        columnInfos:[{field:'name',label:'公司名称',width:'180'},
                            {field:'phone',label:'联系方式',width:'120'},
                            {field:'customerName',label:'联系人',width:'100'},
                            {field:'staffName',label:'交易员',width:'100'}],

                        url:window.webRoot+'/crm/crmcustomersnew/findCompaniesByKeyword.do?type='+(me.type == null ? 2 : me.type),

                        selectedItem:[],

                        placeholder:isPurchase()

                    },true);


                }

            }
        }]);
})();
