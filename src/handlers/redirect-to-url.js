const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const redirect = require('../libs/redirect.js');
const bad = require('../libs/bad.js')
// Get the DynamoDB table name from environment variables
const tableName = process.env.Url_Table;

/**
 * get shotId from path get original url from DynamoDB.
 */
exports.redirectToUrlLambdaHandler = async (event) => {
    console.info('received:', event);
  
    if (event.httpMethod !== 'GET') {
        return bad();
    }

    try {
        //get shotId from query path
        const shotId = getShotIdFromPath(event);
  
        const result = await docClient.get({
            TableName: tableName,
            Key: { shotId: shotId },
        }).promise();

        console.info('getresult:', result);

        return redirect(result.Item.originUrl);
    }
    catch (error) {
        console.error('error:', error.stack);
        return bad();
    }
}   
    
function getShotIdFromPath(event) {
    return event.pathParameters.shotId;
}   