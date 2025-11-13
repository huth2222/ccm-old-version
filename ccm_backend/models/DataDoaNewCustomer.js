const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataDoaNewCustomerSchema = new Schema(
    {
        companyCode: {
            type: String,
            required: true,
        },
        distChannel: {
            type: String,
            required: true
        },
        DOA1: {
            type: String,
            default: ""
        },
        DOA2: {
            type: String,
            default: ""
        },
        DOA3: {
            type: String,
            default: ""
        },
        DOA4: {
            type: String,
            default: ""
        },
    },
    { collection: 'DataDoaNewCustomer' }
)

module.exports = mongoose.model('DataDoaNewCustomer', DataDoaNewCustomerSchema)