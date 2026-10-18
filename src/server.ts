import 'dotenv/config';
import { connectDatabase } from './config/database.js';
import app from './app.js';

const PORT = Number(process.env.PORT) || 3000;

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
