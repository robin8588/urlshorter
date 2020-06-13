const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const redirect = require('../libs/redirect');
const bad = require('../libs/bad');
const reject = require('../libs/reject');

/**
 * get shortId from path get original url from DynamoDB and redirect to original url
 */
exports.redirectToUrlLambdaHandler = async (event) => {
    if (event.httpMethod !== 'GET') {
        return reject();
    }

    try {
        const shortId = getShortIdFromPath(event);
  
        const result = await getUrlBy(shortId);
        
        return redirect(result.Item.originUrl);
    }
    catch (error) {
        return bad(error);
    }
}   

/**
 * get shortId from pathParameters.
 * @param {*} event 
 */
var getShortIdFromPath = function (event) {
    return event.pathParameters.shortId;
}  

/**
 * get original url from DynamoDB.
 * @param {*} shortId 
 */
var getUrlBy = async function (shortId) {
    const result = await docClient.get({
        TableName: process.env.Url_Table,
        Key: { shortId: shortId },
    }).promise();
    if (!result.Item) {
        throw new Error('redirect url not found');
    }
    return result;
}