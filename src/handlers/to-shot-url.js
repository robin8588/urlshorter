const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const shotIdGen = require('shortid');
// Get the DynamoDB table name from environment variables
const tableName = process.env.DDB_TABLE;

/**
 * get original url and save to DynamoDB .
 */
exports.toShotUrlLambdaHandler = async (event) => {
    if (event.httpMethod !== 'POST') {
        const response = {
            statusCode: 400
        };
        return response;
    }
    
    console.info('received:', event);

    // Get url from the body of the request
    const body = JSON.parse(event.body)
    const originUrl = body.url;
    const shotId = shotIdGen.generate();

    var params = {
        TableName : tableName,
        Item: { shotId : shotId, originUrl: originUrl }
    };

    // Save to DDB
    const result = await docClient.put(params).promise();

    console.info('putresult:', result);
    
    const response = {
        statusCode: 200,
        body: JSON.stringify(result)
    };

    console.info('response:',response);
    return response;
 }
