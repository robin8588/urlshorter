/**
 * return 405 and reject http request method
 */
function reject() {
    return  { statusCode: 405 }
}

module.exports = reject;