import { z } from 'zod';

const languageCodeSchema = z
  .string()
  .trim()
  .regex(/^[a-z]{2,3}(-[A-Z]{2})?$/);

// Se não forem informados parâmetros, usamos inglês e tradução em português.
export const dailyPublicationQuerySchema = z.object({
  language: languageCodeSchema.default('en'),
  locale: languageCodeSchema.default('pt-BR'),
});
