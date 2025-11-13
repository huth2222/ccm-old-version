const mongoose = require("mongoose");

const { Schema } = mongoose;

const DataMasterRegionTransportZoneSchema = new Schema(
  {
    Number: {
      type: String,
    },
    ZipCode: {
      type: String,
    },
    Province: {
      type: String,
    },
    Amphure: {
      type: String,
    },
    SubDistric: {
      type: String,
    },
    Region: {
      type: String,
    },
    TransportZone: {
      type: String,
    },
  },
  { collection: "DataMasterRegionTransportZone" }
);

module.exports = mongoose.model(
  "DataMasterRegionTransportZone",
  DataMasterRegionTransportZoneSchema
);
