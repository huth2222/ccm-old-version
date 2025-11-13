exports.getAllDropDownData = async (req, res) => {
  try {
    const modelNames = [
      "DataBPGroup",
      "DataBusinessPartnerCat",
      "DataCountry",
      "DataRegion",
      "DataLanguage",
      "DataCompanyCode",
      "DataTradingPartner",
      "DataAttributeOne",
      "DataCustomerClassification",
      "DataReconciliationAccount",
      "DataWithholdingTaxCode",
      "DataDistributionChannel",
      "DataCustomerGroup",
      "DataCurrency",
      "DataExchangeRateType",
      "DataPriceList",
      "DataShippingCondition",
      "DataIncoterm",
      "DataAccountAssignmentGroup",
      "DataTaxClassification",
      "DataRiskClass",
      "DataCheckRule",
      "DataGender",
      "DataCarrier",
    ];

    if (req.params.companyCode == "1100") {
      modelNames.push(
        "DataTransportationZone",
        "DataBankBranch",
        "DataPaymentTerm",
        "DataDeliveryPriority",
        "DataSalesDistrict",
        "DataSalesOffice"
      );
    }
    if (req.params.companyCode == "1200") {
      modelNames.push(
        "DataTransportationZoneCaptain",
        "DataBankBranchCaptain",
        "DataPaymentTermCaptain",
        "DataDeliveryPriorityCaptain",
        "DataSalesDistrictCaptain",
        "DataSalesOfficeCaptain"
      );
    }
    if (req.params.companyCode == "5100") {
      modelNames.push(
        "DataTransportationZoneVietnam",
        "DataBankBranchVietnam",
        "DataPaymentTermVietnam",
        "DataDeliveryPriorityVietnam",
        "DataSalesDistrictVietnam",
        "DataSalesOfficeVietnam"
      );
    }

    const data = {};
    await Promise.all(
      modelNames.map(async (modelName) => {
        const Model = require(`../models/${modelName}`);
        const result = await Model.find({});
        if (modelName.startsWith("DataTransportationZone")) {
          data["DataTransportationZone"] = result;
        } else if (modelName.startsWith("DataBankBranch")) {
          data["DataBankBranch"] = result;
        } else if (modelName.startsWith("DataPaymentTerm")) {
          data["DataPaymentTerm"] = result;
        } else if (modelName.startsWith("DataDeliveryPriority")) {
          data["DataDeliveryPriority"] = result;
        } else if (modelName.startsWith("DataSalesDistrict")) {
          data["DataSalesDistrict"] = result;
        } else if (modelName.startsWith("DataSalesOffice")) {
          data["DataSalesOffice"] = result;
        } else {
          data[modelName] = result;
        }
      })
    );
    const UserHierarchy = require("../models/UserHierarchy");
    if (req.user.role != "AR Master") {
      const userHierarchy = await UserHierarchy.find({
        requesterEmployeeId: req.user.employeeId,
      });
      if (userHierarchy && userHierarchy.length > 0) {
        const userSalesDistrictData = userHierarchy.map((item) => {
          const salesDistrictInfo = data["DataSalesDistrict"].find(
            (salesDistrict) => salesDistrict.SalesDistrict == item.salesDistrict
          );
          return {
            salesDistrict: item.salesDistrict,
            Description: salesDistrictInfo
              ? salesDistrictInfo.Description
              : null,
          };
        });
        data["DataSalesDistrict"] = userSalesDistrictData;
      }
    }

    // Remove unnecessary keys
    ["Captain", "Vietnam"].forEach((suffix) => {
      [
        "DataTransportationZone",
        "DataBankBranch",
        "DataPaymentTerm",
        "DataDeliveryPriority",
        "DataSalesOffice",
      ].forEach((key) => {
        delete data[`${key}${suffix}`];
      });
    });

    res.json({
      status: "success",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

exports.rejectTopics = async (req, res) => {
  try {
    const DataRejectTopic = require("../models/DataRejectTopics");
    const data = await DataRejectTopic.find({});
    res.json({
      status: "success",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

exports.getSalesGroup = async (req, res) => {
  const companyCodeModelMap = {
    1100: require("../models/DataSalesGroup"),
    1200: require("../models/DataSalesGroupCaptain"),
    5100: require("../models/DataSalesGroupVietnam"),
  };

  const { salesOffice, companyCode } = req.params;

  if (!salesOffice || !companyCode || !companyCodeModelMap[companyCode]) {
    return res.status(400).json({
      status: "error",
      message: "Invalid parameters",
    });
  }

  try {
    const DataSalesGroup = companyCodeModelMap[companyCode];
    const data = await DataSalesGroup.find({ SalesOffice: salesOffice });

    res.json({
      status: "success",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

exports.getZipcodeData = async (req, res) => {
  const DataThailandAddress = require("../models/DataThailandAddress");

  const zipcodeToFilter = req.body.zipcode;

  // Find all data entries for the given zipcode
  const data = await DataThailandAddress.find({ zipcode: zipcodeToFilter });

  // Create an object to store city (formerly province), district (formerly amphure), and related subdistricts
  const cityDistrictSubdistricts = {};
  const newcityDistrictSubdistricts = {};

  // Create a set to store distinct cities
  const distinctCities = new Set();
  const cities = new Set();
  let cityRaw = "";

  // Iterate through the filtered data and populate the object

  for await (let [_, entry] of data.entries()) {
    const city = entry.city;
    const district = entry.districts;
    const subdistrict = entry.subdistricts;

    // Add city to distinctCities
    distinctCities.add(district);
    cities.add(city);
    cityRaw = city;
    if (city in cityDistrictSubdistricts) {
      if (district in cityDistrictSubdistricts[city]) {
        cityDistrictSubdistricts[city][district].push(subdistrict);
      } else {
        cityDistrictSubdistricts[city][district] = [subdistrict];
      }
    } else {
      cityDistrictSubdistricts[city] = { [district]: [subdistrict] };
    }

    if (district in newcityDistrictSubdistricts) {
      newcityDistrictSubdistricts[district].push(subdistrict);
    } else {
      newcityDistrictSubdistricts[district] = [subdistrict];
    }
  }

  let mainSubdistricts = cityDistrictSubdistricts[cityRaw];
  res.json({
    status: "success",
    data: {
      city: [...cities],
      districts: [...distinctCities],
      subdistricts:
        [...cities]?.length > 1
          ? newcityDistrictSubdistricts
          : mainSubdistricts,
    },
  });
};

exports.getZipcodeDataAll = async (req, res) => {
  const DataThailandAddress = require("../models/DataThailandAddress");

  // Find all data entries for the given zipcode
  const data = await DataThailandAddress.find();

  // Create an object to store city (formerly province), district (formerly amphure), and related subdistricts
  const cityDistrictSubdistricts = {};
  const newcityDistrictSubdistricts = {};

  // Create a set to store distinct cities
  const distinctCities = new Set();
  const cities = new Set();
  let cityRaw = "";

  // Iterate through the filtered data and populate the object

  for await (let [_, entry] of data.entries()) {
    const city = entry.city;
    const district = entry.districts;
    const subdistrict = entry.subdistricts;

    // Add city to distinctCities
    distinctCities.add(district);
    cities.add(city);
    cityRaw = city;
    if (city in cityDistrictSubdistricts) {
      if (district in cityDistrictSubdistricts[city]) {
        cityDistrictSubdistricts[city][district].push(subdistrict);
      } else {
        cityDistrictSubdistricts[city][district] = [subdistrict];
      }
    } else {
      cityDistrictSubdistricts[city] = { [district]: [subdistrict] };
    }

    if (district in newcityDistrictSubdistricts) {
      newcityDistrictSubdistricts[district].push(subdistrict);
    } else {
      newcityDistrictSubdistricts[district] = [subdistrict];
    }
  }

  let mainSubdistricts = cityDistrictSubdistricts[cityRaw];
  res.json({
    status: "success",
    data: {
      city: [...cities],
      districts: [...distinctCities],
      subdistricts:
        [...cities]?.length > 1
          ? newcityDistrictSubdistricts
          : mainSubdistricts,
    },
  });
};

exports.getMasterRegionTransportZone = async (req, res) => {
  try {
    const { ZipCode, Province, Amphure, SubDistric } = req.body;
    const DataMasterRegionTransportZoneSchema = require("../models/DataMasterRegionTransportZone");
    const dataMaster = await DataMasterRegionTransportZoneSchema.findOne({
      ZipCode: ZipCode,
      Province: Province,
      Amphure: Amphure,
      SubDistric: SubDistric,
    });
    return res.status(200).json(dataMaster);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

exports.getCityVietnam = async (req, res) => {
  try {
    const DataVietnamCity = require("../models/DataVietnamCity");
    const data = await DataVietnamCity.find({});

    res.json({
      status: "success",
      data: data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

exports.getDistrictVietnam = async (req, res) => {
  if (!req.params.city) {
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
  try {
    const DataVietnamDistrict = require("../models/DataVietnamDistrict");
    const data = await DataVietnamDistrict.find({ City: req.params.city });

    res.json({
      status: "success",
      data: data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

exports.dropDownList = async (req, res) => {
  const list = [
    {
      name: "BUSINESS PARTNER CATEGORY",
      url: "admin/importDataBusinessPartnerCat",
      file: process.env.SELF_URL + "/data-business-parther-cat.xlsx",
    },
    {
      name: "COUNTRY",
      url: "admin/importDataCountry",
      file: process.env.SELF_URL + "/data-country.xlsx",
    },
    {
      name: "REGION",
      url: "admin/importDataRegion",
      file: process.env.SELF_URL + "/data-region.xlsx",
    },
    {
      name: "TRANSPORTATION ZONE",
      url: "admin/importDataTransportationZone",
      file: process.env.SELF_URL + "/data-transportation-zone.xlsx",
    },
    {
      name: "TRANSPORTATION ZONE VIETNAM",
      url: "admin/importDataTransportationZoneVietnam",
      file: process.env.SELF_URL + "/data-transportation-zone-vietnam.xlsx",
    },
    {
      name: "TRANSPORTATION ZONE CAPTAIN",
      url: "admin/importDataTransportationZoneCaptain",
      file: process.env.SELF_URL + "/data-transportation-zone-captain.xlsx",
    },
    {
      name: "LANGUAGE",
      url: "admin/importDataLanguage",
      file: process.env.SELF_URL + "/data-language.xlsx",
    },
    {
      name: "COMPANY CODE",
      url: "admin/importDataCompanyCode",
      file: process.env.SELF_URL + "/data-company-code.xlsx",
    },
    {
      name: "TRADING PARTNER",
      url: "admin/importDataTradingPartner",
      file: process.env.SELF_URL + "/data-trading-partner.xlsx",
    },
    {
      name: "BANK BRANCH",
      url: "admin/importDataBankBranch",
      file: process.env.SELF_URL + "/data-bank-branch.xlsm",
    },
    {
      name: "BANK BRANCH CAPTAIN",
      url: "admin/importDataBankBranchCaptain",
      file: process.env.SELF_URL + "/data-bank-branch-captain.xlsm",
    },
    {
      name: "BANK BRANCH VIETNAM",
      url: "admin/importDataBankBranchVietnam",
      file: process.env.SELF_URL + "/data-bank-branch-vietnam.xlsm",
    },
    {
      name: "ATTRIBUTE ONE",
      url: "admin/importDataAttributeOne",
      file: process.env.SELF_URL + "/data-attribute-one.xlsx",
    },
    {
      name: "CUSTOMER CLASSIFICATION",
      url: "admin/importDataCustomerClassification",
      file: process.env.SELF_URL + "/data-customer-classification.xlsx",
    },
    // {
    //     "name": "CUSTOMER CLASSIFICATION CAPTAIN",
    //     "url": "admin/importDataCustomerClassificationCaptain",
    //     "file": process.env.SELF_URL + "/data-customer-classification-captain.xlsx"
    // },
    // {
    //     "name": "CUSTOMER CLASSIFICATION VIETNAM",
    //     "url": "admin/importDataCustomerClassificationVietnam",
    //     "file": process.env.SELF_URL + "/data-customer-classification-vietnam.xlsx"
    // },
    {
      name: "RECONCILIATION ACCOUNT",
      url: "admin/importDataReconciliationAccount",
      file: process.env.SELF_URL + "/data-reconciliation-acct.xlsx",
    },
    {
      name: "PAYMENT TERM",
      url: "admin/importDataPaymentTerm",
      file: process.env.SELF_URL + "/data-payment-term.xlsx",
    },
    {
      name: "PAYMENT TERM VIETNAM",
      url: "admin/importDataPaymentTermVietnam",
      file: process.env.SELF_URL + "/data-payment-term-vietnam.xlsx",
    },
    {
      name: "PAYMENT TERM CAPTAIN",
      url: "admin/importDataPaymentTermCaptain",
      file: process.env.SELF_URL + "/data-payment-term-captain.xlsx",
    },
    {
      name: "WITHHOLDING TAX CODE",
      url: "admin/importDataithholdingTaxCode",
      file: process.env.SELF_URL + "/data-withholding-tax-code.xlsx",
    },
    {
      name: "DISTRIBUTION CHANNEL",
      url: "admin/importDataDistributionChannel",
      file: process.env.SELF_URL + "/data-distribution-channel.xlsx",
    },
    {
      name: "SALES DISTRICT",
      url: "admin/importDataSalesDistrict",
      file: process.env.SELF_URL + "/data-sales-district.xlsx",
    },
    {
      name: "SALES DISTRICT CAPTAIN",
      url: "admin/importDataSalesDistrictCaptain",
      file: process.env.SELF_URL + "/data-sales-district-captain.xlsx",
    },
    {
      name: "SALES DISTRICT VIETNAM",
      url: "admin/importDataSalesDistricVietnam",
      file: process.env.SELF_URL + "/data-sales-district-vietnam.xlsx",
    },
    {
      name: "CUSTOMER GROUP",
      url: "admin/importDataCustomerGroup",
      file: process.env.SELF_URL + "/data-customer-group.xlsx",
    },
    {
      name: "SALES OFFICE",
      url: "admin/importDataSalesOffice",
      file: process.env.SELF_URL + "/data-sales-office.xlsx",
    },
    {
      name: "SALES OFFICE CAPTAIN",
      url: "admin/importDataSalesOfficeCaptain",
      file: process.env.SELF_URL + "/data-sales-office-captain.xlsx",
    },
    {
      name: "SALES OFFICE VIETNAM",
      url: "admin/importDataSalesOfficeVietnam",
      file: process.env.SELF_URL + "/data-sales-office-vietnam.xlsx",
    },
    {
      name: "SALES GROUP",
      url: "admin/importDataSalesGroup",
      file: process.env.SELF_URL + "/data-sales-office-sales-group.xlsx",
    },
    {
      name: "SALES GROUP CAPTAIN",
      url: "admin/importDataSalesGroupCaptain",
      file:
        process.env.SELF_URL + "/data-sales-office-sales-group-captain.xlsx",
    },
    {
      name: "SALES GROUP VIETNAM",
      url: "admin/importDataSalesGroupVietnam",
      file:
        process.env.SELF_URL + "/data-sales-office-sales-group-vietnam.xlsx",
    },
    {
      name: "CURRENCY",
      url: "admin/importDataCurrency",
      file: process.env.SELF_URL + "/data-currency.xlsx",
    },
    {
      name: "EXCHANGE RATE TYPE",
      url: "admin/importDataExchangeRateType",
      file: process.env.SELF_URL + "/data-exchange-rate-type.xlsx",
    },
    {
      name: "PRICE LIST",
      url: "admin/importDataPriceList",
      file: process.env.SELF_URL + "/data-price-list.xlsx",
    },
    {
      name: "DELIVERY PRIORITY",
      url: "admin/importDataDeliveryPriority",
      file: process.env.SELF_URL + "/data-delivery-priority.xlsx",
    },
    {
      name: "DELIVERY PRIORITY VIETNAM",
      url: "admin/importDataDeliveryPriorityVietnam",
      file: process.env.SELF_URL + "/data-delivery-priority-vietnam.xlsx",
    },
    {
      name: "DELIVERY PRIORITY CAPTAIN",
      url: "admin/importDataDeliveryPriorityCaptain",
      file: process.env.SELF_URL + "/data-delivery-priority-captain.xlsx",
    },
    {
      name: "SHIPPING CONDITION",
      url: "admin/importDataShippingCondition",
      file: process.env.SELF_URL + "/data-shipping-condition.xlsx",
    },
    {
      name: "INCOTERM",
      url: "admin/importDataIncoterm",
      file: process.env.SELF_URL + "/data-incoterm.xlsx",
    },
    {
      name: "ACCOUNT ASSIGNMENT GROUP",
      url: "admin/importDataAccountAssignmentGroup",
      file: process.env.SELF_URL + "/data-account-assignment-group.xlsx",
    },
    {
      name: "TAX CLASSIFICATION",
      url: "admin/importDataTaxClassification",
      file: process.env.SELF_URL + "/data-tax-classification.xlsx",
    },
    {
      name: "RISK CLASS",
      url: "admin/importDataRiskClass",
      file: process.env.SELF_URL + "/data-risk-class.xlsx",
    },
    {
      name: "CHECK RULE",
      url: "admin/importDataCheckRule",
      file: process.env.SELF_URL + "/data-check-rule.xlsx",
    },
    {
      name: "GENDER",
      url: "admin/importDataGender",
      file: process.env.SELF_URL + "/data-gender.xlsx",
    },
    {
      name: "CARRIER",
      url: "admin/importDataCarrier",
      file: process.env.SELF_URL + "/data-carrier.xlsx",
    },
    {
      name: "THAILAND ADDRESS",
      url: "admin/importDataThailandAddress",
      file: process.env.SELF_URL + "/data-thailand-address.xlsx",
    },
    {
      name: "VIETNAM DISTRICT",
      url: "admin/importDataVietnamDistrict",
      file: process.env.SELF_URL + "/data-vietnam-district.xlsx",
    },
    {
      name: "VIETNAM CITY",
      url: "admin/importDataVietnamCity",
      file: process.env.SELF_URL + "/data-vietnam-city.xlsx",
    },
    {
      name: "USERS",
      url: "admin/importDataUsers",
      file: process.env.SELF_URL + "/data-users.xlsx",
    },
    {
      name: "USER DOA",
      url: "admin/importDataUserDOA",
      file: process.env.SELF_URL + "/data-users-doa.xlsx",
    },
    {
      name: "USER HIERACHY",
      url: "admin/importDataUserHierarchy",
      file: process.env.SELF_URL + "/data-user-hierachy.xlsx",
    },
  ];
  res.json({
    status: "success",
    data: list,
  });
};

exports.getCoAppproveForArMaster = async (req, res) => {
  try {
    const UserDOA = require("../models/UserDOA");
    const UserCoApprove = await UserDOA.find({ isCoApprove: true })
      .sort({ doaRoleHierarchy: 1 })
      .select("-password");

    res.json({
      status: "success",
      UserCoApprove,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

exports.bankCheck = async (req, res) => {
  const taxId = req.params.taxId;
  const branchCode = req.params.branchCode;
  if (!taxId || !branchCode) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
  const Customer = require("../models/Customer");

  try {
    const customer = await Customer.findOne({
      TaxNo3: taxId,
      BranchCode1: branchCode,
    });

    if (!customer) {
      return res.status(500).json({
        status: "error",
        message: "Customer tax ID and branch code not found",
      });
    }

    for (let i = 1; i <= 10; i++) {
      const BankKey = `BankKey${i}`;
      if (!customer[BankKey]) {
        return res.json({
          status: "success",
          bankNumberNext: i,
        });
      }
    }

    return res.status(500).json({
      status: "error",
      message: "This Tax Id and This branch have full bank number",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.userDOAdataSet = async (req, res) => {
  const doaCondition = require("../datasets/doaCondition");
  if (!req.user.companyCode || !req.params.channel) {
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
  const doa = doaCondition.userSelect[req.user.companyCode][req.params.channel];
  const UserDOA = require("../models/UserDOA");
  let userDOAData = {};
  try {
    const promises = doa.map(async (item) => {
      const userDOA = await UserDOA.find({
        companyCode: req.user.companyCode,
        distChannel: req.params.channel,
        doaTag: item,
      }).select("-password");
      userDOAData[item] = userDOA;
    });
    // Wait for all promises to resolve
    await Promise.all(promises);

    res.json({
      status: "success",
      data: {
        userDOAData,
        doa,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};
