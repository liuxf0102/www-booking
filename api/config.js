var express = require('express');
var router = express.Router();
const request = require('request');

var log = require('log4js').getLogger("api/config");
log.level = "debug";

router.get('/getConfig', function (req, res, next) {
    var response = [];
    let data={
        class: ['语文', '数学', '英语', '美术', '体育']
      
    }
    response.push({
        'result': 'success',
        'data': data
    });
    log.debug("getConfig:"+JSON.stringify(response));
    console.log("getConfig:"+JSON.stringify(response));
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(response));
});



module.exports = router;

