const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataAttributeOneSchema = new Schema(
    {
        AttributeOne: {
            type: String,
            required: true,
            unique: true
        },
        Description: {
            type: String,
            required: true
        },
    },
    { collection: 'DataAttributeOne' }
)

module.exports = mongoose.model('DataAttributeOne', DataAttributeOneSchema)