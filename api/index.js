// CommonJS wrapper to be extra compatible on Vercel
const serverless = require("serverless-http");
const app = require("../server/server.js").default;

module.exports = serverless(app);
