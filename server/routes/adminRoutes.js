const express = require("express");

const router = express.Router();

const {
    adminLogin,
    getAdmin,
} = require("../controllers/adminController");
const verifyAdmin = require("../middleware/verifyAdmin");


router.post("/login", adminLogin);
router.get("/me", verifyAdmin, getAdmin);

module.exports = router;