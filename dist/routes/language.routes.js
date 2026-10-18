import { Router } from 'express';
import { LanguageController } from '../controllers/language.controller.js';
const languageRoutes = Router();
const languageController = new LanguageController();
languageRoutes.get('/', (req, res, next) => languageController.index(req, res, next));
languageRoutes.post('/', (req, res, next) => languageController.create(req, res, next));
export { languageRoutes };
//# sourceMappingURL=language.routes.js.map