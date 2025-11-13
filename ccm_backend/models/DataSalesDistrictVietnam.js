const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataSalesDistrictVietnamSchema = new Schema(
    {
        SalesDistrict: {
            type: String,
            required: true,
            unique: true
        },
        Description: {
            type: String,
            required: true
        },
    },
    { collection: 'DataSalesDistrictVietnam' }
)

module.exports = mongoose.model('DataSalesDistrictVietnam', DataSalesDistrictVietnamSchema)