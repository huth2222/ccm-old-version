const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataBusinessPartnerCatSchema = new Schema(
    {
        BusinessPartnerCat: {
            type: String,
            required: true,
            unique: true
        },
        Description: {
            type: String,
            required: true
        },
    },
    { collection: 'DataBusinessPartnerCat' }
)

module.exports = mongoose.model('DataBusinessPartnerCat', DataBusinessPartnerCatSchema)