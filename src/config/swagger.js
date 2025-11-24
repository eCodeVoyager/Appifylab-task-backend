const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');

const loadApiDocs = () => {
  try {
    const docsPath = path.join(__dirname, '../docs/api-documentation.json');
    return JSON.parse(fs.readFileSync(docsPath, 'utf8'));
  } catch (error) {
    return null;
  }
};

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Backend API',
      version: '1.0.0',
      description: 'API documentation for backend application',
    },
    servers: [
      {
        url: process.env.BACKEND_URL || 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string', format: 'email' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            statusCode: { type: 'number' },
            message: { type: 'string' },
            errors: { type: 'array', items: { type: 'string' } },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/modules/*/routes/*.js', './src/modules/*/controllers/*.js'],
};

const specs = swaggerJSDoc(options);
const comprehensiveDocs = loadApiDocs();

const swaggerSetup = app => {
  if (process.env.ENABLE_DOCS === 'true') {
    const docs = comprehensiveDocs || specs;

    app.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(docs, {
        explorer: true,
        customCss: '.swagger-ui .topbar { display: none }',
        swaggerOptions: {
          persistAuthorization: true,
          displayRequestDuration: true,
        },
      })
    );

    app.get('/api-docs.json', (req, res) => {
      res.json(docs);
    });

    console.log(' API Documentation available at /api-docs');
  }
};

module.exports = { swaggerSetup, specs };