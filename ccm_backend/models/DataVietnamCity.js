const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataVietnamCitySchema = new Schema(
    {
        Country: {
            type: String,
            required: true,
        },
        City: {
            type: String,
            required: true
        },
    },
    { collection: 'DataVietnamCity' }
)

module.exports = mongoose.model('DataVietnamCity', DataVietnamCitySchema)