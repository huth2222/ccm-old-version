const xlsx = require("xlsx");
// const Customer = require('../models/Customer');
// const SftpClient = require('ssh2-sftp-client');
// const fs = require('fs');
// const parse = require('csv-parser');
// const Client = require('ssh2-sftp-client');
// const path = require('path');
// const sftpConfig = {
//     host: process.env.SFTP_HOST,
//     port: process.env.SFTP_PORT,
//     username: process.env.SFTP_USERNAME,
//     password: process.env.SFTP_PASSWORD,
// };
// const sendEmail = require('../middlewares/mail');

// const remoteFilePath = '/upload/CustomerMaster/Customer Master.csv';

// const util = require('util');
// const { promisify } = require('util');
// // const path = require('path');

// const readFileAsync = util.promisify(fs.readFile);

// exports.importCustomerDaily = async (req, res) => {

//     const sftp = new Client();
//     let isSftpConnected = false;
//     const start = new Date();
//     const Daily = require('../models/Daily');

//     try {
//         await sftp.connect(sftpConfig);
//         isSftpConnected = true;

//         const local = path.join(__dirname, '../stfp_file_daily', 'sftp_file_daily.csv');
//         await downloadCsv(sftp, local);

//         const results = await parseCsv(local);

//         const missingFields = getMissingFields(results);
//         if (missingFields.length > 0) {
//             await sendMissingFieldEmail(missingFields);
//             console.log({ status: 'fail', message: `Missing field: ${missingFields.join(', ')}` })
//             // return res.json({ status: 'fail', message: `Missing field: ${missingFields.join(', ')}` });
//         }

//         await processCsvData(results);

//         const dailyData = {
//             start,
//             end: new Date(),
//             status: 'success',
//             count: results.length,
//             type: 'customer',
//         };

//         await Daily.create(dailyData);
//         console.log({
//             status: 'success',
//             message: `Successfully imported ${results.length} customers`,
//             count: results.length,
//             type: 'customer',
//         })

//     } catch (error) {
//         console.error('Error:', error.message);
//         const dailyDataFail = {
//             start,
//             end: new Date(),
//             status: 'fail',
//             count: results.length,
//             type: 'customer',
//         };
//         await Daily.create(dailyDataFail);
//         console.log({
//             status: 'fail',
//             message: `fail imported ${results.length} customers`,
//             count: results.length,
//             type: 'customer',
//             detail_error: error.message
//         })

//     } finally {
//         if (isSftpConnected) {
//             await sftp.end();
//         }
//     }
// };

// exports.importCustomerDailyManual_oldVersion = async (req, res) => {
//     const sftp = new Client();
//     let start = new Date();
//     const Daily = require('../models/Daily');

//     try {
//         await sftp.connect(sftpConfig);
//         const local = path.join(__dirname, '../stfp_file_daily', 'sftp_file_daily.csv');

//         await downloadCsv(sftp, local);
//         const csvData = await parseCsvOldversion(local);
//         // csvData.shift()
//         await processCsvData(csvData);

//         const dailyData = {
//             start,
//             end: new Date(),
//             status: 'success',
//             count: csvData.length,
//             // count: 11000,
//             type: 'customer manual',
//         };

//         const dailySuccess = Daily.create(dailyData);
//         // if (res) {
//         res.json({
//             status: 'success',
//             // message: `Successfully imported 11000 customers`,
//             message: `Successfully imported ${csvData.length} customers`,
//             count: csvData.length,
//             type: 'customer manual',
//             // count: 11000,
//         });
//         // }

//     } catch (error) {
//         const dailyData = {
//             start,
//             end: new Date(),
//             status: 'fail',
//             type: 'customer manual',
//         };

//         const dailyFail = Daily.create(dailyData);

//         console.error('Error:', error.message);
//         res.status(500).json({ status: 'error', message: 'Internal server error' });
//     } finally {
//         // if (sftp.isConnected()) {
//         //     sftp.end();
//         // }
//     }
// };

// exports.importCustomerDailyManual = async (req, res) => {
//     const sftp = new Client();
//     let isSftpConnected = false;
//     const start = new Date();
//     const Daily = require('../models/Daily');
//     console.log("start importCustomerDailyManual")
//     try {
//         await sftp.connect(sftpConfig);
//         isSftpConnected = true;

//         const local = path.join(__dirname, '../stfp_file_daily', 'sftp_file_daily.csv');
//         await downloadCsv(sftp, local);

//         const results = await parseCsv(local);

//         const missingFields = getMissingFields(results);
//         if (missingFields.length > 0) {
//             await sendMissingFieldEmail(missingFields);
//             return res.json({ status: 'fail', message: `Missing field: ${missingFields.join(', ')}` });
//         }

//         await processCsvData(results);

//         const dailyData = {
//             start,
//             end: new Date(),
//             status: 'success',
//             count: results.length,
//             type: 'customer manual',
//         };

//         await Daily.create(dailyData);

//         res.json({
//             status: 'success',
//             message: `Successfully imported ${results.length} customers`,
//             count: results.length,
//             type: 'customer manual',
//         });

//     } catch (error) {
//         console.error('Error:', error.message);
//         res.status(500).json({ status: 'error', message: 'Internal server error', detail_error: error.message });

//     } finally {
//         if (isSftpConnected) {
//             await sftp.end();
//         }
//     }
// };

// // Helper functions

// async function parseCsv(filePath) {
//     const fs = require('fs');
//     const csv = require('csv-parser');

//     return new Promise((resolve, reject) => {
//         const results = [];
//         fs.createReadStream(filePath)
//             .pipe(csv())
//             .on('data', (data) => results.push(data))
//             .on('end', () => resolve(results))
//             .on('error', reject);
//     });
// }

// function getMissingFields(results) {
//     const requiredFields = ["SalesOrg", "Customer", "Company Code", "Buying", "Branch Code 1", "Tax no.1", "Tax no.3"];
//     const missingFields = [];

//     requiredFields.forEach(field => {
//         if (results.length > 0 && results[0][field] === undefined) {
//             missingFields.push(field);
//         }
//     });

//     return missingFields;
// }

// async function sendMissingFieldEmail(missingFields) {
//     const emailData = {
//         type: 'customerMissingField',
//         email: [
//             "adinan@toagroup.com",
//             "akekaraj_p@toagroup.com",
//             "duangjai_s@toagroup.com",
//             "chuanchuen@toagroup.com",
//             "apichai_t@toagroup.com",
//             "avika_a@toagroup.com",
//             "watipong_l@toagroup.com",
//             "sittichok_b@toagroup.com",
//         ],
//         mailTopicMissing: missingFields.join(', '),
//     };
//     await sendEmail(emailData);
// }

// async function downloadCsv(sftp, localFilePath) {
//     await sftp.get(remoteFilePath, localFilePath);
// }

// async function parseCsvOldversion(localFilePath) {
//     const csvData = await readFileAsync(localFilePath, 'utf-8');
//     return new Promise((resolve, reject) => {
//         const parsedData = [];
//         const parser = parse({ headers: true });

//         parser.on('data', (row) => {
//             parsedData.push(row);
//         });

//         parser.on('end', () => {
//             resolve(parsedData);
//         });

//         parser.on('error', (error) => {
//             reject(error);
//         });

//         // Pipe the CSV data to the parser
//         fs.createReadStream(localFilePath).pipe(parser);
//     });
// }

// async function processCsvData(csvData) {
//     const customers = csvData.slice(1).map(row => ({
//         SalesOrg: row["SalesOrg"],
//         Customer: row["Customer"],
//         DistChan: row["Dist.Chan"],
//         CompanyCode: row["Company Code"],
//         Buying: row["Buying"],
//         BranchCode1: row["Branch Code 1"],
//         BranchCode: row["Branch Code"],
//         TaxNo1: row["Tax no.1"],
//         TaxNo3: row["Tax no.3"],
//         CrLimit: row["Cr.Limit"],
//         PriceList: row["Price List"],
//         PaymentTerm: row["PaymentTerm"],
//         NAME1: row["NAME1"],
//         NAME2: row["NAME2"],
//         NAME3: row["NAME3"],
//         NAME4: row["NAME4"],
//     }));

//     await Customer.deleteMany({});
//     await Customer.insertMany(customers);
// }

exports.importDataBpGroup = async (req, res) => {
  const DataBPGroup = require("../models/DataBPGroup");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const BpGroupData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    const BpGroups = BpGroupData.slice(1).map((row) => ({
      BPGroup: row.A,
      Description: row.B,
    }));

    await DataBPGroup.deleteMany({});
    await DataBPGroup.insertMany(BpGroups);

    return res
      .status(200)
      .json({ message: "BpGroup data imported successfully" });
  } catch (error) {
    console.error("Error importing BpGroup data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.importDataBusinessPartnerCat = async (req, res) => {
  const DataBusinessPartnerCat = require("../models/DataBusinessPartnerCat");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const BusinessPartnerCatData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    const BusinessPartnerCats = BusinessPartnerCatData.slice(1).map((row) => ({
      BusinessPartnerCat: row.A,
      Description: row.B,
    }));

    await DataBusinessPartnerCat.deleteMany({});
    await DataBusinessPartnerCat.insertMany(BusinessPartnerCats);

    return res
      .status(200)
      .json({ message: "BusinessPartnerCat data imported successfully" });
  } catch (error) {
    console.error("Error importing BusinessPartnerCat data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.importDataCountry = async (req, res) => {
  const DataCountry = require("../models/DataCountry");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const CountryData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    const Countrys = CountryData.slice(1).map((row) => ({
      Country: row.A,
      Description: row.B,
    }));

    await DataCountry.deleteMany({});
    await DataCountry.insertMany(Countrys);

    return res
      .status(200)
      .json({ message: "Country data imported successfully" });
  } catch (error) {
    console.error("Error importing Country data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.importDataRegion = async (req, res) => {
  const DataRegion = require("../models/DataRegion");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const RegionData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    const Regions = RegionData.slice(1).map((row) => ({
      Region: row.A,
      Description: row.B,
    }));

    await DataRegion.deleteMany({});
    await DataRegion.insertMany(Regions);

    return res
      .status(200)
      .json({ message: "Region data imported successfully" });
  } catch (error) {
    console.error("Error importing Region data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.importDataTransportationZone = async (req, res) => {
  const DataTransportationZone = require("../models/DataTransportationZone");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const TransportationZoneData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    const TransportationZones = TransportationZoneData.slice(1).map((row) => ({
      TransportationZone: row.A,
      Description: row.B,
    }));

    await DataTransportationZone.deleteMany({});
    await DataTransportationZone.insertMany(TransportationZones);

    return res
      .status(200)
      .json({ message: "TransportationZone data imported successfully" });
  } catch (error) {
    console.error("Error importing TransportationZone data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
exports.importDataTransportationZoneVietnam = async (req, res) => {
  const DataTransportationZone = require("../models/DataTransportationZoneVietnam");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const TransportationZoneData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    const TransportationZones = TransportationZoneData.slice(1).map((row) => ({
      TransportationZone: row.A,
      Description: row.B,
    }));

    await DataTransportationZone.deleteMany({});
    await DataTransportationZone.insertMany(TransportationZones);

    return res.status(200).json({
      message: "TransportationZone Vietnam data imported successfully",
    });
  } catch (error) {
    console.error("Error importing TransportationZone Vietnam data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.importDataTransportationZoneCaptain = async (req, res) => {
  const DataTransportationZone = require("../models/DataTransportationZoneCaptain");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const TransportationZoneData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    const TransportationZones = TransportationZoneData.slice(1).map((row) => ({
      TransportationZone: row.A,
      Description: row.B,
    }));

    await DataTransportationZone.deleteMany({});
    await DataTransportationZone.insertMany(TransportationZones);

    return res.status(200).json({
      message: "TransportationZone Captain data imported successfully",
    });
  } catch (error) {
    console.error("Error importing TransportationZone Captain data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.importDataLanguage = async (req, res) => {
  const DataLanguage = require("../models/DataLanguage");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const LanguageData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    const Languages = LanguageData.slice(1).map((row) => ({
      Language: row.A,
      Description: row.B,
    }));

    await DataLanguage.deleteMany({});
    await DataLanguage.insertMany(Languages);

    return res
      .status(200)
      .json({ message: "Language data imported successfully" });
  } catch (error) {
    console.error("Error importing Language data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.importDataCompanyCode = async (req, res) => {
  const DataCompanyCode = require("../models/DataCompanyCode");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const CompanyCodeData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    const CompanyCodes = CompanyCodeData.slice(1).map((row) => ({
      CompanyCode: row.A,
      Description: row.B,
    }));

    await DataCompanyCode.deleteMany({});
    await DataCompanyCode.insertMany(CompanyCodes);

    return res
      .status(200)
      .json({ message: "CompanyCode data imported successfully" });
  } catch (error) {
    console.error("Error importing CompanyCode data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.importDataTradingPartner = async (req, res) => {
  const DataTradingPartner = require("../models/DataTradingPartner");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const TradingPartnerData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    const TradingPartners = TradingPartnerData.slice(1).map((row) => ({
      TradingPartner: row.A,
      Description: row.B,
    }));

    await DataTradingPartner.deleteMany({});
    await DataTradingPartner.insertMany(TradingPartners);

    return res
      .status(200)
      .json({ message: "TradingPartner data imported successfully" });
  } catch (error) {
    console.error("Error importing TradingPartner data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.importDataBankBranch = async (req, res) => {
  const DataBankBranch = require("../models/DataBankBranch");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const BankBranchData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    const BankBranchs = BankBranchData.slice(1).map((row) => ({
      BankBranch: row.A,
      BankName: row.B,
      BranchName: row.C,
      Description: row.D,
    }));

    await DataBankBranch.deleteMany({});
    await DataBankBranch.insertMany(BankBranchs);

    return res
      .status(200)
      .json({ message: "BankBranch data imported successfully" });
  } catch (error) {
    console.error("Error importing BankBranch data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.importDataBankBranchVietnam = async (req, res) => {
  const DataBankBranchVietnam = require("../models/DataBankBranchVietnam");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const BankBranchVietnamData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    const BankBranchVietnams = BankBranchVietnamData.slice(1).map((row) => ({
      BankBranch: row.A,
      BankName: row.B,
      BranchName: row.C,
      Description: row.D,
    }));

    await DataBankBranchVietnam.deleteMany({});
    await DataBankBranchVietnam.insertMany(BankBranchVietnams);

    return res
      .status(200)
      .json({ message: "BankBranchVietnam data imported successfully" });
  } catch (error) {
    console.error("Error importing BankBranchVietnam data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.importDataBankBranchCaptain = async (req, res) => {
  const DataBankBranchCaptain = require("../models/DataBankBranchCaptain");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const BankBranchCaptainData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    const BankBranchCaptains = BankBranchCaptainData.slice(1).map((row) => ({
      BankBranch: row.A,
      BankName: row.B,
      BranchName: row.C,
      Description: row.D,
    }));

    await DataBankBranchCaptain.deleteMany({});
    await DataBankBranchCaptain.insertMany(BankBranchCaptains);

    return res
      .status(200)
      .json({ message: "BankBranchCaptain data imported successfully" });
  } catch (error) {
    console.error("Error importing BankBranchCaptain data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.importDataAttributeOne = async (req, res) => {
  const DataAttributeOne = require("../models/DataAttributeOne");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const AttributeOneData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    const AttributeOnes = AttributeOneData.slice(1).map((row) => ({
      AttributeOne: row.A,
      Description: row.B,
    }));

    await DataAttributeOne.deleteMany({});
    await DataAttributeOne.insertMany(AttributeOnes);

    return res
      .status(200)
      .json({ message: "AttributeOne data imported successfully" });
  } catch (error) {
    console.error("Error importing AttributeOne data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.importDataCustomerClassification = async (req, res) => {
  const DataCustomerClassification = require("../models/DataCustomerClassification");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const CustomerClassificationData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    const CustomerClassifications = CustomerClassificationData.slice(1).map(
      (row) => ({
        CustomerClassification: row.A,
        Description: row.B,
      })
    );

    await DataCustomerClassification.deleteMany({});
    await DataCustomerClassification.insertMany(CustomerClassifications);

    return res
      .status(200)
      .json({ message: "CustomerClassification data imported successfully" });
  } catch (error) {
    console.error("Error importing CustomerClassification data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.importDataCustomerClassificationVietnam = async (req, res) => {
  const DataCustomerClassificationVietnam = require("../models/DataCustomerClassificationVietnam");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const CustomerClassificationVietnamData = xlsx.utils.sheet_to_json(
      worksheet,
      {
        raw: false,
        header: "A",
      }
    );

    const CustomerClassificationVietnams =
      CustomerClassificationVietnamData.slice(1).map((row) => ({
        CustomerClassification: row.A,
        Description: row.B,
      }));

    await DataCustomerClassificationVietnam.deleteMany({});
    await DataCustomerClassificationVietnam.insertMany(
      CustomerClassificationVietnams
    );

    return res.status(200).json({
      message: "CustomerClassificationVietnam data imported successfully",
    });
  } catch (error) {
    console.error("Error importing CustomerClassificationVietnam data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
exports.importDataCustomerClassificationCaptain = async (req, res) => {
  const DataCustomerClassificationCaptain = require("../models/DataCustomerClassificationCaptain");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const CustomerClassificationCaptainData = xlsx.utils.sheet_to_json(
      worksheet,
      {
        raw: false,
        header: "A",
      }
    );

    const CustomerClassificationCaptains =
      CustomerClassificationCaptainData.slice(1).map((row) => ({
        CustomerClassification: row.A,
        Description: row.B,
      }));

    await DataCustomerClassificationCaptain.deleteMany({});
    await DataCustomerClassificationCaptain.insertMany(
      CustomerClassificationCaptains
    );

    return res.status(200).json({
      message: "CustomerClassificationCaptain data imported successfully",
    });
  } catch (error) {
    console.error("Error importing CustomerClassificationCaptain data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.importDataReconciliationAccount = async (req, res) => {
  const DataReconciliationAccount = require("../models/DataReconciliationAccount");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const ReconciliationAccountData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    const ReconciliationAccounts = ReconciliationAccountData.slice(1).map(
      (row) => ({
        ReconciliationAccount: row.A,
        Description: row.B,
      })
    );

    await DataReconciliationAccount.deleteMany({});
    await DataReconciliationAccount.insertMany(ReconciliationAccounts);

    return res
      .status(200)
      .json({ message: "ReconciliationAccount data imported successfully" });
  } catch (error) {
    console.error("Error importing ReconciliationAccount data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.importDataPaymentTerm = async (req, res) => {
  const DataPaymentTerm = require("../models/DataPaymentTerm");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const PaymentTermData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    const PaymentTerms = PaymentTermData.slice(1).map((row) => ({
      PaymentTerm: row.A,
      Description: row.B,
      DOA: row.C,
    }));

    await DataPaymentTerm.deleteMany({});
    await DataPaymentTerm.insertMany(PaymentTerms);

    return res
      .status(200)
      .json({ message: "PaymentTerm data imported successfully" });
  } catch (error) {
    console.error("Error importing PaymentTerm data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.importDataPaymentTermCaptain = async (req, res) => {
  const DataPaymentTerm = require("../models/DataPaymentTermCaptain");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const PaymentTermData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    const PaymentTerms = PaymentTermData.slice(1).map((row) => ({
      PaymentTerm: row.A,
      Description: row.B,
      DOA: row.C,
    }));

    await DataPaymentTerm.deleteMany({});
    await DataPaymentTerm.insertMany(PaymentTerms);

    return res
      .status(200)
      .json({ message: "PaymentTerm Captain data imported successfully" });
  } catch (error) {
    console.error("Error importing PaymentTerm Captain data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.importDataPaymentTermVietnam = async (req, res) => {
  const DataPaymentTerm = require("../models/DataPaymentTermVietnam");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const PaymentTermData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    const PaymentTerms = PaymentTermData.slice(1).map((row) => ({
      PaymentTerm: row.A,
      Description: row.B,
      DOA: row.C,
    }));

    await DataPaymentTerm.deleteMany({});
    await DataPaymentTerm.insertMany(PaymentTerms);

    return res
      .status(200)
      .json({ message: "PaymentTerm Vietnam data imported successfully" });
  } catch (error) {
    console.error("Error importing PaymentTerm Vietnam data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.importDataWithholdingTaxCode = async (req, res) => {
  const DataWithholdingTaxCode = require("../models/DataWithholdingTaxCode");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const WithholdingTaxCodeData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    const WithholdingTaxCodes = WithholdingTaxCodeData.slice(1).map((row) => ({
      WithholdingTaxCode: row.A,
      Description: row.B,
    }));

    await DataWithholdingTaxCode.deleteMany({});
    await DataWithholdingTaxCode.insertMany(WithholdingTaxCodes);

    return res
      .status(200)
      .json({ message: "WithholdingTaxCode data imported successfully" });
  } catch (error) {
    console.error("Error importing WithholdingTaxCode data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.importDataDistributionChannel = async (req, res) => {
  const DataDistributionChannel = require("../models/DataDistributionChannel");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const DistributionChannelData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    const DistributionChannels = DistributionChannelData.slice(1).map(
      (row) => ({
        DistributionChannel: row.A,
        Description: row.B,
      })
    );

    await DataDistributionChannel.deleteMany({});
    await DataDistributionChannel.insertMany(DistributionChannels);

    return res
      .status(200)
      .json({ message: "DistributionChannel data imported successfully" });
  } catch (error) {
    console.error("Error importing DistributionChannel data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.importDataSalesDistrict = async (req, res) => {
  const DataSalesDistrict = require("../models/DataSalesDistrict");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const SalesDistrictData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    const SalesDistricts = SalesDistrictData.slice(1).map((row) => ({
      SalesDistrict: row.A,
      Description: row.B,
    }));

    await DataSalesDistrict.deleteMany({});
    await DataSalesDistrict.insertMany(SalesDistricts);

    return res
      .status(200)
      .json({ message: "SalesDistrict data imported successfully" });
  } catch (error) {
    console.error("Error importing SalesDistrict data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.importDataSalesDistrictVietnam = async (req, res) => {
  const DataSalesDistrictVietnam = require("../models/DataSalesDistrictVietnam");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const SalesDistrictVietnamData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    const SalesDistrictVietnams = SalesDistrictVietnamData.slice(1).map(
      (row) => ({
        SalesDistrict: row.A,
        Description: row.B,
      })
    );

    await DataSalesDistrictVietnam.deleteMany({});
    await DataSalesDistrictVietnam.insertMany(SalesDistrictVietnams);

    return res
      .status(200)
      .json({ message: "SalesDistrictVietnam data imported successfully" });
  } catch (error) {
    console.error("Error importing SalesDistrictVietnam data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.importDataSalesDistrictCaptain = async (req, res) => {
  const DataSalesDistrictCaptain = require("../models/DataSalesDistrictCaptain");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const SalesDistrictCaptainData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    const SalesDistrictCaptains = SalesDistrictCaptainData.slice(1).map(
      (row) => ({
        SalesDistrict: row.A,
        Description: row.B,
      })
    );

    await DataSalesDistrictCaptain.deleteMany({});
    await DataSalesDistrictCaptain.insertMany(SalesDistrictCaptains);

    return res
      .status(200)
      .json({ message: "SalesDistrictCaptain data imported successfully" });
  } catch (error) {
    console.error("Error importing SalesDistrictCaptain data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.importDataCustomerGroup = async (req, res) => {
  const DataCustomerGroup = require("../models/DataCustomerGroup");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const CustomerGroupData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    const CustomerGroups = CustomerGroupData.slice(1).map((row) => ({
      CustomerGroup: row.A,
      Description: row.B,
    }));

    await DataCustomerGroup.deleteMany({});
    await DataCustomerGroup.insertMany(CustomerGroups);

    return res
      .status(200)
      .json({ message: "CustomerGroup data imported successfully" });
  } catch (error) {
    console.error("Error importing CustomerGroup data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.importDataSalesOffice = async (req, res) => {
  const DataSalesOffice = require("../models/DataSalesOffice");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const SalesOfficeData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    const SalesOffices = SalesOfficeData.slice(1).map((row) => ({
      SalesOffice: row.A,
      Description: row.B,
    }));

    await DataSalesOffice.deleteMany({});
    await DataSalesOffice.insertMany(SalesOffices);

    return res
      .status(200)
      .json({ message: "SalesOffice data imported successfully" });
  } catch (error) {
    console.error("Error importing SalesOffice data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.importDataSalesOfficeCaptain = async (req, res) => {
  const DataSalesOfficeCaptain = require("../models/DataSalesOfficeCaptain");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const SalesOfficeCaptainData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    const SalesOfficeCaptains = SalesOfficeCaptainData.slice(1).map((row) => ({
      SalesOffice: row.A,
      Description: row.B,
    }));

    await DataSalesOfficeCaptain.deleteMany({});
    await DataSalesOfficeCaptain.insertMany(SalesOfficeCaptains);

    return res
      .status(200)
      .json({ message: "SalesOfficeCaptain data imported successfully" });
  } catch (error) {
    console.error("Error importing SalesOfficeCaptain data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.importDataSalesOfficeVietnam = async (req, res) => {
  const DataSalesOfficeVietnam = require("../models/DataSalesOfficeVietnam");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const SalesOfficeVietnamData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    const SalesOfficeVietnams = SalesOfficeVietnamData.slice(1).map((row) => ({
      SalesOffice: row.A,
      Description: row.B,
    }));

    await DataSalesOfficeVietnam.deleteMany({});
    await DataSalesOfficeVietnam.insertMany(SalesOfficeVietnams);

    return res
      .status(200)
      .json({ message: "SalesOfficeVietnam data imported successfully" });
  } catch (error) {
    console.error("Error importing SalesOfficeVietnam data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.importDataSalesGroup = async (req, res) => {
  const DataSalesGroup = require("../models/DataSalesGroup");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const SalesGroupData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    const SalesGroups = SalesGroupData.slice(1).map((row) => ({
      SalesOffice: row.A,
      SaleOfficeDescription: row.B,
      SalesGroup: row.C,
      SaleGroupDescription: row.D,
    }));

    await DataSalesGroup.deleteMany({});
    await DataSalesGroup.insertMany(SalesGroups);

    return res
      .status(200)
      .json({ message: "SalesGroup data imported successfully" });
  } catch (error) {
    console.error("Error importing SalesGroup data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
exports.importDataSalesGroupCaptain = async (req, res) => {
  const DataSalesGroupCaptain = require("../models/DataSalesGroupCaptain");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const SalesGroupCaptainData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    const SalesGroupCaptains = SalesGroupCaptainData.slice(1).map((row) => ({
      SalesOffice: row.A,
      SaleOfficeDescription: row.B,
      SalesGroup: row.C,
      SaleGroupDescription: row.D,
    }));

    await DataSalesGroupCaptain.deleteMany({});
    await DataSalesGroupCaptain.insertMany(SalesGroupCaptains);

    return res
      .status(200)
      .json({ message: "SalesGroupCaptain data imported successfully" });
  } catch (error) {
    console.error("Error importing SalesGroupCaptain data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
exports.importDataSalesGroupVietnam = async (req, res) => {
  const DataSalesGroupVietnam = require("../models/DataSalesGroupVietnam");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const SalesGroupVietnamData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    const SalesGroupVietnams = SalesGroupVietnamData.slice(1).map((row) => ({
      SalesOffice: row.A,
      SaleOfficeDescription: row.B,
      SalesGroup: row.C,
      SaleGroupDescription: row.D,
    }));

    await DataSalesGroupVietnam.deleteMany({});
    await DataSalesGroupVietnam.insertMany(SalesGroupVietnams);

    return res
      .status(200)
      .json({ message: "SalesGroupVietnam data imported successfully" });
  } catch (error) {
    console.error("Error importing SalesGroupVietnam data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.importDataCurrency = async (req, res) => {
  const DataCurrency = require("../models/DataCurrency");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const CurrencyData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    const Currencys = CurrencyData.slice(1).map((row) => ({
      Currency: row.A,
      Description: row.B,
    }));

    await DataCurrency.deleteMany({});
    await DataCurrency.insertMany(Currencys);

    return res
      .status(200)
      .json({ message: "Currency data imported successfully" });
  } catch (error) {
    console.error("Error importing Currency data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.importDataExchangeRateType = async (req, res) => {
  const DataExchangeRateType = require("../models/DataExchangeRateType");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const ExchangeRateTypeData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    const ExchangeRateTypes = ExchangeRateTypeData.slice(1).map((row) => ({
      ExchangeRateType: row.A,
      Description: row.B,
    }));

    await DataExchangeRateType.deleteMany({});
    await DataExchangeRateType.insertMany(ExchangeRateTypes);

    return res
      .status(200)
      .json({ message: "ExchangeRateType data imported successfully" });
  } catch (error) {
    console.error("Error importing ExchangeRateType data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.importDataPriceList = async (req, res) => {
  const DataPriceList = require("../models/DataPriceList");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const PriceListData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    const PriceLists = PriceListData.slice(1).map((row) => ({
      PriceList: row.A,
      Description: row.B,
    }));

    await DataPriceList.deleteMany({});
    await DataPriceList.insertMany(PriceLists);

    return res
      .status(200)
      .json({ message: "PriceList data imported successfully" });
  } catch (error) {
    console.error("Error importing PriceList data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.importDataDeliveryPriority = async (req, res) => {
  const DataDeliveryPriority = require("../models/DataDeliveryPriority");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const DeliveryPriorityData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    const DeliveryPrioritys = DeliveryPriorityData.slice(1).map((row) => ({
      DeliveryPriority: row.A,
      Description: row.B,
    }));

    await DataDeliveryPriority.deleteMany({});
    await DataDeliveryPriority.insertMany(DeliveryPrioritys);

    return res
      .status(200)
      .json({ message: "DeliveryPriority data imported successfully" });
  } catch (error) {
    console.error("Error importing DeliveryPriority data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.importDataDeliveryPriorityVietnam = async (req, res) => {
  const DataDeliveryPriorityVietnam = require("../models/DataDeliveryPriorityVietnam");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const DeliveryPriorityVietnamData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    const DeliveryPriorityVietnams = DeliveryPriorityVietnamData.slice(1).map(
      (row) => ({
        DeliveryPriority: row.A,
        Description: row.B,
      })
    );

    await DataDeliveryPriorityVietnam.deleteMany({});
    await DataDeliveryPriorityVietnam.insertMany(DeliveryPriorityVietnams);

    return res
      .status(200)
      .json({ message: "DeliveryPriorityVietnam data imported successfully" });
  } catch (error) {
    console.error("Error importing DeliveryPriorityVietnam data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.importDataDeliveryPriorityCaptain = async (req, res) => {
  const DataDeliveryPriorityCaptain = require("../models/DataDeliveryPriorityCaptain");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const DeliveryPriorityCaptainData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    const DeliveryPriorityCaptains = DeliveryPriorityCaptainData.slice(1).map(
      (row) => ({
        DeliveryPriority: row.A,
        Description: row.B,
      })
    );

    await DataDeliveryPriorityCaptain.deleteMany({});
    await DataDeliveryPriorityCaptain.insertMany(DeliveryPriorityCaptains);

    return res
      .status(200)
      .json({ message: "DeliveryPriorityCaptain data imported successfully" });
  } catch (error) {
    console.error("Error importing DeliveryPriorityCaptain data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.importDataShippingCondition = async (req, res) => {
  const DataShippingCondition = require("../models/DataShippingCondition");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const ShippingConditionData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    const ShippingConditions = ShippingConditionData.slice(1).map((row) => ({
      ShippingCondition: row.A,
      Description: row.B,
    }));

    await DataShippingCondition.deleteMany({});
    await DataShippingCondition.insertMany(ShippingConditions);

    return res
      .status(200)
      .json({ message: "ShippingCondition data imported successfully" });
  } catch (error) {
    console.error("Error importing ShippingCondition data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.importDataIncoterm = async (req, res) => {
  const DataIncoterm = require("../models/DataIncoterm");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const IncotermData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    const Incoterms = IncotermData.slice(1).map((row) => ({
      Incoterm: row.A,
      Description: row.B,
    }));

    await DataIncoterm.deleteMany({});
    await DataIncoterm.insertMany(Incoterms);

    return res
      .status(200)
      .json({ message: "Incoterm data imported successfully" });
  } catch (error) {
    console.error("Error importing Incoterm data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.importDataAccountAssignmentGroup = async (req, res) => {
  const DataAccountAssignmentGroup = require("../models/DataAccountAssignmentGroup");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const AccountAssignmentGroupData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    const AccountAssignmentGroups = AccountAssignmentGroupData.slice(1).map(
      (row) => ({
        AccountAssignmentGroup: row.A,
        Description: row.B,
      })
    );

    await DataAccountAssignmentGroup.deleteMany({});
    await DataAccountAssignmentGroup.insertMany(AccountAssignmentGroups);

    return res
      .status(200)
      .json({ message: "AccountAssignmentGroup data imported successfully" });
  } catch (error) {
    console.error("Error importing AccountAssignmentGroup data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.importDataTaxClassification = async (req, res) => {
  const DataTaxClassification = require("../models/DataTaxClassification");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const TaxClassificationData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    const TaxClassifications = TaxClassificationData.slice(1).map((row) => ({
      TaxClassification: row.A,
      Description: row.B,
    }));

    await DataTaxClassification.deleteMany({});
    await DataTaxClassification.insertMany(TaxClassifications);

    return res
      .status(200)
      .json({ message: "TaxClassification data imported successfully" });
  } catch (error) {
    console.error("Error importing TaxClassification data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.importDataRiskClass = async (req, res) => {
  const DataRiskClass = require("../models/DataRiskClass");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const RiskClassData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    const RiskClasss = RiskClassData.slice(1).map((row) => ({
      RiskClass: row.A,
      Description: row.B,
    }));

    await DataRiskClass.deleteMany({});
    await DataRiskClass.insertMany(RiskClasss);

    return res
      .status(200)
      .json({ message: "RiskClass data imported successfully" });
  } catch (error) {
    console.error("Error importing RiskClass data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.importDataCheckRule = async (req, res) => {
  const DataCheckRule = require("../models/DataCheckRule");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const CheckRuleData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    const CheckRules = CheckRuleData.slice(1).map((row) => ({
      CheckRule: row.A,
      Description: row.B,
    }));

    await DataCheckRule.deleteMany({});
    await DataCheckRule.insertMany(CheckRules);

    return res
      .status(200)
      .json({ message: "CheckRule data imported successfully" });
  } catch (error) {
    console.error("Error importing CheckRule data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.importDataGender = async (req, res) => {
  const DataGender = require("../models/DataGender");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const GenderData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    const Genders = GenderData.slice(1).map((row) => ({
      Gender: row.A,
      Description: row.B,
    }));

    await DataGender.deleteMany({});
    await DataGender.insertMany(Genders);

    return res
      .status(200)
      .json({ message: "Gender data imported successfully" });
  } catch (error) {
    console.error("Error importing Gender data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.importDataCarrier = async (req, res) => {
  const DataCarrier = require("../models/DataCarrier");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const CarrierData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    const Carriers = CarrierData.slice(1).map((row) => ({
      Carrier: row.A,
      Description: row.B,
    }));

    await DataCarrier.deleteMany({});
    await DataCarrier.insertMany(Carriers);

    return res
      .status(200)
      .json({ message: "Carrier data imported successfully" });
  } catch (error) {
    console.error("Error importing Carrier data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.importDataThailandAddress = async (req, res) => {
  const DataThailandAddress = require("../models/DataThailandAddress");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const ThailandAddressData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    const ThailandAddresss = ThailandAddressData.slice(1).map((row) => ({
      id: row.A,
      zipcode: row.B,
      city: row.C,
      districts: row.D,
      subdistricts: row.E,
    }));

    await DataThailandAddress.deleteMany({});
    await DataThailandAddress.insertMany(ThailandAddresss);

    return res
      .status(200)
      .json({ message: "ThailandAddress data imported successfully" });
  } catch (error) {
    console.error("Error importing ThailandAddress data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.importDataVietnamDistrict = async (req, res) => {
  const DataVietnamDistrict = require("../models/DataVietnamDistrict");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const VietnamAddressData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    const VietnamAddresss = VietnamAddressData.slice(1).map((row) => ({
      City: row.A,
      District: row.B,
    }));

    await DataVietnamDistrict.deleteMany({});
    await DataVietnamDistrict.insertMany(VietnamAddresss);

    return res
      .status(200)
      .json({ message: "VietnamAddress data imported successfully" });
  } catch (error) {
    console.error("Error importing VietnamAddress data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.importDataVietnamCity = async (req, res) => {
  const DataVietnamCity = require("../models/DataVietnamCity");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const VietnamCityData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    const VietnamCitys = VietnamCityData.slice(1).map((row) => ({
      Country: row.A,
      City: row.B,
    }));

    await DataVietnamCity.deleteMany({});
    await DataVietnamCity.insertMany(VietnamCitys);

    return res
      .status(200)
      .json({ message: "VietnamCity data imported successfully" });
  } catch (error) {
    console.error("Error importing VietnamCity data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.importDataUserHierarchy = async (req, res) => {
  const DataUserHierarchy = require("../models/UserHierarchy");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const UserHierarchyData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    const UserHierarchys = UserHierarchyData.slice(1).map((row) => ({
      salesDistrict: row.A,
      requesterEmployeeId: row.B,
      approverEmployeeId: row.C,
      approverEmployeeIdSecond: row.D,
      reviewerEmployeeId: row.E,
      acknowledgeEmployeeId: row.F,
    }));

    await DataUserHierarchy.deleteMany({});
    await DataUserHierarchy.insertMany(UserHierarchys);

    return res
      .status(200)
      .json({ message: "UserHierarchy data imported successfully" });
  } catch (error) {
    console.error("Error importing UserHierarchy data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.importDataUsers = async (req, res) => {
  const DataUser = require("../models/User");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const UserData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    if (
      UserData[0]?.A === "employeeId" &&
      UserData[0]?.B === "name" &&
      UserData[0]?.C === "userType" &&
      UserData[0]?.D === "role" &&
      UserData[0]?.E === "level" &&
      UserData[0]?.F === "email" &&
      UserData[0]?.G === "distChannel" &&
      UserData[0]?.H === "companyCode" &&
      UserData[0]?.I === "salesType"
    ) {
      const data_user = await DataUser.find();
      const Users = UserData.slice(1).map((row) => {
        const password_employee = data_user.filter(
          (x) => x?.employeeId === row?.A
        );
        return {
          employeeId: row.A,
          name: row.B,
          userType: row.C,
          role: row.D,
          level: row.E,
          email: row.F,
          distChannel: row.G ? row.G.split(",") : [], // Check if row.G is defined
          companyCode: row.H,
          password:
            password_employee?.length > 0
              ? password_employee[0]?.password
              : "$2a$10$jA6jSrR47sbCmBzHztBEouPIcOi1niMf9pjO9FjsqDZQ03no1Ozha",
          isActive: true,
          isApprove: true,
          username: row.A,
        };
      });

      await DataUser.deleteMany({});
      await DataUser.insertMany(Users);

      return res
        .status(200)
        .json({ message: "User data imported successfully" });
    } else {
      return res.status(400).json({ message: "format column wrong" });
    }
  } catch (error) {
    console.error("Error importing User data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.importDataUserDOA = async (req, res) => {
  const DataUserDOA = require("../models/UserDOA");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const UserDOAData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      header: "A",
    });

    if (
      UserDOAData[0]?.A === "DOA Tag" &&
      UserDOAData[0]?.B === "Username" &&
      UserDOAData[0]?.C === "FullName" &&
      UserDOAData[0]?.D === "Email" &&
      UserDOAData[0]?.E === "Channel" &&
      UserDOAData[0]?.F === "Company" &&
      UserDOAData[0]?.G === "User Type" &&
      UserDOAData[0]?.H === "Role" &&
      UserDOAData[0]?.I === "Co Approval" &&
      UserDOAData[0]?.J === "doaRoleHierarchy" &&
      UserDOAData[0]?.K === "ar master receive email"
    ) {
      const data_user_doa = await DataUserDOA.find();
      const UserDOAs = UserDOAData.slice(1).map((row) => {
        const password_employee = data_user_doa.filter(
          (x) => x?.username === row?.B
        );
        return {
          doaTag: row.A,
          employeeId: row.B,
          username: row.B,
          name: row.C,
          email: row.D,
          distChannel: row.E ? row.E.split(",") : [], // Check if row.E is defined
          companyCode: row.F,
          userType: row.G,
          role: row.H,
          password:
            password_employee?.length > 0
              ? password_employee[0]?.password
              : "$2a$10$jA6jSrR47sbCmBzHztBEouPIcOi1niMf9pjO9FjsqDZQ03no1Ozha",
          isActive: true,
          isApprove: true,
          isCoApproval: row.I ? true : false,
          doaRoleHierarchy: row.J,
          isARMasterSendMail: row.K ? true : false,
        };
      });

      await DataUserDOA.deleteMany({});
      await DataUserDOA.insertMany(UserDOAs);

      return res
        .status(200)
        .json({ message: "UserDOA data imported successfully" });
    } else {
      return res.status(400).json({ message: "format column wrong" });
    }
  } catch (error) {
    console.error("Error importing UserDOA data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
