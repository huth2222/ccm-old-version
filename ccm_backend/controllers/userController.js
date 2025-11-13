const User = require('../models/User'); // Assuming you have a "user" model defined using Mongoose
const UserHierarchy = require('../models/UserHierarchy'); // Assuming you have a "user" model defined using Mongoose

exports.getMeUser = async (req, res) => {
    try {
        res.json(req.user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getSelection = async (req, res) => {
    try {
        let addOn = {};
        if (req.user.companyCode === "") {
            addOn.companyCodeSelection = ["1100", "1200", "5100"];
        } else {
            addOn.companyCodeSelection = [req.user.companyCode]
        }
        if (req.user.distChannel.length === 0) {
            addOn.distChannelSelection = ["10", "20", "30", "40", "50", "60"];
        } else {
            addOn.distChannelSelection = req.user.distChannel
        }
        const userHierarchy = await UserHierarchy.findOne({ requesterEmployeeId: req.user.employeeId });
        let isRequester = false;
        if (userHierarchy) {
            isRequester = true;
        }

        if (isRequester) {
            addOn.statusSelection = ["Waiting", "Completed", "Rejected", "Cancelled"]
            addOn.statusSelectionDefault = "Waiting"
        } else if (req.user.role == "AR Master") {
            addOn.statusSelection = ["Pending", "Waiting", "Completed", "Rejected", "Cancelled"]
            addOn.statusSelectionDefault = "Pending"
        } else {
            addOn.statusSelection = ["Pending", "Approved", "Rejected", "Cancelled"]
            addOn.statusSelectionDefault = "Pending"
        }
        res.json(addOn);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createUser = async (req, res) => {
    try {
        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        res.json(savedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: { $nin: ['SUPER ADMIN', 'ADMIN'] } });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) throw Error('User not found');
        res.json(user);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

exports.updateUserById = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteUserById = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndRemove(req.params.id);
        res.json(deletedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.activeUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) throw Error('User not found');
        user.isActive = true;
        const updatedUser = await user.save();
        const mail = require('../middlewares/mail')({
            type: 'approvedRequest',
            email: user.email,
            url: process.env.FRONTEND_URL,
        });
        res.json(updatedUser);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}

exports.inactiveUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) throw Error('User not found');
        user.isActive = false;
        const updatedUser = await user.save();
        const mail = require('../middlewares/mail')({
            type: 'rejectedRequest',
            email: user.email,
            url: process.env.FRONTEND_URL,
        });
        res.json(updatedUser);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}

exports.searchNameOrEmployeeId = async (req, res) => {
    try {
        const searchText = req.body.searchText;

        const users = await User.find({
            $or: [
                { 'employeeId': { $regex: searchText, $options: 'i' } }, // Case-insensitive regex search for employeeId
                { 'name': { $regex: searchText, $options: 'i' } } // Case-insensitive regex search for name
            ]
        }).exec();

        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred while searching." });
    }
}

exports.approvedList = async (req, res) => {
    try {
        let query = { isApprove: true, role: { $nin: ['SUPER ADMIN', 'ADMIN'] } };

        if (req.query.searchText != "all" && req.query.searchText != "" && req.query.searchText != undefined) {
            // If searchText is provided, add employeeId search to the query
            query.employeeId = { $regex: new RegExp(req.query.searchText, 'i') };
        }

        // Perform the query
        let users = await User.find(query).lean();

        res.json(users);
    } catch (err) {
        res.status(500).json({ error: `Error fetching approved users: ${err.message}` });
    }
};

exports.rejectedList = async (req, res) => {
    try {
        let query = { isReject: true, role: { $nin: ['SUPER ADMIN', 'ADMIN'] } };
        if (req.query.searchText != "all" && req.query.searchText != "" && req.query.searchText != undefined) {
            // If searchText is provided, add employeeId search to the query
            query.employeeId = { $regex: new RegExp(req.query.searchText, 'i') };
        }
        let users = await User.find(query).lean();

        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

