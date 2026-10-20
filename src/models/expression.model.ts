import { Schema, model, type InferSchemaType } from 'mongoose';

// Um significado pode ser armazenado em diferentes idiomas.
const meaningSchema = new Schema(
  {
    languageCode: {
      type: String,
      required: true,
      trim: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

// Cada exemplo contém a frase original e sua tradução.
const exampleSchema = new Schema(
  {
    sentence: {
      type: String,
      required: true,
      trim: true,
    },

    translationLanguageCode: {
      type: String,
      required: true,
      trim: true,
    },

    translation: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

const expressionSchema = new Schema(
  {
    phrase: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    // Referência ao idioma original, cadastrado em Language.
    languageCode: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      ref: 'Language',
    },

    // Transcrição fonética em IPA (International Phonetic Alphabet).
    // Opcional para permitir que expressões sem pronúncia cadastrada continuem válidas.
    pronunciation: {
      type: String,
      trim: true,
      maxlength: 200,
    },

    meanings: {
      type: [meaningSchema],
      required: true,
      validate: {
        validator: (meanings: unknown[]) => meanings.length > 0,
        message: 'At least one meaning is required.',
      },
    },

    examples: {
      type: [exampleSchema],
      required: true,
      validate: {
        validator: (examples: unknown[]) => examples.length > 0,
        message: 'At least one example is required.',
      },
    },

    category: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    level: {
      type: String,
      required: true,
      enum: ['beginner', 'intermediate', 'advanced'],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Garante que a mesma frase não seja cadastrada duas vezes no mesmo idioma.
expressionSchema.index(
  { languageCode: 1, phrase: 1 },
  {
    unique: true,
    collation: { locale: 'en', strength: 2 },
  },
);

export type ExpressionDocument = InferSchemaType<typeof expressionSchema>;

export const Expression = model('Expression', expressionSchema);
