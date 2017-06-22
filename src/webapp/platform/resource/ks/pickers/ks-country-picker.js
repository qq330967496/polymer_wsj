/**
 * ks 分页模块
 * @author Wangyiqun
 * @date 2014-12-29
 */
(function () {
    angular.module('ks.countryPicker', ['ks','ks.cache'])
        .directive('ksCountryPicker', ["$compile",'ksCache',function ($compile,ksCache) {

            var matchItem = function(items, val){
                if(!items || !val){
                    return null;
                }
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    if(item.countryCode == val){
                        return item;
                    }
                }

                return null;
            }
            return {
                require: 'ngModel',
                scope: {
                    readonly:'=',
                    selectedItem:'=?'
                },
                restrict: 'E',
                template: '<ks-auto-complete label-field="nameCn" onSelected="onSelected()" readonly="readonly"  value-field="countryCode" selected-item="selectedItem" items="countries" ng-model="ngModel"></ks-auto-complete>',
                link: function (scope, element, attrs, ngModel) {


                    ngModel.$render = function(){
                        var value = ngModel.$viewValue;
                        promise.then(function(){
                            scope.selectedItem = matchItem(scope.countries,value);
                        });

                    }

                    scope.$watch("selectedItem",function(){
                        var val = null;
                        if(scope.selectedItem){
                            val = scope.selectedItem.countryCode;
                        }
                        ngModel.$setViewValue(val);
                    })


                    var promise = ksCache.get("countries", window.webRoot+"/pdm/countries/all.do").then(function(data){
                        scope.countries = data;
                    });



                }
            }
        }]);
})();