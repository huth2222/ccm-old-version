const express = require("express");
const customerMasterController = require("../controllers/customerMasterController");

const app = express();

app.route("/").post(customerMasterController.index);

module.exports = app;
