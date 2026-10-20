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

// O campo pronunciation armazena a transcrição fonética em IPA.
// null é aceito para permitir remover uma pronúncia em uma atualização PATCH.
const pronunciationSchema = z.string().trim().max(200).nullable().optional();

// Define os campos aceitos para cadastrar uma expressão.
export const createExpressionSchema = z.object({
  phrase: z.string().trim().min(1).max(150),
  languageCode: languageCodeSchema,
  pronunciation: pronunciationSchema,
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

// PATCH aceita somente os campos que precisam ser alterados.
// Pelo menos um campo é obrigatório para evitar atualizações vazias.
export const updateExpressionSchema = createExpressionSchema
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided.',
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
