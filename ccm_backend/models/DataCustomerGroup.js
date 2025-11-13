const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataCustomerGroupSchema = new Schema(
    {
        CustomerGroup: {
            type: String,
            required: true,
            unique: true
        },
        Description: {
            type: String,
            required: true
        },
    },
    { collection: 'DataCustomerGroup' }
)

module.exports = mongoose.model('DataCustomerGroup', DataCustomerGroupSchema)