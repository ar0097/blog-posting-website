const express = require("express");

const router = express.Router();

const verifyAdmin = require("../middleware/verifyAdmin");

const {
    getAllUsers,
    getUserById,
} = require("../controllers/userController");

router.get("/", verifyAdmin, getAllUsers);

router.get("/:id", verifyAdmin, getUserById);

module.exports = router;