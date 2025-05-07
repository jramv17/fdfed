const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SocietyLog API',
      version: '1.0.0',
      description: 'API documentation for SocietyLog',
    },
    servers: [
      {
        url: 'https://fdfed-server.vercel.app',  
      },
    ],
  },
  apis: ['./Routes/*.js'],  
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
