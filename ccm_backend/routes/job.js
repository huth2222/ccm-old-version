const express = require("express");
const jobController = require("../controllers/jobController");
const passportJWT = require("../middlewares/passportJWT");
const app = express();

const fs = require("fs");

const folderPathUpload = "./public/uploads";
// Check if the folder exists
if (!fs.existsSync(folderPathUpload)) {
  // Create the folder
  fs.mkdirSync(folderPathUpload);
  console.log("public/uploads Folder created successfully.");
}

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folderPath = "public/uploads/";
    // Check if the folder exists
    if (!fs.existsSync(folderPath)) {
      // Create the folder if it doesn't exist
      fs.mkdirSync(folderPath);
    }
    cb(null, folderPath); // Specify the directory where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    file.originalname = Buffer.from(file.originalname, "latin1").toString(
      "utf-8"
    );
    cb(null, Date.now() + "-" + file.originalname); // Specify the filename for the uploaded file
  },
});
const upload = multer({ storage: storage });

app.route("/").get([passportJWT.isLogin], jobController.getAllJobList);

app.route("/report").get([passportJWT.isLogin], jobController.getReport);

app.route("/:jobId").get([passportJWT.isLogin], jobController.getJobById);

app
  .route("/submitFirstDraftJob")
  .post([passportJWT.isLogin], jobController.submitFirstDraftJob);

app
  .route("/submitDraftJob/:jobId")
  .put(
    [upload.array("files"), passportJWT.isLogin],
    jobController.submitDraftJob
  );

app
  .route("/submitAgianDraftJob/:jobId")
  .put(
    [upload.array("files"), passportJWT.isLogin],
    jobController.submitAgianDraftJob
  );

app
  .route("/submitSaveJob/:jobId")
  .put(
    [upload.array("files"), passportJWT.isLogin],
    jobController.submitSaveJob
  );

app
  .route("/submitUpdateJob/:jobId")
  .put([passportJWT.isLogin], jobController.submitUpdateJob);

app
  .route("/submitCloseJob/:jobId")
  .put([passportJWT.isLogin], jobController.submitCloseJob);

app
  .route("/submitAgianSaveJob/:jobId")
  .put(
    [upload.array("files"), passportJWT.isLogin],
    jobController.submitAgianSaveJob
  );

app
  .route("/arSubmitUpdateJobById/:jobId")
  .put([passportJWT.isLogin], jobController.arSubmitUpdateJobById);

app
  .route("/submitCustomerId/:jobId")
  .put([passportJWT.isLogin], jobController.submitCustomerId);

app
  .route("/rejectJob/:jobId")
  .put([passportJWT.isLogin], jobController.rejectJob);
app
  .route("/cancelJob/:jobId")
  .put([passportJWT.isLogin], jobController.cancelJob);
app
  .route("/approveJob/:jobId")
  .put([passportJWT.isLogin], jobController.approveJob);

app
  .route("/removeFile/:jobId/:fileIndex")
  .put([passportJWT.isLogin], jobController.removeFile);

app.route("/exportExcelJob/:jobId").get(jobController.exportExcelJob);

app.route("/filedownload/:filename").get(jobController.filedownload);

app
  .route("/verifyTaxID/:taxId/:companyCode/:branchCode")
  .get(jobController.verifyTaxID);

app
  .route("/verifyTaxIDAndBranch/:taxId/:branchCode")
  .get(jobController.verifyTaxIDAndBranch);

module.exports = app;
