const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataCarrierSchema = new Schema(
    {
        Carrier: {
            type: String,
            required: true,
            unique: true
        },
        Description: {
            type: String,
            // required: true
        },
    },
    { collection: 'DataCarrier' }
)

module.exports = mongoose.model('DataCarrier', DataCarrierSchema)