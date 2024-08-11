// ROOMS
resource "aws_api_gateway_resource" "rooms" {
    rest_api_id = aws_api_gateway_rest_api.muqu_api.id
    parent_id = aws_api_gateway_rest_api.muqu_api.root_resource_id
    path_part = "rooms"
}

// GET rooms
resource "aws_api_gateway_method" "rooms_get" {
    rest_api_id = aws_api_gateway_rest_api.muqu_api.id
    resource_id = aws_api_gateway_resource.rooms.id
    http_method = "GET"
    authorization = "NONE"
}
resource "aws_api_gateway_integration" "rooms_get_integration" {
    rest_api_id = aws_api_gateway_rest_api.muqu_api.id
    resource_id = aws_api_gateway_resource.rooms.id
    http_method = aws_api_gateway_method.rooms_get.http_method

    integration_http_method = "POST"
    type = "AWS_PROXY"
    uri = aws_lambda_function.muqu_lambda_rooms.invoke_arn
}

// POST rooms
resource "aws_api_gateway_method" "rooms_post" {
    rest_api_id = aws_api_gateway_rest_api.muqu_api.id
    resource_id = aws_api_gateway_resource.rooms.id
    http_method = "POST"
    authorization = "NONE"
}
resource "aws_api_gateway_integration" "rooms_post_integration" {
    rest_api_id = aws_api_gateway_rest_api.muqu_api.id
    resource_id = aws_api_gateway_resource.rooms.id
    http_method = aws_api_gateway_method.rooms_post.http_method

    integration_http_method = "POST"
    type = "AWS_PROXY"
    uri = aws_lambda_function.muqu_lambda_rooms.invoke_arn
}

// CORS rooms
resource "aws_api_gateway_method" "rooms_options_method" {
    rest_api_id = aws_api_gateway_rest_api.muqu_api.id
    resource_id = aws_api_gateway_resource.rooms.id
    http_method = "OPTIONS"
    authorization = "NONE"
}
resource "aws_api_gateway_method_response" "rooms_options_method_response" {
    rest_api_id = aws_api_gateway_rest_api.muqu_api.id
    resource_id = aws_api_gateway_resource.rooms.id
    http_method = aws_api_gateway_method.rooms_options_method.http_method
    status_code = 200

    response_parameters = {
        "method.response.header.Access-Control-Allow-Headers" = true,
        "method.response.header.Access-Control-Allow-Methods" = true,
        "method.response.header.Access-Control-Allow-Origin"  = true
    }
}
resource "aws_api_gateway_integration" "rooms_options_integration" {
    rest_api_id = aws_api_gateway_rest_api.muqu_api.id
    resource_id = aws_api_gateway_resource.rooms.id
    http_method = aws_api_gateway_method.rooms_options_method.http_method
    type = "MOCK"

    request_templates = {
        "application/json" = "{\"statusCode\": 200}"
    }
}
resource "aws_api_gateway_integration_response" "rooms_options_integration_response" {
    rest_api_id = aws_api_gateway_rest_api.muqu_api.id
    resource_id = aws_api_gateway_resource.rooms.id
    http_method = aws_api_gateway_method.rooms_options_method.http_method
    status_code = aws_api_gateway_method_response.rooms_options_method_response.status_code

    response_parameters = {
        "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
        "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,OPTIONS'",
        "method.response.header.Access-Control-Allow-Origin"  = "'*'"
    }
}

// INVOKE PERSMISSION
resource "aws_lambda_permission" "rooms_lambda_invoke_permission" {
    statement_id = "AllowAPIGatewayInvoke"
    action = "lambda:InvokeFunction"
    function_name = aws_lambda_function.muqu_lambda_rooms.function_name
    principal = "apigateway.amazonaws.com"

    source_arn = "${aws_api_gateway_rest_api.muqu_api.execution_arn}/*/*"
}