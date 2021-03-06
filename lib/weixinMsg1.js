const express = require('express');
const access_token = require('../lib/access_token_1');
var m_userInfo = require("../lib/userInfo");
const request = require('request');
const router = express.Router();
var log = require('log4js').getLogger("lib/weixinMsg1");
log.level = "debug";

var urlQR = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=';
let sendMsg = function (toUserid, msg, callback) {
    log.debug("toUserid :" + toUserid);
    m_userInfo.getUserInfo(toUserid, function (userInfo) {

        let openid = userInfo.openid;
        if (openid == "") {
            log.error("can't get openid :userid " + toUserid);
        } else {
            m_userInfo.getUserFormid(userInfo, function (formid) {
                log.debug("openid:" + openid);
                log.debug("formid:" + formid);

                let page='page/booking/qrBookingDetails?bookingId='+msg.id;
                if(msg.page){
                    page=msg.page;
                }
                access_token((accessToken) => {
                    //let accessToken="";
                    console.log("accessToken:" + accessToken);
                    // set content-type header and data as json in args parameter
                    let options = {
                        method: 'post',
                        url: urlQR + accessToken,
                        json: true,
                        headers: {
                            "content-type": "application/json",
                        },

                        body: {
                            'touser': openid,
                            'template_id': 'brT-70QtTc7c8uQ8RqXFTc6sz9KKQfKtGusrn4amM6Y',
                            'page': msg.page ,
                            'form_id': formid,
                            'data': {
                                keyword1: {
                                    value: msg.real_name ? msg.real_name : ""

                                },
                                keyword2: {
                                    value: msg.time_format ? msg.time_format : ""
                                },
                                keyword3: {
                                    value: msg.job_location ? msg.job_location : ""
                                },
                                keyword4: {
                                    value: msg.memo ? msg.memo : ""
                                },
                                keyword5: {
                                    value: msg.status ? msg.status : ""
                                }
                            }
                            ,
                            'emphasis_keyword': 'keyword5.DATA'

                        }
                    };
                    request(options, function (err, res1) {

                        if (!err && res1.body.errcode == 0) {
                            let errTmp = null;
                            callback(errTmp);
                        } else {
                            log.error("sendMsg:" + toUserid + " res:" + res1.body.errmsg);
                            let errTmp = {};
                            errTmp.msg = res1.body.errmsg;
                            errTmp.code=res1.body.errcode;
                            callback(errTmp);

                        }
                    })
                });


            });
        }

    });
};


exports.sendMsg1 = sendMsg;

