// LINKS WS
resource "aws_apigatewayv2_api" "links_ws_api" {
    name = "links_ws_api"
    protocol_type = "WEBSOCKET"
    route_selection_expression = "$request.body.action"
}

resource "aws_apigatewayv2_stage" "links_ws_stage" {
    api_id = aws_apigatewayv2_api.links_ws_api.id
    name = "dev"
    auto_deploy = true
}

resource "aws_apigatewayv2_integration" "links_ws_integration" {
    api_id = aws_apigatewayv2_api.links_ws_api.id
    integration_type = "AWS_PROXY"
    integration_uri = aws_lambda_function.muqu_lambda_links_ws.invoke_arn
    integration_method = "POST"
}

// ROUTES
resource "aws_apigatewayv2_route" "links_ws_route_connect" {
    api_id = aws_apigatewayv2_api.links_ws_api.id
    route_key = "$connect"
    target = "integrations/${aws_apigatewayv2_integration.links_ws_integration.id}"
}
resource "aws_apigatewayv2_route" "links_ws_route_disconnect" {
    api_id = aws_apigatewayv2_api.links_ws_api.id
    route_key = "$disconnect"
    target = "integrations/${aws_apigatewayv2_integration.links_ws_integration.id}"
}

resource "aws_lambda_permission" "links_ws_lambda_permission" {
    statement_id = "AllowAPIGatewayWebSocketInvoke"
    action = "lambda:InvokeFunction"
    function_name = aws_lambda_function.muqu_lambda_links_ws.function_name
    principal = "apigateway.amazonaws.com"
    source_arn = "${aws_apigatewayv2_api.links_ws_api.execution_arn}/*"
}

// OUTPUT
output "api_gateway_links_ws_url" {
    value = "${aws_apigatewayv2_stage.links_ws_stage.invoke_url}"
}