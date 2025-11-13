const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataSalesOfficeCaptainSchema = new Schema(
    {
        SalesOffice: {
            type: String,
            required: true,
            // unique: true
        },
        Description: {
            type: String,
            required: true
        },
    },
    { collection: 'DataSalesOfficeCaptain' }
)

module.exports = mongoose.model('DataSalesOfficeCaptain', DataSalesOfficeCaptainSchema)