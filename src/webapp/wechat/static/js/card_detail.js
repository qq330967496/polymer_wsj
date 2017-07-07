var utils = require('utils');
require('../css/global.css');

const app = new Vue({
    el: '#app',
    components: {
        "comp-header": require('../components/header.vue'),
    },
    data: {
        token: '',
        platform: '',
        url_search: window.location.search,
        message: 'Hello',
        cardstates: '',
        detail_skin: '../images/cardinfo.jpg',
        telephone: '400-6688-005',
        expalins: [],
        Personalst: [],
        invalid: [],
        IsPersonal: false,
        IsPending: false,
        IsInvalid: false,
        IsCancle: false,
        IsLose: false,
        IsAlive: false,
        card_id: '',
        code: '',
        activate_code: '',
        detail_type : '',
        statement: 'javascript:void(0)',
        isAppBind: utils.queryString('isAppBind'),//是否从App绑定
        isBindSuccess: true,//是否绑定成功
        card_num: utils.queryString('card_num'),//app绑定粤通卡账号
    },
    beforeCreate: function () {
        utils.adaptive();
        console.log(utils.getPrefix())
    },
    mounted: function () {
        var card_id = utils.queryString('card_id');

        let _self = this;
        _self.token = utils.queryString('token') || utils.getCookie('token');
        if (_self.token) {
            utils.setCookie('token', _self.token, 30);
        }
        _self.platform = utils.queryString('platform') || utils.getCookie('platform');
        if (_self.platform) {
            utils.setCookie('platform', _self.platform, 30);
        }

        //百度统计
        utils.hmBaidu();


        utils.commonAjax({
            url: "/privilege/card-packet/show-card-details?token=" + _self.token + "&card_id=" + card_id,
            success: function (json) {
                //TODO 模拟数据
                /*json = {
                    code:0,
                    data:{
                        card_info:{
                            /!*
                             1：生效中
                             2：待激活
                             3：已转赠
                             41：被关闭失效
                             42：到期失效
                             51：到期作废
                             52：系统发现运营车辆作废
                             53：客服后台变更关联关系作废
                             54：手动操作作废
                            *!/
                            status:2,
                            detail_skin:'../images/cardinfo.jpg',
                            detail_type:1,
                        },
                        detail_info:{
                            unactivate_time:'2017-04-17',
                        },
                        telephone:'400-456-xxxx',
                    }
                }*/

                if (json.code == 0) {

                    var data = json.data;

                    _self.cardstates = data.card_info.status;
                    _self.detail_skin = data.card_info.detail_skin;
                    _self.expalins = data.privilege_info;

                    _self.card_id = data.card_info.card_id;
                    _self.code = data.card_info.code;
                    _self.activate_code = data.card_info.activate_code;

                    if (data.card_info.detail_type == 1) {
                        // var url = data.card_info.detail_content;
                         // url = url.substr(0,7).toLowerCase() == "http://" ? url : "http://" + url;

                        _self.statement = data.card_info.detail_content;
                        _self.detail_type = 1;

                    }else if(data.card_info.detail_type == 2){

                        _self.statement = location.protocol + '//' + window.location.host + '/view/statement.html?code=' + data.card_info.code;
                         _self.detail_type = 2;
                    }

                    _self.telephone = data.telephone;

                    if (data.card_info.status == 1 || data.card_info.status == 42) {  //生效中/已失效

                        if (data.detail_info != '') {
                            _self.IsPersonal = true;
                            _self.Personalst = data.detail_info;
                        }
                    } else if (data.card_info.status == 2) {  //待激活
                        _self.IsPending = true;
                        _self.unactivate_time = data.detail_info.unactivate_time;

                        if (data.detail_info.display_btn == 2) {
                            _self.IsAlive = true;
                        }

                        //自动绑卡流程
                        // 20170222 改为主动绑卡接口
                        if (_self.isAppBind && _self.card_num) {
                            console.log('绑卡');
                            utils.commonAjax({
                                // url: '/privilege/active-card/autoActivePrivilegeCode',
                                url: '/privilege/active-card/activePrivilegeCode',
                                data: {
                                    token: _self.token,
                                    code: _self.code,
                                    activateCode: _self.activate_code,
                                    cardno: _self.card_num,
                                },
                                beforeSend:function(){
                                    utils.prompt_nodelay("自动激活中...");
                                },
                                complete:function(){
                                    $(".dialog-prompt-nodelay").remove();
                                },
                                success: function (json_1) {
                                    /*json_1 = {
                                        code: 0,
                                        data: true,
                                        msg: 'success',
                                    };*/

                                    if (json_1.code == 0) {
                                        _self.isBindSuccess = json_1.data;
                                        if (_self.isBindSuccess) {
                                            window.location.href = '/view/card_detail.html?card_id='+card_id+'&token='+_self.token;
                                        } else {
                                            _self.showETCbindingError();
                                        }
                                    } else if (json_1.code == -52010 ||
                                        json_1.code == -52011 ||
                                        json_1.code == -52012 ||
                                        json_1.code == -52013 ||
                                        json_1.code == -52014 ||
                                        json_1.code == -52015 ||
                                        json_1.code == -52016 ||
                                        json_1.code == -52017){
                                        _self.showETCbindingError();
                                    } else{
                                        utils.alert(json_1.msg);
                                    }
                                }
                            });
                        }

                    } else if (data.card_info.status == 3) {  //已转赠
                        _self.IsInvalid = true;
                        _self.invalid = data.detail_info.persent_list[0];
                    } else if (data.card_info.status == 41) {  //已失效
                        _self.IsLose = true;
                        _self.invalid = data.detail_info;
                        _self.message = '失效说明';
                    } else if (data.card_info.status == 51 || data.card_info.status == 52 || data.card_info.status == 53 || data.card_info.status == 54) {  //作废
                        _self.IsCancle = true;
                        _self.invalid = data.detail_info;
                        _self.message = '作废说明';

                        if (data.detail_info.ytk_no != 'undefined' && data.detail_info.ytk_no != '' && data.detail_info.ytk_no != null) {
                            _self.IsPersonal = true;
                            _self.Personalst = data.detail_info;
                        }
                        ;
                    }
                    ;
                } else if (json.code == -2002) {
                    utils.alert("网络延迟，请稍后再试~");
                } else {
                    utils.alert(json.msg);
                }
            }
        });
    },
    methods: {
        Turnurl: function (list) {
            var status = utils.queryString('status');
            if (status == 1) {
                window.location.href = list.url;
            }
            ;
        },
        ShareFrends: function () {
            var card_id = utils.queryString('card_id');

            let _self = this;

            utils.commonAjax({
                type: "POST",
                url: "/privilege/card/present?token=" + _self.token + "&card_id=" + card_id,
                success: function (json) {

                    if (json.code == 0) {

                        if (json.data != '') {
                            var share_url = "https://api-card"+utils.getPrefix()+".etcchebao.com/view/share_9discount.html?card_id=" + card_id,
                                title = "速领！送你一张ETC 9折特权卡",
                                content = "全年路费9折，全网独家车主ETC特权卡，赶紧领取吧！",
                                imageUrl = "https://api-card"+utils.getPrefix()+".etcchebao.com/images/appshare.jpg";

                                utils.goToApp("doShare","sharUrl==" + encodeURIComponent(share_url) + "||title==" + title + "||content==" + content + "||imageUrl==" + encodeURIComponent(imageUrl))                     
                            // // iOS接口调用
                            // window.location = "doShare:sharUrl==" + encodeURIComponent(share_url) + "||title==" + title + "||content==" + content + "||imageUrl==" + encodeURIComponent(imageUrl);

                            // // java接口调用
                            // window.JavaScriptHelper.sendCommand("doShare", "sharUrl==" + encodeURIComponent(share_url) + "||title==" + title + "||content==" + content + "||imageUrl==" + encodeURIComponent(imageUrl));
                        }

                    } else if (json.code == -2002) {
                        utils.alert("网络延迟，请稍后再试~");
                    } else {
                       utils.alert(json.msg);
                    }
                }
            });
        },
        AliveCard: function (card_id, code, activate_code) {
            let _self = this;
            window.location.href = "/view/etc_list.html?token=" + _self.token + "&card_id=" + card_id + "&code=" + code + "&activate_code=" + activate_code;
        },
        //显示etc绑定错误信息
        showETCbindingError: function () {
            var _this = this;
            var img_dialog_obj = {
                content: '提示：您所绑定的粤通卡不符合返还规则无法激活特权卡',
                img: '../images/bg_etccards.png',
                btnText: '查看原因',
            };
            utils.img_dialog(img_dialog_obj, function (flag) {
                if (flag) {
                    location.href = _this.statement;
                }
            });
        },
        restore : function(card_id){
            let _self = this;
            window.location.href = "/view/restore_detail.html?token=" + _self.token + "&card_id=" + card_id;
        },
        cardguide : function(){
            var turnurl = "https://mg" + utils.getPrefix() + ".etcchebao.com/mgHtml/card_guide.html";
            window.location = "openWithApp:url=="+encodeURIComponent(turnurl)+"||title==九折卡操作指南";// iOS接口调用
            window.JavaScriptHelper.sendCommand("openWithApp", "url=="+encodeURIComponent(turnurl)+"||title==九折卡操作指南");// java接口调用        
        },
        turnexplain : function(statement,detail_type){
            if(detail_type==1){

                utils.goToApp("openWithApp","url==" + encodeURIComponent(statement) + "||title==特权卡说明");  
                // window.location = "openWithApp:url=="+encodeURIComponent(statement)+"||title==特权卡说明";// iOS接口调用
                // window.JavaScriptHelper.sendCommand("openWithApp", "url=="+encodeURIComponent(statement)+"||title==特权卡说明");// java接口调用
            }else if(detail_type==2){
                window.location.href=statement;
            }

        }
    }
});
