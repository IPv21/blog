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
        const { search, category, location } = req.query;
        console.log(search);

        let query = {};

        if (search) {
            query = {
                ...query,
                $or: [
                    { title: new RegExp(search, 'i') },
                    { content: new RegExp(search, 'i') },
                ]
            };
        }

        if(category) {
            query = {
                ...query,
                category: category,
            };
        }

        if(location) {
            query = {
                ...query,
                location: location,
            };
        }

        const posts = await Blog.find(query).sort({ createdAt: -1 });
        res.status(200).send({
            message: "Posts Fetched Successfully",
            posts: posts
        });
    } catch (error) {
        console.error("<<<>ERROR Fetching Posts<>>>", error);
        res.status(500).send({ message: "Error Fetching Posts" });
    }
});

//get post by id
router.get('/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        console.log(postId);

        const post = await Blog.findById(postId);
        if (!post) {
            return res.status(404).send({ message: "Post not found" });
        }

        res.status(200).send({
            message: "<<<>Post Fetched Successfully<>>>",
            post: post
        });
    } catch (error) {
        console.error("<<<>ERROR Fetching Post<>>>", error);
        res.status(500).send({ message: "Error Fetching Post" });
    }
});

//update post
router.patch('/update-post/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        console.log("Updating post with ID:", postId);
        console.log("Update data:", req.body);

        const updatedPost = await Blog.findByIdAndUpdate(postId, req.body, { new: true, runValidators: true });
        if (!updatedPost) {
            return res.status(404).send({ message: "Post not found" });
        }

        res.status(200).send({
            message: "<<<>Post Updated Successfully<>>>",
            post: updatedPost
        });
    } catch (error) {
        console.error("<<<>ERROR Updating Post<>>>", error);
        res.status(500).send({ message: "<<<>ERROR Updating Post<>>>" });
    }
});


module.exports = router;