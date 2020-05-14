import * as swaggerJSDoc from "swagger-jsdoc";

const swaggerJsdoc = require('swagger-jsdoc');
const ss = require('../modules/groups/groups.routes');

const options = {
  // List of files to be processes. You can also set globs './routes/*.js'
  apis: ['./src/modules/**/*.ts'],
  basePath: '/',
  swaggerDefinition: {
    info: {
      description: 'SoftServe LMS API Documentation',
      swagger: '2.0',
      title: 'Learning Management System API',
      version: '1.0.0',
    },
  },
};

export const specs:swaggerJSDoc.Options = swaggerJsdoc(options);
