const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const tableName = 'muqu_links';

exports.handler = async(event) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
        "Access-Control-Allow-Headers": "Content-Type",
    };

    try {
        let body = JSON.stringify({ message: "Success" });
        switch (event.httpMethod) {
            case "GET":
                const res = await dynamo.send(new ScanCommand({ TableName: tableName }));
                body = JSON.stringify({ message: "Success", data: res.Items });
                break;

            case "POST":
                const input = JSON.parse(JSON.parse(event.body).body);
                const postParams = {
                    TableName: tableName,
                    Item: {
                        'id': input.id,
                        'link': input.link,
                        'room': input.room
                    }
                };
                await dynamo.send(new PutCommand(postParams));
                body = JSON.stringify({ message: "Success" });
                break;

            case "DELETE":
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