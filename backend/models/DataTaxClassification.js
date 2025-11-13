const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataTaxClassificationSchema = new Schema(
    {
        TaxClassification: {
            type: String,
            required: true,
            unique: true
        },
        Description: {
            type: String,
            required: true
        },
    },
    { collection: 'DataTaxClassification' }
)

module.exports = mongoose.model('DataTaxClassification', DataTaxClassificationSchema)