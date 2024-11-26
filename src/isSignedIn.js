import AWSLambda from "aws-lambda";
import * as Shared from "./shared.mjs";

const dynamo = Shared.newDynamo();

/**
 * @param {AWSLambda.APIGatewayProxyEvent} event
 * @param {AWSLambda.Context} context
 * @returns {AWSLambda.APIGatewayProxyResult}
 */
export const handler = async (event, context) => {
  /**
   * @type {string}
   */
  const token = event.headers.Authorization;
  if (!token || !token.split(" ")[1] || !token.includes("Bearer ")) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "No token provided" }),
    };
  }

  const session = await dynamo.get({
    TableName: process.env.SESSIONS_TABLE,
    Key: {
      sessionID: token.split(" ")[1],
    },
  });

  if (session.Item) {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User is signed in", isSignedIn: true }),
    };
  } else {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "User is not signed in",
        isSignedIn: true,
      }),
    };
  }
};
