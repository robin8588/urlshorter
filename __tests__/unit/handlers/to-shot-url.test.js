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
        const originUrl = 'https://www.google.com';
        const shotId = shotIdGen.generate();
        const returnedItem = { shotId: shotId, originUrl: originUrl }; 
 
        //mock DDB put success returned value
        putSpy.mockReturnValue({ 
            promise: () => Promise.resolve(returnedItem) 
        }); 
 
        const event = { 
            httpMethod: 'POST', 
            body: JSON.stringify({url:originUrl})
        }; 
     
        // Invoke toShotUrlLambdaHandler() 
        const result = await lambda.toShotUrlLambdaHandler(event); 
        
        const expectedResult = { 
            statusCode: 200, 
            body: JSON.stringify(returnedItem) 
        }; 
 
        // Compare the result with the expected result 
        expect(result).toEqual(expectedResult); 
    }); 

    it('test get shot url wrong method', async () => { 
        
        const event = { 
            httpMethod: 'GET'
        } 
 
        const result = await lambda.toShotUrlLambdaHandler(event); 
 
        const expectedResult = {
            statusCode: 400
        };
 
        expect(result).toEqual(expectedResult); 
    }); 
}); 
 