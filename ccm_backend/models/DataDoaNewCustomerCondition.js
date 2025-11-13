const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataDoaNewCustomerConditionSchema = new Schema(
    {
        companyCode: {
            type: String,
            required: true,
        },
        distChannel: {
            type: String,
            required: true
        },
        topic: {
            type: String,
            required: true
        },
        condition: {
            type: String,
        },
        conditionValue: {
            type: String,
        },
        approval: {
            type: String,
            required: true
        },
        coApproval: {
            type: String,
        },
    },
    { collection: 'DataDoaNewCustomerCondition' }
)

module.exports = mongoose.model('DataDoaNewCustomerCondition', DataDoaNewCustomerConditionSchema)