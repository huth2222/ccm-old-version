require("dotenv").config();

var express = require("express");
var app = express();
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const basicAuth = require("express-basic-auth");

const passport = require("passport");
const PORT = process.env.PORT;
const errorHandler = require("./middlewares/errorHandler");
// enable encryption
// const { encryptMiddleware, decryptMiddleware } = require('./middlewares/encryptionMiddleware');
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

app.use(logger("dev"));
app.use(express.json());
// enable encryption
// app.use(decryptMiddleware); // Decrypt data before processing
// app.use(encryptMiddleware); // Encrypt data before sending
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
console.log(path.join(__dirname, "template"));
app.use(express.static(path.join(__dirname, "template")));
app.use(express.static(path.join(__dirname, "public/uploads")));

//CRON JOB FOR IMPORT CUSTOMER FROM SFTP SAP
require("./cron-jobs.js");

const fs = require("fs");
const folderPathExport = "export";
// Check if the folder exists asynchronously
fs.access(folderPathExport, (err) => {
  if (err) {
    // If the folder doesn't exist, create it asynchronously
    fs.mkdir(folderPathExport, (err) => {
      if (err) {
        console.error(`Error creating folder: ${err.message}`);
      } else {
        console.log(`Folder '${folderPathExport}' created.`);
      }
    });
  } else {
    console.log(`Folder '${folderPathExport}' already exists.`);
  }
});

const folderPathZip = "zip";

// Check if the folder exists asynchronously
fs.access(folderPathZip, (err) => {
  if (err) {
    // If the folder doesn't exist, create it asynchronously
    fs.mkdir(folderPathZip, (err) => {
      if (err) {
        console.error(`Error creating folder: ${err.message}`);
      } else {
        console.log(`Folder '${folderPathZip}' created.`);
      }
    });
  } else {
    console.log(`Folder '${folderPathZip}' already exists.`);
  }
});

const folderPathSFTP = "stfp_file_daily";
// Check if the folder exists asynchronously
fs.access(folderPathSFTP, (err) => {
  if (err) {
    // If the folder doesn't exist, create it asynchronously
    fs.mkdir(folderPathSFTP, (err) => {
      if (err) {
        console.error(`Error creating folder: ${err.message}`);
      } else {
        console.log(`Folder '${folderPathSFTP}' created.`);
      }
    });
  } else {
    console.log(`Folder '${folderPathSFTP}' already exists.`);
  }
});

// _____   _____   _____   _   _   _____    _   _____  __    __
// /  ___/ | ____| /  ___| | | | | |  _  \  | | |_   _| \ \  / /
// | |___  | |__   | |     | | | | | |_| |  | |   | |    \ \/ /
// \___  \ |  __|  | |     | | | | |  _  /  | |   | |     \  /
//  ___| | | |___  | |___  | |_| | | | \ \  | |   | |     / /
// /_____/ |_____| \_____| \_____/ |_|  \_\ |_|   |_|    /_/
app.use(passport.initialize());

app.use(helmet());

app.use(cors());
/*
const cors = require("cors");

// ✅ เปิดทุก origin และรองรับ credentials
app.use(
  cors({
    origin: function (origin, callback) {
      // อนุญาตทุก origin รวมถึงกรณีไม่มี origin (เช่น Postman)
      callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ รองรับ preflight OPTIONS ทุกเส้นทาง
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.sendStatus(200);
});
*/

app.set("trust proxy", 1);

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 500, // limit each IP to 500 requests per windowMs
});

app.use(limiter);

//===================================================================================================

// _____       ___   _____       ___   _____       ___   _____   _____
// |  _  \     /   | |_   _|     /   | |  _  \     /   | /  ___/ | ____|
// | | | |    / /| |   | |      / /| | | |_| |    / /| | | |___  | |__
// | | | |   / / | |   | |     / / | | |  _  {   / / | | \___  \ |  __|
// | |_| |  / /  | |   | |    / /  | | | |_| |  / /  | |  ___| | | |___
// |_____/ /_/   |_|   |_|   /_/   |_| |_____/ /_/   |_| /_____/ |_____|
require("./config/database.js");
//===================================================================================================

// _____    _____   _   _   _____   _____   _____
// |  _  \  /  _  \ | | | | |_   _| | ____| /  ___/
// | |_| |  | | | | | | | |   | |   | |__   | |___
// |  _  /  | | | | | | | |   | |   |  __|  \___  \
// | | \ \  | |_| | | |_| |   | |   | |___   ___| |
// |_|  \_\ \_____/ \_____/   |_|   |_____| /_____/
const apiV1 = process.env.URL_API_VER;

var indexRoutes = require("./routes/index.js");
var authRouter = require("./routes/auth.js");
var userRouter = require("./routes/user");
var userDOARouter = require("./routes/userDOA");
var forgotPasswordRouter = require("./routes/forgotPassword");
var adminRouter = require("./routes/admin");
var customerRouter = require("./routes/customer");
var customerMasterRouter = require("./routes/customerMaster.js");
var activateUserRouter = require("./routes/activateUser");
var jobRouter = require("./routes/job");
var dataRouter = require("./routes/data");

app.use(apiV1, indexRoutes);
app.use(apiV1 + "/auth", authRouter);
app.use(apiV1 + "/admin", adminRouter);
app.use(apiV1 + "/users", userRouter);
app.use(apiV1 + "/usersDOA", userDOARouter);
app.use(apiV1 + "/forgot-password", forgotPasswordRouter);
app.use(apiV1 + "/customers", customerRouter);
app.use(apiV1 + "/activate-user", activateUserRouter);
app.use(apiV1 + "/job", jobRouter);
app.use(apiV1 + "/data", dataRouter);

app.use(
  apiV1 + "/customer-master",
  basicAuth({
    users: {
      admintoa: "ToaPaint#2024",
    },
    challenge: true,
  }),
  customerMasterRouter
);

//===================================================================================================

// _____   _          __      ___   _____   _____   _____   _____
// /  ___/ | |        / /     /   | /  ___| /  ___| | ____| |  _  \
// | |___  | |  __   / /     / /| | | |     | |     | |__   | |_| |
// \___  \ | | /  | / /     / / | | | |  _  | |  _  |  __|  |  _  /
//  ___| | | |/   |/ /     / /  | | | |_| | | |_| | | |___  | | \ \
// /_____/ |___/|___/     /_/   |_| \_____/ \_____/ |_____| |_|  \_\

if (process.env.ENV != "PRD") {
  const swaggerUi = require("swagger-ui-express");
  const swaggerJsDoc = require("swagger-jsdoc");

  const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Sample API",
        version: "1.0.0",
        description: "A sample API using Swagger",
      },
      servers: [
        {
          url: process.env.SELF_URL + process.env.URL_API_VER,
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
    apis: ["./swaggers/*.yaml"],
  };

  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  console.log(`Swagger is running on ${process.env.SELF_URL}/api-docs`);
}

//===================================================================================================

//      ___  ___   _____   _____   _____   _
//     /   |/   | /  _  \ |  _  \ | ____| | |
//    / /|   /| | | | | | | | | | | |__   | |
//   / / |__/ | | | | | | | | | | |  __|  | |
//  / /       | | | |_| | | |_| | | |___  | |___
// /_/        |_| \_____/ |_____/ |_____| |_____|

require("./models");

// _____   __   _   _____        _____   _____   _____   _   _   _____
// | ____| |  \ | | |  _  \      /  ___/ | ____| |_   _| | | | | |  _  \
// | |__   |   \| | | | | |      | |___  | |__     | |   | | | | | |_| |
// |  __|  | |\   | | | | |      \___  \ |  __|    | |   | | | | |  ___/
// | |___  | | \  | | |_| |       ___| | | |___    | |   | |_| | | |
// |_____| |_|  \_| |_____/      /_____/ |_____|   |_|   \_____/ |_|
app.use(errorHandler);
app.set("port", PORT);
// ========================================================================
app.use((req, res, next) => {
  res.status(404).send({ url: `${req.originalUrl} not found` });
});

// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });
// ========================================================================

module.exports = app;
