const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataPaymentTermCaptainSchema = new Schema(
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
    { collection: 'DataPaymentTermCaptain' }
)

module.exports = mongoose.model('DataPaymentTermCaptain', DataPaymentTermCaptainSchema)