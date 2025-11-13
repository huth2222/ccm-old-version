const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataTransportationZoneVietnamSchema = new Schema(
    {
        TransportationZone: {
            type: String,
            required: true,
            unique: true
        },
        Description: {
            type: String,
            required: true
        },
    },
    { collection: 'DataTransportationZoneVietnam' }
)

module.exports = mongoose.model('DataTransportationZoneVietnam', DataTransportationZoneVietnamSchema)