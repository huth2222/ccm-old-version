const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataCheckRuleSchema = new Schema(
    {
        CheckRule: {
            type: String,
            required: true,
            unique: true
        },
        Description: {
            type: String,
            required: true
        },
    },
    { collection: 'DataCheckRule' }
)

module.exports = mongoose.model('DataCheckRule', DataCheckRuleSchema)