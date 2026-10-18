import { timingSafeEqual } from 'node:crypto';
import type { RequestHandler } from 'express';

// Protege rotas administrativas com uma chave guardada no servidor.
export const requireAdminKey: RequestHandler = (req, res, next) => {
  const expectedKey = process.env.ADMIN_API_KEY;

  // Falha de forma segura se a variável não estiver configurada.
  if (!expectedKey) {
    return res.status(503).json({
      error: 'Admin access is not configured.',
    });
  }

  // A chave deve ser enviada no cabeçalho, nunca na URL.
  const providedKey = req.get('x-admin-key');

  if (!providedKey) {
    return res.status(401).json({
      error: 'Admin key required.',
    });
  }

  const expectedBuffer = Buffer.from(expectedKey, 'utf8');
  const providedBuffer = Buffer.from(providedKey, 'utf8');

  // Comparamos somente buffers do mesmo tamanho.
  if (
    expectedBuffer.length !== providedBuffer.length ||
    !timingSafeEqual(expectedBuffer, providedBuffer)
  ) {
    return res.status(403).json({
      error: 'Invalid admin key.',
    });
  }

  // Chave válida: a requisição pode continuar até o controller.
  next();
};
