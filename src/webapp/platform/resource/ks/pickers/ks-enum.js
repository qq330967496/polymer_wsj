/**
 * ks 枚举指令
 * @author houwl
 * @date 2015.4.21
 */
(function () {
    angular.module('ks.enum', ['ks','ks.cache'])
        .directive('ksEnum',['$http','ksCache',function ($http,ksCache) {
            return {
                require: '?ngModel',
                scope: {
                    ngModel:"=?",
                    code: '@', //默认为value
                    label: '@',//默认为 label
                    options:'@',//静态数据选项
                    defOption:'@',//默认值（用于枚举的label）
                    readonly:'=',//true 用于枚举的label，表示仅显示枚举对应的label值，否则为下拉框
                    width:'@',//标签宽度
                    url:'@',//查询数据的路径，
                    blankOption:'@'//是否使用空选项
                },
                restrict: 'E',
                replace: true,
                templateUrl: window.webRoot+'/platform/resource/ks/pickers/tpl-ks-enum.html?version=' + window.version,
                link: function (scope, element, attrs, ngModel) {
                    var me = scope
                    if(!me.code) {
                        me.code="value"
                    }
                    if(!me.label) {
                        me.label="label"
                    }
                    me.loaded=false

                    scope.$watch("options",function(value){
                        if(!me.url && value && !me.loaded){
                            me.loaded=true
                            me.options=JSON.parse(value)
                            if(me.blankOption){
                                var blackEntity={}
                                blackEntity[me.code]=-1
                                if(me.readonly){
                                    blackEntity[me.label]=''
                                }else{
                                    blackEntity[me.label]='===请选择==='
                                }
                                me.options.unshift(blackEntity)
                            }
                            me.translateEnum(ngModel.$viewValue)
                        }
                    })
                    scope.$watch("url",function(url){
                        if(!url){
                            return
                        }
                        ksCache.get(url, url).then(function (data) {
                            me.options=data
                            if(me.blankOption){
                                var blackEntity={}
                                blackEntity[me.code]=-1
                                if(me.readonly){
                                    blackEntity[me.label]=''
                                }else{
                                    blackEntity[me.label]='===请选择==='
                                }
                                me.options.unshift(blackEntity)
                            }
                            me.translateEnum(ngModel.$viewValue)
                        });
                    })
                    $.extend(me, {
                        onSelect:function(){
                            ngModel.$setViewValue(me.selectedValue);
                        },
                        /**
                         * 初始化调用
                         */
                        init:function(){
                            me.bindEvents();
                            me.resize();
                        },
                        bindEvents:function(){
                            me.enumPane=element.find(".ks-enum-item")
                            me.enumLabel=element.find(".ks-enum-label")
                            me.enumSelect=element.find(".ks-enum-select")
                        },
                        resize:function(){
                            if(me.width){
                                element.width(me.width);
                            }
                        },
                        translateEnum:function(value){
                            //默认选项
                            if(!value && value!=0 && !me.defOption && me.blankOption){
                                //me.onSelect(me.options[0])
                                me.selectedItem=me.options[0];
                                me.selectedValue=value;
                                return
                            }
                            if(!value && value!=0 && me.defOption){
                                me.selectedItem=me.defOption;
                                me.selectedValue=me.defOption[me.code];
                                //枚举label可以自定义文字颜色
                                if(me.readonly && me.selectedItem.color){
                                    element.find(".ks-enum-label").css('color',me.selectedItem.color);
                                }
                                return
                            }else if(!value && value!=0){
                                return
                            }
                            for(var i = 0; i < me.options.length; i++){
                                if(me.options[i][me.code]==value){
                                    me.selectedItem=me.options[i];
                                    me.selectedValue=me.options[i][me.code];
                                    if(me.readonly && me.selectedItem.color){
                                        element.find(".ks-enum-label").css('color',me.selectedItem.color);
                                    }
                                    return
                                }
                            }
                        }
                    })
                    ngModel.$render = function(){
                        var value = ngModel.$viewValue;
                        me.translateEnum(value);
                    }
                    me.init();
                }

            }
        }]);
})();