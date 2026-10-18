import { z } from 'zod';

export const createLanguageSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^[a-z]{2,3}(-[A-Z]{2})?$/, 'Invalid language code'),

  name: z.string().trim().min(1).max(100),

  nativeName: z.string().trim().min(1).max(100),
});
