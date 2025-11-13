const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataDistributionChannelSchema = new Schema(
    {
        DistributionChannel: {
            type: String,
            required: true,
            unique: true
        },
        Description: {
            type: String,
            required: true
        },
    },
    { collection: 'DataDistributionChannel' }
)

module.exports = mongoose.model('DataDistributionChannel', DataDistributionChannelSchema)