const lambda = require('../../../src/handlers/index.js'); 

describe('Tests index', function () {
    it('verifies ok response', async () => {
        const result = await lambda.indexLambdaHandler();
    
        expect(result.statusCode).toEqual(200);
    });
});