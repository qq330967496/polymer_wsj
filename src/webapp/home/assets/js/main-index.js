/**
 * Created by wendy-pc on 2016/7/22.
 */
Polymer({
    is: "main-index",
    behaviors: [OBaseBehavior],
    properties: {
        tabindex: {
            type: Number,
            value: 0
        },
        tabPages: {
            type: Array,
            value: [],
            notify: true
        },
        pageId: {
            type: String,
            notify: true
        },
        mainCont: {
            type: Object
        }
    },
    /**
     * 创建一个mainCont 的单例DOM
     * @private
     */
    _setMainCont: function () {
        if (!this.mainCont) {
            this.set("mainCont", $(this).find("#mainCont")[0]);
        }
    },
    /**
     * 展示tab页
     * @private pageId tab页的id order_XX   company_公司名
     * @private detailId 金融订单的id(可选) 公司id
     */
    _showTabPage: function (pageId, detailId) {
        this._setMainCont();
        /**
         * tabPages里面已经有的页面,说明已经打开过,直接切换该页面,否则新建一个tab页
         */
        var count = 0;
        var length = this.tabPages.length;
        for (var i = 0; i < length; i++, count++) {
            if (pageId == this.tabPages[i].id) {
                this._switchTabPage(pageId);
                this.set("tabindex", count);
                return;
            }
        }
        if (count == length) {
            // 隐藏所有原订单详情页面
            $(this).find("financial-business-order[id^='order_']").hide();
            // 隐藏所有原客户详情页面
            $(this).find("customer-info[id^='company_']").hide();
            //pageId.indexOf("order") > -1 ? this._addNewTabPageOrderDetail(pageId, financialOrderId) : this._addNewTabPage(pageId);
            if(pageId.indexOf("order") > -1){
                this._addNewTabPageOrderDetail(pageId, detailId);
            }else if(pageId.indexOf("company") > -1){
                this._addNewTabPageCompanyDetail(pageId, detailId);
            }else{
                this._addNewTabPage(pageId);
            }
            this.set("tabindex", count);
        }
    },
    /**
     * 新增tab页
     * @param pageId 页面id
     * @param title 详情标题(只有两个详情页面需要传此参数)
     * @private
     */
    _addNewTabPage: function (pageId) {
        var title = "";
        switch (pageId) {
            case "home":
                title = "首页";
                break;
            case "approval":
                title = "待审核";
                break;
            case "pendingPayment":
                title = "待放款";
                break;
            case "dueToday":
                title = "本日到期";
                break;
            case "pendingReceipt":
                title = "进行中";
                break;
            case "overdue":
                title = "逾期";
                break;
            case "historyOrder":
                title = "历史订单";
                break;
            case "allCustomer":
                title = "所有客户";
                break;
            default :
                title = "空白页";
                break;
        }
        this._setTabPages(pageId, title);
    },
    /**
     * 设置tab导航栏标题
     * @param pageId
     * @param title
     * @private
     */
    _setTabPages: function (pageId, title) {
        this.set("pageId", pageId);
        var tabPages = [];
        $.extend(tabPages, this.tabPages);
        tabPages.push({id: pageId, title: title});
        this.set("tabPages", tabPages);
    },
    /**
     * 点击tab页标题头
     * @param e
     * @private
     */
    _clickTitle: function (e) {
        var pageId = $(e.target).attr('name');
        this._switchTabPage(pageId);
    },
    /**
     * 切换tab页
     * @private
     */
    _switchTabPage: function (pageId) {
        if (!pageId) {
            return;
        }
        // 隐藏所有订单详情页面
        $(this).find("financial-business-order[id^='order_']").hide();
        // 隐藏所有客户详情页面
        $(this).find("customer-info[id^='company_']").hide();
        // 如果切换目标页面是订单详情页面,则展示该页面
        if (pageId.indexOf("order") > -1) {
            $(this).find("#" + pageId).show();
        }
        // 如果切换目标页面是客户详情页面,则展示该页面
        if (pageId.indexOf("company") > -1) {
            $(this).find("#" + pageId).show();
        }
        this.set("pageId", pageId);
    },
    /**
     * 关闭tab页
     * @private
     */
    _closeTabPage: function (e) {
        var pageId = $(e.target).attr('name') || $(e.target.parentElement).attr('name');
        /**
         * 1.当关闭当前页面时,
         *      如果当前页面是最后一个tab页,则显示空白页;
         *      如果当前页面不是最后一个tab页,则展示最后一个tab页.
         * 2.关闭非当前页面时,展示当前页面
         */
        if (pageId == this.pageId) {
            if (this.tabPages.length == 1) {
                this._removeTabPage(pageId);
                this.set("tabindex", -1);
                this.set("pageId", "home");
                return;
            }
            this._removeTabPage(pageId);
            this.set("tabindex", this.tabPages.length - 1);
            this._switchTabPage(this.tabPages[this.tabindex].id);
        } else {
            this._removeTabPage(pageId);
            var index = 0;
            for (var i = 0; i < this.tabPages.length; i++) {
                if (this.pageId == this.tabPages[i].id) {
                    index = i;
                    break;
                }
            }
            this.set("tabindex", index);
        }
    },
    /**
     * 删除tab页
     * @param pageId
     * @private
     */
    _removeTabPage: function (pageId) {
        var index = 0;
        for (var i = 0; i < this.tabPages.length; i++) {
            if (pageId == this.tabPages[i].id) {
                index = i;
                /**
                 * 订单详情的tab页的删除还需要把dom删除
                 */
                if (pageId.indexOf("order") > -1) {
                    this.mainCont.removeChild($("#" + pageId)[0]);
                }
                //客户详情的tab页的删除还需要把dom删除
                if (pageId.indexOf("company") > -1) {
                    this.mainCont.removeChild($("#" + pageId)[0]);
                }
                break;
            }
        }
        var tabPages = [];
        $.extend(tabPages, this.tabPages);
        tabPages.splice(index, 1);
        this.set("tabPages", tabPages);
    },
    /**
     * 动态创建订单详情页
     * @param pageId order_订单号
     * @param id 金融订单id
     */
    _addNewTabPageOrderDetail: function (pageId, financialOrderId) {
        /**
         * 新建详情组件,初始化页面参数,加载到主页面
         */
        var orderDetailEle = document.createElement("financial-business-order");
        orderDetailEle._init(financialOrderId);
        $(orderDetailEle).attr("id", pageId);
        this.mainCont.appendChild(orderDetailEle);
        // 例:pageId = "order_KS2016080510",截取订单号部分作为tab的title
        this._setTabPages(pageId, pageId.substring(6, pageId.length));
    },

    /**
     * 动态创建客户详情页
     * @param pageId company_公司名
     * @param companyId 公司id
     */
    _addNewTabPageCompanyDetail: function (pageId, companyId) {
        /**
         * 新建详情组件,初始化页面参数,加载到主页面
         */
        var companyDetailEle = document.createElement("customer-info");
        companyDetailEle._init(companyId);
        $(companyDetailEle).attr("id", pageId);
        this.mainCont.appendChild(companyDetailEle);
        // 例:pageId = "company_广州市塑料有限公司",截取pageId部分作为tab的title
        this._setTabPages(pageId, pageId.substring(8, pageId.length));
    },

    showTabIndex: function (pageName, pageId) {
        return pageName == pageId;
    }

});
