const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataRegionSchema = new Schema(
    {
        Region: {
            type: String,
            required: true,
            unique: true
        },
        Description: {
            type: String,
            required: true
        },
    },
    { collection: 'DataRegion' }
)

module.exports = mongoose.model('DataRegion', DataRegionSchema)