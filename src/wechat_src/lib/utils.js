/**
 * 工具模块
 * Created by shihua.he on 2016/8/26.
 */
define(function (require, exports, module) {
    // date扩展格式化日期 | author:Meizz
    // 对Date的扩展，将 Date 转化为指定格式的String
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
    // 例子：
    // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
    // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
    Date.prototype.Format = function (fmt) { //author: meizz
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    Array.prototype.remove = function (val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == val) {
                this.splice(i, 1);
                break;
            }
        }
    }

    var utils = {
        //获取url参数
        getUrlParam: function (param) {
            var t = new RegExp("(^|&)" + param + "=([^&]*)(&|$)"),
                n = window.location.search.substr(1).match(t);
            return null != n ? unescape(n[2]) : null;
        },
        //获取url参数（不转码）
        getUrlParamt: function (param) {
            var t = new RegExp("(^|&)" + param + "=([^&]*)(&|$)"),
                n = window.location.search.substr(1).match(t);
            return null != n ? n[2] : null; //不转码
        },
        queryToken: function (key) {
            return (document.location.href.match(new RegExp("(?:\\?|&)" + key + "=(.*?)(?=&|$)")) || ['', null])[1];
        },
        //获取url参数json（不转码）
        getUrlParamsJson: function (paramArr) {
            _self = this;
            var valueJson = {};
            var jsonStr = "{";
            if (paramArr != null && paramArr.length != 0) {
                paramArr.forEach(function (param) {
                    var value = _self.getUrlParamt(param);
                    if (value != null && value != "") {
                        jsonStr += param + ":'" + value + "',";
                    } else {
                        jsonStr += param + ":'',";
                    }
                });
            } else {
                return "{}";
            }
            jsonStr += '}';
            valueJson = eval('(' + jsonStr + ')');
            return valueJson;
        },
        //字体自适应
        adaptive: function (num, width) {
            var screenWid = document.documentElement.clientWidth;
            var fixWid = 375;
            screenWid = screenWid > 750 ? 750 : screenWid;
            var htmlFontSize = (screenWid / fixWid) * 20;
            document.documentElement.style.fontSize = htmlFontSize + 'px';

            window.onresize = function () {
                utils.adaptive();
            }
        },
        //获取前缀（其实是后缀）
        getPrefix: function () { //截取当前host有没有后缀 如-dev 、-test等
            var wlh = window.location.host.toString();
            var prefix = '';
            if (wlh.indexOf('-dev') !== -1) {
                prefix = '-dev';
            } else if (wlh.indexOf('-test') !== -1) {
                prefix = '-test';
            }
            return prefix;
        },
        //设置cookie（名称，值，时间[单位：天]）
        setCookie: function (name, value, time) {
            var oDate = new Date();
            oDate.setDate(oDate.getDate() + time);
            document.cookie = name + "=" + value + ";expires=" + oDate;
        },
        //获取cookie
        getCookie: function (name) {
            var arr = document.cookie.split("; ");
            for (var i = 0; i < arr.length; i++) {
                var arr2 = arr[i].split("=");
                if (arr2[0] == name) {
                    return arr2[1];
                }
            }
            return "";
        },
        //移除cookie
        removeCookie: function (name) {
            this.setCookie(name, "", 0);
        },
        //获取url查询字符串
        queryString: function (key) {
            return (document.location.search.match(new RegExp("(?:^\\?|&)" + key + "=(.*?)(?=&|$)")) || ['', null])[1];
        },
        queryToken: function (key) {
            return (document.location.href.match(new RegExp("(?:\\?|&)" + key + "=(.*?)(?=&|$)")) || ['', null])[1];
        },
        //替换电话号码4到7位成*号
        replacePhone: function (key) {
            return key.substr(0, 3) + '****' + key.substr(7);
        },
        //去除url查询字符串
        urlpage: function () {
            return (location.href.replace(document.location.search, ""));
        },

        //百度地图定位（城市，地址）
        baiduMap: function (city, addr) {
            var map = new BMap.Map("allmap"),
                defaultPoint = new BMap.Point(116.331398, 39.897445); //默认地址
            map.centerAndZoom(defaultPoint, 12);
            map.disableDragging();
            var myGeo = new BMap.Geocoder;
            myGeo.getPoint(addr, function (e) {
                e && (map.centerAndZoom(e, 16), map.addOverlay(new BMap.Marker(e)))
            }, city);
        },

        //百度统计模块
        hmBaidu: function () {
            var hm = document.createElement("script");
            // hm.src = "//hm.baidu.com/hm.js?872c315926bb6fcef89e31f700bf1a3a";
            hm.src = "//hm.baidu.com/hm.js?9d04c3312130ec70e33078d306779e47";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);
        },

        //移动端环境判断
        ua: navigator.userAgent,
        url: window.location.href,
        //分享
        isShare: function () {
            return this.url.match(/petShareFrom/i);
        },
        //移动
        isMobile: function () {
            return this.ua.match(/AppleWebKit.*Mobile/i);
        },
        //ios
        isIos: function () {
            return this.ua.match(/iPhone|iPod|iPad/i);
        },
        //安卓
        isAndroid: function () {
            return this.ua.match(/Android/i)
        },
        //微信
        isWeixin: function () {
            return this.ua.match(/MicroMessenger/i);
        },
        //警告对话框
        alert: function (obj, callback) {
            var content = obj.content || String(obj) || "",
                btnText = obj.btnText || "确定",
                boxClass = obj.boxClass || "",
                alertHtml = '\
                <div class="dialog ' + boxClass + '">\
                    <div class="dialog-box">\
                        <div class="dialog-detail">' + content + "" + '</div>\
                        <div class="dialog-opera">\
                            <button class="dialog-btn dialog-btn-close">' + btnText + '</button>\
                        </div>\
                    </div>\
                    <div class="dialog-overlay"></div>\
                </div>';
            //document.body.insertAdjacentHTML("beforeend", alertHtml);
            $(".dialog").remove();
            $("body").append(alertHtml);
            var dialog = $(".dialog"),
                btnClose = $(".dialog-btn-close");
            btnClose.on("click", function () {
                dialog.remove();
                if (callback) {
                    callback();
                }
            });
        },
        //确认对话框
        confirm: function (obj, callback) {
            var content = obj.content || String(obj) || "",
                okText = obj.okText || "确定",
                cancelText = obj.cancelText || "取消",
                boxClass = obj.boxClass || "",
                confirmHtml = '\
                <div class="dialog ' + boxClass + '">\
                    <div class="dialog-box">\
                        <div class="dialog-detail">' + content + "" + '</div>\
                        <div class="dialog-opera">\
                            <button class="dialog-btn dialog-btn-cancel">' + cancelText + '</button>\
                            <button class="dialog-btn dialog-btn-ok">' + okText + '</button>\
                        </div>\
                    </div>\
                    <div class="dialog-overlay"></div>\
                </div>';
            $(".dialog").remove();
            $("body").append(confirmHtml);
            var dialog = $(".dialog"),
                btnOk = $(".dialog-btn-ok"),
                btnCancel = $(".dialog-btn-cancel"),
                flag = true,
                oprea = function () {
                    dialog.remove();
                    if (callback) {
                        callback(flag);
                    }
                };
            btnOk.on("click", function () {
                flag = true;
                oprea();
            });
            btnCancel.on("click", function () {
                flag = false;
                oprea();
            });
        },
        //提示对话框
        prompt: function (obj, callback) {
            var content = obj.content || String(obj) || "",
                boxClass = obj.boxClass || "",
                delay = obj.delay || 2000,
                msgHtml = '<div class="dialog-prompt ' + boxClass + '">' + content + '</div>';
            $(".dialog-prompt").remove();
            $("body").append(msgHtml);
            var prompt = $(".dialog-prompt"),
                promptWidth = prompt.width(),
                wiWidth = $(window).width();
            prompt.css({"margin-left": -promptWidth * 0.5});
            // if (wiWidth / 2 == promptWidth) {
            //     prompt.css({"margin-left": -promptWidth * 0.725});
            // } else {
            //     prompt.css({"margin-left": -promptWidth * 0.5});
            // }
            if (delay < 0) return;
            setTimeout(function () {
                prompt.css({"opacity": 0});
                setTimeout(function () {
                    // prompt.remove();
                    if (callback) {
                        callback();
                    }
                }, 500);
            }, delay);
        },
        prompt_nodelay: function (obj) {
            var content = obj.content || String(obj) || "",
                boxClass = obj.boxClass || "",
                msgHtml = '<div class="dialog-prompt-nodelay">\
                                <div class="dialog-prompt ' + boxClass + '">' + content + '</div>\
                                <div class="dialog-overlay"/>\
                            </div>';
            $(".dialog-prompt").remove();
            $("body").append(msgHtml);

            var prompt = $(".dialog-prompt"),
                promptWidth = prompt.width(),
                wiWidth = $(window).width();
            prompt.css({"margin-left": -promptWidth * 0.5});


        },
        //格式化时间（毫秒）
        formatTime: function (ms) {
            var ss = 1000;
            var mi = ss * 60;
            var hh = mi * 60;
            var dd = hh * 24;

            var day = parseInt(ms / dd);
            var hour = parseInt((ms - day * dd) / hh);
            var minute = parseInt((ms - day * dd - hour * hh) / mi);
            var second = parseInt((ms - day * dd - hour * hh - minute * mi) / ss);
            var milliSecond = parseInt(ms - day * dd - hour * hh - minute * mi - second * ss);

            var result = {
                d: day,
                h: hour,
                mi: minute,
                s: second,
                ms: milliSecond
            };

            return result;

        },
        //格式化时间_补零（毫秒）
        formatTime_zero: function (ms) {
            var ss = 1000;
            var mi = ss * 60;
            var hh = mi * 60;
            var dd = hh * 24;

            var day = utils.getTwoNum(ms / dd);
            var hour = utils.getTwoNum((ms - day * dd) / hh);
            var minute = utils.getTwoNum((ms - day * dd - hour * hh) / mi);
            var second = utils.getTwoNum((ms - day * dd - hour * hh - minute * mi) / ss);
            var milliSecond = utils.getThreeNum(ms - day * dd - hour * hh - minute * mi - second * ss);

            var result = {
                d: day,
                h: hour,
                mi: minute,
                s: second,
                ms: milliSecond
            };

            return result;

        },
        getTwoNum: function getTwoNum(data) {
            if (!data) return "00";
            var int = parseInt(data);
            if (int < 10) return "0" + int;
            else return int;
        },
        getThreeNum: function (data) {
            if (!data) return "000";
            var int = parseInt(data);
            if (int >= 100) return int;
            else if (int < 10) return "00" + int;
            else return "0" + int;
        },
        //执行指令
        goToApp: function (cmd, param) {
            //跟app的交互
            if (utils.isAndroid()) {
                console.log("安卓指令:" + cmd + ":" + param);
                window.JavaScriptHelper.sendCommand(cmd, param); // java接口调用
            } else if (utils.isIos()) {
                console.log("IOS指令:" + cmd + ":" + param);
                window.location = cmd + ":" + param;
            }
        },
        //检测登录
        checkLogin: function (shareUrl) {
            shareUrl = shareUrl;
            var token = utils.getUrlParam('token');
            if (token == null || token == '') {
                token = utils.getCookie('token');
            }
            if (token == null || token == '') {
                utils.toLogin(shareUrl);
            }
            return token;
        },
        toLogin: function (url) {
            console.log('app登录');
            //var url = encodeURIComponent();
            url = url ? encodeURIComponent(url) : '';
            var param = 'url==' + url + '||title==ETC车宝';
            utils.goToApp('login', param);
        },
        // 唤起APP
        awakeAPP: function () {
            // 唤起APP
            if (utils.isWeixin()) {
                if (utils.isAndroid()) {
                    window.location.href = "https://lnk0.com/lQBx5k"; //获得下载链接
                } else if (utils.isIos()) {
                    window.location.href = "https://lnk0.com/QRpskc"; //获得下载链接
                }
            } else {
                if (utils.isAndroid()) {
                    window.location.href = "m://com.etcchebao/"; //打开android手机上的app应用
                    window.location.href = "https://lnk0.com/lQBx5k"; //获得下载链接
                } else if (utils.isIos()) {
                    window.location.href = "etcchebao://"; //打开iphone手机上的app应用
                    window.location.href = "https://lnk0.com/QRpskc"; //获得下载链接
                }
            }
        },
        loadFile: function (url, callback) {
            var elem;
            if (url.match(/\.js/i)) {
                elem = document.createElement("script");
                elem.src = url;
                document.body.appendChild(elem);
            } else {
                elem = document.createElement("link");
                elem.href = url;
                elem.rel = "stylesheet";
                document.head.appendChild(elem);
            }
            elem.onload = elem.onreadystatechange = function () {
                if (!this.readyState || this.readyState == "loaded" || this.readyState == "complete") {
                    if (callback) {
                        callback();
                    }
                }
            };
        },
        wxShare: function (wxData) {
            var wxData = wxData || {},
                title = wxData.title || "ETC车宝",
                desc = wxData.desc || "",
                img = wxData.img || "",
                link = wxData.link || window.location.href,
                url = encodeURIComponent(window.location.href.split("#")[0]);
            $.ajax({
                dataType: "jsonp",
                url: "https://act" + utils.getPrefix() + ".etcchebao.com/wechat/api/jsWxConfig?hash=" + utils.getWeChatHash(),
                success: function (data) {
                    utils.loadFile("https://res.wx.qq.com/open/js/jweixin-1.0.0.js", function () {
                        var shareData = eval(data);
                        //配置信息
                        wx.config({
                            debug: false,
                            appId: shareData.data.appid,
                            timestamp: shareData.data.timestamp,
                            nonceStr: shareData.data.noncestr,
                            signature: shareData.data.signature,
                            jsApiList: [
                                'onMenuShareTimeline',
                                'onMenuShareAppMessage',
                                'onMenuShareQQ',
                                'onMenuShareWeibo'
                            ]
                        });

                        //分享到...
                        wx.ready(function () {
                            wx.onMenuShareTimeline({
                                title: title,
                                link: link,
                                imgUrl: img,
                                success: function () {
                                },
                                cancel: function () {
                                }
                            });
                            wx.onMenuShareAppMessage({
                                title: title,
                                desc: desc,
                                link: link,
                                imgUrl: img,
                                type: '',
                                dataUrl: '',
                                success: function () {
                                },
                                cancel: function () {
                                }
                            });
                            wx.onMenuShareQQ({
                                title: title,
                                desc: desc,
                                link: link,
                                imgUrl: img,
                                success: function () {
                                },
                                cancel: function () {
                                }
                            });
                            wx.onMenuShareWeibo({
                                title: title,
                                desc: desc,
                                link: link,
                                imgUrl: img,
                                success: function () {
                                },
                                cancel: function () {
                                }
                            });
                        });

                    })
                },
                error: function (xhr, type) {
                    alert('微信分享链接错误1111');
                }
            });
        },
        //图片对话框
        img_dialog: function (obj, callback) {
            var obj = obj || {};
            var content = obj.content || String(obj) || "",
                img = obj.img || "",
                btnText = obj.btnText || "确定",
                boxClass = obj.boxClass || "",
                flag = true,
                html = '\
                <div class="img_dialog ' + boxClass + '">\
                    <div class="img_dialog_main">\
                        <div class="img_dialog_img">\
                            <img src="../images/bg_etccards.png" alt="">\
                        </div>\
                        <div class="img_dialog_text">\
                            ' + content + '\
                        </div>\
                        <div class="img_dialog_btn">\
                            ' + btnText + '\
                        </div>\
                        <div class="img_dialog_close">\
                            X\
                        </div>\
                    </div>\
                    <div class="dialog-overlay"></div>\
                </div>\
                ';
            $("body").append(html);
            var $dialog = $(".img_dialog"),
                $ok = $dialog.find(".img_dialog_btn"),
                $close = $dialog.find(".img_dialog_close"),
                $overlay = $dialog.find(".dialog-overlay");

            var okEvent = function () {
                if (callback) {
                    callback(true);
                }
            }
            var closeEvent = function () {
                if (callback) {
                    callback(false);
                }
                $dialog.remove();
            };

            $ok.click(function () {
                okEvent();
            });

            $close.click(function () {
                closeEvent();
            });
            $overlay.click(function () {
                closeEvent();
            });

        },

        /*微信授权*/
        /*跳转到授权页面*/
        toAuthorize: function (url) {
            //参数说明详见http://wiki.etcchebao.cn/pages/viewpage.action?pageId=1802340
            window.location.href =
                utils.getUrl("passport_redirect") + '?client_type=3&user_type=0&type=2&hash=' + utils.getWeChatHash() + '&jump_login=3&src=' + url;
        },
        /*获取微信用户信息*/
        getWcUserinfo: function (openid, cb) {
            console.log("获取微信用户信息");

            $.ajax({
                url: utils.getUrl("passport_wechat_info") + "?hash=" + utils.getWeChatHash() + "&openid=" + openid,
                dataType: "jsonp",
                success: function (json) {
                    console.log(json);
                    if (json.code == 0) {
                        cb(json.data);
                    } else {
                        alert(json.msg);
                    }
                },
                error: function () {
                    alert('网络出错，请稍后再试');
                }
            });
        },

        getWeChatHash: function () {
            // return (utils.getPrefix()=='-test'?'etctest':utils.getPrefix()=='-dev'?'jinghui':'etclink');
            return (utils.getPrefix() == '-test' ? 'jinghui' : utils.getPrefix() == '-dev' ? 'jinghui' : 'etclink');
        },

        getUrl: function (type) {
            var url = '';
            switch (type) {
                case 'passport_redirect' :
                    url = 'https://passport' + utils.getPrefix() + '.etcchebao.com/redirect/';
                    break;
                case 'passport_wechat_info' :
                    url = 'https://passport' + utils.getPrefix() + '.etcchebao.com/wechat/info';
                    break;
                default :
                    url = '';
            }
            return url;
        },

        //滚动到底部
        scrollToBottom: function (cb) {
            var _this = this;
            $(window).scroll(
                function () {
                    var scrollTop = $(this).scrollTop();
                    var scrollHeight = $(document).height();
                    var windowHeight = $(this).height();
                    if (scrollTop + windowHeight == scrollHeight) {
                        console.log("滚动到底部");
                        cb();
                    }
                });

        },

        //获取客服热线
        getHotLine: function (callback) {
            $.ajax({
                url: 'https://api-mall' + utils.getPrefix() + '.etcchebao.com/home/getConfigOption?option=CUSTOMER_TELEPHONE_NUMBERS',
                dataType: "jsonp",
                async: false,
                success: function (json) {
                    console.log(json);
                    if (json.code == 0) {
                        callback(json.data);
                    } else {
                        console.log(json.msg);
                    }
                }, error: function (e) {
                    console.log('网络错误');
                }
            });
            // return '400-6688-005';
        },

        //自定义对话框
        common_dialog: function (obj) {
            var obj = obj || {};
            var content = obj.content || String(obj) || "";
            var boxClass = obj.boxClass || "";

            var html = '\
                    <div class="common_dialog ' + boxClass + '">\
                        <div class="common_dialog_main">\
                            ' + content + '\
                        </div>\
                        <div class="dialog-overlay"></div>\
                    </div>\
                    ';
            $("body").append(html);

            $(".dialog-overlay").click(function () {
                $(".common_dialog").remove();
            });

            obj.dialog_event ? obj.dialog_event() : '';
        },

        //通用ajax
        commonAjax: function (obj) {
            obj.beforeSend = obj.beforeSend || function () {
                    utils.prompt_nodelay("加载中...");
                }
            obj.complete = obj.complete || function () {
                    $(".dialog-prompt-nodelay").remove();
                }
            obj.error = obj.error || function () {
                    utils.alert('网络错误，请重试');
                }
            $.ajax(obj);
        },

        //下拉（selector：选择器；cb：回调函数）- heshihua
        pull_down:function(selector,cb){
            var $this = $(selector);
            var percent = 0;//拉动百分比
            var isPulling = false;
            var mouseStartY = 0;

            var loading = '<div style="top:-1.8rem;position: absolute;text-align: center;width:100%;">\
                                <img src="../images/loading_etcv2.gif" alt="" style="width:100%;">\
                           </div>'
            $this.prepend(loading);

            $this.on('touchstart',function(e){

                // e.stopPropagation();
                // console.log('下拉开始',$(window).scrollTop(),window.event.touches[0].clientY);
                isPulling = true;
                mouseStartY = window.event.touches[0].clientY;

            });
            $this.on('touchmove',function(e){
                var maxDistance = 150;
                var mouseDistanceY = window.event.touches[0].clientY - mouseStartY;
                mouseDistanceY = mouseDistanceY>maxDistance?maxDistance:mouseDistanceY;
                // pullMouseDistanceY = pullMouseDistanceY>50?50:pullMouseDistanceY;

                if($(window).scrollTop()==0 && isPulling && mouseDistanceY>0){
                    e.preventDefault();//阻止safari下拉

                    percent = mouseDistanceY/maxDistance;
                    var pullMouseDistanceY = mouseDistanceY*percent/40;
                    // console.log('下拉中',pullMouseDistanceY);
                    $this.css({
                        '-webkit-transition':'0s ease all',
                        '-moz-transition':'0s ease all',
                        'transition':'0s ease all',
                        'transform': 'translateY('+pullMouseDistanceY+'rem)',
                        '-webkit-transform': 'translateY('+pullMouseDistanceY+'rem)',	/* Safari and Chrome */
                        '-o-transform': 'translateY('+pullMouseDistanceY+'rem)',		/* Opera */
                        '-moz-transform': 'translateY('+pullMouseDistanceY+'rem)',		/* Firefox */
                    });
                }
            });
            $this.on('touchend',function(e){
                if(percent == 1){
                    cb?cb():'';
                }
                // console.log('下拉结束');
                isPulling = false;
                $this.css({
                    '-webkit-transition':'0.5s ease all',
                    '-moz-transition':'0.5s ease all',
                    'transition':'0.5s ease all',
                    'transform': 'translateY(0px)',
                    '-webkit-transform': 'translateY(0px)',	/* Safari and Chrome */
                    '-o-transform': 'translateY(0px)',		/* Opera */
                    '-moz-transform': 'translateY(0px)',		/* Firefox */
                });
                percent = 0;
            });
        }
    };

    module.exports = utils;
});
