const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataCompanyCodeSchema = new Schema(
    {
        CompanyCode: {
            type: String,
            required: true,
            unique: true
        },
        Description: {
            type: String,
            required: true
        },
    },
    { collection: 'DataCompanyCode' }
)

module.exports = mongoose.model('DataCompanyCode', DataCompanyCodeSchema)