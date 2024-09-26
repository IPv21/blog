const express = require('express');
const router = express.Router();
const Blog = require('../model/blog.model');
const bodyParser = require('body-parser');
const verifyToken = require('../middleware/verifyToken');
const Comment = require('../model/comments.model');


// Use body-parser middleware
router.use(bodyParser.json());

router.post('/create-post', verifyToken,  async (req, res) => {
    try {
        const newPost = new Blog({...req.body, author: req.user._id});
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

        const posts = await Blog.find(query).populate('author', 'email').sort({ createdAt: -1 });
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

        //fetch comment related to post
        const comment = await Comment.find({postId: postId}).populate('user', 'username email');

        res.status(200).send({
            message: "<<<>Post Fetched Successfully<>>>",
            post: post
        });
    } catch (error) {
        console.error("<<<>ERROR Fetching Post<>>>", error);
        res.status(500).send({ message: "<<<>Error Fetching Post<>>>" });
    }
});

//update post
router.patch('/update-post/:id', verifyToken, async (req, res) => {
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

//delete post
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Blog.findByIdAndDelete(postId);
        if(!post) {
            return res.status(404).send({ message: "Post not found" });
        }

        //delete all comments related to post
        await Comment.deleteMany({ postId
        });

        res.status(200).send({ message: "<<<>Post Deleted Successfully<>>>" });
        console.log("<<<>DELETING POST WITH ID<>>>", postId);

    } catch(error) {
        console.error("<<<>ERROR Deleting Post<>>>", error);
        res.status(500).send({ message: "<<<>ERROR Deleting Post<>>>" });

    }
});

//related posts
router.get('./related-posts/:id', verifyToken, async (req, res) => {
    const {id} = req.params.id;
    if(!id) {
        return res.status(400).send({ message: "Post ID is required" });
    } 
    const blog = await Blog.findById(id);
    if(!blog) {
        return res.status(404).send({ message: "Post not found" });
    }

    const titleRegex = new RegExp(blog.title.split(' ').join('|'), 'i');
    const relatedQuery = {
        _id: {$ne: id},  //excludes the current blog by id
        title: {$regex: titleRegex}
    }

    const relatedPost = await Blog.find(relatedQuery);
    res.status(200).send({message: "<<<>RELATED POST FOUND!<>>>", post: relatedPost })


    try {
        const relatedPosts = await Blog.find({ category: post.category, _id: { $ne: postId } }).limit(3);
        res.status(200).send({
            message: "<<<>Related Posts Fetched Successfully<>>>",
            posts: relatedPosts
        });
    } catch (error) {
        console.error("<<<>ERROR Fetching Related Posts<>>>", error);
        res.status(500).send({ message: "<<<>ERROR Fetching Related Posts<>>>" });
    }
}
);




module.exports = router;