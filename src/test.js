import AWSLambda from "aws-lambda";
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
  console.log("hash", h);
  console.log(
    await dynamo
      .put({
        TableName: process.env.ACCOUNTS_TABLE,
        Item: { username: "name", password: "pass" },
      })
      .catch((e) => console.log(e))
  );

  // await dynamo
  //   .put({
  //     TableName: process.env.SESSIONS_TABLE,
  //     Item: {
  //       sessionID: "live for 10 seconds",
  //       ttl: Math.floor(Date.now() / 1000) + 10,
  //     },
  //   })
  //   .catch((e) => console.log(e));

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
