const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
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
    password:{
        type: String,
        default: null,
    },
    name: {
        type: String,
        required: true,
    },
    userType: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    level:{
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
        required: true,
    },
    companyCode: {
        type: String,
        required: true,
    },
    salesGroup: {
        type: String,
        // required: true,
    },
    salesDistrict:{
        type: String,
        // required: true,
    },
    isActive: {
        type: Boolean,
        required: true,
        default: false,
    },
    isRequestActive: {
        type: Boolean,
        required: true,
        default: false,
    },
    isApprove: {
        type: Boolean,
        required: true,
        default: false,
    },
    isReject: {
        type: Boolean,
        required: true,
        default: false,
    },
    saleType: {
        type: String,
    },
    doaTag: {
        type: String,
    },
});

// Create an index on the 'email' field for faster queries
userSchema.index({ 'name': 'text', 'employeeId': 'text'});

// Create the User model based on the schema
const User = mongoose.model('User', userSchema);

// Export the User model
module.exports = User;
