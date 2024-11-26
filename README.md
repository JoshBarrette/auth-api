# Auth

I wanted to learn the basics of auth servers so I made this. Currently using session tokens but may expand to JWTs later.

- AWS SAM for defining infrastructure
- API Gateway with a custom Lambda authorizer for protected routes
- Lambda functions in JS with JSDoc
- DynamoDB for account information and session management
- Developed with Docker and SAM for local invocations, see scripts/newDynamo.sh for container and network setup

Currently doesn't have any parameters or outputs but the point of this was learning auth not SAM
