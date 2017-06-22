(function () {

    var Ac = {}

    Ac.nextIdFactory = function () {
        var _id = 0;

        return function () {
            return _id++;
        }
    }
    Ac.nextId = Ac.nextIdFactory();

    angular.module('ks.autoSearchKw', ['ks', 'ks.pinyinEngine']).directive('ksAutoSearchKw', ['$parse', 'k', 'ksEntityService', 'ksPinyinEngine',
        function ($parse, k, ksEntityService, ksPinyinEngine) {

            var KEY = {
                ENTER: 13,
                RIGHT: 39,
                LEFT: 37,
                DOWN: 40,
                UP: 38
            }

            /**
             * 说明：
             * tip: 说明的文字
             * placeholder: placeholder
             * columnInfos: 列信息：[{filed:"name",label:"姓名",width:100,align:'left'},{...}....]
             * url: 请求后台URL
             * datas: 静态数据
             * selectedItem: 被选中的对象
             * selectOnly: true：只能存匹配的数据 不能随意输入
             * displayField: 显示到input中的属性
             * valueField: 指定属性作为值
             * enableMulti: 是否支持多选
             * readonly : 是否只读
             * width : 宽度
             * disableItemIfFieldNull : 设置只读 (废弃)
             * flag  :
             * formatKeyword:格式化关键字
             */
            return {
                scope: {
                    tip: '@?',
                    placeholder: '@?',
                    columnInfos: '=',
                    url: '=?',
                    businessCode: '@?',
                    datas: '=?',
                    selectedItems: '=?',
                    selectOnly: '=?',
                    displayField: '@',
                    valueField: '@',
                    multi:'=?',
                    readonly: '=',
                    width: '@?',
                    flag: '@?',
                    formatKeyword:'&',
                    disableItem:'&',
                    pinyin:'=?'//是否使用拼音搜索（仅针对静态数据而言）
                },
                restrict: 'E',
                replace: true,
                transclude: true,
                templateUrl: window.webRoot + '/platform/resource/ks/pickers/tpl_ks_autoSearch_kw.html?version=' + window.version,
                link: function (scope, element, attrs) {

                    var me = scope;

                    $.extend(me, {
                        searchText:'',//搜索关键字
                        pinyin:true,
                        cacheData: function () {
                            if (me.isUseStateDatas && me.datas && me.datas.rows) {
                                var rows = me.datas.rows;
                                if(me.pinyin){//拼音搜索
                                    for (var i = 0; rows && i < rows.length; i++) {
                                        var item = rows[i];
                                        for (var j in me.columnInfos) {
                                            var columnField = me.columnInfos[j].field;
                                            var value = item[columnField];
                                            if (angular.isNumber(value)) {
                                                value = value + '';
                                            }
                                            ksPinyinEngine.setCache(me.pinyinEngine,[value], item);
                                        }
                                    }
                                }
                                me.results = rows.length || 0;
                                me.matchItems = rows;

                            }
                        },


                        init: function () {
                            me.initVars();
                            me.initSize();
                            me.bindEvents();
                        },

                        loadData: function () {
                        	var url = window.webRoot + '/sys/memcache/findByKeyword.do'
                        	if (me.url)
                        		url = me.url
                            var keyword = me.searchText;
                        	var businessCode = me.businessCode
                            if (url && !me.isUseStateDatas && me.picker.visible) {

                                var newKeyword = me.formatKeyword({keyword:keyword})

                                if(!newKeyword){
                                    newKeyword = keyword;
                                }

                                clearTimeout(me.timer);
                                me.timer = setTimeout(function () {
                                    ksEntityService.get(url, {
                                        limit: 10,
                                        keyword: newKeyword,
                                        businessCode: businessCode
                                    }).success(function (data) {
                                        if (data.rows) {
                                            me.matchItems = data.rows;
                                            me.results = data.results;
                                        }else if(data.length > 0){
                                            me.matchItems = data;
                                            me.results = data.length
                                        }else{
                                            me.matchItems = [];
                                            me.results = 0
                                        }

                                    }).error(function () {
                                        alert("error");
                                    });
                                }, 200);

                            }

                        },

                        /**
                         * 禁用行数据
                         * @param row
                         * @returns {*}
                         */
                        disableRow:function(row){
                            var result = me.disableItem({row: row});
                            if(!angular.isUndefined(result) && typeof result == 'boolean'){
                                return result;
                            }else{
                                return false
                            }
                        },


                        initVars: function () {

                            me.pinyinEngine = ksPinyinEngine.getInstance();

                            me.timer;

                            me.results = 0;

                            me.matchItems = [];

                            me.picker = {
                                visible: false
                            }

                            me.inputTextFlag = false;

                            me.selectItemIndex = 0;

                            me.isUseStateDatas = !me.url && !me.businessCode//是否使用静态数据
                            me.selectedValues = [];

                            me.focusItem = null;
                            me.focusIndex = -1;
                            me.searchInput = element.find(".ks-ac-search-text");
                            me.table = element.find(".ks-ac-table");
                            me.bodyTable = element.find(".ks-ac-body-table");
                            me.rows = element.find(".ks-ac-rows");
                            me.pickerElement = element.find(".ks-ac-picker");
                            me.tags = element.find('.div_tags');
                            element.attr("ksId", Ac.nextId())
                            me.tags.width(me.width || 300);
                        },

                        initSize: function () {
                            //me.tags.width(me.width || 300);
                        },


                        bindEvents: function () {

                            me.$watch('selectedItems', function (value) {
                                if (value && angular.isArray(value) && value.length > 0) {
                                    me.selectedItems = value;
                                } else {
                                    me.selectedItems=[];
                                }
                            }, true)

                            me.$watch('columnInfos', function (newValue) {
                                if (newValue) {
                                    me.columnInfos = newValue;
                                }
                            })

                            me.$watch('searchText', function (newVal) {
                                if (newVal) {
                                    if (me.isUseStateDatas) {
                                        if(me.pinyin && me.datas && me.datas.rows){
                                            me.pinYinSearch(newVal);
                                        }else if(!me.pinyin && me.datas && me.datas.rows){
                                            me.matchKeyword(newVal);//不使用拼音搜索，直接匹配
                                        }
                                    } else {
                                        me.loadData();
                                    }
                                } else {
                                    if (me.isUseStateDatas) {
                                        if(me.datas && me.datas.rows){
                                            me.matchItems = me.datas.rows;
                                        }
                                    } else if (me.flag != 1) {
                                        me.loadData();
                                    }

                                }
                            })


                            me.$watch('datas',function(newValue){
                                if(me.isUseStateDatas && newValue && newValue.rows){
                                    me.cacheData();
                                }
                            });
                            me.$watch('businessCode',function(newV){//因为businessCode使用@初始化时取不到值
                                if(newV || me.url){
                                    me.isUseStateDatas=false;
                                }else{
                                    me.isUseStateDatas=true;
                                }
                            });
                            me.bodyTable.on("click", function (e) {
                                var $target = $(e.target);
                                if ($target.closest('.ks-ac-rows').hasClass("ks-ac-rows")) {
                                    me.focusItem = $target.closest('.ks-ac-rows');
                                    me.focusIndex = me.focusItem.attr("index");
                                    me.selectItemIndex = me.focusIndex;
                                    me.hitItem();
                                    if(!me.multi){
                                        me.hidePicker();
                                    }
                                }
                                return;
                            })


                            $(document.body).on("click", function (e) {
                                var wrap = $(e.target).closest('.ks-ac');
                                var tagsDiv = $(e.target).closest('#div_tags');
                                if (tagsDiv.size() > 0 && tagsDiv[0] == me.tags[0]) {
                                    me.pickerToggle();
                                    me.$digest();
                                } else if(wrap.size() > 0 && wrap[0] == element[0]) {//点击组件内其他地方

                                }else{//点击组件外面关闭组件
                                    if(me.picker.visible) {
                                        me.hidePicker();
                                    }
                                }
                            })

                        },


                        pinYinSearch: function (keyword) {
                            me.matchItems = [];
                            ksPinyinEngine.search(me.pinyinEngine,keyword, function(data){
                                me.matchItems.push(data);
                            });
                            me.results = me.matchItems.length;
                        },

                        matchKeyword: function (keyword) {//非拼音搜索
                            me.matchItems = [];
                            var rows = me.datas.rows;
                            for (var i = 0; rows && i < rows.length; i++) {
                                var item = rows[i];
                                for (var j in me.columnInfos) {
                                    var columnField = me.columnInfos[j].field;
                                    if(columnField=="id" || columnField=="status"){
                                        continue;
                                    }
                                    var value = item[columnField];
                                    if (angular.isNumber(value)) {
                                        value = value + '';
                                    }
                                    if (value.indexOf(keyword) !== -1) {
                                        me.matchItems.push(item);
                                        break;
                                    }
                                }
                            }
                            me.results = me.matchItems.length;
                        },
                        pickerToggle: function (){
                            me.picker.visible=!me.picker.visible;
                            if(me.picker.visible){
                                me.loadData();
                            }
                        },
                        hidePicker: function () {
                            me.picker.visible = false;
                            me.$digest();
                        },

                        showPicker: function () {
                            if (me.readonly) {
                                return;
                            }
                            me.picker.visible = true;

                            setTimeout(function () {
                                k.autoFitPopUp($(element).find('.ks-ac-item-wrap'));
                            }, 0);

                            me.$digest();
                            //me.searchInput.focus();

                        },

                        resizeMultiWidth: function (isExpand, index) {
                           /* var tagTotalWidth=me.width||150;
                            element.find(".tag").each(function () {
                                tagTotalWidth += $(this).width() + 30;
                            })

                            if (tagTotalWidth != 0 && isExpand && tagTotalWidth > me.tags.width()) {
                                me.tags.width(tagTotalWidth);
                            } else if (tagTotalWidth != 0 && !isExpand && tagTotalWidth < me.tags.width()) {
                                me.tags.width(me.tags.width() - element.find('.tag').eq(index).width());
                            }*/

                        },

                           //删除标签
                        removeItem: function (index) {
                            event.stopPropagation();
                            me.selectedItems.splice(index, 1);
                        },
                        
                        
                        
                        split : function(value,selectedItem){
                            var label = '';
                            var displayFields = [];
                            if(value.indexOf('|') != -1){
                                displayFields = value.split('|')
                            }else{
                                displayFields.push(value)
                            }

                            for(var i in displayFields){
                                var displayField = displayFields[i];

                                label += selectedItem[displayField] + '|';
                            }

                            if(label.length > 0)label = label.substring(0,label.length - 1);
                            
                            return label
                            
                        },
                        
                        
                        hitItem: function () {//点击(选择)选项
                            if (me.focusItem && me.matchItems) {
                                var _selectedItem = me.matchItems[me.selectItemIndex];

                                if (_selectedItem) {
                                    var isNew=true;
                                    for(var key in me.selectedItems){
                                        if(_selectedItem[me.valueField]==me.selectedItems[key][me.valueField]){
                                            me.selectedItems[key]=_selectedItem;
                                            isNew=false;
                                            break;
                                        }
                                    }
                                    if(isNew){
                                        me.selectedItems.push(_selectedItem);
                                    }
                                }

                            } else {
                                //me.selectedItem = null;
                            }

                            me.focusIndex = -1;
                            me.selectItemIndex = 0;
                            if (!me.multi) {
                                me.hidePicker();
                            }
                            me.resizeMultiWidth(true);
                            me.$digest();
                            me.$parent.$digest();
                        },

                        /**
                         * 切换焦点到第n个元素，从0开始
                         * @param index
                         */
                        switchFocusItemAt: function (index) {
                            var acRowsLen = me.table.find(".ks-ac-rows").length;
                            if (index < 0) {
                                index = acRowsLen - 1;
                            } else if (index > 9 || acRowsLen == index) {
                                index = 0;
                            }
                            var newIndex = index;
                            var newFocusItem = me.table.find(".ks-ac-rows:eq(" + newIndex + ")");
                            if (newFocusItem != null && newFocusItem.hasClass("ks-ac-rows")) {
                                newFocusItem.addClass("focus");
                                me.focusItem = newFocusItem;
                                me.focusIndex = newIndex;
                                me.selectItemIndex = newFocusItem.attr('index');

                            }
                        }
                        ,
                        /**
                         * 上下切换焦点
                         * @param direction
                         */
                        switchFocusItemStep: function (direction) {
                            if (!me.matchItems || me.matchItems.length < 1) {
                                return;
                            }
                            me.switchFocusItemAt((me.focusIndex + direction) % me.matchItems.length)
                        }
                    }, true);

                    me.init();
                }

            }


        }]);

})();
