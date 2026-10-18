import { z } from 'zod';

const languageCodeSchema = z
  .string()
  .trim()
  .regex(/^[a-z]{2,3}(-[A-Z]{2})?$/, 'Invalid language code');

const meaningSchema = z.object({
  languageCode: languageCodeSchema,
  text: z.string().trim().min(1).max(300),
});

const exampleSchema = z.object({
  sentence: z.string().trim().min(1).max(300),
  translationLanguageCode: languageCodeSchema,
  translation: z.string().trim().min(1).max(300),
});

// Define os campos aceitos para cadastrar uma expressão.
export const createExpressionSchema = z.object({
  phrase: z.string().trim().min(1).max(150),
  languageCode: languageCodeSchema,
  pronunciation: z.string().trim().max(200).optional(),
  meanings: z.array(meaningSchema).min(1),
  examples: z.array(exampleSchema).min(1),
  category: z
    .string()
    .trim()
    .min(1)
    .max(50)
    .transform((value) => value.toLowerCase()),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
});

// Permite filtrar o catálogo sem exigir todos os parâmetros.
export const listExpressionsQuerySchema = z.object({
  language: languageCodeSchema.optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  category: z
    .string()
    .trim()
    .min(1)
    .max(50)
    .transform((value) => value.toLowerCase())
    .optional(),
});
