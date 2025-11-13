const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataTradingPartnerSchema = new Schema(
    {
        TradingPartner: {
            type: String,
            required: true,
            unique: true
        },
        Description: {
            type: String,
            required: true
        },
    },
    { collection: 'DataTradingPartner' }
)

module.exports = mongoose.model('DataTradingPartner', DataTradingPartnerSchema)