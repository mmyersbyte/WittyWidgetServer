import 'dotenv/config';
import { connectDatabase } from './config/database.js';
import app from './app.js';
const PORT = Number(process.env.PORT) || 3000;
async function bootstrap() {
    await connectDatabase();
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}
bootstrap().catch((error) => {
    console.error('Falha ao iniciar o servidor:', error);
    process.exit(1);
});
//# sourceMappingURL=server.js.map