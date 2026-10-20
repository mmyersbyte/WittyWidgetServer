import type { Request, Response, NextFunction } from 'express';
import { MongoServerError } from 'mongodb';
import { memoryCache } from '../utils/memory-cache.js';
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

    // A chave separa cada dia, idioma de aprendizagem e idioma de tradução.
    const cacheKey = `daily-expression:${dateKey}:${language}:${locale.toLowerCase()}`;

    // Permite que clientes HTTP compatíveis reutilizem respostas recentes.
    res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');

    // Se a resposta já estiver em memória, não precisamos consultar o MongoDB.
    const cachedResponse = memoryCache.get<unknown>(cacheKey);

    if (cachedResponse !== undefined) {
      return res.status(200).json(cachedResponse);
    }

    try {
      // Se já existe uma publicação para hoje, reutilizamos a mesma.
      let publication = await DailyPublication.findOne({
        dateKey,
        languageCode: language,
      }).lean();

      if (!publication) {
        // Uma expressão só entra no sorteio se tiver significado e exemplo
        // traduzidos para o idioma padrão da publicação diária.
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

        // Para um catálogo com N expressões elegíveis, consultamos até N - 1
        // publicações anteriores dessas mesmas expressões. A expressão escolhida
        // hoje fica fora do histórico porque dateKey precisa ser anterior a hoje.
        // Assim, com um catálogo estável de 55 expressões, uma frase não se repete
        // dentro de um ciclo de 55 dias. A consulta ignora expressões inativas ou
        // inelegíveis, para que elas não reduzam artificialmente o catálogo.
        const historyLimit = candidates.length - 1;
        let recentlyPublishedIds = new Set<string>();

        if (historyLimit > 0) {
          const candidateIds = candidates.map((candidate) => candidate._id);

          const recentPublications = await DailyPublication.find({
            dateKey: { $lt: dateKey },
            languageCode: language,
            expressionId: { $in: candidateIds },
          })
            .sort({ dateKey: -1 })
            .limit(historyLimit)
            .select('expressionId')
            .lean();

          recentlyPublishedIds = new Set(
            recentPublications.map((item) => item.expressionId.toString()),
          );
        }

        // Embaralhamos apenas as que não aparecem nas N - 1 publicações
        // anteriores. Como há N candidatas e no máximo N - 1 IDs distintos
        // podem estar nesse histórico, sempre haverá pelo menos uma opção.
        const availableCandidates = candidates.filter(
          (candidate) => !recentlyPublishedIds.has(candidate._id.toString()),
        );

        const selected =
          availableCandidates[
            Math.floor(Math.random() * availableCandidates.length)
          ];

        try {
          await DailyPublication.create({
            dateKey,
            languageCode: language,
            expressionId: selected._id,
          });
        } catch (error) {
          // Outra requisição pode ter criado a publicação ao mesmo tempo.
          // O índice único dateKey + languageCode garante apenas uma publicação
          // diária; abaixo, recuperamos a publicação vencedora.
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

      const responseBody = {
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
      };

      // Como a data faz parte da chave, um novo dia usa outro cache.
      // As entradas podem permanecer por até 24 horas.
      memoryCache.set(cacheKey, responseBody, 24 * 60 * 60 * 1000);

      return res.status(200).json(responseBody);
    } catch (error) {
      return next(error);
    }
  }
}

export { DailyPublicationController };
