
<template>
    <header :class="{'ios':platform=='app_ios'}">
        <div @click="hide_back?'':back_close?close():toBack()" class="toBack">
            <span class="arrow_left"></span>
        </div>
        <div class="title">
            {{title?title:'粤通卡·ETC车宝'}}
        </div>
        <div @click="hide_close?'':close()" class="right" v-if='!right_text'>
            <img src="../images/icon_close.png" class="icon_close"></img>
        </div>
        <!--定制 - 兑换激活码-->
        <div @click.stop="convert_code()" class="right" v-if='right_text == "兑换激活码"'>
            <span>{{right_text}}</span>

            <div class="convert_code_list">
                <div class="convert_code_list_item" @click.stop="convert_code_scan">
                    <img src="../images/icon_scan.png">
                    <span>扫一扫</span>
                </div>
                <div class="convert_code_list_item" @click.stop="convert_code_input">
                    <img src="../images/icon_edit.png">
                    <span>输入兑换码</span>
                </div>
            </div>
        </div>

        <!--兑换码框-->
        <div class="common_dialog convert">
            <div class="common_dialog_main">
                <div class="convert_mod">
                    <div class="title">
                        请输入兑换码
                    </div>
                    <div class="input">
                        <input type="text" placeholder="点击输入兑换码" v-model="sn">
                    </div>
                    <div class="error">
                    </div>
                    <div class="btn_mod">
                        <div class="btn">
                            提交
                        </div>
                    </div>
                </div>
            </div>
            <div class="dialog-overlay"></div>
        </div>

    </header>
</template>

<style>
    /*头部*/
    header{
        position: fixed;
        /*overflow: auto;*/
        background-color: #262626;
        color: #c8c8c8;
        width:100%;
        z-index: 9999;
    }
    header.ios{
        padding-top:1rem;
    }
    header>div{
        font-size: 0.8rem;
        float: left;
        box-sizing: border-box;
        text-align: center;
        line-height: 260%;
    }
    header .toBack,header .right{
        text-align: left;
        width:25%;
    }
    header .title {
        width: 50%;

        /*文本超出显示省略号*/
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    header .right{
        text-align: right;
        width:25%;
        /*position: relative;*/
    }
    /*左箭头*/
    .arrow_left{
        border-top:2px solid #fff;
        border-left:2px solid #fff;
        padding:0.25rem;
        width:0;
        display:inline-block;

        -webkit-transform:rotate(-45deg); /* Safari 和 Chrome */
        -moz-transform:rotate(-45deg); 	/* Firefox */
        -ms-transform:rotate(-45deg); 	/* IE 9 */
        -o-transform:rotate(-45deg); 	/* Opera */
        transform:rotate(-45deg);

    }
    header .toBack>*{
        margin-left:1rem;
    }
    header .right>*{
        margin-right:0.5rem;
    }

    /*右箭头*/
    /*.arrow_right{
        border-top:2px solid #989898;
        border-left:2px solid #989898;
        padding:0.15rem;
        width:0;
        display:inline-block;

        -webkit-transform:rotate(135deg); !* Safari 和 Chrome *!
        -moz-transform:rotate(135deg); 	!* Firefox *!
        -ms-transform:rotate(135deg); 	!* IE 9 *!
        -o-transform:rotate(135deg); 	!* Opera *!
        transform:rotate(135deg);

    }*/
    .arrow_right{
        width: 0.5rem;
        height: 0.5rem;
        display: inline-block;
        background: url(../images/lgt.jpg) no-repeat right center;
        background-size: contain;
    }

    /*兑换码框*/
    .common_dialog{
        display: none;
    }
    .convert_code_list{
        z-index: 10000;
        background: #262626;
        position: absolute;
        right:0;
        -webkit-border-radius: 0.2rem;
        -moz-border-radius: 0.2rem;
        border-radius: 0.2rem;
        margin-top:0.25rem;
        display: none;
    }
    .convert_code_list:before{
        content: '';
        width: 0;
        height: 0;
        border-left: 0.3rem solid transparent;
        border-right: 0.3rem solid transparent;
        border-bottom: 0.3rem solid #262626;
        position: absolute;
        right: 1.25rem;
        top: -0.25rem;
    }
    .convert_code_list_item{
        padding:0.5rem 0;
        text-align: left;
        line-height: 100%;
        border-bottom:1px solid #3c3c3c;
    }
    .convert_code_list_item img{
        display: inline-block;
        width :0.8rem;
        height:0.8rem;
        margin:0 0.5rem;
        vertical-align: middle;
    }
    .convert_code_list_item span{
        flex:5;
        display: inline-block;
        margin-right:0.5rem;
        vertical-align: middle;
    }
    .convert_code_list_item:last-child{
        border-bottom:0;
    }

    .convert_mod{
        background: #fff;
        -webkit-border-radius:0.2rem;
        -moz-border-radius:0.2rem;
        border-radius:0.2rem;
    }
    .convert_mod *{
        line-height:150%;
    }

    .convert_mod .title{
        font-size:0.85rem;
        padding:1rem 0;
        font-weight: bold;
        color: #000;
        width:100%;
        text-align: center;
    }
    .convert_mod .input{
        padding:0 1rem;
        padding-bottom:1rem;
    }
    .convert_mod .input input{
        padding:0.5rem 0.625rem;
        border:1px solid #dfdfdf;
        font-size:0.75rem;
        width:100%;

        appearance:button;
        -moz-appearance:button; /* Firefox */
        -webkit-appearance:button; /* Safari 和 Chrome */

    }
    .convert_mod .error{
        font-size:0.6rem;
        color: #fa4e4e;
        text-align: left;
        margin:0 0.75rem;
        padding-bottom:0.5rem;
        display: none;
    }
    .convert_mod .btn_mod{
        margin:0 0.75rem;
        padding-bottom:0.75rem;

    }
    .convert_mod .btn_mod .btn {
        padding: .5rem 0;
        background: #EABF50;
        color: #8e4d00;
        border-radius: .125rem;
    }
</style>

<script>
    var utils = require('utils');

    module.exports = Vue.extend({
        props: {
            hide_back:Boolean,//是否隐藏返回按钮
            hide_close:Boolean,//是否隐藏关闭按钮
            back_url:String,//返回链接
            back_close:Boolean,//返回是否关闭当前页面
            title: String,//标题
            right_text:String,//右侧文本
        },
        data(){
            return{
                token:'',
                platform:'',
                sn:'',//兑换码
            }
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
            console.log(_self.platform);

            if(_self.platform == 'app_ios'){
                $("#main").css('paddingTop','3.125rem');
            }

            if(_self.hide_back){
                $("header .toBack").html('&nbsp;');
            }

            if(_self.hide_close){
                $("header .close").html('&nbsp;');
            }

            //扫码结果
            window.scanningTdBack = function(result){
                console.log('扫码结果：'+result);
                _self.sn = result;
                _self.convert_code_input();
            }
        },
        methods:{
            toBack:function(){
                var _self = this;
                if(!_self.back_url){
                   window.history.go(-1);
                }else{
                    window.location.href = _self.back_url;
                }
            },
            close:function(){
                var _self = this;
                console.log('app关闭当前webview');
                utils.goToApp('closeWebView','-1')
            },

            //定制-兑换激活码
            convert_code:function(){
                $(".convert_code_list").show();
                $("body>*").click(function(e){
                    $(".convert_code_list").hide();
                });
            },
            //扫描
            convert_code_scan:function(){
                $(".convert_code_list").hide();
                utils.goToApp('scanningTDCallJs','-1');
            },

            //打开 兑换框
            convert_code_input:function(){
                let _self = this;

                $(".convert_code_list").hide();
                $(".convert").show();

                $(".common_dialog .dialog-overlay").click(function () {
                    $(".common_dialog").hide();
                });

                $(".convert_mod .btn").click(function(){
                    if(!_self.sn){
                        $(".convert_mod .error").html("输入有误，请重新输入");
                        $(".convert_mod .error").show();
                        $(".convert_mod input").focus();
                        return;
                    }

                    utils.commonAjax({
                        url:'/vipcard/vip/exchangeCard',
                        data:{
                            token:_self.token,
                            sn:_self.sn,
                        },
//                      dataType:'jsonp',
                        success:function(json){
                            //TODO 模拟数据
                            /*json = {
                                code:0,
                                msg:'success',
                            }*/
                            console.log(json);
                            if(json.code==0){
                                console.log('提交成功');
                                $(".common_dialog").hide();
                                utils.alert('提交成功',function(){
                                    location.reload();
                                });
                            }else{
                                $(".convert_mod .error").html(json.msg);
                                $(".convert_mod .error").show();
                                $(".convert_mod input").focus();
                            }
                        },
                        error:function(){
                            $(".convert_mod .error").html("输入有误，请重新输入");
                            $(".convert_mod .error").show();
                            $(".convert_mod input").focus();
                        }
                    });
                });

                /*utils.common_dialog({
                    content:'<div class="convert_mod">\
                                <div class="title">\
                                    请输入兑换码\
                                </div>\
                                <div class="input">\
                                    <input type="text" placeholder="点击输入兑换码">\
                                </div>\
                                <div class="error">\
                                </div>\
                                <div class="btn_mod">\
                                    <div class="btn">\
                                        提交\
                                    </div>\
                                </div>\
                             </div>',
                    dialog_event:function(){
                        $(".convert_mod .btn").click(function(){
                            var val = $(".convert_mod input").val();
                            if(!val){
                                $(".convert_mod .error").html("输入有误，请重新输入");
                                $(".convert_mod .error").show();
                                $(".convert_mod input").focus();
                                return;
                            }

                            $.ajax({
                                url:'?code='+val,
//                                dataType:'jsonp',
                                success:function(json){
                                    //模拟数据
//                                    json = {
//                                        code:1,
//                                        msg:'success',
//                                    }
                                    if(json.code==1){
                                        console.log('提交成功');
                                        $(".common_dialog").remove();
                                    }else{
                                        $(".convert_mod .error").html(json.msg);
                                        $(".convert_mod .error").show();
                                        $(".convert_mod input").focus();
                                    }
                                },
                                error:function(){
                                    $(".convert_mod .error").html("输入有误，请重新输入");
                                    $(".convert_mod .error").show();
                                    $(".convert_mod input").focus();
                                }
                            });
                        });
                    }
                });*/
            }
        }
    });
</script>
