import AWSLambda from "aws-lambda";
import bcryptjs from "bcryptjs";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

const dynamo = DynamoDBDocument.from(
  new DynamoDB({ endpoint: "http://dynamodb-local:8000" })
);

/**
 * @param {AWSLambda.APIGatewayProxyEvent} event
 * @param {AWSLambda.Context} context
 * @returns {AWSLambda.APIGatewayProxyResult}
 */
export const handler = async (event, context) => {
  const h = bcryptjs.hashSync("test", 2);
  console.log("hash", h);
  console.log(
    await dynamo
      .put({
        TableName: "AccountsTable",
        Item: { username: "a", password: "b" },
      })
      .catch((e) => console.log(e))
  );

  try {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "hello world",
      }),
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "some error happened" }),
    };
  }
};
