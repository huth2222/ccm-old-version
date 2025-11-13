const express = require('express');
const passportJWT = require("../middlewares/passportJWT");
const userDOAController = require("../controllers/userDOAController");

const app = express();

app.route('/')
    .get([passportJWT.isLogin, passportJWT.isAdmin], userDOAController.getAllUsers)


module.exports = app;
