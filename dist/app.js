import swaggerUi from 'swagger-ui-express';
import { openApiSpec } from './docs/openapi.js';
import express from 'express';
import { languageRoutes } from './routes/language.routes.js';
import { expressionRoutes } from './routes/expression.routes.js';
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
// Rotas do módulo de expressões.
app.use('/api/v1/expressions', expressionRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));
// Retorna 404 para endpoints inexistentes.
app.use((_req, res) => {
    res.status(404).json({
        error: 'Route not found.',
    });
});
// Trata erros inesperados em um único lugar.
app.use((error, _req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }
    console.error('Unexpected error:', error);
    return res.status(500).json({
        error: 'Internal server error.',
    });
});
export default app;
//# sourceMappingURL=app.js.map