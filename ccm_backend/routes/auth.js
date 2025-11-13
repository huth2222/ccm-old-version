const express = require('express');
const passportJWT = require("../middlewares/passportJWT");
const authController = require('../controllers/authController');

const app = express();

app.route('/login')
    .post( authController.login);
app.route('/login_admin')
    .post( authController.login_admin);

// app.route('/')
//     .get([passportJWT.isLogin], authController.authentication)

module.exports = app;
