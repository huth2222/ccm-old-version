const passport = require("passport");
const User = require("../models/User");
const UserDOA = require("../models/UserDOA");
// const UserAdmin = require("../models/UserAdmin");

const JwtStrategy = require("passport-jwt").Strategy,
    ExtractJwt = require("passport-jwt").ExtractJwt;
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET

passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            let user;
            // console.log(jwt_payload)
            if (jwt_payload.isUserDOA) {
                // user = await UserDOA.findById(jwt_payload.id).select('-password');
                user = await UserDOA.findOne({employeeId:jwt_payload.employeeId}).select('-password');
            } else {
                // user = await User.findById(jwt_payload.id).select('-password');
                user = await User.findOne({employeeId:jwt_payload.employeeId}).select('-password');
            }
            user.isAdmin = jwt_payload.isAdmin
            if (!user) {
                return done(new Error("ไม่พบผู้ใช้ในระบบ"), null);
            }
            return done(null, user);
        } catch (error) {
            console.log(error);
            done(error);
        }
    })
);

module.exports = {
    isLogin: passport.authenticate("jwt", {
        session: false,
    }),
    isAdmin: (req, res, next) => {
        // Assuming that the 'isLogin' middleware has already been called, so the user object is available in 'req.user'.
        if (req.user && (req.user.isAdmin || req.user.role == "AR Master")) {
            // If the user is a Admin, proceed to the next middleware.
            next();
        } else {
            // If the user is not a Admin, return an error response or x`redirect to a different route.
            res.status(403).json({ message: "Unauthorized: You are not a Admin." });
        }
    },
};
