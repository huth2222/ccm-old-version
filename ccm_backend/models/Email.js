const mongoose = require('mongoose');

const { Schema } = mongoose;

const emailSchema = new Schema(
    {
        from_email: {
            type: String,
        },
        to_email: {
            type: String,
        },
        type: {
            type: String,
        },
        status: {
            type: String,
        },
        createDate: {
            type: Date,
            default: Date.now
        },
        sendDetail: {
            type: Object,
        },
        detail: { type: Array, "default": [] }
    },
    { collection: 'email' }
)

module.exports = mongoose.model('email', emailSchema)