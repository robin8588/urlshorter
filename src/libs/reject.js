'use strict';

function reject() {
    return  { statusCode: 405 }
}

module.exports = reject;