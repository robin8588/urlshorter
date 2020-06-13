const lambda = require('../../../src/handlers/to-short-url.js');
const dynamodb = require('aws-sdk/clients/dynamodb');
 
// All tests for toShortUrlLambdaHandler() 
describe('Test toShortUrlLambdaHandler', function () { 
    let putSpy; 
 
    beforeAll(() => { 
        putSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'put'); 
    }); 
 
    afterAll(() => { 
        putSpy.mockRestore(); 
    }); 
 
    // Test invokes toShortUrlLambdaHandler() and compare the result when success 
    it('test get short url success', async () => { 
        const originUrl = 'https://www.test.com';
 
        //mock DDB put success returned value
        putSpy.mockReturnValue({ 
            promise: () => Promise.resolve({}) 
        }); 
 
        const event = { 
            httpMethod: 'POST', 
            body: JSON.stringify({url:originUrl})
        }; 
     
        // Invoke toShortUrlLambdaHandler() 
        const response = await lambda.toShortUrlLambdaHandler(event); 
        
        // Compare the result with the expected result 
        expect(response.statusCode).toEqual(200); 
        const responseBody = JSON.parse(response.body);
        expect(responseBody.originUrl).toEqual(originUrl); 
        expect(responseBody.shortId).not.toBeNull();
    }); 

    it('test get short url wrong method', async () => { 
        
        const event = { 
            httpMethod: 'GET'
        } 
 
        const result = await lambda.toShortUrlLambdaHandler(event); 
 
        expect(result.statusCode).toEqual(405); 
    }); 

    it('test send invalid url', async () => { 
        const originUrl = 'www.test.com';
 
        //mock DDB put success returned value
        putSpy.mockReturnValue({ 
            promise: () => Promise.resolve() 
        }); 
 
        const event = { 
            httpMethod: 'POST', 
            body: JSON.stringify({url:originUrl})
        }; 
     
        // Invoke toShortUrlLambdaHandler() 
        const result = await lambda.toShortUrlLambdaHandler(event); 
 
        // Compare the result with the expected result 
        expect(result.body).toEqual('invalid url'); 
    }); 

    it('test send null url', async () => { 
        const originUrl = '';
 
        //mock DDB put success returned value
        putSpy.mockReturnValue({ 
            promise: () => Promise.resolve() 
        }); 
 
        const event = { 
            httpMethod: 'POST', 
            body: JSON.stringify({url:originUrl})
        }; 
     
        // Invoke toShortUrlLambdaHandler() 
        const result = await lambda.toShortUrlLambdaHandler(event); 
 
        // Compare the result with the expected result 
        expect(result.body).toEqual('parameter not found'); 
    }); 
}); 
 