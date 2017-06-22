/**
 * ks 分页模块
 * @author Wangyiqun
 * @date 2014-12-29
 */
(function () {
    angular.module('ks.manufacturerPicker', ['ks','ks.cache'])
        .directive('ksManufacturerPicker', ["$compile",'ksCache',function ($compile,ksCache) {

            var matchItem = function(items, val){
                if(!items || !val){
                    return null;
                }
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    if(item.id == val){
                        return item;
                    }
                }

                return null;
            }
            return {
                require: 'ngModel',
                scope: {
                    width:'@',
                    readonly:'=',
                    selectedLabel:'=',
                    editable:'=',
                    selectedItem:'=?'
                },
                restrict: 'E',
                template: '<ks-auto-complete label-field="name" width="{{width}}" editable="editable" onSelected="onSelected()" selected-label="selectedLabel" readonly="readonly"   value-field="id" selected-item="selectedItem" items="manufacturers" ng-model="ngModel"></ks-auto-complete>',
                link: function (scope, element, attrs, ngModel) {


                    ngModel.$render = function(){
                        var value = ngModel.$viewValue;
                        promise.then(function(){
                            scope.selectedItem = matchItem(scope.manufacturers,value);
                        })

                    }

                    scope.$watch("selectedItem",function(){
                        var val = null;
                        if(scope.selectedItem){
                            val = scope.selectedItem.id;
                        }
                        ngModel.$setViewValue(val);
                    })


                    var promise = ksCache.get("manufacturers", window.webRoot+"/pdm/manufacturers/all.do").then(function(data){
                        scope.manufacturers = data;
                    });



                }
            }
        }]);
})();