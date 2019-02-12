'use strict';
var https = require('https');

const dbg = true;

function log(type, context, object) {
    if (type == "err")
        console.log("ERROR:" + context + ":\n " + JSON.stringify(object, null, 2));
    else if (type == "dbg" && dbg)
        console.log("DEBUG:" + context + ":\n " + JSON.stringify(object, null, 2));
}

exports.handler = function(payload, context, callback) {

    log("dbg", "postHeatMap", payload);

    var idRequester = payload.idRequester;
    var period = payload.period;
    var area = payload.area;

    var data = {
        content: {
            type: "CUSTOM",
            message: "{" +
                "'beginDate':'" + period.from + "'," +
                "'endDate':'" + period.to + "'," +
                "'latitude':" + area.center.latitude + "," +
                "'longitude':" + area.center.longitude + "," +
                "'radius':" + area.radius + "," +
                "'kind':'RequestLocation'," +
                "'requesterId': '" + idRequester + "'" +
                "}"
        }
    }


    log("dbg", "postHeatMap-data", data);


    var options = {
        hostname: 'api.nimbees.com',
        path: '/nimbees_platform_server_api/sendNotification/',
        method: 'POST',
        headers: {
            "authorization": "Basic eW5HaUE4amV0TjlnaWNmNTozaXBtV3hhM2RUSW95cXNk",
            'Content-Type': 'application/json'
        }
    };

    log("dbg", "postHeatMap-options", options);
    

    var req = https.request(options, function(res) {
        log("dbg", "postHeatMap-res-statusCode", res.statusCode);
        log("dbg", "postHeatMap-res-Headers", JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function(responseBody) {
            log("dbg", "postHeatMap-res-responseBody", responseBody);
            var response = JSON.parse(responseBody);
            log("dbg", "postHeatMap-res-response", response);
            callback(null, response);
        });
    });

    req.on('error', function(err) {
        log("err", "postHeatMap", err);
        callback(new Error(err));
    });


    req.write(JSON.stringify(data, null, 2));
    req.end();


};
