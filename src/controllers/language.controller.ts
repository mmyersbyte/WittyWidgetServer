import type { Request, Response, NextFunction } from 'express';
import { MongoServerError } from 'mongodb';

import { Language } from '../models/language.model.js';
import { createLanguageSchema } from '../validators/language.validator.js';

class LanguageController {
  // Lista os idiomas ativos em ordem alfabética.
  async index(_req: Request, res: Response, next: NextFunction) {
    try {
      const languages = await Language.find({ isActive: true })
        .sort({ name: 1 })
        .lean();

      return res.status(200).json({ languages });
    } catch (error) {
      return next(error);
    }
  }

  // Valida e cadastra um novo idioma.
  async create(req: Request, res: Response, next: NextFunction) {
    const validation = createLanguageSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        error: 'Invalid request data.',
        details: validation.error.issues,
      });
    }

    try {
      const existingLanguage = await Language.findOne({
        code: validation.data.code,
      }).lean();

      if (existingLanguage) {
        return res.status(409).json({
          error: 'Language already exists.',
        });
      }

      const language = await Language.create(validation.data);

      return res.status(201).json({
        message: 'Language created successfully.',
        language,
      });
    } catch (error) {
      // O índice unique do MongoDB também protege contra duplicatas simultâneas.
      if (error instanceof MongoServerError && error.code === 11000) {
        return res.status(409).json({
          error: 'Language already exists.',
        });
      }

      return next(error);
    }
  }
}

export { LanguageController };
