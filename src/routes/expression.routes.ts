import { Router } from 'express';
import { ExpressionController } from '../controllers/expression.controller.js';
import { DailyPublicationController } from '../controllers/daily-publication.controller.js';

import { requireAdminKey } from '../middlewares/require-admin-key.js';

const expressionRoutes = Router();
const expressionController = new ExpressionController();

const dailyPublicationController = new DailyPublicationController();

expressionRoutes.get('/today', (req, res, next) =>
  dailyPublicationController.today(req, res, next),
);

expressionRoutes.get('/', (req, res, next) =>
  expressionController.index(req, res, next),
);

expressionRoutes.post('/', requireAdminKey, (req, res, next) =>
  expressionController.create(req, res, next),
);

expressionRoutes.patch('/:id', requireAdminKey, (req, res, next) =>
  expressionController.update(req, res, next),
);

export { expressionRoutes };
