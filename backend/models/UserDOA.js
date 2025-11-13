const mongoose = require('mongoose');

// Define the User schema
const userDoaSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        default: '$2a$10$jA6jSrR47sbCmBzHztBEouPIcOi1niMf9pjO9FjsqDZQ03no1Ozha',
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        // unique: true,
    },
    distChannel: {
        type: Array,
        default: []
        // required: true,
    },
    companyCode: {
        type: String,
        default: ""
        // required: true,
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true,
    },
    isRequestActive: {
        type: Boolean,
        required: true,
        default: false,
    },
    isApprove: {
        type: Boolean,
        required: true,
        default: true,
    },
    isReject: {
        type: Boolean,
        required: true,
        default: false,
    },
    doaTag: {
        type: String,
    },
    isCoApprove: {
        type: Boolean,
        default: false,
    },
    doaRoleHierarchy: {
        type: Number,
        default: 0,
    },
    isARMasterSendMail: {
        type: Boolean,
        default: false,
    },
    userType: {
        type: String,
        default: 'DOA',
    },
    role: {
        type: String,
        default: "",
    }
});

// Create an index on the 'email' field for faster queries
userDoaSchema.index({ 'name': 'text', 'employeeId': 'text' });

// Create the User model based on the schema
const UserDOA = mongoose.model('UserDOA', userDoaSchema);

// Export the User model
module.exports = UserDOA;
