const express = require('express');
const adminController = require('../controllers/adminController');
const cronController = require('../controllers/cronController');
const passportJWT = require("../middlewares/passportJWT");
const multer = require('multer');
const app = express();
const upload = multer();

// app.route('/importCustomerDailyManual')
//   .get([passportJWT.isLogin, passportJWT.isAdmin],adminController.importCustomerDailyManual);

app.route('/importCustomerDailyManual')
  .get([passportJWT.isLogin, passportJWT.isAdmin],cronController.importCustomerDailyManual);

// app.route('/importCustomer')
//   .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importCustomer);

app.route('/importDataBpGroup')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataBpGroup);

app.route('/importDataBusinessPartnerCat')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataBusinessPartnerCat);

app.route('/importDataCountry')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataCountry);

app.route('/importDataRegion')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataRegion);

app.route('/importDataTransportationZone')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataTransportationZone);

app.route('/importDataTransportationZoneVietnam')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataTransportationZoneVietnam);

app.route('/importDataTransportationZoneCaptain')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataTransportationZoneCaptain);

app.route('/importDataLanguage')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataLanguage);

app.route('/importDataCompanyCode')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataCompanyCode);

app.route('/importDataTradingPartner')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataTradingPartner);

app.route('/importDataBankBranch')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataBankBranch);

app.route('/importDataBankBranchCaptain')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataBankBranchCaptain);

app.route('/importDataBankBranchVietnam')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataBankBranchVietnam);

app.route('/importDataAttributeOne')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataAttributeOne);

app.route('/importDataCustomerClassification')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataCustomerClassification);

app.route('/importDataCustomerClassificationCaptain')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataCustomerClassificationCaptain);

app.route('/importDataCustomerClassificationVietnam')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataCustomerClassificationVietnam);

app.route('/importDataReconciliationAccount')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataReconciliationAccount);

app.route('/importDataPaymentTerm')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataPaymentTerm);

app.route('/importDataPaymentTermVietnam')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataPaymentTermVietnam);

app.route('/importDataPaymentTermCaptain')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataPaymentTermCaptain);

app.route('/importDataWithholdingTaxCode')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataWithholdingTaxCode);

app.route('/importDataDistributionChannel')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataDistributionChannel);

app.route('/importDataSalesDistrict')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataSalesDistrict);

app.route('/importDataSalesDistrictCaptain')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataSalesDistrictCaptain);

app.route('/importDataSalesDistrictVietnam')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataSalesDistrictVietnam);

app.route('/importDataCustomerGroup')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataCustomerGroup);

app.route('/importDataSalesOffice')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataSalesOffice);

app.route('/importDataSalesOfficeCaptain')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataSalesOfficeCaptain);

app.route('/importDataSalesOfficeVietnam')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataSalesOfficeVietnam);

app.route('/importDataSalesGroup')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataSalesGroup);

app.route('/importDataSalesGroupCaptain')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataSalesGroupCaptain);

app.route('/importDataSalesGroupVietnam')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataSalesGroupVietnam);

app.route('/importDataCurrency')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataCurrency);

app.route('/importDataExchangeRateType')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataExchangeRateType);

app.route('/importDataPriceList')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataPriceList);

app.route('/importDataDeliveryPriority')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataDeliveryPriority);

app.route('/importDataDeliveryPriorityVietnam')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataDeliveryPriorityVietnam);

app.route('/importDataDeliveryPriorityCaptain')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataDeliveryPriorityCaptain);

app.route('/importDataShippingCondition')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataShippingCondition);

app.route('/importDataIncoterm')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataIncoterm);

app.route('/importDataAccountAssignmentGroup')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataAccountAssignmentGroup);

app.route('/importDataTaxClassification')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataTaxClassification);

app.route('/importDataRiskClass')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataRiskClass);

app.route('/importDataCheckRule')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataCheckRule);

app.route('/importDataGender')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataGender);

app.route('/importDataUserHierarchy')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataUserHierarchy);

app.route('/importDataUsers')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataUsers);

// app.route('/importUsersDataAddMore')
//   .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importUsersDataAddMore);

// app.route('/importDataDoaNewCustomer')
//   .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataDoaNewCustomer);

// app.route('/importDataDoaNewCustomerCondition')
//   .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataDoaNewCustomerCondition);

app.route('/importDataUserDOA')
  .post([upload.single('file')], adminController.importDataUserDOA);

app.route('/importDataCarrier')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataCarrier);

app.route('/importDataThailandAddress')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataThailandAddress);

app.route('/importDataVietnamDistrict')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataVietnamDistrict);

app.route('/importDataVietnamCity')
  .post([passportJWT.isLogin, passportJWT.isAdmin, upload.single('file')], adminController.importDataVietnamCity);


module.exports = app;
