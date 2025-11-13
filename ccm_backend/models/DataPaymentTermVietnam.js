const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataPaymentTermVietnamSchema = new Schema(
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
    { collection: 'DataPaymentTermVietnam' }
)

module.exports = mongoose.model('DataPaymentTermVietnam', DataPaymentTermVietnamSchema)