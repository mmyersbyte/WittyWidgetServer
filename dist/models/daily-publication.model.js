import { Schema, model } from 'mongoose';
const dailyPublicationSchema = new Schema({
    // Data no formato YYYY-MM-DD, usando o fuso definido pelo produto.
    dateKey: {
        type: String,
        required: true,
        match: /^\d{4}-\d{2}-\d{2}$/,
    },
    languageCode: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        ref: 'Language',
    },
    // Identifica a expressão selecionada para essa publicação.
    expressionId: {
        type: Schema.Types.ObjectId,
        ref: 'Expression',
        required: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});
// Impede duas publicações para o mesmo idioma e data.
dailyPublicationSchema.index({ dateKey: 1, languageCode: 1 }, { unique: true });
export const DailyPublication = model('DailyPublication', dailyPublicationSchema);
//# sourceMappingURL=daily-publication.model.js.map