const UserDOA = require('../models/UserDOA'); // Assuming you have a "user" model defined using Mongoose

exports.getAllUsers = async (req, res) => {
    try {
        const usersDOA = await UserDOA.find();
        res.json(usersDOA);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
