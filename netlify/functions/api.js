
const serverless = require('serverless-http');

// Import the built server
const app = require('../../dist/server/index.js').default;

exports.handler = serverless(app);
