const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataCountrySchema = new Schema(
    {
        Country: {
            type: String,
            required: true,
            unique: true
        },
        Description: {
            type: String,
            required: true
        },
    },
    { collection: 'DataCountry' }
)

module.exports = mongoose.model('DataCountry', DataCountrySchema)