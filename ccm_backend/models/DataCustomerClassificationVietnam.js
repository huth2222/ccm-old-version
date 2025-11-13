const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataCustomerClassificationVietnamSchema = new Schema(
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
    { collection: 'DataCustomerClassificationVietnam' }
)

module.exports = mongoose.model('DataCustomerClassificationVietnam', DataCustomerClassificationVietnamSchema)