/**
 * ks 供应商选择组件
 * @author Wangyiqun
 * @date 2014-12-29
 */
(function () {
    angular.module('ks.supplierPicker', ['ks','ks.cache'])
        .directive('ksSupplierPicker', ["$compile",'ksCache','$http','k',function ($compile,ksCache,$http,k) {

            // 检测输入字符串的正则表达式特殊字符
            var regSpec = /\$|\(|\)|\*|\+|\.|\[|\]|\\|\^|\{|\}|\|/g;

            return {
                require: 'ngModel',
                scope: {
                    width:'@',
                    supplierCompanyName:'=?',
                    onSelected:"&",
                    validOnly:'@'
                },
                restrict: 'E',
                replace: true,
                transclude: true,
                templateUrl: window.webRoot+'/platform/resource/ks/pickers/tpl_ks_supplier_picker.html?version=' + window.version,
                link: function (scope, element, attrs, ngModel) {

                    if(scope.validOnly === undefined){
                        scope.validOnly = true;
                    }
                    var me = scope;

                    $.extend(scope,{

                        showTimes:0,

                        selectedSupplier:null,

                        showFields: ["companyName","name","phone","transOperatorNames"],

                        /**
                         * 控制变量
                         */
                        picker:{
                            visible:false
                        },

                        // 产品ajax查询url
                        SELECT_PRODUCT_MANY_URL:window.webRoot+'/crm/sellers/pickerex.do',

                        SELECT_PRODUCT_VALID_MANY_URL:window.webRoot+'/crm/sellers/valid.do',
                        SELECT_PRODUCT_ONE_URL:window.webRoot+'/crm/sellers/:id.do',

                        // 查询条件
                        qc:{},

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
                        	me.qc = {
                                
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

                            var realQc = angular.copy(me.qc);
                            for(var name in realQc){
                                realQc[name] = encodeURI(realQc[name]);
                            }


                            // 拼接完整参数，queryCondition 、分页等
                            var fullQc = angular.extend(realQc, {
                                start: me.pagination.start,
                                limit: me.pagination.limit
                            });

                            var url = me.validOnly ? me.SELECT_PRODUCT_VALID_MANY_URL : me.SELECT_PRODUCT_MANY_URL;

                            $http({url: url, params: fullQc, method: "GET"}).success(function (data) {
                                // 重新设置 results
                                me.pagination.results = data.results;
                                me.products = data.rows;
                            });
                        },

                        chooseProduct:function(supplier){
                            me.selectedSupplier = supplier;
                            ngModel.$setViewValue(supplier.id);
                            me.picker.visible = false;
                            me.supplierCompanyName = supplier.companyName
                            me.onSelected(supplier)
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

                        },

                        bindEvents:function(){

                            element.find(".ks-query-condition").on("keyup",function(e){
                                if(e.keyCode == 13){
                                    me.selectEntities();
                                }
                            })

                            element.find(".ks-query-condition").on("blur",function(e){
                                me.selectEntities();
                            })


                            // 点击删除按钮，清楚选中项，隐藏picker，ng-click中改变visible 不会隐藏，也无法调用$digest
                            me.clearBtn.on("click", function(){
                                me.selectedSupplier = null;
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
                                    me.selectedSupplier = null;
                                    return;
                                }
                                $http.get(me.SELECT_PRODUCT_ONE_URL.replace(':id',value)).success(function(data){
                                    me.selectedSupplier = data;
                                });
                            }



                        },

                        initSize:function(){
                            me.width = me.width || 160;
                            element.width(me.width);
                            me.showText.width(me.width - 25)
                        },

                        /**
                         * 显示picker
                         */
                        showPicker:function(){
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
                        showSelectedSupplier:function(){
                            if(!me.selectedSupplier){
                                return "";
                            }
                            var arr = [];
                            for (var i = 0; i < me.showFields.length; i++) {
                                var field = me.showFields[i];
                                arr.push(me.selectedSupplier[field] || '');
                            }
                            return arr.join(" | ");
                        }

                    },true);

                    scope.init();


                }

            }
        }]);
})();
