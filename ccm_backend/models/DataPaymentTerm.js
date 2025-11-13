const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataPaymentTermSchema = new Schema(
    {
        PaymentTerm: {
            type: String,
            required: true,
            unique: true
        },
        Description: {
            type: String,
            required: true
        },
        DOA:{
            type: String,
            required: true
        },
    },
    { collection: 'DataPaymentTerm' }
)

module.exports = mongoose.model('DataPaymentTerm', DataPaymentTermSchema)