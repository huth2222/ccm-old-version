const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataReconciliationAccountSchema = new Schema(
    {
        ReconciliationAccount: {
            type: String,
            required: true,
            unique: true
        },
        Description: {
            type: String,
            required: true
        },
    },
    { collection: 'DataReconciliationAccount' }
)

module.exports = mongoose.model('DataReconciliationAccount', DataReconciliationAccountSchema)