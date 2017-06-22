/**
 * @license AngularJS v1.2.9
 * (c) 2010-2014 Google, Inc. http://angularjs.org
 * License: MIT
 * Created by Zed on 19-11-2014.
 */
(function (window, angular) {
    'use strict';
    angular.module('ks.editor', []).directive('ksEditor', ["$compile",function () {

            return {
                require: 'ngModel',
                scope: {
                    width:'=?',
                    height: '=?'
                },
                restrict: 'AE',
                replace: true,
                link: function (scope, elm, attr, ctrl) {
                    var me = scope;
                    if (typeof KindEditor === 'undefined') {
                        console.error('Please import the local resources of kindeditor!');
                        return;
                    }

                    var _config = {
                        width: me.width || 400,
                        height:me.height || 300,
                        //autoHeightMode: false,
                        cssPath:  window.webRoot +'/platform/resource/kindeditor/plugins/code/prettify.css?version?version=' + window.version,
                        uploadJson: window.webRoot + '/platform/resource/kindeditor/jsp/upload_json.jsp??version=' + window.version,
                        fileManagerJson: window.webRoot +'/platform/resource/kindeditor/jsp/file_manager_json.jsp??version=' + window.version,
                        allowFileManager: true,
                        filterMode:false,
                            afterCreate: function () {
                            this.loadPlugin('autoheight');
                        }
                    };

                    var editorId = elm[0],
                        editorConfig = scope.config || _config;

                    editorConfig.afterChange = function () {
                        if (!scope.$$phase) {
                            ctrl.$setViewValue(this.html());
                            // exception happens here when angular is 1.2.28
                            // scope.$apply();
                        }
                    };

                    if (KindEditor) {
                        me.htmlEditor=KindEditor.create(editorId, editorConfig);
                    }

                    ctrl.$parsers.push(function (viewValue) {
                        ctrl.$setValidity('ksEditor', viewValue);
                        return viewValue;
                    });
                    ctrl.$render = function () {
                        var value = ctrl.$viewValue;
                        me.htmlEditor.html(value);
                    }
                }
            }
        }]);
})(window, window.angular);
