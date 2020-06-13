/**
 * welcome page
 */
exports.indexLambdaHandler = async () => {
    let html = '<html>' +
        '<head><title>Url Shorter API</title></head>' +
        '<body><h1>Welcome to Url Shorter API</h1>' +
        '<p>please visit <a href="http://urlshorterweb.s3-website.ap-northeast-2.amazonaws.com/swagger/"> swagger </a> page for details</p></body> ' +
        '</html >';
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "text/html"
        },
        body: html
    }
}