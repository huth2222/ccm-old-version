const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataBPGroupSchema = new Schema(
    {
        BPGroup: {
            type: String,
            required: true,
            unique: true
        },
        Description: {
            type: String,
            required: true
        },
    },
    { collection: 'DataBPGroup' }
)

module.exports = mongoose.model('DataBPGroup', DataBPGroupSchema)