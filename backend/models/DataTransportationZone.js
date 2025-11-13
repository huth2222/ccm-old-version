const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataTransportationZoneSchema = new Schema(
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
    { collection: 'DataTransportationZone' }
)

module.exports = mongoose.model('DataTransportationZone', DataTransportationZoneSchema)