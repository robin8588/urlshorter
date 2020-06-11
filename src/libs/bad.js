'use strict';

function bad(error) {
  console.error(error);
  return {
    statusCode: 400,
    headers: {
      "Content-Type": "text/plain"
    },
    isBase64Encoded: false,
    body: error.message
  }
}

module.exports = bad;
