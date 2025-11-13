const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataAccountAssignmentGroupSchema = new Schema(
    {
        AccountAssignmentGroup: {
            type: String,
            required: true,
            unique: true
        },
        Description: {
            type: String,
            required: true
        },
    },
    { collection: 'DataAccountAssignmentGroup' }
)

module.exports = mongoose.model('DataAccountAssignmentGroup', DataAccountAssignmentGroupSchema)