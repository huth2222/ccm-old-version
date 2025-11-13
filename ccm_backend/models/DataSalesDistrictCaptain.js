const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataSalesDistrictCaptainSchema = new Schema(
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
    { collection: 'DataSalesDistrictCaptain' }
)

module.exports = mongoose.model('DataSalesDistrictCaptain', DataSalesDistrictCaptainSchema)