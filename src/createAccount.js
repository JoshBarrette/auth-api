import AWSLambda from "aws-lambda";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import * as Shared from "./shared.mjs";

const dynamo = DynamoDBDocument.from(
  new DynamoDB({ endpoint: "http://dynamodb-local:8000" })
);

/**
 * @param {AWSLambda.APIGatewayProxyEvent} event
 * @param {AWSLambda.Context} context
 * @param {AWSLambda.Callback} callback
 * @returns {AWSLambda.APIGatewayProxyResult}
 */
export const handler = async (event, context, callback) => {
  const credChecker = Shared.checkCredentials(
    event.headers.Username,
    event.headers.Password
  );
  if (credChecker) {
    return credChecker;
  }

  const username = event.headers.Username;

  const namerChecker = await dynamo.get({
    TableName: process.env.ACCOUNTS_TABLE,
    Key: {
      username,
    },
  });
  if (namerChecker.Item) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Username already in use",
      }),
    };
  }

  const password = await Shared.hash(event.headers.Password, 2);

  await dynamo
    .put({
      TableName: process.env.ACCOUNTS_TABLE,
      Item: { username, password },
    })
    .catch((e) => {
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({ message: "Failed to add new user to DB" }),
      });
    });

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Added to DB" }),
  };
};
