/**
 * ks 分页模块
 * @author Wangyiqun
 * @date 2014-12-29
 */
(function () {

    angular.module('ks.uploadPreviewPrice', ['ks'])
        .directive('ksUploadPreviewPrice', ["$compile",'ksTip','$filter',function ($compile,ksTip,$filter) {
            return {
                scope: {
                    //kuaisu or taosu
                    type:'@',
                    onClose:'&'
                },
                restrict: 'E',
                templateUrl:window.webRoot+ '/platform/resource/ks/price/tpl_ks_upload_preview_price.html?version=' + window.version,
                link: function ($scope, element, attrs, ngModel) {
                    var today = new Date();
                    var nextMonth = new Date();
                    nextMonth.setDate(nextMonth.getDate() + 30);
                    var me = $scope;
                    $.extend(me,{

                        upload_url:me.type == 'taosu'?window.webRoot+'/pdm/supplier_price/upload.do':window.webRoot+'/pdm/kuaisu_price/upload.do',
                        batch_update_url:me.type == 'taosu'?window.webRoot+'/pdm/supplier_price/batch_update.do':window.webRoot+'/pdm/kuaisu_price/batch_update.do',
                        preview_url:me.type == 'taosu' ?window.webRoot+'/pdm/supplier_price/preview.do':window.webRoot+'/pdm/kuaisu_price/preview.do',
                        entity:{

                        },

                        successItemNum:0,
                        errorItemNum:0,
                        // 预览模式
                        previewMode:false,

                        pricesInfo:null,
                        /**
                         * 默认发布日期
                         */
                        publishDate: $filter('date')(today, "yyyy-MM-dd"),

                        /**
                         * 默认过期日期
                         */
                        expireDate: $filter('date')(nextMonth, "yyyy-MM-dd"),

                        /**
                         * 默认文件名为空
                         */
                        fileName: "",

                        /**
                         * 默认文件大小
                         */
                        fileSize: 0,

                        /**
                         * ready后执行
                         */
                        init: function () {
                            $scope.today();
                            $scope.toggleMin();

                        },


                        /**
                         * 更新发布日期为今天
                         */
                        updatePublishDate: function () {
                            $scope.publishDate = $filter('date')(new Date(), "yyyy-MM-dd");
                        },

                        today: function () {
                            $scope.dt = new Date();
                        },

                        // 窗口关闭
                        dismiss: function () {
                            //$scope.$dismiss();
                        },

                        /**
                         * 清空日期
                         */
                        clear: function () {
                            $scope.dt = null;
                        },

                        toggleMin: function () {
                            $scope.minDate = $scope.minDate ? null : new Date();
                        },

                        /**
                         *
                         * 打开公布日期时间选择窗口
                         * @param $event
                         */
                        openPublishDateStart: function ($event) {
                            $event.preventDefault();
                            $event.stopPropagation();
                            $scope.publishStartOpened = true;
                        },

                        /**
                         * 时间跨度下拉列表选择后更新失效时间
                         */
                        updateExpireDate: function () {
                            var oldDate = new Date();
                            oldDate.setDate(oldDate.getDate() + ($scope.daysAfter - 0));
                            $scope.expireDate = $filter("date")(oldDate, 'yyyy-MM-dd');
                        },

                        /**
                         * 打开失效日期时间选择窗口
                         * @param $event
                         */
                        openPublishDateEnd: function ($event) {
                            $event.preventDefault();
                            $event.stopPropagation();

                            $scope.publishEndOpened = true;
                        },


                        saveAll:function(){
                            var data = angular.copy(me.prices);
                            for (var i = 0; i < data.length; i++) {
                                var price = data[i];
                                delete price.errors;
                                delete price.modifies;
                                price.priceString = price.price;
                                price.weightString = price.weight;
                                if(!price.warehouseName){
                                    delete warehouseId;
                                }
                            }

                            var publishDate = $filter('date')(me.pricesInfo.uploadPrice.publishDate, "yyyy-MM-dd");
                            var expireDate = $filter('date')(me.pricesInfo.uploadPrice.expireDate, "yyyy-MM-dd");
                            $("#ksUploadPreviewPrices").val(JSON.stringify(data));
                            $("#ksUploadPreviewSupplierId").val(me.pricesInfo.uploadPrice.supplierId);
                            $("#ksUploadPreviewPublishDate").val(publishDate);
                            $("#ksUploadPreviewExpireDate").val(expireDate);

                            $("#bacthFrom").ajaxSubmit({
                                url: me.batch_update_url,
                                type: 'post',
                                dataType: 'json',
                                success: function (data) {
                                    if(data){
                                        me.pricesInfo = data;
                                        me.prices = data.prices;
                                        me.$digest();
                                    }else{
                                        $('#resultDialog .content').html(data.errorMessage);
                                        $('#resultDialog').show();
                                    }
                                }
                            });
                        },

                        dismiss:function(){

                            if($scope.onClose && angular.isFunction($scope.onClose)){
                                $scope.onClose.call();
                            }
                        },

                        /**
                         */
                        preview: function (form) {

                            var result = $scope.validateForm(form);
                            if(result === false){
                                return false;
                            }

                            $scope.previewMode = true;

                            $("#fimrUploadForm").ajaxSubmit({
                                url: me.preview_url,
                                type: 'post',
                                dataType: 'json',
                                data:{supplierId:$scope.supplierId,publishDate:$scope.publishDate,expireDate:$scope.expireDate},
                                success: function (data) {
                                    if(data){
                                        me.pricesInfo = data;
                                        me.prices = data.prices;
                                        me.$digest();
                                    }else{
                                        $('#resultDialog .content').html(data.errorMessage);
                                        $('#resultDialog').show();
                                    }
                                }
                            });
                        },

                        validateForm:function(){
                            if ($scope.overSizeError || $scope.typeError) {
                                ksTip.alert("文件大小超过限制或者类型错误");
                                return false;
                            }

                            if ($scope.fileSize < 1) {
                                ksTip.alert("请先上传文件");
                                return false;
                            }

                            //  保存的时候丢弃updatedAt和createdAt
                            if ( $scope.supplierId) {
                                $("#uploadSupplierId").val($scope.supplierId);
                            } else {
                                ksTip.alert("供应商不能为空");
                                return false;
                            }

                            if (!$scope.publishDate) {
                                ksTip.alert("发布日期不能为空");
                                return false;
                            }

                            if (!$scope.expireDate) {
                                ksTip.alert("失效日期不能为空");
                                return false;
                            }
                            return true;
                        },

                        /**
                         * 上传文件
                         * @param form
                         * @returns {boolean}
                         */
                        upload: function (form) {

                            var result = $scope.validateForm(form);
                            if(result === false){
                                return false;
                            }
                            $scope.previewMode = true;
                            /*
                             $("#fimrUploadForm")[0].target = "hidden_frame";
                             $("#fimrUploadForm")[0].action = window.webRoot+'/pdm/supplier_price/upload.do';
                             $("#fimrUploadForm").submit();
                             */

                            $("#fimrUploadForm").ajaxSubmit({
                                url: me.upload_url,
                                type: 'post',
                                dataType: 'json',
                                data:{supplierId:$scope.supplierId,publishDate:$scope.publishDate,expireDate:$scope.expireDate},
                                success: function (data) {
                                    $scope.previewMode = true;
                                    if(data){
                                        me.pricesInfo = data;
                                        me.prices = data.prices;
                                        me.$digest();
                                    }else{
                                        $('#resultDialog .content').html(data.errorMessage);
                                        $('#resultDialog').show();
                                    }
                                }
                            });
                        }


                    },true);

                    me.init();

                }
            }
        }]);
})();