const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataRejectTopicSchema = new Schema(
    {
        RejectTopic: {
            type: String,
            required: true,
            unique: true
        },
        Description: {
            type: String,
            required: true
        },
    },
    { collection: 'DataRejectTopic' }
)

module.exports = mongoose.model('DataRejectTopic', DataRejectTopicSchema)