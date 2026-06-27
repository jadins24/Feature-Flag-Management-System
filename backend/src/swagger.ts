import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Feature Flag Management API',
      version: '1.0.0',
      description:
        'Multi-tenant feature flag management system with role-based access control. ' +
        'Supports super_admin (manages organizations) and org_admin (manages flags within their org) roles.',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Local development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token obtained from /auth/login or /auth/signup',
        },
      },
      schemas: {
        Organization: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        SafeUser: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['super_admin', 'org_admin', 'end_user'] },
            org_id: { type: 'string', format: 'uuid', nullable: true },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        FeatureFlag: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            org_id: { type: 'string', format: 'uuid' },
            feature_key: { type: 'string' },
            enabled: { type: 'boolean' },
            created_by: { type: 'string', format: 'uuid', nullable: true },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Organizations', description: 'Organization management (super_admin)' },
      { name: 'Feature Flags', description: 'Feature flag operations' },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
