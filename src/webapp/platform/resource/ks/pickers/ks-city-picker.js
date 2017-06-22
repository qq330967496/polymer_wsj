/**
 * ks 分页模块
 * @author Wangyiqun
 * @date 2014-12-29
 */
(function () {
    angular.module('ks.cityPicker', ['ks','ks.cache'])
        .directive('ksCityPicker', ["$compile",'ksCache',function ($compile,ksCache) {

            var matchItem = function(cities, val){
                if(!cities || !val){
                    return null;
                }
                for (var i = 0; i < cities.length; i++) {
                    var city = cities[i];
                    if(city.cityCode == val){
                        return city;
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
                template: '<ks-auto-complete label-field="name" onSelected="onSelected()" readonly="readonly" width="90"  value-field="cityCode" selected-item="selectedItem" items="cities" ng-model="ngModel"></ks-auto-complete>',
                link: function (scope, element, attrs, ngModel) {

                    var promise = ksCache.get("cities", window.webRoot+"/pdm/cities/all.do").then(function(data){
                        scope.cities = data;
                    });

                    ngModel.$render = function(){
                        var value = ngModel.$viewValue;
                        promise.then(function(data){
                            scope.selectedItem = matchItem(scope.cities,value);
                        })
                    }

                    scope.$watch("selectedItem",function(){
                        var val = null;
                        if(scope.selectedItem){
                            val = scope.selectedItem.cityCode;
                        }
                        ngModel.$setViewValue(val);
                    })






                }
            }
        }]);
})();