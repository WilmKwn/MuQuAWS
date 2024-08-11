const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const tableName = 'muqu_users';

exports.handler = async(event) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
        "Access-Control-Allow-Headers": "Content-Type",
    };

    try {
        let body = JSON.stringify({ message: "None" });
        switch (event.httpMethod) {
            case "GET":
                const getParams = {
                    TableName: tableName
                };
                const res = await dynamo.send(new ScanCommand(getParams));
                body = JSON.stringify({ message: "Success", data: res.Items });
                break;

            case "POST":
                const input = JSON.parse(JSON.parse(event.body).body);
                const postParams = {
                    TableName: tableName,
                    Item: {
                        'username': input.link,
                        'password': input.id,
                    }
                };
                await dynamo.send(new PutCommand(postParams));
                body = JSON.stringify({ message: "Success" });
                break;

            default:
                break;
        }
        return {
            statusCode: 200,
            headers: headers,
            body: body,
        }
    } catch (error) {
        return {
            statusCode: 500,
            headers: headers,
            body: JSON.stringify({ message: `Failed ${error.message}` }),
        };
    }
}