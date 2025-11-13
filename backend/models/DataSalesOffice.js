const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataSalesOfficeSchema = new Schema(
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
    { collection: 'DataSalesOffice' }
)

module.exports = mongoose.model('DataSalesOffice', DataSalesOfficeSchema)