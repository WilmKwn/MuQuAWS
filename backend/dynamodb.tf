resource "aws_dynamodb_table" "muqu_links" {
  name = "muqu_links"
  billing_mode = "PROVISIONED"
  read_capacity = 2
  write_capacity = 2
  hash_key = "id"
  range_key = "link"
  
  attribute {
    name = "id"
    type = "S"
  }
  attribute {
    name = "link"
    type = "S"
  }

  stream_enabled = true
  stream_view_type = "NEW_IMAGE"
}

// LINKS DYNAMODB STREAMS LAMBDA TRIGGER
resource "aws_lambda_event_source_mapping" "muqu_links_trigger" {
  event_source_arn = aws_dynamodb_table.muqu_links.stream_arn
  function_name = aws_lambda_function.muqu_lambda_links_dynamo.arn
  starting_position = "LATEST"
}

resource "aws_dynamodb_table" "muqu_users" {
  name = "muqu_users"
  billing_mode = "PROVISIONED"
  read_capacity = 2
  write_capacity = 2
  hash_key = "username"
  range_key = "password"
  
  attribute {
    name = "username"
    type = "S"
  }
  attribute {
    name = "password"
    type = "S"
  }
}

resource "aws_dynamodb_table" "muqu_current_users" {
  name = "muqu_current_users"
  billing_mode = "PROVISIONED"
  read_capacity = 2
  write_capacity = 2
  hash_key = "id"

  attribute {
    name = "id"
    type = "S"
  }
}
resource "aws_dynamodb_table" "muqu_current_room_users" {
  name = "muqu_current_room_users"
  billing_mode = "PROVISIONED"
  read_capacity = 2
  write_capacity = 2
  hash_key = "id"

  attribute {
    name = "id"
    type = "S"
  }
}

resource "aws_dynamodb_table" "muqu_rooms" {
  name = "muqu_rooms"
  billing_mode = "PROVISIONED"
  read_capacity = 2
  write_capacity = 2
  hash_key = "name"
  range_key = "username"

  attribute {
    name = "name"
    type = "S"
  }
  attribute {
    name = "username"
    type = "S"
  }

  stream_enabled = true
  stream_view_type = "NEW_IMAGE"
}

// ROOMS DYNAMODB STREAMS LAMBDA TRIGGER
resource "aws_lambda_event_source_mapping" "muqu_rooms_trigger" {
  event_source_arn = aws_dynamodb_table.muqu_rooms.stream_arn
  function_name = aws_lambda_function.muqu_lambda_rooms_dynamo.arn
  starting_position = "LATEST"
}