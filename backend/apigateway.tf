provider "aws" {
    region = "us-east-2"
}

resource "aws_api_gateway_rest_api" "muqu_api" {
    name = "muqu_api"
    endpoint_configuration {
        types = ["REGIONAL"]
    }
}

resource "aws_api_gateway_deployment" "dev" {
    rest_api_id = aws_api_gateway_rest_api.muqu_api.id
    stage_name = "dev"

    # depends_on = [
    #     aws_api_gateway_integration_response.users_options_integration_response,
    #     aws_api_gateway_integration.users_get_integration,
    #     aws_api_gateway_integration.users_post_integration,

    #     aws_api_gateway_integration_response.links_options_integration_response,
    #     aws_api_gateway_integration.links_get_integration,
    #     aws_api_gateway_integration.links_post_integration,

    #     aws_api_gateway_integration_response.rooms_options_integration_response,
    #     aws_api_gateway_integration.rooms_get_integration,
    #     aws_api_gateway_integration.rooms_post_integration
    # ]

    triggers = {
        redeployment = sha1(jsonencode([
            aws_api_gateway_rest_api.muqu_api.body,
            aws_api_gateway_rest_api.muqu_api.root_resource_id,

            aws_api_gateway_integration_response.users_options_integration_response,
            aws_api_gateway_integration.users_get_integration,
            aws_api_gateway_integration.users_post_integration,

            aws_api_gateway_integration_response.links_options_integration_response,
            aws_api_gateway_integration.links_get_integration,
            aws_api_gateway_integration.links_post_integration,

            aws_api_gateway_integration_response.rooms_options_integration_response,
            aws_api_gateway_integration.rooms_get_integration,
            aws_api_gateway_integration.rooms_post_integration
        ]))
    }

    lifecycle {
        create_before_destroy = true
    }
}

// URL
output "api_gateway_url" {
    value = "${aws_api_gateway_deployment.dev.invoke_url}"
}