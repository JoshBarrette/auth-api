docker run \
    --name dynamodb-local \
    -d \
    --network sam \
    -p 8000:8000 \
    -v "$(pwd)/db:/home/dynamodblocal/data" \
    amazon/dynamodb-local \
    -jar DynamoDBLocal.jar -sharedDb -dbPath ./data

aws dynamodb create-table \
    --table-name AccountsTable \
    --attribute-definitions AttributeName=username,AttributeType=S \
    --key-schema AttributeName=username,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --endpoint-url http://localhost:8000

aws dynamodb create-table \
    --table-name SessionsTable \
    --attribute-definitions AttributeName=sessionID,AttributeType=S \
    --key-schema AttributeName=sessionID,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --endpoint-url http://localhost:8000

aws dynamodb update-time-to-live \
    --table-name SessionsTable \
    --time-to-live-specification "Enabled=true, AttributeName=ttl" \
    --endpoint-url http://localhost:8000