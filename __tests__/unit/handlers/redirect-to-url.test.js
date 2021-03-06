const lambda = require('../../../src/handlers/redirect-to-url.js'); 
const dynamodb = require('aws-sdk/clients/dynamodb'); 
const shortIdGen = require('short-id');

// All tests for redirectToUrlLambdaHandler() 
describe('Test redirectToUrlLambdaHandler', () => { 
    let getSpy; 
 
    beforeAll(() => { 
        getSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'get'); 
    }); 
 
    afterAll(() => { 
        getSpy.mockRestore(); 
    }); 
 
    // Test redirectToUrlLambdaHandler() and compare the result when success
    it('test redirect to url success', async () => { 
        const originUrl = 'https://www.google.com';
        const shortId = shortIdGen.generate();
        const returnedItem = { shortId: shortId, originUrl: originUrl }; 
 
        // Mock get item from DDB 
        getSpy.mockReturnValue({ 
            promise: () => Promise.resolve({ Item: returnedItem }) 
        }); 
 
        const event = { 
            httpMethod: 'GET', 
            pathParameters: { shortId: shortId }
        } 
 
        // Invoke redirectToUrlLambdaHandler() 
        const result = await lambda.redirectToUrlLambdaHandler(event); 
 
        // Compare the result with the expected result 
        expect(result.statusCode).toEqual(301); 
    }); 

    it('test redirect to url wrong method', async () => { 
        
        const event = { 
            httpMethod: 'POST'
        } 
 
        const result = await lambda.redirectToUrlLambdaHandler(event); 
 
        expect(result.statusCode).toEqual(405); 
    });

    it('test redirect url not found', async () => { 
        
        const event = { 
            httpMethod: 'GET',
            pathParameters: { shortId: 'shortid' }
        } 
 
        getSpy.mockReturnValue({ 
            promise: () => Promise.resolve({}) 
        }); 

        const result = await lambda.redirectToUrlLambdaHandler(event); 
 
        expect(result.body).toEqual('redirect url not found'); 
    });
}); 
 