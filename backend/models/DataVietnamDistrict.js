const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataVietnamDistrictSchema = new Schema(
    {
        City: {
            type: String,
            required: true,
        },
        District: {
            type: String,
            required: true
        },
    },
    { collection: 'DataVietnamDistrict' }
)

module.exports = mongoose.model('DataVietnamDistrict', DataVietnamDistrictSchema)