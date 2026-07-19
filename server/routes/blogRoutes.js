const express = require("express");

const router = express.Router();

const {
    getAllBlogs,
    getBlogBySlug,
    deleteBlog,
    createBlog,
    updateBlog,
    toggleLike,
    addComment,
    incrementView
} = require("../controllers/blogController");
const verifyAdmin = require("../middleware/verifyAdmin");
const verifyUser = require("../middleware/verifyUser");


router.post("/", verifyAdmin, createBlog);

router.get("/", getAllBlogs);

router.get("/:slug", getBlogBySlug);
router.put("/:id", verifyAdmin, updateBlog);
router.delete("/:id", verifyAdmin, deleteBlog);
router.post("/:id/like", verifyUser, toggleLike);
router.post("/:id/comment", verifyUser, addComment);
router.post("/:id/view", incrementView);

module.exports = router;