require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const connectDB = require("../config/db");
const Admin = require("../models/Admin");

const createAdmin = async () => {
    try {
        await connectDB();

        const existingAdmin = await Admin.findOne({
            email: "blogadmin@gmail.com",
        });

        if (existingAdmin) {
            console.log("Admin already exists");
            process.exit();
        }

        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

        await Admin.create({
            name: "Blog Admin",
            email: "blogadmin@gmail.com",
            password: hashedPassword,
        });

        console.log("Admin created successfully");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

createAdmin();