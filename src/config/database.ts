import mongoose from 'mongoose';

export async function connectDatabase(): Promise<void> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI não foi definida.');
  }

  await mongoose.connect(uri);

  console.log('MongoDB conectado com sucesso.');
}
