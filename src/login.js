import AWSLambda from "aws-lambda";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import * as Shared from "./shared.mjs";
import * as uuid from "uuid";

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

  const user = await dynamo.get({
    TableName: process.env.ACCOUNTS_TABLE,
    Key: {
      username: event.headers.Username.trim(),
    },
  });
  if (!user.Item) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "No such user",
      }),
    };
  }

  const verifyPassword = await Shared.verifyPassword(
    user.Item.password,
    event.headers.Password
  );
  if (!verifyPassword) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Invalid password",
      }),
    };
  }

  const sessionID = uuid.v4();
  await dynamo
    .put({
      TableName: process.env.SESSIONS_TABLE,
      Item: {
        sessionID,
        username: event.headers.Username,
        ttl: Math.floor(Date.now() / 1000) + 300, // 5 mins
      },
    })
    .catch((e) => {
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({ message: "Failed to log in" }),
      });
    });

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Successfully logged in",
      token: "Bearer " + sessionID,
    }),
  };
};
