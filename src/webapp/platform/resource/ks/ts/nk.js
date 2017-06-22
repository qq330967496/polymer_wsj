/// <reference path="../../../../ts-lib/angularjs/angular.d.ts"/>
/// <reference path="../../../../ts-lib/jquery/jquery.d.ts"/>
/// <reference path="../../../../ts-lib/angular-ui/angular-ui-router.d.ts"/>
/// <reference path="../../../../ts-lib/angular-ui/angular-ui-bootstrap.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var nk;
(function (nk) {
    var BaseDomain = (function () {
        function BaseDomain() {
        }
        return BaseDomain;
    })();
    nk.BaseDomain = BaseDomain;
    var PagingQueryCondition = (function () {
        function PagingQueryCondition() {
            this.start = 0;
            this.pageSize = 0;
            this.limit = 20;
            this.results = 0;
            this.pageIndex = 0;
        }
        return PagingQueryCondition;
    })();
    nk.PagingQueryCondition = PagingQueryCondition;
    var BaseController = (function () {
        function BaseController($scope, $state, $stateParams) {
            this.$scope = $scope;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.webRoot = window.webRoot;
            this.version = window.version;
            var me = this;
            //  自定义ctrl之间的事件
            this.$scope.$on("KsEvent", function (event, msg) {
                if (me.ksName === msg.controller) {
                    return;
                }
                var name = msg.name.replace(/[\w]/, function ($) {
                    return $.toUpperCase();
                });
                var data = msg.data;
                var handler = me["on" + name];
                if (handler) {
                    handler.call(me, angular.copy(data));
                }
            });
            // state切换事件
            $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                if (toState.name === 'root') {
                    var handler = me.onBackToRoot;
                    if (handler) {
                        me.onBackToRoot.call(me, fromState.data);
                    }
                }
            });
        }
        BaseController.prototype.onBackToRoot = function (data) {
        };
        BaseController.prototype.go = function (name, data) {
            this.$state.go(name, data);
        };
        BaseController.prototype.putAppCache = function (key, value) {
            var page = this.ksPage;
            if (!page) {
                alert("putCache失败!");
                return;
            }
            var app = page.app;
            if (!app) {
                alert("putCache失败!");
                return;
            }
            if (!app.cache) {
                alert("putCache失败!");
                return;
            }
            app.cache[key] = value;
        };
        BaseController.prototype.getAppCache = function (key) {
            var page = this.ksPage;
            if (!page) {
                alert("putCache失败!");
                return;
            }
            var app = page.app;
            if (!app) {
                alert("putCache失败!");
                return;
            }
            if (!app.cache) {
                alert("putCache失败!");
                return;
            }
            return app.cache[key];
        };
        //会被k.Controller 覆盖，用以注入内部处理需要的信息
        BaseController.prototype._getCtrlInfo = function () {
        };
        BaseController.prototype.emit = function (name, data) {
            this.$scope.$emit("KsEvent", { name: name, data: data, controller: this.ksName });
        };
        BaseController.prototype.currencyFormat = function (amount, currency) {
            if (!amount && amount != 0) {
                return;
            }
            var sign = '￥';
            if (currency == 'USD') {
                sign = '$';
            }
            return this.$filter('currency')(amount, sign);
        };
        return BaseController;
    })();
    nk.BaseController = BaseController;
    var PopUpController = (function (_super) {
        __extends(PopUpController, _super);
        function PopUpController($scope, $state, $stateParams) {
            _super.call(this, $scope, $state, $stateParams);
            this.$scope = $scope;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this._resetParam();
        }
        PopUpController.prototype.dismiss = function () {
            this.$scope.$dismiss();
        };
        PopUpController.prototype.pushParam = function (key, value) {
            this.$state.current.data[key] = value;
        };
        PopUpController.prototype.deleteParam = function (key) {
            delete this.$state.current.data[key];
        };
        PopUpController.prototype._resetParam = function () {
            this.$state.current.data = {};
        };
        PopUpController.prototype.preview2 = function (num) {
            var bdhtml = window.document.getElementById("all").innerHTML;
            var printHtml = new Array();
            for (var i = 1; i <= num; i++) {
                var sprnstr = "<!--startprint" + i + "-->";
                var eprnstr = "<!--endprint" + i + "-->";
                var prnhtml = bdhtml.substr(bdhtml.indexOf(sprnstr) + 18);
                var prnhtml = prnhtml.substring(0, prnhtml.indexOf(eprnstr));
                printHtml.push(prnhtml);
            }
            window.document.body.innerHTML = printHtml.toString();
            window.print();
            var parentHtml = window.parent.document.getElementById("tabContainer").innerHTML;
            parentHtml = '<style>.uc-tabbar-iframe{width:100%}</style>' + parentHtml;
            window.document.body.innerHTML = parentHtml;
            window.location.reload();
        };
        //打印
        PopUpController.prototype.preview = function (num) {
            var bdhtml = window.document.getElementById("all").innerHTML;
            var printHtml = new Array();
            for (var i = 1; i <= num; i++) {
                var sprnstr = "<!--startprint" + i + "-->";
                var eprnstr = "<!--endprint" + i + "-->";
                var prnhtml = bdhtml.substr(bdhtml.indexOf(sprnstr) + 18);
                var printContent = prnhtml.substring(0, prnhtml.indexOf(eprnstr));
                printHtml.push(printContent);
            }
            var openWindow = window.open("", "newwin");
            var styleStr = "<style>input,button,select{display: none} ._po{font-size: 12px;}table{ border-collapse:collapse;} table th,table td{ border:1px solid #eee;} </style>";
            openWindow.document.write(printHtml.toString());
            openWindow.document.write(styleStr);
            function callBack() {
                openWindow.print();
                openWindow.close();
            }
            setTimeout(callBack, 1);
        };
        //大写金额
        PopUpController.prototype.toCnyUpp = function (num) {
            if (isNaN(num))
                return "无效数值！";
            var strPrefix = "";
            if (num < 0)
                strPrefix = "(负)";
            num = Math.abs(num);
            if (num >= 1000000000000)
                return "无效数值！";
            var strOutput = "";
            var strUnit = '仟佰拾亿仟佰拾万仟佰拾元角分';
            var strCapDgt = '零壹贰叁肆伍陆柒捌玖';
            num += "00";
            var intPos = num.indexOf('.');
            if (intPos >= 0) {
                num = num.substring(0, intPos) + num.substr(intPos + 1, 2);
            }
            strUnit = strUnit.substr(strUnit.length - num.length);
            for (var i = 0; i < num.length; i++) {
                strOutput += strCapDgt.substr(num.substr(i, 1), 1) + strUnit.substr(i, 1);
            }
            return strPrefix + strOutput.replace(/零角零分$/, '整').replace(/零[仟佰拾]/g, '零').replace(/零{2,}/g, '零').replace(/零([亿|万])/g, '$1').replace(/零+元/, '元').replace(/亿零{0,3}万/, '亿').replace(/^元/, "零元");
        };
        return PopUpController;
    })(BaseController);
    nk.PopUpController = PopUpController;
})(nk || (nk = {}));
//# sourceMappingURL=nk.js.map