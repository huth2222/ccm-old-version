const Customer = require("../models/Customer");
const jobController = require("./jobController.js");
exports.verifyData = async (req, res) => {
  const {
    taxId,
    branchCode,
    companyCode,
    channel,
    buyingGroup,
    jobType,
    officeType,
  } = req.body;
  let customer = "";
  //check each field is not empty
  let taxCheck = "TaxNo3";
  if (companyCode == "5100") {
    taxCheck = "TaxNo1";
  }

  let queryObject = {};
  queryObject[taxCheck] = taxId;

  if (jobType == "newCustomer") {
    if (!taxId) {
      return res
        .status(400)
        .json({ error: "Please fill tax id required field" });
    }
    if (!branchCode) {
      return res
        .status(400)
        .json({ error: "Please fill branch code required field" });
    }
    if (!companyCode) {
      return res
        .status(400)
        .json({ error: "Please fill company code required field" });
    }
    if (!channel) {
      return res
        .status(400)
        .json({ error: "Please fill channel required field" });
    }
    // if(!buyingGroup){
    //     return res.status(400).json({ error: 'Please fill buying group required field' });
    // }
    if (!jobType) {
      return res
        .status(400)
        .json({ error: "Please fill job type required field" });
    }
    if (!officeType) {
      return res
        .status(400)
        .json({ error: "Please fill office type required field" });
    }

    if (officeType == "headOffice") {
      return res.status(200).json({ status: "ready to go" });
    }
  }
  if (officeType == "branch") {
    return res.status(200).json({ status: "ready to go" });
  } else {
    const customerId = req.body.customerId;

    if (!customerId) {
      return res
        .status(400)
        .json({ error: "Please fill customer id required field" });
    }
    customer = await Customer.findOne({
      Customer: customerId,
      CompanyCode: companyCode,
    });
    if (!customer) {
      return res
        .status(404)
        .json({ error: "Customer not found for change data" });
    } else {
      try {
        let mixDataVerify = { customer, ...req.body };
        await jobController.submitFirstDraftJobChange(req, res, mixDataVerify);
      } catch (error) {
        console.error(`Error create draft on verify change customer`, error);
        return res.status(500).json({
          error: `An error occurred while create draft on verify change customer.`,
        });
      }
      // return res.json(customer);
    }
  }
};

exports.getAllCustomers = async (req, res) => {
  //limit customer to 100
  const customers = await Customer.find({}).limit(10);
  return res.json(customers);
};

exports.getCustomerById = async (req, res) => {
  const { customerId, companyCode } = req.body;
  const customers = await Customer.findOne({
    Customer: customerId,
    CompanyCode: companyCode,
  });

  return res.status(200).json(customers);
};
