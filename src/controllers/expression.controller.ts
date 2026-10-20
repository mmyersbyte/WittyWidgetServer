import type { Request, Response, NextFunction } from 'express';
import { MongoServerError } from 'mongodb';
import { isValidObjectId } from 'mongoose';

import { Expression } from '../models/expression.model.js';
import { Language } from '../models/language.model.js';
import {
  createExpressionSchema,
  listExpressionsQuerySchema,
  updateExpressionSchema,
} from '../validators/expression.validator.js';

// Retorna os códigos de idioma que não existem ou estão inativos.
async function findMissingLanguageCodes(
  languageCodes: string[],
): Promise<string[]> {
  const uniqueCodes = [...new Set(languageCodes)];

  const languages = await Language.find({
    code: { $in: uniqueCodes },
    isActive: true,
  })
    .select('code')
    .lean();

  const existingCodes = new Set(languages.map((language) => language.code));
  return uniqueCodes.filter((code) => !existingCodes.has(code));
}

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

  // Cadastra uma expressão após validar campos e referências de idioma.
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
      const languageCodes = [
        data.languageCode,
        ...data.meanings.map((meaning) => meaning.languageCode),
        ...data.examples.map((example) => example.translationLanguageCode),
      ];
      const missingCodes = await findMissingLanguageCodes(languageCodes);

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
      if (error instanceof MongoServerError && error.code === 11000) {
        return res.status(409).json({
          error: 'Expression already exists.',
        });
      }

      return next(error);
    }
  }

  // Atualiza parcialmente uma expressão. A rota é protegida por requireAdminKey.
  async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid expression id.' });
    }

    const validation = updateExpressionSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        error: 'Invalid request data.',
        details: validation.error.issues,
      });
    }

    try {
      const expression = await Expression.findById(id);

      if (!expression) {
        return res.status(404).json({ error: 'Expression not found.' });
      }

      const data = validation.data;
      const nextPhrase = data.phrase ?? expression.phrase;
      const nextLanguageCode = data.languageCode ?? expression.languageCode;

      // Se frase ou idioma mudarem, impede criar uma duplicata.
      if (data.phrase !== undefined || data.languageCode !== undefined) {
        const duplicate = await Expression.findOne({
          _id: { $ne: expression._id },
          phrase: nextPhrase,
          languageCode: nextLanguageCode,
        })
          .collation({ locale: 'en', strength: 2 })
          .lean();

        if (duplicate) {
          return res.status(409).json({
            error: 'Expression already exists.',
          });
        }
      }

      // Valida os idiomas resultantes se campos que os referenciam forem alterados.
      const changesLanguageReferences =
        data.languageCode !== undefined ||
        data.meanings !== undefined ||
        data.examples !== undefined;

      if (changesLanguageReferences) {
        const nextMeanings = data.meanings ?? expression.meanings;
        const nextExamples = data.examples ?? expression.examples;
        const languageCodes = [
          nextLanguageCode,
          ...nextMeanings.map((meaning) => meaning.languageCode),
          ...nextExamples.map((example) => example.translationLanguageCode),
        ];
        const missingCodes = await findMissingLanguageCodes(languageCodes);

        if (missingCodes.length > 0) {
          return res.status(400).json({
            error: 'Some languages do not exist or are inactive.',
            missingLanguages: missingCodes,
          });
        }
      }

      // O Mongoose executa as validações do schema ao salvar.
      // Enviar pronunciation: null permite limpar esse campo explicitamente.
      expression.set(data);
      await expression.save();

      return res.status(200).json({
        message: 'Expression updated successfully.',
        expression,
      });
    } catch (error) {
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
