const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataDeliveryPrioritySchema = new Schema(
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
    { collection: 'DataDeliveryPriority' }
)

module.exports = mongoose.model('DataDeliveryPriority', DataDeliveryPrioritySchema)