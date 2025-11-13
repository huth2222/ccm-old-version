const mongoose = require('mongoose');

// Define the User schema
const UserHierarchySchema = new mongoose.Schema({
    salesDistrict: {
        type: String,
        required: true,
    },
    requesterEmployeeId: {
        type: String,
        required: true,
    },
    approverEmployeeId: {
        type: String,
        required: true,
    },
    approverEmployeeIdSecond: {
        type: String,
        default: null,
        // required: true,
    },
    reviewerEmployeeId: {
        type: String,
        required: true,
    },
    acknowledgeEmployeeId: {
        type: String,
        required: true,
    },
});

// Create an index on the 'email' field for faster queries
UserHierarchySchema.index({ email: 1 });

// Create the User model based on the schema
const UserHierarchy = mongoose.model('UserHierarchy', UserHierarchySchema);

// Export the User model
module.exports = UserHierarchy;
