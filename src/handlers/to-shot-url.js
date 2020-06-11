const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const shotIdGen = require('shortid');
const success = require('../libs/success');
const bad = require('../libs/bad');
const reject = require('../libs/reject');


/**
 * get original url and save to DynamoDB .
 */
exports.toShotUrlLambdaHandler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return reject();
    }
    
    try {
        // Get url from the body of the request
        const originUrl = getUrl(event);
        
        validUrl(originUrl);

        const shotId = await genValidShotId();
        
        // Save to DDB
        await saveUrl(shotId, originUrl);

        return success({ shotId: shotId, originUrl: originUrl });
    }
    catch (error) {
        return bad(error);
    }
}

var validUrl = function(url) {
    let urlTester = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
    if (!urlTester.test(url)) {
        throw new Error('invalid url');
    }
}

var genValidShotId = async function () {
    const shotId = shotIdGen.generate();
    const result = docClient.get({
        TableName: process.env.Url_Table,
        Key: { shotId: shotId },
    }).promise();
    if (result.Item) {
        console.info(shotId + ' exist ');
        await genValidShotId();
    } else {
        return shotId;
    }
}

var getUrl = function (event) {
    let body = JSON.parse(event.body);
    if (!body || !body.url) {
        throw new Error('parameter not found')
    }
    return body.url;
}

var saveUrl = function (shotId, originUrl) {
    return docClient.put({
        TableName: process.env.Url_Table,
        Item: { shotId: shotId, originUrl: originUrl }
    }).promise();
}