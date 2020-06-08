const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const shotIdGen = require('shortid');
const success = require('../libs/success.js');
const bad = require('../libs/bad.js')
// Get the DynamoDB table name from environment variables
const tableName = process.env.Url_Table;


/**
 * get original url and save to DynamoDB .
 */
exports.toShotUrlLambdaHandler = async (event) => {
    console.info('received:', event);

    if (event.httpMethod !== 'POST') {
        return bad();
    }

    try {
        // Get url from the body of the request
        const body = JSON.parse(event.body);
        const originUrl = body.url;
        const shotId = shotIdGen.generate();

        if (!isValid(originUrl)) {
            return bad();
        }
    
        // Save to DDB
        await docClient.put({
            TableName: tableName,
            Item: { shotId: shotId, originUrl: originUrl }
        }).promise();

        return success(JSON.stringify({ shotId: shotId, originUrl: originUrl }));;
    }
    catch (error) {
        console.error('error:', error.stack);
        return bad();
    }
}

function isValid(url) {
    let urlTester = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
    return urlTester.test(url);
}