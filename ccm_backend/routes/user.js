const express = require('express');
const passportJWT = require("../middlewares/passportJWT");
const userController = require("../controllers/userController");

const app = express();

app.route('/approvedList')
    .get([passportJWT.isLogin, passportJWT.isAdmin], userController.approvedList);
app.route('/rejectedList')
    .get([passportJWT.isLogin, passportJWT.isAdmin], userController.rejectedList);

app.route('/me')
    .get([passportJWT.isLogin], userController.getMeUser);
app.route('/getSelection')
    .get([passportJWT.isLogin], userController.getSelection);

app.route('/')
    .get([passportJWT.isLogin, passportJWT.isAdmin], userController.getAllUsers)
    .post([passportJWT.isLogin, passportJWT.isAdmin], userController.createUser);

app.route('/:id')
    .get([passportJWT.isLogin, passportJWT.isAdmin], userController.getUserById)
    .put([passportJWT.isLogin, passportJWT.isAdmin], userController.updateUserById)
    .delete([passportJWT.isLogin, passportJWT.isAdmin], userController.deleteUserById);

app.route('/active/:id')
    .put([passportJWT.isLogin, passportJWT.isAdmin], userController.activeUserById);
app.route('/inactive/:id')
    .put([passportJWT.isLogin, passportJWT.isAdmin], userController.inactiveUserById);

app.route('/searchNameOrEmployeeId')
    .post([passportJWT.isLogin, passportJWT.isAdmin], userController.searchNameOrEmployeeId);

module.exports = app;
