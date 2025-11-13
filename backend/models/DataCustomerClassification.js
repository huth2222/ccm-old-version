const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataCustomerClassificationSchema = new Schema(
    {
        CustomerClassification: {
            type: String,
            required: true,
            unique: true
        },
        Description: {
            type: String,
            required: true
        },
    },
    { collection: 'DataCustomerClassification' }
)

module.exports = mongoose.model('DataCustomerClassification', DataCustomerClassificationSchema)