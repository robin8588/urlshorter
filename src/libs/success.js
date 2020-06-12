/**
 * return 200 and return json format body
 * @param {*} body 
 */
function success(body) {
    return  {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
        },
        isBase64Encoded: false,
        body: JSON.stringify(body)
    }
}

module.exports = success;