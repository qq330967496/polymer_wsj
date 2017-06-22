/**
 * Created by jarek.li on 2015/4/28.
 * var config = {}
 * <line-chart height="..."
 *      data-url="......"
 *      data-paras="json"
 *      x-axis="...."
 *      y-axis="....">
 *
 *
 */
(function () {
    angular.module('ks.chartsLine', ['ks', 'ks.entityService'])
        .directive('ksChartsLine', ['ksEntityService', 'ksTip', function (ksEntityService, ksTip) {
            return {
                restrict: 'EA',
                transclude: true,
                replace: true,
                scope: {
                    height: '@', //组件高度
                    //selfParam: '@', //组件自身的参数列表
                    path: '@', //动态数据请求路径
                    data: '=', //静态数据
                    externalParam: '=', //外部参数
                    config: '=',//图表配置
                    chartId: '@'//图表divID
                },
                link: function (scope, element, attrs, ngModelCtrl) {
                },
                controller: function (ksTip, $scope, $element) {
                    var myConfig = {};
                    var me = $scope;
                    var echarts;
                    me.selectLegend = [];
                    require(['echarts', 'echarts/chart/line'], function (ec) {
                        echarts = ec;
                    });
                    var myCharts;
                    /**
                     *  弹出指标选择框
                     */
                    me.popupDiv = function popupDiv() {
                        var select_btn = $($element[0].getElementsByClassName("select-btn")[0]);
                        var top = select_btn.offset().top + select_btn.outerHeight() + 5;
                        var left = select_btn.offset().left;
                        var div_obj = $($element[0].getElementsByClassName("pop-box")[0]);
                        me.legendData=myConfig.legend.data;
                        me.selectLegend = getCurrentSelected();
                        div_obj.css({
                            "position": "absolute"
                        }).animate({
                            left: left,
                            top: top,
                            opacity: "show"
                        }, "slow");
                    };

                    /**
                     * 获取当前选定的曲线
                     * @returns {Array}
                     */
                    function getCurrentSelected(){
                        var currSelected = myConfig.legend.selected;
                        var arr = [];
                        var i = 0;
                        for(var s in currSelected){
                            arr[i++]=currSelected[s];
                        }
                        return arr;
                    }

                    /**
                     * 关闭选择框
                     */
                    me.hideDiv = function hideDiv() {
                        var div_obj = $($element[0].getElementsByClassName("pop-box")[0]);
                        div_obj.animate({
                            left: 0,
                            top: 0,
                            opacity: "hide"
                        }, "slow");
                    };

                    /**
                     * 获取一个boolean数组
                     * @param length
                     * @returns {Array}
                     */
                    function initArray(length){
                        var arr = new Array(length);
                        for(var i = 0; i<length;i++){
                            arr[i]=false;
                        }
                        return arr;
                    }

                    /**
                     * 清楚选中
                     */
                    me.clearSeries = function clearSeries(){
                        me.selectLegend=initArray(myConfig.legend.data.length);
                    }

                    /**
                     * 重置图表曲线的显示规则
                     */
                    me.resetSeries = function resetSeries(){
                        var s = myConfig.yAxisFields;
                        var sl = me.selectLegend;
                        var l ={};
                        var j = 0;//被选择曲线的条数
                        for(var i = 0;i< s.length;i++){
                            l[s[i].title] = sl[i];
                            if(sl[i]){
                                j++;
                            }
                        }
                        if(j==0){
                            ksTip.error("请至少选择一条要展示的曲线!");
                        }else{
                            myConfig.legend.selected=l;
                            setChartsData(myCharts,myConfig);
                        }
                        me.hideDiv();//关闭选择框
                    };



                    var defaultConfig = {
                        title: {
                            text: 'Default Title',
                            subtext: 'Sub Default Title'
                        },
                        tooltip: {
                            trigger: 'item'
                            //trigger: 'axis'
                        },
                        xAxis: [{
                            type: 'category',
                            boundaryGap: false
                        }],
                        yAxis: [{
                            type: 'value',
                            name: '数量',
                            axisLabel: {
                                formatter: '{value}'
                            }
                        }]
                    };
                    var makeChartData = function makeChartData(datas, config) {
                        var myOption = {};
                        if (datas && datas.length > 0 && config) {
                            datas = disposeData(datas, config);
                            myOption.title = makeChartTitle(config);
                            myOption.tooltip = makeTooltip(config);
                            myOption.legend = config.legend;
                            myOption.xAxis = makeChartXAxis(datas, config);
                            myOption.yAxis = makeChartYAxis(config);
                            myOption.series = makeSeries(datas, config);
                            makeChartDataZoom(myOption, config);
                            return myOption;
                        } else {
                            return null;
                        }
                    };

                    /**
                     * 处理chart的数据缩放轴
                     * @param option
                     * @param config
                     */
                    var makeChartDataZoom = function makeChartDataZoom(option, config) {
                        if (config.dataZoom) {
                            option.dataZoom = config.dataZoom;
                        }
                    };

                    /**
                     * 处理config将它组装成为Echart能识别的对象
                     * @param config
                     */
                    var disposeConfig = function disposeConfig(config) {
                        var myConfig = config;
                        var yAxisFields = myConfig.yAxisFields;
                        var yAxisField = [];
                        var legend = {};
                        var legendSelected = {};
                        var legendData = [];
                        var increaseField = [];
                        var j = 0;
                        for (var i = 0; i < yAxisFields.length; i++) {
                            yAxisField[i] = yAxisFields[i]['fieldName'];
                            legendData[i] = yAxisFields[i]['title'];
                            legendSelected[yAxisFields[i]['title']] = yAxisFields[i]['selected'];
                            if (yAxisFields[i]['isIncrease']) {
                                increaseField[j++] = yAxisFields[i]['fieldName'];
                            }
                        }
                        myConfig.yAxisField = yAxisField;
                        legend.selected = legendSelected;
                        legend.data = legendData;
                        myConfig.legend = legend;
                        myConfig.increaseField = increaseField;
                        return myConfig;

                    };

                    var disposeData = function disposeData(datas, config) {
                        var increaseField = config.increaseField;//数据需要累加的行
                        if (increaseField && increaseField.length > 0 && datas.length > 0) {
                            for (var i = 0; i < increaseField.length; i++) {
                                var field = increaseField[i];
                                var sum = 0;
                                for (var j = 0; j < datas.length; j++) {
                                    var dataItem = datas[j];
                                    for (var p in dataItem) {
                                        if (p == field) {
                                            if (!dataItem[p]) {
                                                dataItem[p] = 0;
                                            }
                                            sum = sum + (+dataItem[p]);
                                            dataItem[p] = parseFloat(sum.toFixed(2));
                                        }
                                    }
                                }
                            }
                        }
                        return datas;

                    };

                    var makeTooltip = function makeTooltip(config) {
                        if (config.tooltip) {
                            return config.tooltip;
                        } else {
                            if (config.xAxis && (config.xAxis[0].type == 'time')) {
                                var formatter = function (params) {
                                    var value = params.value;
                                    if (!value.length) {
                                        return params.name + ' :<br/>' + params.value;
                                    } else if (value && value.length == 2) {
                                        var date = new Date(params.value[0]);
                                        var data = date.getHours() + ':' + date.getMinutes();
                                        return data + '<br/>' + params.value[1];
                                    }
                                };
                                var tooltip = {
                                    trigger: 'item',
                                    formatter: formatter
                                };
                                return tooltip;
                            }
                            return defaultConfig.tooltip;
                        }
                    };

                    var makeChartTitle = function makeChartTitle(config) {
                        if (config.title) {
                            return config.title;
                        } else {
                            return defaultConfig.title;
                        }
                    };

                    var makeChartXAxis = function makeChartXAxis(datas, config) {
                        var xAxis = [];
                        if (config.xAxis) {
                            xAxis = config.xAxis;
                        } else {
                            xAxis = defaultConfig.xAxis;
                        }
                        if (!(config.xAxis[0].type == 'time')) {
                            var xData = [];
                            if (datas && config.xAxisField) {
                                for (var i = 0; i < datas.length; i++) {
                                    xData[i] = getValueByObjFieldName(datas[i], config.xAxisField);
                                }
                            }
                            xAxis[0].data = xData;
                        } else {
                            var sd = new Date();
                            //sd.setDate(18);
                            sd.setHours(8);
                            sd.setMinutes(0);
                            sd.setSeconds(0);
                            var ed = new Date();
                            //ed.setDate(18);
                            ed.setHours(20);
                            ed.setMinutes(0);
                            ed.setSeconds(0);
                            xAxis[0].min = sd.getTime();
                            xAxis[0].max = ed.getTime();
                        }
                        return xAxis;
                    };

                    var makeChartYAxis = function makeChartYAxis(config) {
                        var yAxis = [];
                        if (config.yAxis) {
                            yAxis = config.yAxis;
                        } else {
                            yAxis = defaultConfig.yAxis;
                        }
                        return yAxis;
                    };

                    var makeSeries = function makeSeries(datas, config) {
                        var series = [];
                        var yAxisField = config.yAxisField;
                        if (datas) {
                            for (var i = 0; i < yAxisField.length; i++) {
                                var dataItem = datas;
                                var sItem = {};
                                sItem.type = 'line';
                                sItem.name = config.legend.data[i];
                                var sData = [];
                                for (var j = 0; j < dataItem.length; j++) {
                                    if (config.xAxis && config.xAxis[0].type == 'time') {
                                        sData[j] = [new Date(dataItem[j][config.xAxisField]), getValueByObjFieldName(dataItem[j], yAxisField[i])];
                                    } else {
                                        sData[j] = getValueByObjFieldName(dataItem[j], yAxisField[i]);
                                    }
                                }
                                sItem.data = sData;
                                sItem.markPoint = {
                                    data: [{
                                        type: 'max',
                                        name: '最大值'
                                    }, {
                                        type: 'min',
                                        name: '最小值'
                                    }]
                                };
                                sItem.showAllSymbol = true;
                                sItem.symbolSize = function (value) {
                                    return 1;
                                },
                                    series[i] = sItem;
                            }
                        }
                        return series;

                    };

                    var getValueByObjFieldName = function getValueByObjFieldName(obj, filed) {
                        for (var p in obj) {
                            if (p == filed) {
                                if (obj[p]) {
                                    return +obj[p];
                                }
                                return 0;
                            }
                        }
                        return '';
                    };
                    /**
                     * 查询图表数据
                     */
                    me.queryData = function queryData(isManual) {
                        var elem = $element[0].getElementsByClassName("chart-area")[0];
                        if (!myCharts) {
                            myCharts = echarts.init(elem, 'macarons');
                        }
                        var datas = me.data;
                        //处理config将它组装成为Echart能识别的对象
                        myConfig = disposeConfig(me.config);

                        if (datas) {
                            myCharts.clear();
                            myCharts.setOption(makeChartData(datas, myConfig));
                        } else if (me.path) {
                            if (myConfig.delayTime && !isManual) {//定时刷新
                                var time = myConfig.delayTime * 1000;
                                setInterval(function () {
                                    $scope.$apply(setChartsData(myCharts, myConfig));
                                }, time);
                            }
                            setChartsData(myCharts, myConfig);
                        }
                    };
                    /**
                     * 给图表设置数据
                     */
                    var setChartsData = function setChartsData(myCharts,config){
                        ksEntityService.get(window.webRoot + me.path, {}).success(function (data, status, headers) {
                            console.log("execute query");
                            myCharts.clear();
                            var myOption = makeChartData(data, config);
                            if (myOption) {
                                myCharts.setOption(myOption);
                            } else {
                                myCharts.showLoading({
                                    text : '暂无数据',
                                    effect : 'whirling',
                                    textStyle : {
                                        fontSize : 30
                                    }
                                });
                            }

                        });
                    }
                },
                templateUrl: window.webRoot + '/platform/resource/ks/charts/ks-charts-line.html?version=' + window.version
            };
        }
        ]).controller('SomeController', function ($scope) {
            $scope.title = '哟西';
            $scope.aa = "nihao";
            var config = {
                xAxisField: 'field1',
                yAxisField: ['field2', 'field3'],
                legend: {
                    data: ['最高气温', '最低气温']
                },
                title: {
                    text: '未来一周气温变化',
                    subtext: '纯属虚构'
                },
                tooltip: {
                    trigger: 'item'
                },
                xAxis: [{
                    type: 'category',
                    boundaryGap: false
                }],
                yAxis: [{
                    type: 'value',
                    axisLabel: {
                        formatter: '{value} °C'
                    }
                }]
            };
            $scope.config = config;
            $scope.data = [
                {
                    field1: 'Mon',
                    field2: 7,
                    field3: 12
                }, {
                    field1: 'Tues',
                    field2: 4,
                    field3: 7
                }, {
                    field1: 'Wed',
                    field2: 4,
                    field3: 3
                }, {
                    field1: 'Thurs',
                    field2: 10,
                    field3: 17
                }, {
                    field1: 'Fri',
                    field2: 20,
                    field3: 14
                }
            ];
            $scope.param = {
                "param1": 1,
                "param2": 2
            };
            $scope.text = '八路滴干活';
            $scope.getText = function () {
                return $scope.text;
            }
            $scope.funa = function () {
                alert(12);
            }
        });
})();