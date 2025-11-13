const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataDeliveryPriorityVietnamSchema = new Schema(
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
    { collection: 'DataDeliveryPriorityVietnam' }
)

module.exports = mongoose.model('DataDeliveryPriorityVietnam', DataDeliveryPriorityVietnamSchema)