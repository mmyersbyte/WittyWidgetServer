import { Schema, model } from 'mongoose';
const languageSchema = new Schema({
    // Código padronizado do idioma, como "en" ou "pt-BR".
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: /^[a-z]{2,3}(-[A-Z]{2})?$/,
    },
    // Nome do idioma em inglês e na própria língua.
    name: {
        type: String,
        required: true,
        trim: true,
    },
    nativeName: {
        type: String,
        required: true,
        trim: true,
    },
    // Permite desativar um idioma sem excluir seus documentos.
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true, // Cria createdAt e updatedAt automaticamente.
    versionKey: false,
});
export const Language = model('Language', languageSchema);
//# sourceMappingURL=language.model.js.map