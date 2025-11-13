const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataBankBranchCaptainSchema = new Schema(
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
    { collection: 'DataBankBranchCaptain' }
)

module.exports = mongoose.model('DataBankBranchCaptain', DataBankBranchCaptainSchema)