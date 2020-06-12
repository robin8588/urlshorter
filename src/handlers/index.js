/**
 * welcome page
 */
exports.indexLambdaHandler = async () => {
    let html = '<html>' +
        '<head><title>Url Shoter API</title></head>' +
        '<body><h1>Welcome to Url Shoter API</h1>' +
        '<p>please visit <a href="http://shoturlweb.s3-website.ap-northeast-2.amazonaws.com/swagger/"> swagger </a> page for details</p></body> ' +
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