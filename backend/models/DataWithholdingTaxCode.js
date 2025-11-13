const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataWithholdingTaxCodeSchema = new Schema(
    {
        WithholdingTaxCode: {
            type: String,
            required: true,
            unique: true
        },
        Description: {
            type: String,
            required: true
        },
    },
    { collection: 'DataWithholdingTaxCode' }
)

module.exports = mongoose.model('DataWithholdingTaxCode', DataWithholdingTaxCodeSchema)