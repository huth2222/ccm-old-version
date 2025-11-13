const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataCustomerClassificationCaptainSchema = new Schema(
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
    { collection: 'DataCustomerClassificationCaptain' }
)

module.exports = mongoose.model('DataCustomerClassificationCaptain', DataCustomerClassificationCaptainSchema)