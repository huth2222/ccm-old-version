const express = require("express");
const passportJWT = require("../middlewares/passportJWT");
const customerController = require("../controllers/customerController");

const app = express();

app
  .route("/verifyData")
  .post([passportJWT.isLogin], customerController.verifyData);

app
  .route("/customerbyid")
  .post([passportJWT.isLogin], customerController.getCustomerById);

app
  .route("/")
  .get(
    [passportJWT.isLogin, passportJWT.isAdmin],
    customerController.getAllCustomers
  );

module.exports = app;
