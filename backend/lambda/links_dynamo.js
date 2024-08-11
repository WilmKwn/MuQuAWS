const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { ApiGatewayManagementApiClient, PostToConnectionCommand } = require('@aws-sdk/client-apigatewaymanagementapi');

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const tableName = 'muqu_links';

const ENDPOINT = "https://snda4rigpj.execute-api.us-east-2.amazonaws.com/dev";
const apigwManagementApi = new ApiGatewayManagementApiClient({
    apiVersion: '2018-11-29',
    endpoint: ENDPOINT
});

exports.handler = async(event) => {
    try {
        const res = await dynamo.send(new ScanCommand({ TableName: tableName }));
        const connectionIds = await dynamo.send(new ScanCommand({ TableName: 'muqu_current_room_users' }));

        await Promise.all(connectionIds.Items.map(async (connection) => {
            try {
                await apigwManagementApi.send(new PostToConnectionCommand({
                    ConnectionId: connection.id,
                    Data: JSON.stringify({ data: res.Items })
                }));
            } catch (error) {
                console.log("ERROR is:", error.message);
            }
        }));

        let body = JSON.stringify({ message: "Success" });
        return {
            statusCode: 200,
            body: body,
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: `Failed ${error.message}` }),
        };
    }
};