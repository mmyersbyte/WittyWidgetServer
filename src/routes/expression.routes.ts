import { Router } from 'express';
import { ExpressionController } from '../controllers/expression.controller.js';

const expressionRoutes = Router();
const expressionController = new ExpressionController();

expressionRoutes.get('/', (req, res, next) =>
  expressionController.index(req, res, next),
);

expressionRoutes.post('/', (req, res, next) =>
  expressionController.create(req, res, next),
);

export { expressionRoutes };
