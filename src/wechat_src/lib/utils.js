/**
 * 工具模块
 * Created by shihua.he on 2016/8/26.
 */
define(function (require, exports, module) {
    var utils = {
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
                msgHtml = '<div class="dialog-prompt ' + boxClass + '"><div>' + content + '</div></div>';
            $(".dialog-prompt").remove();
            $("body").append(msgHtml);
            var prompt = $(".dialog-prompt"),
                promptWidth = prompt.width(),
                wiWidth = $(window).width();
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
    };

    module.exports = utils;
});
