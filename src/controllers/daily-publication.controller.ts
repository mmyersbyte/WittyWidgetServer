import type { Request, Response, NextFunction } from 'express';
import { MongoServerError } from 'mongodb';

import { DailyPublication } from '../models/daily-publication.model.js';
import { Expression } from '../models/expression.model.js';
import { dailyPublicationQuerySchema } from '../validators/daily-publication.validator.js';

const TIME_ZONE = 'America/Sao_Paulo';
const DEFAULT_LOCALE = 'pt-BR';

// Retorna a data no fuso de referência do aplicativo: YYYY-MM-DD.
function getDateKey(date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const getPart = (type: string): string => {
    const value = parts.find((part) => part.type === type)?.value;

    if (!value) {
      throw new Error(`Could not determine date part: ${type}`);
    }

    return value;
  };

  return `${getPart('year')}-${getPart('month')}-${getPart('day')}`;
}

class DailyPublicationController {
  async today(req: Request, res: Response, next: NextFunction) {
    const validation = dailyPublicationQuerySchema.safeParse(req.query);

    if (!validation.success) {
      return res.status(400).json({
        error: 'Invalid query parameters.',
        details: validation.error.issues,
      });
    }

    const { language, locale } = validation.data;
    const dateKey = getDateKey();

    try {
      // Se já existe uma publicação para hoje, reutilizamos a mesma.
      let publication = await DailyPublication.findOne({
        dateKey,
        languageCode: language,
      }).lean();

      if (!publication) {
        // No MVP, uma expressão precisa ter significado e exemplo em português.
        const defaultLocaleRegex = new RegExp(`^${DEFAULT_LOCALE}$`, 'i');

        const candidates = await Expression.find({
          languageCode: language,
          isActive: true,
          meanings: {
            $elemMatch: { languageCode: defaultLocaleRegex },
          },
          examples: {
            $elemMatch: {
              translationLanguageCode: defaultLocaleRegex,
            },
          },
        })
          .select('_id')
          .lean();

        if (candidates.length === 0) {
          return res.status(404).json({
            error: 'No eligible expressions found for this language.',
          });
        }

        // Escolhe uma expressão aleatoriamente para a publicação do dia.
        const selected =
          candidates[Math.floor(Math.random() * candidates.length)];

        try {
          await DailyPublication.create({
            dateKey,
            languageCode: language,
            expressionId: selected._id,
          });
        } catch (error) {
          // Outra requisição pode ter criado a publicação ao mesmo tempo.
          if (!(error instanceof MongoServerError) || error.code !== 11000) {
            return next(error);
          }
        }

        // Lê novamente a publicação vencedora, inclusive em caso de concorrência.
        publication = await DailyPublication.findOne({
          dateKey,
          languageCode: language,
        }).lean();
      }

      if (!publication) {
        throw new Error('Daily publication could not be retrieved.');
      }

      const expression = await Expression.findById(
        publication.expressionId,
      ).lean();

      if (!expression) {
        throw new Error('The published expression was not found.');
      }

      // A comparação ignora maiúsculas/minúsculas no código do idioma.
      const meaning = expression.meanings.find(
        (item) => item.languageCode.toLowerCase() === locale.toLowerCase(),
      );

      const example = expression.examples.find(
        (item) =>
          item.translationLanguageCode.toLowerCase() === locale.toLowerCase(),
      );

      if (!meaning || !example) {
        return res.status(404).json({
          error: `Translation not available for locale '${locale}'.`,
        });
      }

      return res.status(200).json({
        date: dateKey,
        timeZone: TIME_ZONE,
        language,
        locale,
        expression: {
          id: expression._id.toString(),
          phrase: expression.phrase,
          pronunciation: expression.pronunciation ?? null,
          meaning: meaning.text,
          example: {
            sentence: example.sentence,
            translation: example.translation,
          },
          category: expression.category,
          level: expression.level,
        },
      });
    } catch (error) {
      return next(error);
    }
  }
}

export { DailyPublicationController };
