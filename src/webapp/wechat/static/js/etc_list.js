var utils = require('utils');

const app = new Vue({
    el: '#app',
    components: {
        "comp-header":require('../components/header.vue'),
    },
    data: {
        token: '',
        platform: '',
        selectedCard:'',
        card_id:utils.queryString('card_id'),//特权卡号
        code:utils.queryString('code'),//特权卡类型
        activate_code:utils.queryString('activate_code'),//激活码
        json_data:{info:[]},

    },
    beforeCreate: function() {
        utils.adaptive();

    },
    mounted: function() {
        var _self = this;
        _self.token = utils.queryString('token') || utils.getCookie('token');
        if (_self.token) {
            utils.setCookie('token', _self.token, 30);
        }
        _self.platform = utils.queryString('platform') || utils.getCookie('platform');
        if (_self.platform) {
            utils.setCookie('platform', _self.platform, 30);
        }

        // _self.showETCbindingError();
        utils.commonAjax({
            url:'/privilege/active-card/getUnitollCardList',
            data:{
                token:_self.token,
                code:_self.code,
            },
            beforeSend:function(){
                utils.prompt_nodelay('加载中');
            },
            complete:function(){
                $(".dialog-prompt-nodelay").remove();
            },
            success:function(json){
                // console.log(json);
                /*json = {
                    code:0,
                    data:{
                        info:[
                            {
                                license:'粤H ZY520',
                                color:'1',
                                used_flag:'1',//是否为营运车 1为非营运车，其他为营运车
                                card_no:'123456',
                                card_type:1,
                                is_gray:0,
                                return_type:1,//返回类型 1：路费，2：U币，3：积分，4：卡券，5无
                                gray_reason:'',
                            },
                            {
                                license:'粤H ZY520',
                                color:'1',
                                used_flag:'2',//是否为营运车 1为非营运车，其他为营运车
                                card_no:'7890123',
                                card_type:2,
                                is_gray:0,
                                return_type:2,//返回类型 1：路费，2：U币，3：积分，4：卡券，5无
                                gray_reason:'',
                            },
                        ],
                        count:1,
                    }
                };
                json = {
                    code:0,
                    data:{
                        info:[],
                        count:0,
                    }
                };*/

                if(json.code == 0){
                    _self.json_data = json.data;
                } else {
                    utils.alert(json.msg);
                }
            }
        });
    },
    //各种方法
    methods: {
        selectCard:function(event){
            //使当前点击事件指向最外层标签
            var $this = $(event.target).hasClass("card_mod")?$(event.target):$(event.target).parents(".card_mod");

            if($this.hasClass("disabled")){
                return;
            }

            //清空选择
            $(".card_mod").removeClass("selected");
            var $radios = $(".card_mod").find(".iconfont");
            $radios.removeClass(".con-checkbox").removeClass("icon-checkbox1");
            $radios.addClass("icon-checkbox1");

            //选择
            $this.addClass("selected");
            $this.find(".iconfont").removeClass("icon-checkbox1").addClass("icon-checkbox");

            var id = $this.data("id");
            this.selectedCard = id ;

            console.log("选择粤通卡:"+this.selectedCard);

        },
        submit:function(event){
            var _self = this;
            if(_self.selectedCard == ''){
                utils.alert('请选择粤通卡');
            }else{
                console.log("激活特权卡，粤通卡号:"+_self.selectedCard);
                utils.commonAjax({
                    url:'/privilege/active-card/activePrivilegeCode',
                    data:{
                        token:_self.token,
                        code:_self.code,
                        activateCode:_self.activate_code,
                        cardno:_self.selectedCard,
                    },
                    beforeSend:function(){
                        utils.prompt_nodelay("激活中...");
                    },
                    complete:function(){
                        $(".dialog-prompt-nodelay").remove();
                    },
                    success:function(json){
                        console.log(json);
                        /*json = {
                            code:0,
                            data:true,
                            msg:'success',
                        };*/

                        if(json.code == 0 || json.data){
                            window.location.href='/view/card_detail.html?card_id='+ _self.card_id +'&token='+_self.token;
                        } else {
                            utils.alert(json.msg);
                        }
                    }
                });


            }
        },
        addEtcCard:function(){
            let _self = this;
            if(utils.isWeixin() || !_self.platform){
                utils.confirm({
                    content:'下载ETC车宝才能添加粤通卡哦！',
                    okText:'以后再说',
                    cancelText:'立即下载',
                },function(flag){
                    if(!flag){
                        utils.awakeAPP();
                    }
                })
            }else{
                console.log("app指令-添加粤通卡");
                utils.goToApp("bindCard","scene==1||url==api-card"+utils.getPrefix()+".etcchebao.com/view/card_detail.html?token="+this.token+"&card_id="+this.card_id+"&isAppBind=true&setHeadView=0");
            }

        },
        // showETCbindingError:function(){
        //     var img_dialog_obj = {
        //         content:'提示：您所绑定的粤通卡不符合返还规则无法激活特权卡',
        //         img:'../images/bg_etccards.png',
        //         btnText:'查看原因',
        //     };
        //     utils.img_dialog(img_dialog_obj,function(flag){
        //         if(flag){
        //             location.href = "/privilege_card/view/statement.html";
        //         }
        //     });
        // },

        //获取返还类型中文
        getReturnTypeCHS:function(code){
            //1：路费，2：U币，3：积分，4：卡券，5无
            var strArr = ['','路费','U币','积分','卡券','无'];
            return strArr[code];
        },
        //获取卡类型中文
        getCardTypeCHS:function(code){
            //1、储值卡，2、记账卡，3、地标卡
            var strArr = ['','储值卡','记账卡','地标卡'];
            return strArr[code];
        }
    }
});
