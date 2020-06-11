exports.indexLambdaHandler = async () => {
    console.info(process.env);
    return { statusCode: 200 }
}