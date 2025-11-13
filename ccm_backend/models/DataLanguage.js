const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataLanguageSchema = new Schema(
    {
        Language: {
            type: String,
            required: true,
            unique: true
        },
        Description: {
            type: String,
            required: true
        },
    },
    { collection: 'DataLanguage' }
)

module.exports = mongoose.model('DataLanguage', DataLanguageSchema)