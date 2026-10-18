import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express';

import { languageRoutes } from './routes/language.routes.js';

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'WittyWidgetServer',
  });
});

// Rotas do módulo de idiomas.
app.use('/api/v1/languages', languageRoutes);

// Retorna 404 para endpoints inexistentes.
app.use((_req, res) => {
  res.status(404).json({
    error: 'Route not found.',
  });
});

// Trata erros inesperados em um único lugar.
app.use((error: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(error);
  }

  console.error('Unexpected error:', error);

  return res.status(500).json({
    error: 'Internal server error.',
  });
});

export default app;
