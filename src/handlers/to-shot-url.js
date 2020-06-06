const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const shotIdGen = require('shortid');
// Get the DynamoDB table name from environment variables
const tableName = process.env.Url_Table;

/**
 * get original url and save to DynamoDB .
 */
exports.toShotUrlLambdaHandler = async (event) => {
    console.info('received:', event);

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 400
        };
    }

    try {
        // Get url from the body of the request
        const body = JSON.parse(event.body);
        const originUrl = body.url;
        const shotId = shotIdGen.generate();

        var params = {
            TableName: tableName,
            Item: { shotId: shotId, originUrl: originUrl }
        };

        // Save to DDB
        await docClient.put(params).promise();

        const response = {
            statusCode: 200,
            body: JSON.stringify({ shotId: shotId, originUrl: originUrl })
        };
        console.info('response:', response);

        return response;
    } catch (error) {
        console.info('error:', error.stack);
        return {
            statusCode: 400
        };
    }
}