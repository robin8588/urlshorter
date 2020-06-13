const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const shortIdGen = require('short-id');
const success = require('../libs/success');
const bad = require('../libs/bad');
const reject = require('../libs/reject');


/**
 * get original url and save to DynamoDB .
 */
exports.toShortUrlLambdaHandler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return reject();
    }
    
    try {
        const originUrl = getUrl(event);
        
        validUrl(originUrl);

        const shortId = await genValidShortId();
        
        await saveUrl(shortId, originUrl);

        return success({ shortId: shortId, originUrl: originUrl });
    }
    catch (error) {
        return bad(error);
    }
}

/**
 * valid the input url
 * @param {*} url 
 */
var validUrl = function(url) {
    let urlTester = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
    if (!urlTester.test(url)) {
        throw new Error('invalid url');
    }
}

/**
 * generate unique short id
 */
var genValidShortId = async function () {
    const shortId = shortIdGen.generate();
    const result = docClient.get({
        TableName: process.env.Url_Table,
        Key: { shortId: shortId },
    }).promise();
    if (result.Item) {
        console.info(shortId + ' exist ');
        await genValidShortId();
    } else {
        return shortId;
    }
}

/**
 * get url from the body of the request
 * @param {*} event 
 */
var getUrl = function (event) {
    let body = JSON.parse(event.body);
    if (!body || !body.url) {
        throw new Error('parameter not found')
    }
    return body.url;
}

/**
 * save shortId and originUrl to DDB
 * @param {*} shortId 
 * @param {*} originUrl 
 */
var saveUrl = function (shortId, originUrl) {
    return docClient.put({
        TableName: process.env.Url_Table,
        Item: { shortId: shortId, originUrl: originUrl }
    }).promise();
}