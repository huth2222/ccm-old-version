const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataSalesGroupCaptainSchema = new Schema(
    {
        SalesOffice: {
            type: String,
            required: true,
            // unique: true
        },
        SaleOfficeDescription: {
            type: String,
            required: true
        },
        SalesGroup: {
            type: String,
            required: true,
            // unique: true
        },
        SaleGroupDescription: {
            type: String,
            required: true
        },
    },
    { collection: 'DataSalesGroupCaptain' }
)

module.exports = mongoose.model('DataSalesGroupCaptain', DataSalesGroupCaptainSchema)