const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const redirect = require('../libs/redirect');
const bad = require('../libs/bad');
const reject = require('../libs/reject');

/**
 * get shotId from path get original url from DynamoDB.
 */
exports.redirectToUrlLambdaHandler = async (event) => {
    if (event.httpMethod !== 'GET') {
        return reject();
    }

    try {
        //get shotId from query path
        const shotId = getShotIdFromPath(event);
  
        const result = await getUrlBy(shotId);
        
        return redirect(result.Item.originUrl);
    }
    catch (error) {
        return bad(error);
    }
}   
    
var getShotIdFromPath = function (event) {
    return event.pathParameters.shotId;
}  

var getUrlBy = async function (shotId) {
    const result = await docClient.get({
        TableName: process.env.Url_Table,
        Key: { shotId: shotId },
    }).promise();
    if (!result.Item) {
        throw new Error('redirect url not found');
    }
    return result;
}