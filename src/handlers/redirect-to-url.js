const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
// Get the DynamoDB table name from environment variables
const tableName = process.env.DDB_TABLE;

/**
 * get shotId from path get original url from DynamoDB.
 */
exports.redirectToUrlLambdaHandler = async (event) => {
    if (event.httpMethod !== 'GET') {
        const response = {
            statusCode: 400
        };
        return response;
    }

    console.info('received:', event);
  
    const shotId = getShotIdFromPath(event.path);
  
    var params = {
      TableName : tableName,
      Key: { shotId: shotId },
    };

    const result = await docClient.get(params).promise();

    console.info('getresult:', result);

    const response = {
        statusCode: 301,
        headers: {
            Location: result.Item.originUrl
        }
    };
   
    console.info('response:',response);
    return response;
}   
    
function getShotIdFromPath(path) {
    return path.charAt(1);
}   