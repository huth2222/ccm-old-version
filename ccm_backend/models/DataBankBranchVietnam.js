const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataBankBranchVietnamSchema = new Schema(
    {
        BankBranch: {
            type: String,
            required: true,
            // unique: true
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
    { collection: 'DataBankBranchVietnam' }
)

module.exports = mongoose.model('DataBankBranchVietnam', DataBankBranchVietnamSchema)