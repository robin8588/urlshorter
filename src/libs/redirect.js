/**
 * return 301 and redirect to url
 * @param {*} url 
 */
function redirect(url) {
    return {
        statusCode: 301,
        headers: {
            Location: url
        }
    }
}

module.exports = redirect;