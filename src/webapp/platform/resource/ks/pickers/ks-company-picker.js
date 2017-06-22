/**
 * ks 公司选择组件
 */
(function () {
    angular.module('ks.companyPicker', ['ks','ks.cache'])
        .directive('ksCompanyPicker', ["$compile",'ksCache','$http',function ($compile,ksCache,$http) {

            return {
                require: '?ngModel',
                scope: {
                    width:'@',
                    companyId:'=?',
                    onSelected:"&"
                },
                restrict: 'E',
                replace: true,
                templateUrl: window.webRoot+'/platform/resource/ks/pickers/tpl_ks_company_picker.html?version=' + window.version,
                link: function (scope, element, attrs, ngModel) {
                    var me = scope;
                    scope.$watch("companyId",function(val){
                        if(val){
                            me.fillBack();
                        }
                    })
                    $.extend(scope,{

                        showTimes:0,

                        selectedCompany:null,

                        showFields: ["name","phone","verified"],

                        /**
                         * 控制变量
                         */
                        picker:{
                            visible:false
                        },

                        // 公司ajax查询url
                        SELECT_COMPANY_MANY_URL:window.webRoot+'/crm/crmcustomers/simpleCompanies.do',
                        SELECT_COMPANY_ONE_URL:window.webRoot+'/crm/crmcustomers/selectCompanyById/:id.do',
                        // 查询条件
                        sc:{verified:-1},

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
                         * 查询数据
                         * @param resetPaging true 表示重置页码为0
                         */
                        selectEntities: function (resetPaging) {

                            if (resetPaging) {
                                me.pagination.start = 0;
                            }

                            var realSc = angular.copy(me.sc);
                            //for(var name in realSc){
                            //    realSc[name] = encodeURI(realSc[name]);
                            //}

                            // 拼接完整参数，queryCondition 、分页等
                            var fullSc = angular.extend(realSc, {
                                start: me.pagination.start,
                                limit: me.pagination.limit
                            });
                            if(!fullSc.verified && fullSc.verified!=0 || fullSc.verified==-1){
                                delete  fullSc.verified
                            }
                            $http({url: me.SELECT_COMPANY_MANY_URL, params: fullSc, method: "GET"}).success(function (data) {
                                // 重新设置 results
                                me.pagination.results = data.results;
                                me.companies = data.rows;
                            });
                        },

                        chooseCompany:function(company){
                            me.selectedCompany = company;
                            if(ngModel){
                                ngModel.$setViewValue(company);
                            }
                            me.companyId=company.id
                            me.picker.visible = false;
                            me.onSelected(company)
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

                            // 点击删除按钮，清楚选中项，隐藏picker，ng-click中改变visible 不会隐藏，也无法调用$digest
                            me.clearBtn.on("click", function(){
                                me.selectedCompany = null;
                                if(ngModel){
                                    ngModel.$setViewValue(null);
                                }
                                me.companyId=null
                                me.entity=null
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
                        //回填
                        fillBack: function(){
                            var value = me.companyId;
                            if(!value){
                                me.selectedCompany = null;
                                return;
                            }
                            $http.get(me.SELECT_COMPANY_ONE_URL.replace(':id',value)).success(function(data){
                                me.selectedCompany = data;
                            });
                        }
                    },true);

                    scope.init();

                }

            }
        }]);
})();
