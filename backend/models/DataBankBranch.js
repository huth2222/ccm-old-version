const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataBankBranchSchema = new Schema(
    {
        BankBranch: {
            type: String,
            required: true,
            unique: true
        },
        BankName: {
            type: String,
            required: false,
            default: ""
        },
        BranchName: {
            type: String,
            required: false,
            default: ""
        },
        Description: {
            type: String,
            required: false,
            default: ""
        },
    },
    { collection: 'DataBankBranch' }
)

module.exports = mongoose.model('DataBankBranch', DataBankBranchSchema)