resource "aws_s3_bucket" "lambda_bucket" {
    bucket = "muqu-lambda-bucket"
}

resource "aws_iam_role" "lambda_role" {
    name = "muqu_lambda_role"

    assume_role_policy = jsonencode({
        Version = "2012-10-17"
        Statement = [
            {
                Action = "sts:AssumeRole"
                Effect = "Allow"
                Principal = {
                    Service = "lambda.amazonaws.com"
                }
            }
        ]
    })
}
resource "aws_iam_role_policy_attachment" "lambda_policy" {
    policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
    role = aws_iam_role.lambda_role.name
}

resource "aws_iam_policy" "dynamodb_access_policy" {
    name = "muqu_dynamodb_access_policy"
    path = "/"

    policy = jsonencode({
        Version = "2012-10-17"
        Statement = [
            {
                Effect = "Allow"
                Action = [
                    "dynamodb:GetItem",
                    "dynamodb:PutItem",
                    "dynamodb:UpdateItem",
                    "dynamodb:DeleteItem",
                    "dynamodb:Scan",
                ]
                Resource = "arn:aws:dynamodb:*:*:table/*"
            }
        ]
    })
}
resource "aws_iam_role_policy_attachment" "dynamodb_policy_attachment" {
    policy_arn = aws_iam_policy.dynamodb_access_policy.arn
    role = aws_iam_role.lambda_role.name
}

resource "aws_iam_policy" "lambda_access_api_policy" {
    name = "lambda_access_api_policy"
    path = "/"

    policy = jsonencode({
        Version = "2012-10-17"
        Statement = [
            {
                "Effect": "Allow",
                "Action": [
                    "execute-api:ManageConnections",
                    "execute-api:Invoke"
                ],
                "Resource": "arn:aws:execute-api:us-east-2:*:*/*/*/@connections/*"
            }
        ]
    })
}
resource "aws_iam_role_policy_attachment" "lambda_access_api_policy_attachment" {
    policy_arn = aws_iam_policy.lambda_access_api_policy.arn
    role = aws_iam_role.lambda_role.name
}
resource "aws_iam_role_policy_attachment" "lambda_dynamodb_policy" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaDynamoDBExecutionRole"
}

// USERS FUNCTION
resource "aws_s3_object" "muqu_lambda_users_zip" {
    bucket = aws_s3_bucket.lambda_bucket.id
    key = "users.zip"
    source = var.users_zip_path
    etag = filemd5(var.users_zip_path)
}

resource "aws_lambda_function" "muqu_lambda_users" {
    function_name = "muqu_users"
    role = aws_iam_role.lambda_role.arn
    handler = "users.handler"
    runtime = "nodejs20.x"

    s3_bucket = aws_s3_bucket.lambda_bucket.id
    s3_key = aws_s3_object.muqu_lambda_users_zip.key
    source_code_hash = filebase64sha256(var.users_zip_path)
}

// LINKS FUNCTION
resource "aws_s3_object" "muqu_lambda_links_zip" {
    bucket = aws_s3_bucket.lambda_bucket.id
    key = "links.zip"
    source = var.links_zip_path
    etag = filemd5(var.links_zip_path)
}

resource "aws_lambda_function" "muqu_lambda_links" {
    function_name = "muqu_links"
    role = aws_iam_role.lambda_role.arn
    handler = "links.handler"
    runtime = "nodejs20.x"

    s3_bucket = aws_s3_bucket.lambda_bucket.id
    s3_key = aws_s3_object.muqu_lambda_links_zip.key
    source_code_hash = filebase64sha256(var.links_zip_path)
}

// LINK WS FUNCTION
resource "aws_s3_object" "muqu_lambda_links_ws_zip" {
    bucket = aws_s3_bucket.lambda_bucket.id
    key = "links_ws.zip"
    source = var.links_ws_zip_path
    etag = filemd5(var.links_ws_zip_path)
}

resource "aws_lambda_function" "muqu_lambda_links_ws" {
    function_name = "muqu_links_ws"
    role = aws_iam_role.lambda_role.arn
    handler = "links_ws.handler"
    runtime = "nodejs20.x"

    s3_bucket = aws_s3_bucket.lambda_bucket.id
    s3_key = aws_s3_object.muqu_lambda_links_ws_zip.key
    source_code_hash = filebase64sha256(var.links_ws_zip_path)
}

// LINKS DYANMODB STREAMS FUNCTION
resource "aws_s3_object" "muqu_lambda_links_dynamo_zip" {
    bucket = aws_s3_bucket.lambda_bucket.id
    key = "links_dynamo.zip"
    source = var.links_dynamo_zip_path
    etag = filemd5(var.links_dynamo_zip_path)
}

resource "aws_lambda_function" "muqu_lambda_links_dynamo" {
    function_name = "muqu_links_dynamo"
    role = aws_iam_role.lambda_role.arn
    handler = "links_dynamo.handler"
    runtime = "nodejs20.x"

    s3_bucket = aws_s3_bucket.lambda_bucket.id
    s3_key = aws_s3_object.muqu_lambda_links_dynamo_zip.key
    source_code_hash = filebase64sha256(var.links_dynamo_zip_path)
}

// ROOMS FUNCTION
resource "aws_s3_object" "muqu_lambda_rooms_zip" {
    bucket = aws_s3_bucket.lambda_bucket.id
    key = "rooms.zip"
    source = var.rooms_zip_path
    etag = filemd5(var.rooms_zip_path)
}

resource "aws_lambda_function" "muqu_lambda_rooms" {
    function_name = "muqu_rooms"
    role = aws_iam_role.lambda_role.arn
    handler = "rooms.handler"
    runtime = "nodejs20.x"

    s3_bucket = aws_s3_bucket.lambda_bucket.id
    s3_key = aws_s3_object.muqu_lambda_rooms_zip.key
    source_code_hash = filebase64sha256(var.rooms_zip_path)
}

// ROOMS WS FUNCTION
resource "aws_s3_object" "muqu_lambda_rooms_ws_zip" {
    bucket = aws_s3_bucket.lambda_bucket.id
    key = "rooms_ws.zip"
    source = var.rooms_ws_zip_path
    etag = filemd5(var.rooms_ws_zip_path)
}

resource "aws_lambda_function" "muqu_lambda_rooms_ws" {
    function_name = "muqu_rooms_ws"
    role = aws_iam_role.lambda_role.arn
    handler = "rooms_ws.handler"
    runtime = "nodejs20.x"

    s3_bucket = aws_s3_bucket.lambda_bucket.id
    s3_key = aws_s3_object.muqu_lambda_rooms_ws_zip.key
    source_code_hash = filebase64sha256(var.rooms_ws_zip_path)
}

// ROOMS DYANMODB STREAMS FUNCTION
resource "aws_s3_object" "muqu_lambda_rooms_dynamo_zip" {
    bucket = aws_s3_bucket.lambda_bucket.id
    key = "rooms_dynamo.zip"
    source = var.rooms_dynamo_zip_path
    etag = filemd5(var.rooms_dynamo_zip_path)
}

resource "aws_lambda_function" "muqu_lambda_rooms_dynamo" {
    function_name = "muqu_rooms_dynamo"
    role = aws_iam_role.lambda_role.arn
    handler = "rooms_dynamo.handler"
    runtime = "nodejs20.x"

    s3_bucket = aws_s3_bucket.lambda_bucket.id
    s3_key = aws_s3_object.muqu_lambda_rooms_dynamo_zip.key
    source_code_hash = filebase64sha256(var.rooms_dynamo_zip_path)
}