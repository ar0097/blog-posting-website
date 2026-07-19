const Blog = require("../models/Blog");

const createBlog = async (req, res) => {
    try {
        const {
            title,
            slug,
            description,
            content,
            thumbnail,
            banner,
            seoTitle,
            seoDescription,
            canonical,
            schemaMarkup,
            tags,
            category,
            author,
        } = req.body;

        const existingBlog = await Blog.findOne({ slug });

        if (existingBlog) {
            return res.status(400).json({
                success: false,
                message: "Slug already exists",
            });
        }

        const blog = await Blog.create({
            title,
            slug,
            description,
            content,
            thumbnail,
            banner,
            seoTitle,
            seoDescription,
            canonical,
            schemaMarkup,
            tags,
            category,
            author,
        });

        res.status(201).json({
            success: true,
            message: "Blog created successfully",
            blog,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: blogs.length,
            blogs,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getBlogBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const blog = await Blog.findOne({ slug })
            .populate("comments.user", "name avatar");

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }

        res.status(200).json({
            success: true,
            blog,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const incrementView = async (req, res) => {
    try {
        const { id } = req.params;

        const blog = await Blog.findByIdAndUpdate(
            id,
            {
                $inc: {
                    views: 1,
                },
            },
            {
                returnDocument: "after",
            }
        );

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }

        res.status(200).json({
            success: true,
            views: blog.views,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            title,
            slug,
            description,
            content,
            thumbnail,
            banner,
            seoTitle,
            seoDescription,
            canonical,
            schemaMarkup,
            tags,
            category,
            author,
        } = req.body;

        const existingBlog = await Blog.findOne({
            slug,
            _id: { $ne: id },
        });

        if (existingBlog) {
            return res.status(400).json({
                success: false,
                message: "Slug already exists",
            });
        }

        const blog = await Blog.findByIdAndUpdate(
            id,
            {
                title,
                slug,
                description,
                content,
                thumbnail,
                banner,
                seoTitle,
                seoDescription,
                canonical,
                schemaMarkup,
                tags,
                category,
                author,
            },
            {
                returnDocument: "after",
                runValidators: true,
            }
        );

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            blog,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;

        const blog = await Blog.findByIdAndDelete(id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Blog deleted successfully",
            blog,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const toggleLike = async (req, res) => {
    try {
        const { id } = req.params;

        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }

        const userId = req.user._id;

        const alreadyLiked = blog.likes.some(
            (like) => like.toString() === userId.toString()
        );

        if (alreadyLiked) {
            // Unlike
            blog.likes = blog.likes.filter(
                (like) => like.toString() !== userId.toString()
            );

            await blog.save();

            return res.status(200).json({
                success: true,
                message: "Blog unliked",
                likes: blog.likes.length,
                liked: false,
            });
        }

        // Like
        blog.likes.push(userId);

        await blog.save();

        res.status(200).json({
            success: true,
            message: "Blog liked",
            likes: blog.likes.length,
            liked: true,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { comment } = req.body;

        if (!comment || comment.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Comment is required",
            });
        }

        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }

        blog.comments.push({
            user: req.user._id,
            comment,
        });

        await blog.save();

        await blog.populate("comments.user", "name avatar");

        res.status(201).json({
            success: true,
            message: "Comment added successfully",
            comments: blog.comments,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createBlog,
    getAllBlogs,
    getBlogBySlug,
    updateBlog,
    deleteBlog,
    toggleLike,
    addComment,
    incrementView
};