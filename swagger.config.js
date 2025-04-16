// swagger.config.js
const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Users CRUD API",
      version: "1.0.0",
      description: "A simple CRUD API for managing users",
    },
    servers: [
      {
        url: "http://10.10.23.98:3001",
      },
    ],
  },
  apis: ["./routes/*.js", "./models/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
