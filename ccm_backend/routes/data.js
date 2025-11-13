const express = require("express");
const dataController = require("../controllers/dataController");
const passportJWT = require("../middlewares/passportJWT");

const app = express();

app
  .route("/allDropDownData/:companyCode")
  .get([passportJWT.isLogin], dataController.getAllDropDownData);
app
  .route("/getSalesGroup/:salesOffice/:companyCode")
  .get([passportJWT.isLogin], dataController.getSalesGroup);
app
  .route("/rejectTopics")
  .get([passportJWT.isLogin], dataController.rejectTopics);
app
  .route("/getCoAppproveForArMaster")
  .get([passportJWT.isLogin], dataController.getCoAppproveForArMaster);
app
  .route("/zipcode")
  .post([passportJWT.isLogin], dataController.getZipcodeData);
app
  .route("/zipcodeall")
  .post([passportJWT.isLogin], dataController.getZipcodeDataAll);
app
  .route("/regionTransportZone")
  .post([passportJWT.isLogin], dataController.getMasterRegionTransportZone);
app
  .route("/bankCheck/:taxId/:branchCode")
  .get([passportJWT.isLogin], dataController.bankCheck);
app
  .route("/userDOAdataSet/:channel")
  .get([passportJWT.isLogin], dataController.userDOAdataSet);
app
  .route("/getCityVietnam")
  .get([passportJWT.isLogin], dataController.getCityVietnam);
app
  .route("/getDistrictVietnam/:city")
  .get([passportJWT.isLogin], dataController.getDistrictVietnam);
app
  .route("/dropDownList")
  .get([passportJWT.isLogin], dataController.dropDownList);

module.exports = app;
