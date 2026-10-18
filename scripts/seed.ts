import 'dotenv/config';
import mongoose from 'mongoose';

import { connectDatabase } from '../src/config/database.js';
import { Language } from '../src/models/language.model.js';
import { Expression } from '../src/models/expression.model.js';

async function seed(): Promise<void> {
  await connectDatabase();

  // Cadastra os idiomas ou atualiza os dados básicos.
  await Language.updateOne(
    { code: 'en' },
    {
      $set: {
        name: 'English',
        nativeName: 'English',
        isActive: true,
      },
    },
    { upsert: true },
  );

  await Language.updateOne(
    { code: 'pt-BR' },
    {
      $set: {
        name: 'Portuguese (Brazil)',
        nativeName: 'Português (Brasil)',
        isActive: true,
      },
    },
    { upsert: true },
  );

  // Dados de exemplo para testar o catálogo de expressões.
  const expressions = [
    {
      phrase: 'Take it easy',
      languageCode: 'en',
      pronunciation: 'teik it ii-zi',
      meanings: [
        {
          languageCode: 'pt-BR',
          text: 'Relaxe, fique tranquilo.',
        },
      ],
      examples: [
        {
          sentence: 'Take it easy this weekend.',
          translationLanguageCode: 'pt-BR',
          translation: 'Relaxe neste fim de semana.',
        },
      ],
      category: 'everyday',
      level: 'beginner',
      isActive: true,
    },
    {
      phrase: 'It is up to you',
      languageCode: 'en',
      meanings: [
        {
          languageCode: 'pt-BR',
          text: 'Você é quem decide.',
        },
      ],
      examples: [
        {
          sentence: 'We can go now or later. It is up to you.',
          translationLanguageCode: 'pt-BR',
          translation: 'Podemos ir agora ou mais tarde. Você decide.',
        },
      ],
      category: 'everyday',
      level: 'beginner',
      isActive: true,
    },
    {
      phrase: 'That makes sense',
      languageCode: 'en',
      meanings: [
        {
          languageCode: 'pt-BR',
          text: 'Isso faz sentido.',
        },
      ],
      examples: [
        {
          sentence: 'That makes sense to me.',
          translationLanguageCode: 'pt-BR',
          translation: 'Isso faz sentido para mim.',
        },
      ],
      category: 'conversation',
      level: 'beginner',
      isActive: true,
    },
  ];

  // Atualiza as expressões existentes em vez de inserir duplicatas.
  for (const expression of expressions) {
    await Expression.updateOne(
      {
        phrase: expression.phrase,
        languageCode: expression.languageCode,
      },
      { $set: expression },
      { upsert: true, runValidators: true },
    );
  }

  console.log('Seed executado com sucesso.');
}

seed()
  .catch((error: unknown) => {
    console.error('Erro ao executar o seed:', error);
    throw Error('Erro ao executar o seed'); // Re-throw para que o processo termine com erro.
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
