const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'App Node Express Mongo API',
      version: '0.0.1',
      description: 'API manage app build on nodejs, express and mongo',
      contact: {
        name: 'JL',
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Local Server',
        },
      ],
    },
    tags: [
      {
        name: 'Authors',
        description: 'Everything endpoints about Authors',
      },
      {
        name: 'Books',
        description: 'Everything endpoints about Books',
      },
      {
        name: 'Users',
        description: 'Everything endpoints about Users',
      },
    ],
    paths: {
      '/authors': {
        get: {
          tags: ['Authors'],
          description:
            'Returns all authors from the system that the user has access to',
          responses: {
            200: {
              description: 'A list of authors.',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      // $ref: '#/components/schemas/authors',
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/authors/{authorId}': {
        put: {
          tags: ['Authors'],
          description: 'Delete an Author',
          responses: {
            400: {
              description: 'invalid author value',
            },
          },
        },
        patch: {
          tags: ['Authors'],
          description: 'Delete an Author',
          responses: {
            400: {
              description: 'invalid author value',
            },
          },
        },
        delete: {
          tags: ['Authors'],
          description: 'Delete an Author',
          responses: {
            400: {
              description: 'invalid author value',
            },
          },
        },
      },
    },
    components: {
      schemas: {
        Author: {
          type: 'object',
          properties: {
            code: {
              type: 'integer',
              format: 'int32',
            },
            message: {
              type: 'string',
            },
          },
        },
        Book: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              format: 'int64',
            },
            name: {
              type: 'string',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              format: 'int64',
            },
            name: {
              type: 'string',
            },
          },
        },
      },
      parameters: {
        skipParam: {
          name: 'skip',
          in: 'query',
          description: 'number of items to skip',
          required: true,
          schema: {
            type: 'integer',
            format: 'int32',
          },
        },
        limitParam: {
          name: 'limit',
          in: 'query',
          description: 'max records to return',
          required: true,
          schema: {
            type: 'integer',
            format: 'int32',
          },
        },
      },
      responses: {
        NotFound: {
          description: 'Entity not found.',
        },
        IllegalInput: {
          description: 'Illegal input for operation.',
        },
        GeneralError: {
          description: 'General Error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/GeneralError',
              },
            },
          },
        },
      },
      securitySchemes: {
        api_key: {
          type: 'apiKey',
          name: 'api_key',
          in: 'header',
        },
        appstore_auth: {
          type: 'oauth2',
          flows: {
            implicit: {
              authorizationUrl: 'https://example.org/api/oauth/dialog',
              scopes: {
                'write:authors': 'modify authors in your account',
                'read:authors': 'read your authors',
              },
            },
          },
        },
      },
    },
  },
  apis: ['./routes/*.routes.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
