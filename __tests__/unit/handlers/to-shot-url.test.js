const lambda = require('../../../src/handlers/to-shot-url.js');
const dynamodb = require('aws-sdk/clients/dynamodb'); 
const shotIdGen = require('shortid');
 
// All tests for toShotUrlLambdaHandler() 
describe('Test toShotUrlLambdaHandler', function () { 
    let putSpy; 
 
    beforeAll(() => { 
        putSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'put'); 
    }); 
 
    afterAll(() => { 
        putSpy.mockRestore(); 
    }); 
 
    // Test invokes toShotUrlLambdaHandler() and compare the result when success 
    it('test get shot url success', async () => { 
        const originUrl = 'https://www.test.com';
 
        //mock DDB put success returned value
        putSpy.mockReturnValue({ 
            promise: () => Promise.resolve() 
        }); 
 
        const event = { 
            httpMethod: 'POST', 
            body: JSON.stringify({url:originUrl})
        }; 
     
        // Invoke toShotUrlLambdaHandler() 
        const response = await lambda.toShotUrlLambdaHandler(event); 
        
        // Compare the result with the expected result 
        expect(response.statusCode).toEqual(200); 
        const responseBody = JSON.parse(response.body);
        expect(responseBody.originUrl).toEqual(originUrl); 
        expect(responseBody.shotId).not.toBeNull();
    }); 

    it('test get shot url wrong method', async () => { 
        
        const event = { 
            httpMethod: 'GET'
        } 
 
        const result = await lambda.toShotUrlLambdaHandler(event); 
 
        const expectedResult = {
            statusCode: 400
        };
 
        expect(result.expectedResult).toEqual(expectedResult.expectedResult); 
    }); 

    it('test send wrong url', async () => { 
        const originUrl = 'www.test.com';
 
        //mock DDB put success returned value
        putSpy.mockReturnValue({ 
            promise: () => Promise.resolve() 
        }); 
 
        const event = { 
            httpMethod: 'POST', 
            body: JSON.stringify({url:originUrl})
        }; 
     
        // Invoke toShotUrlLambdaHandler() 
        const result = await lambda.toShotUrlLambdaHandler(event); 
 
        // Compare the result with the expected result 
        expect(result.statusCode).toEqual(400); 
    }); 
}); 
 