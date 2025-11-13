const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");
const Client = require("ssh2-sftp-client");
const Customer = require("../models/Customer");
const Daily = require("../models/Daily");
const sendEmail = require("../middlewares/mail");
const remoteFilePath = "/upload/CustomerMaster/Customer Master.csv";
const sftpConfig = {
  host: process.env.SFTP_HOST,
  port: process.env.SFTP_PORT,
  username: process.env.SFTP_USERNAME,
  password: process.env.SFTP_PASSWORD,
};

exports.importCustomerDailyManual = async (req, res) => {
  // Shared function to handle importing
  await handleCustomerImport(remoteFilePath, req, res, true);
};

exports.importCustomerDaily = async (req, res) => {
  // Shared function to handle importing
  await handleCustomerImport(remoteFilePath, req, res, false);
};

async function handleCustomerImport(remoteFilePath, req, res, isManual) {
  const sftp = new Client();
  let isSftpConnected = false;
  const start = new Date();

  try {
    await sftp.connect(sftpConfig);
    isSftpConnected = true;

    const localFilePath = path.join(
      __dirname,
      "../stfp_file_daily",
      "sftp_file_daily.csv"
    );
    await downloadCsv(sftp, remoteFilePath, localFilePath);

    const readableStream = fs.createReadStream(localFilePath);
    const results = await parseCsvStream(readableStream);
    const missingFields = getMissingFields(results);

    if (missingFields.length > 0) {
      await sendMissingFieldEmail(missingFields);
      console.log({
        status: "fail",
        message: `Missing field: ${missingFields.join(", ")}`,
      });
    } else {
      await processCustomerData(results);

      const dailyData = {
        start,
        end: new Date(),
        status: "success",
        count: results.length,
        type: isManual ? "customer manual" : "customer",
      };

      await Daily.create(dailyData);
      if (isManual) {
        res.json({
          status: "success",
          message: `Successfully imported ${results.length} customers`,
          count: results.length,
          type: isManual ? "customer manual" : "customer",
        });
      } else {
        console.log({
          status: "success",
          message: `Successfully imported ${results.length} customers`,
          count: results.length,
          type: isManual ? "customer manual" : "customer",
        });
      }
    }
  } catch (error) {
    console.error("Error:", error.message);
    const dailyData = {
      start,
      end: new Date(),
      status: "fail",
      count: 0,
      type: isManual ? "customer manual" : "customer",
    };

    await Daily.create(dailyData);

    if (isManual) {
      res.status(500).json({
        status: "error",
        message: "Internal server error",
        detail_error: error.message,
      });
    } else {
      console.log({
        status: "error",
        message: "Internal server error",
        detail_error: error.message,
      });
    }
  } finally {
    if (isSftpConnected) {
      await sftp.end();
    }
  }
}

async function downloadCsv(sftp, remoteFilePath, localFilePath) {
  await sftp.get(remoteFilePath, localFilePath);
}

async function parseCsvStream(readableStream) {
  return new Promise((resolve, reject) => {
    const results = [];
    readableStream
      .pipe(csv())
      .on("data", (data) => {
        results.push(data);
      })
      .on("end", () => {
        resolve(results);
      })
      .on("error", reject);
  });
}

function getMissingFields(results) {
  const requiredFields = [
    "SalesOrg",
    "Customer",
    "Company Code",
    "Buying",
    "Branch Code 1",
    "Tax no.1",
    "Tax no.3",
  ];
  const missingFields = [];
  requiredFields.forEach((field) => {
    if (results.length > 0 && results[0][field] === undefined) {
      missingFields.push(field);
    }
  });
  return missingFields;
}

async function sendMissingFieldEmail(missingFields) {
  const emailData = {
    type: "customerMissingField",
    email: [
      "adinan@toagroup.com",
      "akekaraj_p@toagroup.com",
      "duangjai_s@toagroup.com",
      "chuanchuen@toagroup.com",
      "apichai_t@toagroup.com",
      "avika_a@toagroup.com",
      "watipong_l@toagroup.com",
      "sittichok_b@toagroup.com",
    ],
    mailTopicMissing: missingFields.join(", "),
  };
  await sendEmail(emailData);
}

async function processCustomerData(csvData) {
  if (csvData?.length > 0) {
    const customers = csvData.slice(1).map((row) => ({
      SalesOrg: row["SalesOrg"],
      Customer: row["Customer"],
      DistChan: row["Dist.Chan"],
      CompanyCode: row["Company Code"],
      Buying: row["Buying"],
      BranchCode1: row["Branch Code 1"],
      BranchCode: row["Branch Code"],
      TaxNo1: row["Tax no.1"],
      TaxNo3: row["Tax no.3"],
      CrLimit: row["Cr.Limit"],
      PriceList: row["Price List"],
      PaymentTerm: row["PaymentTerm"],
      NAME1: row["NAME1"],
      NAME2: row["NAME2"],
      NAME3: row["NAME3"],
      NAME4: row["NAME4"],
      BankKey1: row["Bank Key1"],
      BankKey2: row["Bank Key2"],
      BankKey3: row["Bank Key3"],
      BankKey4: row["Bank Key4"],
      BankKey5: row["Bank Key5"],
      BankKey6: row["Bank Key6"],
      BankKey7: row["Bank Key7"],
      BankKey8: row["Bank Key8"],
      BankKey9: row["Bank Key9"],
      BankKey10: row["Bank Key10"],
      SalesDistrict: row["Sales District"],
      SalesDistrictDesc: row["Sales District Description"],
      SalesOff: row["SalesOff"],
      SalesOffDesc: row["SalesOff. Desc."],
      BPExtNo: row["BP. Ext. No."],
      SH: row["SH"],
    }));

    await Customer.deleteMany({});
    await Customer.insertMany(customers);
  }
}
