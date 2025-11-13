const express = require('express');
const activateUserController = require('../controllers/activateUserController');
const passportJWT = require("../middlewares/passportJWT");

const app = express();

app.route('/')
    .post( activateUserController.activateUser)
    .get([passportJWT.isLogin, passportJWT.isAdmin], activateUserController.activateUserList);

app.route('/approve/:id')
    .put([passportJWT.isLogin, passportJWT.isAdmin],activateUserController.activateApprove)
app.route('/reject/:id')
    .put([passportJWT.isLogin, passportJWT.isAdmin],activateUserController.activateReject)


module.exports = app;
