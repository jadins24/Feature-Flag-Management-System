import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

import authRoutes from './routes/auth.routes';
import orgRoutes from './routes/org.routes';
import flagRoutes from './routes/flag.routes';
import { errorHandler } from './middleware/errorHandler';
import { swaggerSpec } from './swagger';

const app = express();

// ---- Global middleware ----
app.use(cors());
app.use(express.json());

// ---- API Documentation ----
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'Feature Flag API Docs',
  customCss: '.swagger-ui .topbar { display: none }',
}));

// ---- Routes ----
app.use('/auth', authRoutes);
app.use('/orgs', orgRoutes);
app.use('/flags', flagRoutes);

// ---- Health check ----
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ---- Global error handler ----
app.use(errorHandler);

export default app;
