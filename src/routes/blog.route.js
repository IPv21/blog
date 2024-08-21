const express = require('express');
const router = express.Router();
const Blog = require('../model/blog.model');
const bodyParser = require('body-parser');

// Use body-parser middleware
router.use(bodyParser.json());

router.post('/create-post', async (req, res) => {
    try {
        const newPost = new Blog(req.body);
        await newPost.save();
        res.status(201).send({
            message: "Post Created Successfully",
            post: newPost
        });
    } catch (error) {
        console.error("<<<>ERROR Creating Post<>>>", error);
        res.status(500).send({ message: "Error Creating Post" });
    }
});

router.get('/', async (req, res) => {
    try {
        const posts = await Blog.find();
        res.status(200).send({
            message: "Posts Fetched Successfully",
            posts: posts
        });
    } catch (error) {
        console.error("<<<>ERROR Fetching Posts<>>>", error);
        res.status(500).send({ message: "Error Fetching Posts" });
    }
});

module.exports = router;