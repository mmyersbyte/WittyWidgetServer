import 'dotenv/config';
import mongoose from 'mongoose';

import { connectDatabase } from '../src/config/database.js';
import { Language } from '../src/models/language.model.js';
import { Expression } from '../src/models/expression.model.js';

async function seed(): Promise<void> {
  await connectDatabase();

  // Idiomas
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

  // Pronúncias em IPA: referência geral do inglês americano.
  const expressions = [
    // EVERYDAY — BEGINNER
    {
      phrase: 'Take it easy',
      languageCode: 'en',
      pronunciation: '/teɪk ɪt ˈiːzi/',
      meanings: [{ languageCode: 'pt-BR', text: 'Relaxe, fique tranquilo.' }],
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
      pronunciation: '/ɪt ɪz ˌʌp tə ˈjuː/',
      meanings: [{ languageCode: 'pt-BR', text: 'Você é quem decide.' }],
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
      pronunciation: '/ðæt meɪks sɛns/',
      meanings: [{ languageCode: 'pt-BR', text: 'Isso faz sentido.' }],
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
    {
      phrase: 'No worries',
      languageCode: 'en',
      pronunciation: '/noʊ ˈwɝiz/',
      meanings: [
        { languageCode: 'pt-BR', text: 'Sem problemas; não se preocupe.' },
      ],
      examples: [
        {
          sentence: 'No worries, I can help you.',
          translationLanguageCode: 'pt-BR',
          translation: 'Sem problemas, posso ajudar você.',
        },
      ],
      category: 'everyday',
      level: 'beginner',
      isActive: true,
    },
    {
      phrase: 'Sounds good',
      languageCode: 'en',
      pronunciation: '/saʊndz ɡʊd/',
      meanings: [{ languageCode: 'pt-BR', text: 'Parece ótimo; combinado.' }],
      examples: [
        {
          sentence: 'Let us meet at six. Sounds good!',
          translationLanguageCode: 'pt-BR',
          translation: 'Vamos nos encontrar às seis. Combinado!',
        },
      ],
      category: 'conversation',
      level: 'beginner',
      isActive: true,
    },
    {
      phrase: 'I am not sure',
      languageCode: 'en',
      pronunciation: '/aɪ æm nɑt ʃʊr/',
      meanings: [{ languageCode: 'pt-BR', text: 'Não tenho certeza.' }],
      examples: [
        {
          sentence: 'I am not sure about the answer.',
          translationLanguageCode: 'pt-BR',
          translation: 'Não tenho certeza sobre a resposta.',
        },
      ],
      category: 'everyday',
      level: 'beginner',
      isActive: true,
    },
    {
      phrase: 'Never mind',
      languageCode: 'en',
      pronunciation: '/ˈnɛvɚ maɪnd/',
      meanings: [
        { languageCode: 'pt-BR', text: 'Deixa para lá; não importa.' },
      ],
      examples: [
        {
          sentence: 'Never mind, I found my keys.',
          translationLanguageCode: 'pt-BR',
          translation: 'Deixa para lá, encontrei minhas chaves.',
        },
      ],
      category: 'conversation',
      level: 'beginner',
      isActive: true,
    },
    {
      phrase: 'Here you go',
      languageCode: 'en',
      pronunciation: '/hɪr juː ɡoʊ/',
      meanings: [{ languageCode: 'pt-BR', text: 'Aqui está; toma.' }],
      examples: [
        {
          sentence: 'Here you go. Your coffee is ready.',
          translationLanguageCode: 'pt-BR',
          translation: 'Aqui está. Seu café está pronto.',
        },
      ],
      category: 'everyday',
      level: 'beginner',
      isActive: true,
    },
    {
      phrase: 'It depends',
      languageCode: 'en',
      pronunciation: '/ɪt dɪˈpɛndz/',
      meanings: [{ languageCode: 'pt-BR', text: 'Depende.' }],
      examples: [
        {
          sentence: 'It depends on the weather.',
          translationLanguageCode: 'pt-BR',
          translation: 'Depende do clima.',
        },
      ],
      category: 'conversation',
      level: 'beginner',
      isActive: true,
    },
    {
      phrase: 'I got it',
      languageCode: 'en',
      pronunciation: '/aɪ ɡɑt ɪt/',
      meanings: [{ languageCode: 'pt-BR', text: 'Entendi; consegui.' }],
      examples: [
        {
          sentence: 'Thanks for explaining. I got it.',
          translationLanguageCode: 'pt-BR',
          translation: 'Obrigado por explicar. Entendi.',
        },
      ],
      category: 'conversation',
      level: 'beginner',
      isActive: true,
    },

    // CONVERSATION — BEGINNER
    {
      phrase: 'How is it going?',
      languageCode: 'en',
      pronunciation: '/haʊ ɪz ɪt ˈɡoʊɪŋ/',
      meanings: [{ languageCode: 'pt-BR', text: 'Como vão as coisas?' }],
      examples: [
        {
          sentence: 'Hey, how is it going?',
          translationLanguageCode: 'pt-BR',
          translation: 'Oi, como vão as coisas?',
        },
      ],
      category: 'conversation',
      level: 'beginner',
      isActive: true,
    },
    {
      phrase: 'Long time no see',
      languageCode: 'en',
      pronunciation: '/lɔŋ taɪm noʊ siː/',
      meanings: [{ languageCode: 'pt-BR', text: 'Quanto tempo!' }],
      examples: [
        {
          sentence: 'Long time no see! How have you been?',
          translationLanguageCode: 'pt-BR',
          translation: 'Quanto tempo! Como você tem passado?',
        },
      ],
      category: 'conversation',
      level: 'beginner',
      isActive: true,
    },
    {
      phrase: 'What do you mean?',
      languageCode: 'en',
      pronunciation: '/wʌt də juː miːn/',
      meanings: [{ languageCode: 'pt-BR', text: 'O que você quer dizer?' }],
      examples: [
        {
          sentence: 'What do you mean by that?',
          translationLanguageCode: 'pt-BR',
          translation: 'O que você quer dizer com isso?',
        },
      ],
      category: 'conversation',
      level: 'beginner',
      isActive: true,
    },
    {
      phrase: 'Are you kidding me?',
      languageCode: 'en',
      pronunciation: '/ɑr juː ˈkɪdɪŋ miː/',
      meanings: [
        { languageCode: 'pt-BR', text: 'Você está brincando comigo?' },
      ],
      examples: [
        {
          sentence: 'Are you kidding me? That is amazing!',
          translationLanguageCode: 'pt-BR',
          translation: 'Você está brincando comigo? Isso é incrível!',
        },
      ],
      category: 'conversation',
      level: 'intermediate',
      isActive: true,
    },
    {
      phrase: 'I have no idea',
      languageCode: 'en',
      pronunciation: '/aɪ hæv noʊ aɪˈdiːə/',
      meanings: [{ languageCode: 'pt-BR', text: 'Não faço a menor ideia.' }],
      examples: [
        {
          sentence: 'I have no idea where he went.',
          translationLanguageCode: 'pt-BR',
          translation: 'Não faço ideia de para onde ele foi.',
        },
      ],
      category: 'conversation',
      level: 'beginner',
      isActive: true,
    },
    {
      phrase: 'Fair enough',
      languageCode: 'en',
      pronunciation: '/fɛr ɪˈnʌf/',
      meanings: [{ languageCode: 'pt-BR', text: 'Justo; faz sentido.' }],
      examples: [
        {
          sentence: 'You need more time? Fair enough.',
          translationLanguageCode: 'pt-BR',
          translation: 'Você precisa de mais tempo? Justo.',
        },
      ],
      category: 'conversation',
      level: 'intermediate',
      isActive: true,
    },
    {
      phrase: 'I see what you mean',
      languageCode: 'en',
      pronunciation: '/aɪ siː wʌt juː miːn/',
      meanings: [
        { languageCode: 'pt-BR', text: 'Entendo o que você quer dizer.' },
      ],
      examples: [
        {
          sentence: 'I see what you mean now.',
          translationLanguageCode: 'pt-BR',
          translation: 'Agora entendo o que você quer dizer.',
        },
      ],
      category: 'conversation',
      level: 'intermediate',
      isActive: true,
    },
    {
      phrase: 'That is a good point',
      languageCode: 'en',
      pronunciation: '/ðæt ɪz ə ɡʊd pɔɪnt/',
      meanings: [{ languageCode: 'pt-BR', text: 'Esse é um bom argumento.' }],
      examples: [
        {
          sentence: 'That is a good point. Let us discuss it.',
          translationLanguageCode: 'pt-BR',
          translation: 'Esse é um bom argumento. Vamos discutir isso.',
        },
      ],
      category: 'conversation',
      level: 'intermediate',
      isActive: true,
    },
    {
      phrase: 'It slipped my mind',
      languageCode: 'en',
      pronunciation: '/ɪt slɪpt maɪ maɪnd/',
      meanings: [{ languageCode: 'pt-BR', text: 'Acabei esquecendo.' }],
      examples: [
        {
          sentence: 'Sorry, it slipped my mind.',
          translationLanguageCode: 'pt-BR',
          translation: 'Desculpe, acabei esquecendo.',
        },
      ],
      category: 'conversation',
      level: 'intermediate',
      isActive: true,
    },
    {
      phrase: 'You never know',
      languageCode: 'en',
      pronunciation: '/juː ˈnɛvɚ noʊ/',
      meanings: [{ languageCode: 'pt-BR', text: 'Nunca se sabe.' }],
      examples: [
        {
          sentence: 'Take an umbrella. You never know.',
          translationLanguageCode: 'pt-BR',
          translation: 'Leve um guarda-chuva. Nunca se sabe.',
        },
      ],
      category: 'conversation',
      level: 'beginner',
      isActive: true,
    },

    // SOCIAL — BEGINNER / INTERMEDIATE
    {
      phrase: 'I am down for that',
      languageCode: 'en',
      pronunciation: '/aɪ æm daʊn fɚ ðæt/',
      meanings: [{ languageCode: 'pt-BR', text: 'Topo essa; estou dentro.' }],
      examples: [
        {
          sentence: 'Want to try that new restaurant? I am down for that.',
          translationLanguageCode: 'pt-BR',
          translation: 'Quer experimentar aquele restaurante novo? Eu topo.',
        },
      ],
      category: 'social',
      level: 'intermediate',
      isActive: true,
    },
    {
      phrase: 'Let me know',
      languageCode: 'en',
      pronunciation: '/lɛt miː noʊ/',
      meanings: [{ languageCode: 'pt-BR', text: 'Me avise; me diga.' }],
      examples: [
        {
          sentence: 'Let me know when you arrive.',
          translationLanguageCode: 'pt-BR',
          translation: 'Me avise quando você chegar.',
        },
      ],
      category: 'social',
      level: 'beginner',
      isActive: true,
    },
    {
      phrase: 'I am looking forward to it',
      languageCode: 'en',
      pronunciation: '/aɪ æm ˈlʊkɪŋ ˈfɔrwɚd tə ɪt/',
      meanings: [{ languageCode: 'pt-BR', text: 'Estou ansioso por isso.' }],
      examples: [
        {
          sentence: 'Our trip is next week. I am looking forward to it.',
          translationLanguageCode: 'pt-BR',
          translation:
            'Nossa viagem é na próxima semana. Estou ansioso por ela.',
        },
      ],
      category: 'social',
      level: 'intermediate',
      isActive: true,
    },
    {
      phrase: 'Make yourself at home',
      languageCode: 'en',
      pronunciation: '/meɪk jɚˈsɛlf æt hoʊm/',
      meanings: [{ languageCode: 'pt-BR', text: 'Fique à vontade.' }],
      examples: [
        {
          sentence: 'Come in and make yourself at home.',
          translationLanguageCode: 'pt-BR',
          translation: 'Entre e fique à vontade.',
        },
      ],
      category: 'social',
      level: 'intermediate',
      isActive: true,
    },
    {
      phrase: 'It was nice meeting you',
      languageCode: 'en',
      pronunciation: '/ɪt wəz naɪs ˈmiːtɪŋ juː/',
      meanings: [
        { languageCode: 'pt-BR', text: 'Foi um prazer conhecer você.' },
      ],
      examples: [
        {
          sentence: 'Thanks for coming. It was nice meeting you.',
          translationLanguageCode: 'pt-BR',
          translation: 'Obrigado por vir. Foi um prazer conhecer você.',
        },
      ],
      category: 'social',
      level: 'beginner',
      isActive: true,
    },
    {
      phrase: 'Keep in touch',
      languageCode: 'en',
      pronunciation: '/kiːp ɪn tʌtʃ/',
      meanings: [{ languageCode: 'pt-BR', text: 'Vamos manter contato.' }],
      examples: [
        {
          sentence: 'I enjoyed our conversation. Keep in touch!',
          translationLanguageCode: 'pt-BR',
          translation: 'Gostei da nossa conversa. Vamos manter contato!',
        },
      ],
      category: 'social',
      level: 'beginner',
      isActive: true,
    },
    {
      phrase: 'Give me a heads-up',
      languageCode: 'en',
      pronunciation: '/ɡɪv miː ə ˈhɛdz ʌp/',
      meanings: [{ languageCode: 'pt-BR', text: 'Me avise com antecedência.' }],
      examples: [
        {
          sentence: 'Give me a heads-up before you leave.',
          translationLanguageCode: 'pt-BR',
          translation: 'Me avise antes de sair.',
        },
      ],
      category: 'social',
      level: 'intermediate',
      isActive: true,
    },
    {
      phrase: 'My bad',
      languageCode: 'en',
      pronunciation: '/maɪ bæd/',
      meanings: [
        { languageCode: 'pt-BR', text: 'Foi mal; a culpa foi minha.' },
      ],
      examples: [
        {
          sentence: 'My bad, I sent the wrong file.',
          translationLanguageCode: 'pt-BR',
          translation: 'Foi mal, enviei o arquivo errado.',
        },
      ],
      category: 'social',
      level: 'beginner',
      isActive: true,
    },
    {
      phrase: 'I am just kidding',
      languageCode: 'en',
      pronunciation: '/aɪ æm dʒʌst ˈkɪdɪŋ/',
      meanings: [{ languageCode: 'pt-BR', text: 'Estou só brincando.' }],
      examples: [
        {
          sentence: 'Relax, I am just kidding.',
          translationLanguageCode: 'pt-BR',
          translation: 'Relaxa, estou só brincando.',
        },
      ],
      category: 'social',
      level: 'beginner',
      isActive: true,
    },
    {
      phrase: 'It is not a big deal',
      languageCode: 'en',
      pronunciation: '/ɪt ɪz nɑt ə bɪɡ diːl/',
      meanings: [
        {
          languageCode: 'pt-BR',
          text: 'Não é nada demais; não é um grande problema.',
        },
      ],
      examples: [
        {
          sentence: 'Do not worry about the mistake. It is not a big deal.',
          translationLanguageCode: 'pt-BR',
          translation: 'Não se preocupe com o erro. Não é nada demais.',
        },
      ],
      category: 'social',
      level: 'intermediate',
      isActive: true,
    },

    // WORK — BEGINNER / INTERMEDIATE
    {
      phrase: 'I will get back to you',
      languageCode: 'en',
      pronunciation: '/aɪ wɪl ɡɛt bæk tə juː/',
      meanings: [
        {
          languageCode: 'pt-BR',
          text: 'Retorno para você; volto a falar com você.',
        },
      ],
      examples: [
        {
          sentence: 'I need to check the details. I will get back to you.',
          translationLanguageCode: 'pt-BR',
          translation: 'Preciso verificar os detalhes. Retorno para você.',
        },
      ],
      category: 'work',
      level: 'intermediate',
      isActive: true,
    },
    {
      phrase: 'Let us touch base',
      languageCode: 'en',
      pronunciation: '/lɛts tʌtʃ beɪs/',
      meanings: [
        {
          languageCode: 'pt-BR',
          text: 'Vamos conversar para alinhar as coisas.',
        },
      ],
      examples: [
        {
          sentence: 'Let us touch base after the meeting.',
          translationLanguageCode: 'pt-BR',
          translation:
            'Vamos conversar depois da reunião para alinhar as coisas.',
        },
      ],
      category: 'work',
      level: 'intermediate',
      isActive: true,
    },
    {
      phrase: 'Keep me posted',
      languageCode: 'en',
      pronunciation: '/kiːp miː ˈpoʊstɪd/',
      meanings: [{ languageCode: 'pt-BR', text: 'Me mantenha informado.' }],
      examples: [
        {
          sentence: 'Keep me posted on the project.',
          translationLanguageCode: 'pt-BR',
          translation: 'Me mantenha informado sobre o projeto.',
        },
      ],
      category: 'work',
      level: 'intermediate',
      isActive: true,
    },
    {
      phrase: 'I will take care of it',
      languageCode: 'en',
      pronunciation: '/aɪ wɪl teɪk kɛr əv ɪt/',
      meanings: [{ languageCode: 'pt-BR', text: 'Vou cuidar disso.' }],
      examples: [
        {
          sentence: 'Do not worry about the report. I will take care of it.',
          translationLanguageCode: 'pt-BR',
          translation: 'Não se preocupe com o relatório. Vou cuidar disso.',
        },
      ],
      category: 'work',
      level: 'beginner',
      isActive: true,
    },
    {
      phrase: 'Could you clarify that?',
      languageCode: 'en',
      pronunciation: '/kʊd juː ˈklɛrəˌfaɪ ðæt/',
      meanings: [
        { languageCode: 'pt-BR', text: 'Você poderia esclarecer isso?' },
      ],
      examples: [
        {
          sentence: 'Could you clarify that point for the team?',
          translationLanguageCode: 'pt-BR',
          translation: 'Você poderia esclarecer esse ponto para a equipe?',
        },
      ],
      category: 'work',
      level: 'intermediate',
      isActive: true,
    },
    {
      phrase: 'I will keep that in mind',
      languageCode: 'en',
      pronunciation: '/aɪ wɪl kiːp ðæt ɪn maɪnd/',
      meanings: [
        { languageCode: 'pt-BR', text: 'Vou levar isso em consideração.' },
      ],
      examples: [
        {
          sentence: 'Thanks for the feedback. I will keep that in mind.',
          translationLanguageCode: 'pt-BR',
          translation:
            'Obrigado pelo feedback. Vou levar isso em consideração.',
        },
      ],
      category: 'work',
      level: 'intermediate',
      isActive: true,
    },
    {
      phrase: 'Let us figure it out',
      languageCode: 'en',
      pronunciation: '/lɛts ˈfɪɡjɚ ɪt aʊt/',
      meanings: [
        { languageCode: 'pt-BR', text: 'Vamos encontrar uma solução.' },
      ],
      examples: [
        {
          sentence: 'We have a problem, but let us figure it out.',
          translationLanguageCode: 'pt-BR',
          translation: 'Temos um problema, mas vamos encontrar uma solução.',
        },
      ],
      category: 'work',
      level: 'intermediate',
      isActive: true,
    },
    {
      phrase: 'I am on it',
      languageCode: 'en',
      pronunciation: '/aɪ æm ɑn ɪt/',
      meanings: [{ languageCode: 'pt-BR', text: 'Já estou cuidando disso.' }],
      examples: [
        {
          sentence: 'Can you send the update? I am on it.',
          translationLanguageCode: 'pt-BR',
          translation:
            'Você pode enviar a atualização? Já estou cuidando disso.',
        },
      ],
      category: 'work',
      level: 'beginner',
      isActive: true,
    },
    {
      phrase: 'Let us call it a day',
      languageCode: 'en',
      pronunciation: '/lɛts kɔl ɪt ə deɪ/',
      meanings: [{ languageCode: 'pt-BR', text: 'Vamos encerrar por hoje.' }],
      examples: [
        {
          sentence: 'We have done enough. Let us call it a day.',
          translationLanguageCode: 'pt-BR',
          translation: 'Já fizemos o suficiente. Vamos encerrar por hoje.',
        },
      ],
      category: 'work',
      level: 'intermediate',
      isActive: true,
    },
    {
      phrase: 'I appreciate your help',
      languageCode: 'en',
      pronunciation: '/aɪ əˈpriːʃiˌeɪt jɚ hɛlp/',
      meanings: [{ languageCode: 'pt-BR', text: 'Agradeço pela sua ajuda.' }],
      examples: [
        {
          sentence: 'I really appreciate your help with this task.',
          translationLanguageCode: 'pt-BR',
          translation: 'Agradeço muito pela sua ajuda com esta tarefa.',
        },
      ],
      category: 'work',
      level: 'beginner',
      isActive: true,
    },

    // TRAVEL — BEGINNER
    {
      phrase: 'How much does it cost?',
      languageCode: 'en',
      pronunciation: '/haʊ mʌtʃ dʌz ɪt kɔst/',
      meanings: [{ languageCode: 'pt-BR', text: 'Quanto custa?' }],
      examples: [
        {
          sentence: 'Excuse me, how much does it cost?',
          translationLanguageCode: 'pt-BR',
          translation: 'Com licença, quanto custa?',
        },
      ],
      category: 'travel',
      level: 'beginner',
      isActive: true,
    },
    {
      phrase: 'Where is the nearest station?',
      languageCode: 'en',
      pronunciation: '/wɛr ɪz ðə ˈnɪrəst ˈsteɪʃən/',
      meanings: [
        { languageCode: 'pt-BR', text: 'Onde fica a estação mais próxima?' },
      ],
      examples: [
        {
          sentence: 'Excuse me, where is the nearest station?',
          translationLanguageCode: 'pt-BR',
          translation: 'Com licença, onde fica a estação mais próxima?',
        },
      ],
      category: 'travel',
      level: 'beginner',
      isActive: true,
    },
    {
      phrase: 'Could I have the menu?',
      languageCode: 'en',
      pronunciation: '/kʊd aɪ hæv ðə ˈmɛnjuː/',
      meanings: [
        { languageCode: 'pt-BR', text: 'Poderia me trazer o cardápio?' },
      ],
      examples: [
        {
          sentence: 'Could I have the menu, please?',
          translationLanguageCode: 'pt-BR',
          translation: 'Poderia me trazer o cardápio, por favor?',
        },
      ],
      category: 'travel',
      level: 'beginner',
      isActive: true,
    },
    {
      phrase: 'I would like a table for two',
      languageCode: 'en',
      pronunciation: '/aɪ wʊd laɪk ə ˈteɪbəl fɚ tuː/',
      meanings: [
        {
          languageCode: 'pt-BR',
          text: 'Gostaria de uma mesa para duas pessoas.',
        },
      ],
      examples: [
        {
          sentence: 'Hello, I would like a table for two.',
          translationLanguageCode: 'pt-BR',
          translation: 'Olá, gostaria de uma mesa para duas pessoas.',
        },
      ],
      category: 'travel',
      level: 'beginner',
      isActive: true,
    },
    {
      phrase: 'Can I get a receipt?',
      languageCode: 'en',
      pronunciation: '/kæn aɪ ɡɛt ə rɪˈsiːt/',
      meanings: [{ languageCode: 'pt-BR', text: 'Posso pegar um recibo?' }],
      examples: [
        {
          sentence: 'Can I get a receipt for this purchase?',
          translationLanguageCode: 'pt-BR',
          translation: 'Posso pegar um recibo desta compra?',
        },
      ],
      category: 'travel',
      level: 'beginner',
      isActive: true,
    },
    {
      phrase: 'I am looking for this address',
      languageCode: 'en',
      pronunciation: '/aɪ æm ˈlʊkɪŋ fɚ ðɪs əˈdrɛs/',
      meanings: [
        { languageCode: 'pt-BR', text: 'Estou procurando este endereço.' },
      ],
      examples: [
        {
          sentence: 'Excuse me, I am looking for this address.',
          translationLanguageCode: 'pt-BR',
          translation: 'Com licença, estou procurando este endereço.',
        },
      ],
      category: 'travel',
      level: 'beginner',
      isActive: true,
    },
    {
      phrase: 'Is there a pharmacy nearby?',
      languageCode: 'en',
      pronunciation: '/ɪz ðɛr ə ˈfɑrməsi ˌnɪrˈbaɪ/',
      meanings: [
        { languageCode: 'pt-BR', text: 'Tem uma farmácia aqui perto?' },
      ],
      examples: [
        {
          sentence: 'Is there a pharmacy nearby? I need some medicine.',
          translationLanguageCode: 'pt-BR',
          translation: 'Tem uma farmácia aqui perto? Preciso de um remédio.',
        },
      ],
      category: 'travel',
      level: 'beginner',
      isActive: true,
    },
    {
      phrase: 'Could you take a picture?',
      languageCode: 'en',
      pronunciation: '/kʊd juː teɪk ə ˈpɪktʃɚ/',
      meanings: [
        { languageCode: 'pt-BR', text: 'Você poderia tirar uma foto?' },
      ],
      examples: [
        {
          sentence: 'Could you take a picture of us, please?',
          translationLanguageCode: 'pt-BR',
          translation: 'Você poderia tirar uma foto nossa, por favor?',
        },
      ],
      category: 'travel',
      level: 'beginner',
      isActive: true,
    },
    {
      phrase: 'I have a reservation',
      languageCode: 'en',
      pronunciation: '/aɪ hæv ə ˌrɛzɚˈveɪʃən/',
      meanings: [{ languageCode: 'pt-BR', text: 'Tenho uma reserva.' }],
      examples: [
        {
          sentence: 'Hello, I have a reservation under my name.',
          translationLanguageCode: 'pt-BR',
          translation: 'Olá, tenho uma reserva em meu nome.',
        },
      ],
      category: 'travel',
      level: 'beginner',
      isActive: true,
    },
    {
      phrase: 'Could you speak more slowly?',
      languageCode: 'en',
      pronunciation: '/kʊd juː spiːk mɔr ˈsloʊli/',
      meanings: [
        { languageCode: 'pt-BR', text: 'Você poderia falar mais devagar?' },
      ],
      examples: [
        {
          sentence: 'Could you speak more slowly? I am still learning English.',
          translationLanguageCode: 'pt-BR',
          translation:
            'Você poderia falar mais devagar? Ainda estou aprendendo inglês.',
        },
      ],
      category: 'travel',
      level: 'beginner',
      isActive: true,
    },

    // EVERYDAY — INTERMEDIATE
    {
      phrase: 'Better late than never',
      languageCode: 'en',
      pronunciation: '/ˈbɛtɚ leɪt ðæn ˈnɛvɚ/',
      meanings: [{ languageCode: 'pt-BR', text: 'Antes tarde do que nunca.' }],
      examples: [
        {
          sentence: 'You finally started exercising. Better late than never!',
          translationLanguageCode: 'pt-BR',
          translation:
            'Você finalmente começou a se exercitar. Antes tarde do que nunca!',
        },
      ],
      category: 'everyday',
      level: 'intermediate',
      isActive: true,
    },
    {
      phrase: 'Practice makes perfect',
      languageCode: 'en',
      pronunciation: '/ˈpræktɪs meɪks ˈpɝfɪkt/',
      meanings: [
        { languageCode: 'pt-BR', text: 'A prática leva à perfeição.' },
      ],
      examples: [
        {
          sentence: 'Keep practicing your English. Practice makes perfect.',
          translationLanguageCode: 'pt-BR',
          translation:
            'Continue praticando seu inglês. A prática leva à perfeição.',
        },
      ],
      category: 'everyday',
      level: 'beginner',
      isActive: true,
    },
    {
      phrase: 'It is worth it',
      languageCode: 'en',
      pronunciation: '/ɪt ɪz wɝθ ɪt/',
      meanings: [{ languageCode: 'pt-BR', text: 'Vale a pena.' }],
      examples: [
        {
          sentence: 'Learning a new language takes time, but it is worth it.',
          translationLanguageCode: 'pt-BR',
          translation: 'Aprender um novo idioma leva tempo, mas vale a pena.',
        },
      ],
      category: 'everyday',
      level: 'beginner',
      isActive: true,
    },
    {
      phrase: 'Better safe than sorry',
      languageCode: 'en',
      pronunciation: '/ˈbɛtɚ seɪf ðæn ˈsɑri/',
      meanings: [
        { languageCode: 'pt-BR', text: 'É melhor prevenir do que remediar.' },
      ],
      examples: [
        {
          sentence: 'Wear your helmet. Better safe than sorry.',
          translationLanguageCode: 'pt-BR',
          translation: 'Use seu capacete. É melhor prevenir do que remediar.',
        },
      ],
      category: 'everyday',
      level: 'intermediate',
      isActive: true,
    },
    {
      phrase: 'The sooner, the better',
      languageCode: 'en',
      pronunciation: '/ðə ˈsuːnɚ ðə ˈbɛtɚ/',
      meanings: [{ languageCode: 'pt-BR', text: 'Quanto antes, melhor.' }],
      examples: [
        {
          sentence: 'Please send me the documents. The sooner, the better.',
          translationLanguageCode: 'pt-BR',
          translation: 'Por favor, envie os documentos. Quanto antes, melhor.',
        },
      ],
      category: 'everyday',
      level: 'intermediate',
      isActive: true,
    },
  ];

  // Atualiza expressões existentes ou cria novas.
  // A combinação de frase + idioma funciona como chave lógica.
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

  console.log(
    `Seed executado com sucesso: ${expressions.length} expressões processadas.`,
  );
}

seed()
  .catch((error: unknown) => {
    console.error('Erro ao executar o seed:', error);
    throw error; // Re-throw the error to ensure the process exits with a non-zero code
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
