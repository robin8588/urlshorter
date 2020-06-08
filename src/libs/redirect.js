'use strict';

function redirect(url) {
    return {
        statusCode: 301,
        headers: {
            Location: url
        }
    }
}

module.exports = redirect;