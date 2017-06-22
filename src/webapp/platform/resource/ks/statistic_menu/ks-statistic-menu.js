/// <reference path="../../../../platform/resource/ks/ts/ks-ts-all.ts"/>
/**
 * Created by jarek.li on 2015/4/28.
 */
(function() {
	angular.module('ks.statisticMenu', []).directive('ksStatisticMenu', function factory() {
		return {
			restrict: 'E',
			transclude: true,
			replace: true,
			scope: {
				data: '=',
				dataUrl: '@'
			},
			link: function(scope, element, attrs) {
				scope.$wrap = $(element);
				scope.$parentWrap = $(element).parent();
				var st_tree = $(scope.$wrap[0].getElementsByClassName('st_tree')[0]);
				var option = {};
				option.st_tree = st_tree;
				option._init = function() {
					st_tree.find("ul ul").hide();
					st_tree.find("ul ul").prev("li").removeClass("open");

					st_tree.find("ul ul[show='true']").show();
					st_tree.find("ul ul[show='true']").prev("li").addClass("open");
				}; /* option._init() End */

				st_tree.find("a").click(function() {
					$(this).parents("li").click();
					
					var href = $(this).attr("href");
					var id = $(this).attr("id");
					var text = $(this).attr("text");
					console.log(href);
					if(href != '#'){
						var config = {
							id:id,
							text:text,
							src: window.webRoot+href+'?version='+window.version
						};
						window.parent.uc.tabbar.addTab(config);
					}
					return false;
				});

				st_tree.find("li").click(function() {
					var a = $(this).find("a")[0];
					if (typeof(a) != "undefined") {
						if ($(this).next("ul").attr("show") == "true") {
							$(this).next("ul").attr("show", "false");
						} else { /* 打开当前这个关闭其他的 */
							st_tree.find("ul").attr("show", "false");
							$(this).next("ul").attr("show", "true");
							$(this).parents("ul").attr("show", "true");
						}
					}
					option._init();
				});

				st_tree.find("li").hover(
					function() {
						$(this).addClass("hover");
					},
					function() {
						$(this).removeClass("hover");
					}
				);

				st_tree.find("ul").prev("li").addClass("folder");

				st_tree.find("li").find("a").attr("hasChild", false);

				st_tree.find("ul").prev("li").find("a").attr("hasChild", true);
				option._init();
			},
			controller: ['$scope',
				function(scope) {
					/**
					 * 打开统计指标选择框
					 */
					scope.popupDiv = function() {
						var select_btn = $(document.getElementsByClassName("select-btn")[0]);
						var top = select_btn.offset().top + select_btn.outerHeight() + 5;
						var left = select_btn.offset().left;
						var div_obj = $(document.getElementsByClassName("pop-box")[0]);
						div_obj.css({
							"position": "absolute"
						}).animate({
							left: left,
							top: top,
							opacity: "show"
						}, "slow");
					}

					/**
					 * 隐藏统计指标选择框
					 */
					scope.hideDiv = function() {
						var div_obj = $(document.getElementsByClassName("pop-box")[0]);
						div_obj.animate({
							left: 0,
							top: 0,
							opacity: "hide"
						}, "slow");
					}

					scope.popupDiv();
				}
			],
			templateUrl: window.webRoot + '/platform/resource/ks/statistic_menu/ks-statistic-menu.html?version=' + window.version
		};
	})
})()