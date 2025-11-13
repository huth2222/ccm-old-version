const mongoose = require('mongoose');

// Define the User schema
const dailySchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    start: {
        type: Date,
        default: ""
    },
    end: {
        type: Date,
        default: ""
    },
    status: {
        type: String,
    },
    type: {
        type: String,
    },
    count: {
        type: Number,
        default: ""
    },
    detail_error: {
        type: String,
        default: ""
    },
});

// Create an index on the 'email' field for faster queries

// Create the User model based on the schema
const Daily = mongoose.model('Daily', dailySchema);

// Export the Daily model
module.exports = Daily;
