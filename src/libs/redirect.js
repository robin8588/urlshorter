/**
 * return 301 and redirect to url
 * @param {*} url 
 */
function redirect(url) {
    return {
        statusCode: 301,
        headers: {
            Location: url
        },
        body:'<html><head><title>301 Moved Permanently</title></head><body bgcolor="white"><center><h1>301 Moved Permanently</h1></center><hr><center>ShotUrl</center></body></html>'
    }
}

module.exports = redirect;