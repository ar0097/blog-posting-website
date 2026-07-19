const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        content: [
            {
                heading: {
                    type: String,
                    trim: true,
                    default: "",
                },

                content: {
                    type: String,
                    required: true,
                    trim: true,
                },
            },
        ],
        thumbnail: {
            type: String,
            required: true,
        },
        banner: {
            type: String,
            required: true,
        },
        seoTitle: {
            type: String,
            required: true,
            trim: true,
        },
        seoDescription: {
            type: String,
            required: true,
            trim: true,
        },
        canonical: {
            type: String,
            default: "",
        },
        schemaMarkup: {
            type: String,
            default: "",
        },
        tags: [
            { type: String, trim: true, }
        ],
        category: {
            type: String,
            required: true,
            trim: true,
        },

        author: {
            name: {
                type: String,
                required: true,
            },

            bio: {
                type: String,
                required: true,
            },

            avatar: {
                type: String,
                required: true,
            },
        },

        views: {
            type: Number,
            default: 0,
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        comments: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },

                comment: {
                    type: String,
                    required: true,
                },

                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Blog', blogSchema);