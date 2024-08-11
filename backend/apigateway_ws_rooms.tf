// ROOMS WS
resource "aws_apigatewayv2_api" "rooms_ws_api" {
    name = "rooms_ws_api"
    protocol_type = "WEBSOCKET"
    route_selection_expression = "$request.body.action"
}

resource "aws_apigatewayv2_stage" "rooms_ws_stage" {
    api_id = aws_apigatewayv2_api.rooms_ws_api.id
    name = "dev"
    auto_deploy = true
}

resource "aws_apigatewayv2_integration" "rooms_ws_integration" {
    api_id = aws_apigatewayv2_api.rooms_ws_api.id
    integration_type = "AWS_PROXY"
    integration_uri = aws_lambda_function.muqu_lambda_rooms_ws.invoke_arn
    integration_method = "POST"
}

// ROUTES
resource "aws_apigatewayv2_route" "rooms_ws_route_connect" {
    api_id = aws_apigatewayv2_api.rooms_ws_api.id
    route_key = "$connect"
    target = "integrations/${aws_apigatewayv2_integration.rooms_ws_integration.id}"
}
resource "aws_apigatewayv2_route" "rooms_ws_route_disconnect" {
    api_id = aws_apigatewayv2_api.rooms_ws_api.id
    route_key = "$disconnect"
    target = "integrations/${aws_apigatewayv2_integration.rooms_ws_integration.id}"
}

resource "aws_lambda_permission" "rooms_ws_lambda_permission" {
    statement_id = "AllowAPIGatewayWebSocketInvoke"
    action = "lambda:InvokeFunction"
    function_name = aws_lambda_function.muqu_lambda_rooms_ws.function_name
    principal = "apigateway.amazonaws.com"
    source_arn = "${aws_apigatewayv2_api.rooms_ws_api.execution_arn}/*"
}

// OUTPUT
output "api_gateway_rooms_ws_url" {
    value = "${aws_apigatewayv2_stage.rooms_ws_stage.invoke_url}"
}