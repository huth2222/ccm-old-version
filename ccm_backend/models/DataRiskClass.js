const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataRiskClassSchema = new Schema(
    {
        RiskClass: {
            type: String,
            required: true,
            unique: true
        },
        Description: {
            type: String,
            required: true
        },
    },
    { collection: 'DataRiskClass' }
)

module.exports = mongoose.model('DataRiskClass', DataRiskClassSchema)