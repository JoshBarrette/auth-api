import AWSLambda from "aws-lambda";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

const dynamo = DynamoDBDocument.from(
  new DynamoDB({ endpoint: "http://dynamodb-local:8000" })
);

/**
 * @param {AWSLambda.APIGatewayAuthorizerEvent} event
 * @param {AWSLambda.Context} context
 * @param {AWSLambda.APIGatewayAuthorizerCallback} callback
 * @returns {AWSLambda.APIGatewayAuthorizerResult}
 */
export const handler = async (event, context, callback) => {
  /**
   * @type {string}
   */
  const token = event.authorizationToken;
  if (!token || !token.split(" ")[1]) {
    callback("No Token");
    return;
  }

  const session = await dynamo.get({
    TableName: process.env.SESSIONS_TABLE,
    Key: {
      sessionID: token.split(" ")[1],
    },
  });

  if (session.Item) {
    callback(null, generateAllow("Lambda Allow Policy", event.methodArn));
  } else {
    callback("Unauthorized");
  }
};

const generatePolicy = function (principalId, effect, resource) {
  var authResponse = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    var policyDocument = {};
    policyDocument.Version = "2012-10-17";
    policyDocument.Statement = [];
    var statementOne = {};
    statementOne.Action = "execute-api:Invoke";
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }

  return authResponse;
};

const generateAllow = function (principalId, resource) {
  return generatePolicy(principalId, "Allow", resource);
};

// const generateDeny = function (principalId, resource) {
//   return generatePolicy(principalId, "Deny", resource);
// };
