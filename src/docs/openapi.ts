export const openApiSpec: Record<string, any> = {
  openapi: '3.0.3',

  info: {
    title: 'WittyWidget API',
    version: '1.0.0',
    description:
      'API para expressões em inglês, pronúncias em IPA, traduções e publicações diárias.',
  },

  // Endereço utilizado durante o desenvolvimento local.
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local development',
    },
  ],

  // Chave utilizada somente nas operações administrativas.
  components: {
    securitySchemes: {
      AdminApiKey: {
        type: 'apiKey',
        in: 'header',
        name: 'x-admin-key',
        description: 'Chave administrativa configurada no servidor.',
      },
    },

    schemas: {
      LanguageInput: {
        type: 'object',
        required: ['code', 'name', 'nativeName'],
        properties: {
          code: { type: 'string', example: 'en' },
          name: { type: 'string', example: 'English' },
          nativeName: { type: 'string', example: 'English' },
        },
      },

      Meaning: {
        type: 'object',
        required: ['languageCode', 'text'],
        properties: {
          languageCode: { type: 'string', example: 'pt-BR' },
          text: { type: 'string', example: 'Relaxe, fique tranquilo.' },
        },
      },

      Example: {
        type: 'object',
        required: ['sentence', 'translationLanguageCode', 'translation'],
        properties: {
          sentence: {
            type: 'string',
            example: 'Take it easy this weekend.',
          },
          translationLanguageCode: { type: 'string', example: 'pt-BR' },
          translation: {
            type: 'string',
            example: 'Relaxe neste fim de semana.',
          },
        },
      },

      ExpressionInput: {
        type: 'object',
        required: [
          'phrase',
          'languageCode',
          'meanings',
          'examples',
          'category',
          'level',
        ],
        properties: {
          phrase: { type: 'string', example: 'Take it easy' },
          languageCode: { type: 'string', example: 'en' },
          pronunciation: {
            type: 'string',
            nullable: true,
            maxLength: 200,
            description:
              'Transcrição fonética em IPA (International Phonetic Alphabet). Use uma convenção consistente de inglês; por exemplo, /teɪk ɪt ˈiːzi/.',
            example: '/teɪk ɪt ˈiːzi/',
          },
          meanings: {
            type: 'array',
            items: { $ref: '#/components/schemas/Meaning' },
          },
          examples: {
            type: 'array',
            items: { $ref: '#/components/schemas/Example' },
          },
          category: { type: 'string', example: 'everyday' },
          level: {
            type: 'string',
            enum: ['beginner', 'intermediate', 'advanced'],
          },
        },
      },

      // PATCH recebe um ou mais campos, sem exigir o objeto inteiro.
      ExpressionUpdateInput: {
        type: 'object',
        minProperties: 1,
        additionalProperties: false,
        properties: {
          phrase: { type: 'string', minLength: 1, maxLength: 150 },
          languageCode: { type: 'string', example: 'en' },
          pronunciation: {
            type: 'string',
            nullable: true,
            maxLength: 200,
            description:
              'Transcrição fonética em IPA. Envie null para remover a pronúncia cadastrada.',
            example: '/teɪk ɪt ˈiːzi/',
          },
          meanings: {
            type: 'array',
            minItems: 1,
            items: { $ref: '#/components/schemas/Meaning' },
          },
          examples: {
            type: 'array',
            minItems: 1,
            items: { $ref: '#/components/schemas/Example' },
          },
          category: { type: 'string', minLength: 1, maxLength: 50 },
          level: {
            type: 'string',
            enum: ['beginner', 'intermediate', 'advanced'],
          },
        },
      },

      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            example: 'Invalid request data.',
          },
        },
      },
    },
  },

  paths: {
    '/health': {
      get: {
        summary: 'Verificar a saúde da API',
        tags: ['System'],
        responses: {
          '200': { description: 'API funcionando.' },
        },
      },
    },

    '/api/v1/languages': {
      get: {
        summary: 'Listar idiomas ativos',
        tags: ['Languages'],
        responses: {
          '200': { description: 'Lista de idiomas.' },
        },
      },
      post: {
        summary: 'Cadastrar um idioma',
        tags: ['Languages'],
        security: [{ AdminApiKey: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LanguageInput' },
            },
          },
        },
        responses: {
          '201': { description: 'Idioma criado.' },
          '400': { description: 'Dados inválidos.' },
          '401': { description: 'Chave administrativa ausente.' },
          '403': { description: 'Chave administrativa inválida.' },
          '409': { description: 'Idioma já cadastrado.' },
          '503': { description: 'Acesso administrativo não configurado.' },
        },
      },
    },

    '/api/v1/expressions': {
      get: {
        summary: 'Listar expressões',
        tags: ['Expressions'],
        parameters: [
          {
            name: 'language',
            in: 'query',
            schema: { type: 'string', example: 'en' },
          },
          {
            name: 'level',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['beginner', 'intermediate', 'advanced'],
            },
          },
          {
            name: 'category',
            in: 'query',
            schema: { type: 'string', example: 'everyday' },
          },
        ],
        responses: {
          '200': {
            description:
              'Lista de expressões, incluindo pronunciation em IPA quando cadastrado.',
          },
          '400': { description: 'Parâmetros inválidos.' },
        },
      },
      post: {
        summary: 'Cadastrar uma expressão',
        tags: ['Expressions'],
        security: [{ AdminApiKey: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ExpressionInput' },
            },
          },
        },
        responses: {
          '201': { description: 'Expressão criada.' },
          '400': { description: 'Dados ou idiomas inválidos.' },
          '401': { description: 'Chave administrativa ausente.' },
          '403': { description: 'Chave administrativa inválida.' },
          '409': { description: 'Expressão já cadastrada.' },
          '503': { description: 'Acesso administrativo não configurado.' },
        },
      },
    },

    '/api/v1/expressions/{id}': {
      patch: {
        summary: 'Atualizar parcialmente uma expressão',
        description:
          'Rota administrativa. Permite atualizar pronunciation em IPA sem recriar a expressão. Envie pronunciation: null para limpar o campo.',
        tags: ['Expressions'],
        security: [{ AdminApiKey: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ObjectId da expressão no MongoDB.',
            schema: { type: 'string', pattern: '^[a-fA-F0-9]{24}$' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ExpressionUpdateInput' },
              examples: {
                pronunciation: {
                  summary: 'Atualizar somente a pronúncia',
                  value: { pronunciation: '/teɪk ɪt ˈiːzi/' },
                },
                clearPronunciation: {
                  summary: 'Remover a pronúncia',
                  value: { pronunciation: null },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Expressão atualizada.' },
          '400': {
            description:
              'ID ou dados inválidos; idioma referenciado inválido ou inativo.',
          },
          '401': { description: 'Chave administrativa ausente.' },
          '403': { description: 'Chave administrativa inválida.' },
          '404': { description: 'Expressão não encontrada.' },
          '409': {
            description: 'Outra expressão já usa a mesma frase e idioma.',
          },
          '503': { description: 'Acesso administrativo não configurado.' },
        },
      },
    },

    '/api/v1/expressions/today': {
      get: {
        summary: 'Obter a expressão do dia',
        tags: ['Daily Expression'],
        parameters: [
          {
            name: 'language',
            in: 'query',
            required: false,
            schema: { type: 'string', default: 'en' },
            description: 'Idioma que o usuário quer aprender.',
          },
          {
            name: 'locale',
            in: 'query',
            required: false,
            schema: { type: 'string', default: 'pt-BR' },
            description: 'Idioma da tradução.',
          },
        ],
        responses: {
          '200': {
            description:
              'Expressão diária e tradução; pronunciation é devolvido em IPA quando cadastrado.',
          },
          '400': { description: 'Parâmetros inválidos.' },
          '404': {
            description:
              'Não foi encontrada uma expressão elegível ou tradução.',
          },
        },
      },
    },
  },
};
