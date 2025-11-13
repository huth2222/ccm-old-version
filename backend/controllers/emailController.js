const mongoose = require('mongoose');
const email = require('../models/Email');

exports.list_all_emails = (req, res) => {
    email.find().sort({ createDate: -1 }).exec((err, emails) => {
        if (err) {
            res.send(err);
        }
        res.json(emails);
    });
}

exports.create_a_email = (req, res) => {
    const newemail = new email(req.body);
    newemail.save((err, email) => {
        if (err) {
            res.send(err);
        }
        res.json(email)
    })
}

exports.create_a_email_func = (req, res) => {
    const newemail = new email(req);

    newemail.save()
        .then(function (email) {
            // Handle the successful save
        })
        .catch(function (err) {
            console.log("err_create_a_email_func", err);
        });


}

exports.read_a_email = (req, res) => {
    email.findById(req.params.emailId, (err, email) => {
        if (err) {
            res.send(err);
        }
        res.json(email);
    })
}

exports.update_a_email = (req, res) => {
    email.findOneAndUpdate(
        { _id: req.params.emailId },
        req.body,
        { new: true },
        (err, email) => {
            if (err) {
                res.send(err);
            }
            res.json(email);
        }
    )
}

exports.delete_a_email = (req, res) => {
    email.deleteOne({ _id: req.params.emailId }, err => {
        if (err) {
            res.send(err);
        }
        res.json({
            message: 'email succesfully deleted',
            _id: req.params.emailId
        })
    })
}