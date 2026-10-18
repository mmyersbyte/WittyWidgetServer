import { Router } from 'express';
import { LanguageController } from '../controllers/language.controller.js';
import { requireAdminKey } from '../middlewares/require-admin-key.js';

const languageRoutes = Router();
const languageController = new LanguageController();

languageRoutes.get('/', (req, res, next) =>
  languageController.index(req, res, next),
);

languageRoutes.post('/', requireAdminKey, (req, res, next) =>
  languageController.create(req, res, next),
);

export { languageRoutes };
