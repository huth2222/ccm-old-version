const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataCurrencySchema = new Schema(
    {
        Currency: {
            type: String,
            required: true,
            unique: true
        },
        Description: {
            type: String,
            // required: true
        },
    },
    { collection: 'DataCurrency' }
)

module.exports = mongoose.model('DataCurrency', DataCurrencySchema)