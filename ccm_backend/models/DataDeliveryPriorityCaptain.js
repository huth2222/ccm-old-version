const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataDeliveryPriorityCaptainSchema = new Schema(
    {
        DeliveryPriority: {
            type: String,
            required: true,
            unique: true
        },
        Description: {
            type: String,
            // required: true
        },
    },
    { collection: 'DataDeliveryPriorityCaptain' }
)

module.exports = mongoose.model('DataDeliveryPriorityCaptain', DataDeliveryPriorityCaptainSchema)