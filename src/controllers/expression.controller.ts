import type { Request, Response, NextFunction } from 'express';
import { MongoServerError } from 'mongodb';

import { Expression } from '../models/expression.model.js';
import { Language } from '../models/language.model.js';
import {
  createExpressionSchema,
  listExpressionsQuerySchema,
} from '../validators/expression.validator.js';

class ExpressionController {
  // Lista expressões ativas e permite filtrar por idioma, nível e categoria.
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const validation = listExpressionsQuerySchema.safeParse(req.query);

      if (!validation.success) {
        return res.status(400).json({
          error: 'Invalid query parameters.',
          details: validation.error.issues,
        });
      }

      const { language, level, category } = validation.data;

      const filters: {
        isActive: boolean;
        languageCode?: string;
        level?: 'beginner' | 'intermediate' | 'advanced';
        category?: string;
      } = { isActive: true };

      if (language) filters.languageCode = language;
      if (level) filters.level = level;
      if (category) filters.category = category;

      const expressions = await Expression.find(filters)
        .sort({ phrase: 1 })
        .lean();

      return res.status(200).json({
        count: expressions.length,
        expressions,
      });
    } catch (error) {
      return next(error);
    }
  }

  // Valida as expressões e os idiomas antes de salvar.
  async create(req: Request, res: Response, next: NextFunction) {
    const validation = createExpressionSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        error: 'Invalid request data.',
        details: validation.error.issues,
      });
    }

    try {
      const data = validation.data;

      // Todos os idiomas referenciados precisam estar cadastrados e ativos.
      const languageCodes = [
        ...new Set([
          data.languageCode,
          ...data.meanings.map((meaning) => meaning.languageCode),
          ...data.examples.map((example) => example.translationLanguageCode),
        ]),
      ];

      const languages = await Language.find({
        code: { $in: languageCodes },
        isActive: true,
      })
        .select('code')
        .lean();

      const existingCodes = new Set(languages.map((language) => language.code));

      const missingCodes = languageCodes.filter(
        (code) => !existingCodes.has(code),
      );

      if (missingCodes.length > 0) {
        return res.status(400).json({
          error: 'Some languages do not exist or are inactive.',
          missingLanguages: missingCodes,
        });
      }

      // Evita cadastrar a mesma expressão mais de uma vez.
      const existingExpression = await Expression.findOne({
        phrase: data.phrase,
        languageCode: data.languageCode,
      })
        .collation({ locale: 'en', strength: 2 })
        .lean();

      if (existingExpression) {
        return res.status(409).json({
          error: 'Expression already exists.',
        });
      }

      const expression = await Expression.create(data);

      return res.status(201).json({
        message: 'Expression created successfully.',
        expression,
      });
    } catch (error) {
      // Trata duplicatas detectadas pelo índice único do MongoDB.
      if (error instanceof MongoServerError && error.code === 11000) {
        return res.status(409).json({
          error: 'Expression already exists.',
        });
      }

      return next(error);
    }
  }
}

export { ExpressionController };
