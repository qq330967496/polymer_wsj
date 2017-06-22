/// <reference path="../../../../ts-lib/angularjs/angular.d.ts"/>
/// <reference path="../../../../ts-lib/jquery/jquery.d.ts"/>
/// <reference path="../../../../ts-lib/angular-ui/angular-ui-router.d.ts"/>
/// <reference path="../../../../ts-lib/angular-ui/angular-ui-bootstrap.d.ts"/>


declare var k:nk._K;
module nk{

    export interface _K{
        getApp(name:String):_K;
        registerController(name:String,obj:any);
        loadScript(url:String);
        App:App;
        services:any;
    }

    export interface App{
        cache:any;
    }

    export interface Page{
        app:App;
    }

    export interface Event{
        name:String
        data:any
    }

    export class BaseDomain{
        createdAt:Date;
        updatedAt:Date;
        createdBy:number;
        updatedBy:number;
    }


    export class PagingQueryCondition{
        start: number = 0
        pageSize: number = 0
        limit: number = 20
        results: number = 0
        pageIndex: number = 0
    }


    export class BaseController{

        ksPage:Page;
        ksName:string;
        webRoot:string = window.webRoot;
        version:string = window.version;

        constructor(protected $scope,protected $state,protected $stateParams){
            var me = this;

            //  自定义ctrl之间的事件
            this.$scope.$on("KsEvent",function(event:any,msg){
                if(me.ksName === msg.controller){
                    return;
                }
                var name = msg.name.replace(/[\w]/,function($){return $.toUpperCase()})
                var data = msg.data;
                var handler = me["on" + name ];
                if (handler) {
                    handler.call(me, angular.copy(data));
                }
            })

            // state切换事件
            $scope.$on('$stateChangeStart',
                function (event, toState, toParams, fromState, fromParams) {
                    if (toState.name === 'root') {
                        var handler = me.onBackToRoot;
                        if(handler){
                            me.onBackToRoot.call(me,fromState.data);
                        }
                    }
                })
        }

        onBackToRoot(data:any){

        }

        go(name:String,data:any){
            this.$state.go(name, data)
        }

        putAppCache(key:string,value:any){
            var page = this.ksPage;
            if(!page){
                alert("putCache失败!");
                return;
            }
            var app = page.app;
            if(!app){
                alert("putCache失败!");
                return;
            }
            if(!app.cache){
                alert("putCache失败!");
                return;
            }
            app.cache[key] = value;
        }

        getAppCache(key){
            var page = this.ksPage;
            if(!page){
                alert("putCache失败!");
                return;
            }
            var app = page.app;
            if(!app){
                alert("putCache失败!");
                return;
            }
            if(!app.cache){
                alert("putCache失败!");
                return;
            }
            return app.cache[key];
        }


        //会被k.Controller 覆盖，用以注入内部处理需要的信息
        _getCtrlInfo(){}

        emit(name:string,data:any){
            this.$scope.$emit("KsEvent",{name:name,data:data,controller:this.ksName})
        }

        currencyFormat(amount,currency){
            if(!amount && amount!=0){
                return;
            }
            var sign='￥'
            if(currency=='USD'){
                sign='$'
            }
            return this.$filter('currency')(amount,sign);
        }

    }

    export class PopUpController extends  BaseController {

        constructor(protected $scope, protected $state, protected $stateParams) {
            super($scope, $state, $stateParams);
            this._resetParam();
        }

        dismiss() {
            this.$scope.$dismiss();
        }

        pushParam(key, value) {
            this.$state.current.data[key] = value;
        }

        deleteParam(key) {
            delete this.$state.current.data[key];
        }

        _resetParam() {
            this.$state.current.data = {};
        }

        preview2(num) {
            var bdhtml = window.document.getElementById("all").innerHTML
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
            window.location.reload()
        }

        //打印
        preview(num) {
            var bdhtml = window.document.getElementById("all").innerHTML
            var printHtml = new Array();
            for (var i = 1; i <= num; i++) {
                var sprnstr = "<!--startprint" + i + "-->";
                var eprnstr = "<!--endprint" + i + "-->";
                var prnhtml = bdhtml.substr(bdhtml.indexOf(sprnstr) + 18);
                var printContent = prnhtml.substring(0, prnhtml.indexOf(eprnstr));
                printHtml.push(printContent);
            }
            var openWindow = window.open("", "newwin");
            var  styleStr="<style>input,button,select{display: none} ._po{font-size: 12px;}table{ border-collapse:collapse;} table th,table td{ border:1px solid #eee;} </style>";
            openWindow.document.write(printHtml.toString());
            openWindow.document.write(styleStr);
            function callBack(){
                openWindow.print();
                openWindow.close();
            }
            setTimeout(callBack,1);
        }

        //大写金额
        toCnyUpp(num){
            if (isNaN(num))return "无效数值！";
            var strPrefix = "";
            if (num < 0)strPrefix = "(负)";
            num = Math.abs(num);
            if (num >= 1000000000000)return "无效数值！";
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
        }

    }
}