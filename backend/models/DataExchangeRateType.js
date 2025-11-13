const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataExchangeRateTypeSchema = new Schema(
    {
        ExchangeRateType: {
            type: String,
            required: true,
            unique: true
        },
        Description: {
            type: String,
            required: true
        },
    },
    { collection: 'DataExchangeRateType' }
)

module.exports = mongoose.model('DataExchangeRateType', DataExchangeRateTypeSchema)