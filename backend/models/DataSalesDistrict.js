const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataSalesDistrictSchema = new Schema(
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
    { collection: 'DataSalesDistrict' }
)

module.exports = mongoose.model('DataSalesDistrict', DataSalesDistrictSchema)