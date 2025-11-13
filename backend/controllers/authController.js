const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import your User model
// const UserAdmin = require('../models/UserAdmin'); // Import your User model
const UserDOA = require('../models/UserDOA'); // Import your User model
const UserHierarchy = require('../models/UserHierarchy'); // Import your User model

// exports.authentication = async (req, res) => {
//     try {
//         const jwt_authorization = req.headers.authorization.split(" ")[1];
//         const jwt_verify = jwt.verify(jwt_authorization, process.env.JWT_SECRET);
//         const refresh_token = jwt.sign({ ...jwt_verify, update: new Date() }, process.env.JWT_SECRET, {});
//         let update = {
//             token: refresh_token,
//             update: new Date()
//         };

//         if (jwt_verify.isAdmin) {
//             update.isAdmin = true;
//             await UserAdmin.updateOne({ id: jwt_verify.id }, update);
//         } else {
//             await User.updateOne({ id: jwt_verify.id }, update);
//         }

//         res.send({
//             user: req.user,
//             refresh_token: refresh_token
//         });
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ error: 'Failed to authenticate user' });
//     }
// };

const loginUser = async (req, res, isAdmin) => {
    try {
        const { employeeId, password } = req.body;
        if (!employeeId || !password) {
            return res.status(400).json({ error: 'employeeId and password are required' });
        }
        let user
        const UserModel = User;
        let isUserDOA = false;
        user = await UserModel.findOne({ employeeId: employeeId });
        if (!user) {
            user = await UserDOA.findOne({ employeeId: employeeId });
            isUserDOA = true;
            if (!user) {
                return res.status(404).json({ error: 'employeeId not found' });
            }
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid employeeId or password' });
        }

        if (user.isApprove === false) {
            return res.status(401).json({ error: 'User is not approve' });
        }

        if (user.isReject === true) {
            return res.status(401).json({ error: 'User is reject' });
        }

        if (user.isActive === false) {
            return res.status(401).json({ error: 'User is Inactive' });
        }
        // let isAdmin = false;
        // if (user.role == "SUPER ADMIN") {
        //     isAdmin = true;
        // }
        let isArMaster = false;
        if (user.doaTag == "AR Master") {
            isArMaster = true;
        }

        const sign = {
            // id: user.id,
            // id: user.id,
            employeeId: user.employeeId,
            isAdmin: isAdmin,
            isArMaster: isArMaster,
            isUserDOA: isUserDOA,
        };

        const token = jwt.sign(sign, process.env.JWT_SECRET);

        if (!token) {
            return res.status(500).json({ error: 'Failed to generate token' });
        }

        const userHierarchy = await UserHierarchy.findOne({ requesterEmployeeId: user.employeeId });
        let isRequester = false;
        if (userHierarchy) {
            isRequester = true;
        }



        res.json({
            token: token,
            employeeId: employeeId,
            role: user.role || user.doaTag,
            userType: user.userType,
            isRequester: isRequester,
            isArMaster: isArMaster,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to login user' });
    }
};

exports.login = async (req, res) => {
    await loginUser(req, res, false);
};

exports.login_admin = async (req, res) => {
    await loginUser(req, res, true);
};
