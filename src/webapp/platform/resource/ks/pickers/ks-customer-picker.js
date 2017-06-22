/**
 * ks 客户选择组件
 */
(function () {
    angular.module('ks.customerPicker', ['ks','ks.cache'])
        .directive('ksCustomerPicker', ["$compile",'ksCache','$http','k',function ($compile,ksCache,$http,k) {

            // 检测输入字符串的正则表达式特殊字符
            var regSpec = /\$|\(|\)|\*|\+|\.|\[|\]|\\|\^|\{|\}|\|/g;

            return {
                require: 'ngModel',
                scope: {
                    width:'@',
                    customerCompanyName:'=?',
                    onSelected:"&",
                    disabled:'=?'
                },
                restrict: 'E',
                replace: true,
                transclude: true,
                templateUrl: window.webRoot+'/platform/resource/ks/pickers/tpl_ks_customer_picker.html?version=' + window.version,
                link: function (scope, element, attrs, ngModel) {
                    var me = scope;

                    $.extend(scope,{

                        showTimes:0,

                        selectedCustomer:null,

                        showFields: ["name","phone","buyerLevel","companyName","salesOperatorNames"],

                        /**
                         * 控制变量
                         */
                        picker:{
                            visible:false
                        },

                        // 产品ajax查询url
                        SELECT_CUSTOMERS_MANY_URL:window.webRoot+'/crm/buyers/picker.do?buyerStatus=2',
                        SELECT_CUSTOMERS_ONE_URL:window.webRoot+'/crm/buyers/:id.do',

                        // 查询条件
                        sc:{},

                        /**
                         * 分页
                         */
                        pagination: {
                            start: 0,
                            pageSize: 0,
                            limit: 15,
                            results: 0,
                            pageIndex: 0
                        },

                        /**
                         * 重置表单
                         */
                        resetForm: function () {
                        	me.sc = {
                                
                            };
                        	me.selectEntities(true);
                        },
                        
                        /**
                         * 查询数据
                         * @param resetPaging true 表示重置页码为0
                         */
                        selectEntities: function (resetPaging) {

                            if (resetPaging) {
                                me.pagination.start = 0;
                            }

                            var realSc = angular.copy(me.sc);
                            for(var name in realSc){
                                realSc[name] = encodeURI(realSc[name]);
                            }

                            // 拼接完整参数，queryCondition 、分页等
                            var fullSc = angular.extend(realSc, {
                                start: me.pagination.start,
                                limit: me.pagination.limit
                            });
                            if(!fullSc.rate){
                                fullSc.rate=-1;
                            }
                            if(!fullSc.status){
                                fullSc.status=-1;
                            }if(!fullSc.bizManName){
                                fullSc.bizManName=null;
                            }

                            if(fullSc.staffId == null || fullSc.staffId == 'null'){
                                fullSc.staffId=-1;
                            }
                            
                            $http({url: me.SELECT_CUSTOMERS_MANY_URL, params: fullSc, method: "GET"}).success(function (data) {
                                // 重新设置 results
                                me.pagination.results = data.results;
                                me.customers = data.rows;
                            });
                        },

                        chooseCustomer:function(customer){
                            me.selectedCustomer = customer;
                            ngModel.$setViewValue(customer.id);
                            me.picker.visible = false;
                            me.customerCompanyName = customer.companyName;
                            me.onSelected(customer)
                        },

                        /**
                         * 初始化调用
                         */
                        init:function(){
                            // 初始化尺寸
                            me.initVars();
                            me.initSize();
                            me.bindEvents();
                        },

                        initVars:function(){

                            me.clearBtn = element.find(".clear-btn");
                            me.showText = element.find(".ks-ac-show-text");
                            me.$picker = element.find(".ks-product-picker");

                        },

                        bindEvents:function(){

                            // 点击删除按钮，清楚选中项，隐藏picker，ng-click中改变visible 不会隐藏，也无法调用$digest
                            me.clearBtn.on("click", function(){
                                me.selectedCustomer = null;
                                ngModel.$setViewValue(null);
                            })

                            // 点击组件区域外的地方，因此picker
                            $(document.body).on("click", function (e) {

                                if($(e.target).hasClass("clear-btn")){
                                    scope.picker.visible = false;
                                    scope.$digest();
                                    return;
                                }

                                if($(e.target).hasClass("ks-product-picker-choose-btn")){
                                    scope.picker.visible = false;
                                    scope.$digest();
                                    return;
                                }
                                if ($(e.target).closest(".ks-product-picker-wrap").size() < 1) {
                                    scope.picker.visible = false;
                                    scope.$digest();
                                }
                            });


                            ngModel.$render = function(){
                                var value = ngModel.$viewValue;
                                if(!value){
                                    me.selectedCustomer = null;
                                    return;
                                }
                                $http.get(me.SELECT_CUSTOMERS_ONE_URL.replace(':id',value)).success(function(data){
                                    me.selectedCustomer = data;
                                });
                            }



                        },

                        initSize:function(){
                            me.width = me.width || 140;
                            element.width(me.width);
                            me.showText.width(me.width - 25)
                        },

                        /**
                         * 显示picker
                         */
                        showPicker:function(){
                            if(scope.disabled){
                                return ;
                            }
                            me.picker.visible = true;

                            // 第一次显示的时候做一次查询
                            if(me.showTimes == 0){
                                me.selectEntities(true);
                                me.showTimes++;
                            }

                        },

                        /**
                         * 分页服务暴露的事件，分页切换，第一页、下一页等。
                         * @param pagination
                         */
                        onSelectPageHandler: function (pagination) {
                            me.pagination.start = pagination.start;
                            me.selectEntities(false);
                        },


                        /**
                         * 显示选中产品
                         */
                        showSelectedCustomer:function(){
                            if(!me.selectedCustomer){
                                return "";
                            }
                            var arr = [];
                            for (var i = 0; i < me.showFields.length; i++) {
                                var field = me.showFields[i];
                                arr.push(me.selectedCustomer[field] || '');
                            }
                            return arr.join(" | ");
                        }

                    },true);

                    scope.init();


                }

            }
        }]);
})();
