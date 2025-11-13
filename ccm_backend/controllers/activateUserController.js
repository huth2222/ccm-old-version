const User = require('../models/User'); // Assuming you have a "user" model defined using Mongoose
const bcrypt = require('bcryptjs');


/**
 * @func activateUser
 * @desc activateUser api
 * @param {string} email - email
 * @param {string} password - password
 * @param {string} confirmPassword - confirmPassword
 * @returns {string} users - users
 */
exports.activateUser = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;
        if (!email || !password || !confirmPassword) {
            return res.status(400).json({ error: 'email, password, and confirmPassword are required' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ error: 'password and confirmPassword do not match' });
        }

        const filter = {
            email: email
        };

        const user = await User.findOne(filter);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.isRequestActive) {
            return res.status(400).json({ error: 'User already sent activate' });
        }

        if (user.isApprove) {
            return res.status(400).json({ error: 'User already approved' });
        }

        const passwordHash = await bcrypt.hash(confirmPassword, 10);

        const updateUserData = {
            password: passwordHash,
            isRequestActive: true,
            isActive: false,
            isApprove: false,
            isReject: false,
        };

        const updatedUser = await User.findByIdAndUpdate(user._id, updateUserData);
        if (!updatedUser) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        const mail = require('../middlewares/mail')({
            type: 'activeRequest',
            email: email,
            url: process.env.FRONTEND_URL,
        });

        return res.json({
            status: 'success'
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

/**
 * @func activateUserList
 * @desc activateUserList api
 * @returns {object} users - users
 */
exports.activateUserList = async (req, res) => {
    try {
        let query = {
            isRequestActive: true,
        };

        if (req.query.searchText != "all" && req.query.searchText != "" && req.query.searchText != undefined) {
            query.employeeId = { $regex: new RegExp(req.query.searchText, 'i') };

        }

        let users = await User.find(query).lean();
        return res.json({
            status: 'success',
            data: users
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

exports.activateApprove = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) throw Error('User not found');
        user.isApprove = true;
        user.isRequestActive = false;
        user.isActive = true;
        user.isReject = false;
        const updatedUser = await user.save();
        res.json({
            status: 'success',
        });
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}

exports.activateReject = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) throw Error('User not found');
        user.isApprove = false;
        user.isRequestActive = false;
        user.isActive = false;
        user.isReject = true;
        const updatedUser = await user.save();
        res.json({
            status: 'success',
        });
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}