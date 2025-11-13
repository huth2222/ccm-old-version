const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataThailandAddressSchema = new Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true
        },
        zipcode: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true
        },
        districts: {
            type: String,
            required: true
        },
        subdistricts: {
            type: String,
            required: true
        },
    },
    { collection: 'DataThailandAddress' }
)

module.exports = mongoose.model('DataThailandAddress', DataThailandAddressSchema)