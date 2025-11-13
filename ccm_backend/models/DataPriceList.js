const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataPriceListSchema = new Schema(
    {
        PriceList: {
            type: String,
            required: true,
            unique: true
        },
        Description: {
            type: String,
            required: true
        },
    },
    { collection: 'DataPriceList' }
)

module.exports = mongoose.model('DataPriceList', DataPriceListSchema)