require('dotenv').config();
const connectDB = require('../config/db');
const blogs = require('./blog');
const Blog = require('../models/Blog');

const seedData = async () => {
    try {
        await connectDB();

        await Blog.deleteMany();


        await Blog.insertMany(blogs);

        process.exit(0);

    } catch (error) {
        console.log(error.message);

        process.exit(1);
    }
}


seedData();