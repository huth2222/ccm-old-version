const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataTransportationZoneCaptainSchema = new Schema(
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
    { collection: 'DataTransportationZoneCaptain' }
)

module.exports = mongoose.model('DataTransportationZoneCaptain', DataTransportationZoneCaptainSchema)