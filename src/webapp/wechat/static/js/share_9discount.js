var utils = require('utils');

const app = new Vue({
    el: '#app',
    data: {
        phone:'',//手机号
        card_id:utils.queryString('card_id'),
        wc_name:'',//微信用户名称
        openid:'',
        show_status:-1,//显示状态，-1：无状态，0：待领取；1：已领取；2：领取成功；
        hasGot:false,
        notice:'',
    },
    beforeCreate: function() {
        utils.adaptive();
    },
    mounted: function() {
        var _this = this;

        //百度统计
        utils.hmBaidu();

        _this.openid = _this.checkAuthorize();

        //微信二次分享
        var wxObj = {
            title:'速领！送你一张ETC 9折特权卡',
            desc:'全年路费9折，全网独家车主ETC特权卡，赶紧领取吧！',
            img:'https://api-card'+utils.getPrefix()+'.etcchebao.com/images/appshare.jpg',
            link:'https://api-card'+utils.getPrefix()+'.etcchebao.com/view/share_9discount.html?card_id=' + _this.card_id,
        };
        utils.wxShare(wxObj);

        utils.commonAjax({
            url:'/privilege/card/isActivityPresentValid',
            //url:'',
            data:{
                card_id:_this.card_id,
            },
            beforeSend:function(){
                utils.prompt_nodelay('加载中');
            },
            complete:function(){
                $(".dialog-prompt-nodelay").remove();
            },
            success:function(json){
                //模拟数据
                /*json = {
                    code:0,
                    data:true,
                    msg:'success'
                };*/
                console.log(json);
                if(json.code == 0){
                    if(json.data){
                        _this.show_status = 0;

                        //微信授权验证
                        if(_this.openid){
                            utils.getWcUserinfo(_this.openid,function(userinfo){
                                _this.wc_name = userinfo.nickname;
                            });
                        }else{
                            utils.toAuthorize(location.href);
                        }

                    }else{
                        _this.show_status = 1;
                    }
                }else{
                    alert(json.msg);
                }
            }
        });
    },
    //各种方法
    methods: {
        //检测授权
        checkAuthorize:function(){
            var openid = utils.queryString('openid');
            if(!openid){
                openid = utils.getCookie('openid');
            }
            if(openid){
                utils.setCookie('openid',openid,365);
                return openid;
            }
        },
        submit:function(){
            console.log("领取");
            var _this = this;
            if(!_this.phone){
                utils.prompt('手机号不能为空');
                return;
            }else if(_this.phone.length != 11){
                utils.prompt('输入的手机号有误');
                return;
            }

            utils.commonAjax({
                url:'/privilege/card/activityPresentGet',
                // url:'',
                data:{
                    phone:_this.phone,
                    wc_name: _this.wc_name,
                    card_id:_this.card_id,
                },
                beforeSend:function(){
                    utils.prompt_nodelay('正在领取...');
                },
                complete:function(){
                    $(".dialog-prompt-nodelay").remove();
                },
                // type:'jsonp',
                success:function(json){
                    //模拟数据
                    /*json = {
                        code:0,
                        data:true,
                        msg:'success'
                    };*/
                    console.log(json);
                    if(json.code == 0){
                        if(json.data){
                            _this.show_status = 2;
                        }else{
                            _this.hasGot = true;
                            _this.notice = json.msg;
                        }
                    }else if(json.code==-2002){
                        utils.alert("网络延迟，请稍后再试");
                    }else{
                        utils.alert(json.msg);
                    }
                }
            });
        },
        toGet:function(){
            console.log("进入活动页面");
            location.href='https://mg'+utils.getPrefix()+'.etcchebao.com/mgHtml/operactivities/groupinsure/active_main_g.html?platformType=9';
        },
        use:function(){
            console.log("唤起app");
            utils.awakeAPP();
        },
    }
});
