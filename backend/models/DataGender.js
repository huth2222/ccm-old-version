const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataGenderSchema = new Schema(
    {
        Gender: {
            type: String,
            required: true,
            unique: true
        },
        Description: {
            type: String,
            required: true
        },
    },
    { collection: 'DataGender' }
)

module.exports = mongoose.model('DataGender', DataGenderSchema)