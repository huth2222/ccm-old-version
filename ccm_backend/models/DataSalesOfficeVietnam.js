const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataSalesOfficeVietnamSchema = new Schema(
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
    { collection: 'DataSalesOfficeVietnam' }
)

module.exports = mongoose.model('DataSalesOfficeVietnam', DataSalesOfficeVietnamSchema)