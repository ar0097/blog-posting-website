const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");

const verifyAuth = async (req, res, next) => {
    console.log("VERIFY AUTH");

    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "No token provided",
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        let account;

        if (decoded.role === "user") {
            account = await User.findById(decoded.id).select("-password");
        } else if (decoded.role === "admin") {
            account = await Admin.findById(decoded.id).select("-password");
        }

        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Account not found",
            });
        }

        req.user = account;
        req.role = decoded.role;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token",
        });
    }
};

module.exports = verifyAuth;