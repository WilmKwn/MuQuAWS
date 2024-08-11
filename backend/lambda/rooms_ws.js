const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, DeleteCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const tableName = 'muqu_current_users';

exports.handler = async(event) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
        "Access-Control-Allow-Headers": "Content-Type",
    };

    try {
        let body = JSON.stringify({ message: "None" });
        switch (event.requestContext.routeKey) {
            case '$connect':
                const postParams = {
                    TableName: tableName,
                    Item: {
                        'id': event.requestContext.connectionId,
                    }
                };
                await dynamo.send(new PutCommand(postParams));
                body = JSON.stringify({ message: "Success" });
                break;
                
            case '$disconnect':
                const deleteParams = {
                    TableName: tableName,
                    Key: {
                        'id': event.requestContext.connectionId,
                    }
                };
                await dynamo.send(new DeleteCommand(deleteParams));
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