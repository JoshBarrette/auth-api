import * as argon2 from "argon2";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

/**
 * @returns {DynamoDBDocument}
 */
export function newDynamo() {
  return DynamoDBDocument.from(
    new DynamoDB({
      endpoint: process.env.AWS_SAM_LOCAL
        ? "http://dynamodb-local:8000"
        : undefined,
    })
  );
}

/**
 * Hash a password
 * @param {string} password Password to hash
 * @returns {Promise<string>} The hashed password
 */
export async function hash(password) {
  return await argon2.hash(password);
}

/**
 * Verify a hashed password
 * @param {string} hash Hashed password
 * @param {string} password Plaintext password
 * @returns {Promise<boolean>} If they match
 */
export async function verifyPassword(hash, password) {
  return await argon2.verify(hash, password);
}

/**
 * Check that the username and password are defined
 * @param {string | undefined} username
 * @param {string | undefined} password
 * @returns Null if they do, error responses if they do not
 */
export function checkCredentials(username, password) {
  if (!username && !password) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Please provide a username and a password",
      }),
    };
  } else if (!username) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Please provide a username",
      }),
    };
  } else if (!password) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Please provide a password",
      }),
    };
  }

  return null;
}
