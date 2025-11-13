const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataShippingConditionSchema = new Schema(
    {
        ShippingCondition: {
            type: String,
            required: true,
            unique: true
        },
        Description: {
            type: String,
            required: true
        },
    },
    { collection: 'DataShippingCondition' }
)

module.exports = mongoose.model('DataShippingCondition', DataShippingConditionSchema)