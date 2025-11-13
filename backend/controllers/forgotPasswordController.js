const User = require('../models/User'); // Assuming you have a "user" model defined using Mongoose
const UserDOA = require('../models/UserDOA'); // Assuming you have a "user" model defined using Mongoose
const bcrypt = require('bcryptjs');

/**
 * @func forgotPassword
 * @desc forgotPassword api
 * @param {string} employeeId - employeeId
 * @param {string} email - email
 * @param {string} newPassword - password
 * @returns {string} status - status
 */
exports.forgotPassword = async (req, res) => {
    try {
        const { employeeId, email, newPassword } = req.body;
        if (!employeeId || !email || !newPassword) {
            return res.status(400).json({ error: 'employeeId, email, and newPassword are required' });
        }

        const filterEmployeeId = { employeeId };

        const user = await User.findOne(filterEmployeeId);
        const userDOA = await UserDOA.findOne(filterEmployeeId);

        if (!user && !userDOA) {
            return res.status(404).json({ error: 'Employee Id not found' });
        }

        const filter = { employeeId, email };

        const userToUpdate = user || userDOA;

        const userCheck = await (user ? User.findOne(filter) : UserDOA.findOne(filter));

        if (!userCheck) {
            return res.status(404).json({ error: 'Employee Id and Email do not match' });
        }

        const passwordHash = await bcrypt.hash(newPassword, 10);
        const updateUserData = { password: passwordHash };

        const updatedUser = await (user
            ? User.findByIdAndUpdate(userToUpdate._id, updateUserData)
            : UserDOA.findByIdAndUpdate(userToUpdate._id, updateUserData)
        );

        if (!updatedUser) {
            return res.status(500).json({ error: 'Failed to update user' });
        }

        return res.json({ status: 'success' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

