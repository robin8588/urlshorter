const lambda = require('../../../src/handlers/redirect-to-url.js'); 
const dynamodb = require('aws-sdk/clients/dynamodb'); 
const shotIdGen = require('shortid');

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
        const shotId = shotIdGen.generate();
        const returnedItem = { shotId: shotId, originUrl: originUrl }; 
 
        // Mock get item from DDB 
        getSpy.mockReturnValue({ 
            promise: () => Promise.resolve({ Item: returnedItem }) 
        }); 
 
        const event = { 
            httpMethod: 'GET', 
            pathParameters: { id: shotId }
        } 
 
        // Invoke redirectToUrlLambdaHandler() 
        const result = await lambda.redirectToUrlLambdaHandler(event); 
 
        const expectedResult = {
            statusCode: 301,
            headers: {
                Location: originUrl
            }
        };
 
        // Compare the result with the expected result 
        expect(result).toEqual(expectedResult); 
    }); 

    it('test redirect to url wrong method', async () => { 
        
        const event = { 
            httpMethod: 'POST'
        } 
 
        const result = await lambda.redirectToUrlLambdaHandler(event); 
 
        const expectedResult = {
            statusCode: 400
        };
 
        expect(result).toEqual(expectedResult); 
    }); 
}); 
 