const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataIncotermSchema = new Schema(
    {
        Incoterm: {
            type: String,
            required: true,
            unique: true
        },
        Description: {
            type: String,
            required: true
        },
    },
    { collection: 'DataIncoterm' }
)

module.exports = mongoose.model('DataIncoterm', DataIncotermSchema)