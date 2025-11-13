const express = require('express');
const forgotPasswordController = require('../controllers/forgotPasswordController');

const app = express();

app.route('/')
    .post( forgotPasswordController.forgotPassword);

module.exports = app;
