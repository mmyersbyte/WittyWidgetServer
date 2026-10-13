import 'dotenv/config';
import express from 'express';
import { connectDatabase } from './config/database.js';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'WittyWidgetServer',
  });
});

async function bootstrap(): Promise<void> {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

bootstrap().catch((error: unknown) => {
  console.error('Falha ao iniciar o servidor:', error);
  process.exit(1);
});
