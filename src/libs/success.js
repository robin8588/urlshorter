'use strict';

function success(body) {
    return  {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
        body: body
    }
}

module.exports = success;