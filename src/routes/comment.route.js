const express = require('express');
const router = express.Router();
const Comment = require('../model/comments.model');

router.post('/create-comment', async (req, res) => {
    try {
        const newComment = new Comment(req.body);
        await newComment.save();
        res.status(201).send({
            message: "Comment Created Successfully",
            comment: newComment
        });
    } catch (error) {
        console.error("<<<>ERROR Creating Comment<>>>", error);
        res.status(500).send({ message: "Error Creating Comment" });
    }
});

//get all comments 
router.get("/total-comments", async (req, res) => {
    try {
        const comments = await Comment.find();
        res.status(200).send({
            message: "Comments Fetched Successfully",
            comments: comments
        });
    } catch (error) {
        console.error("<<<>ERROR Fetching Comments<>>>", error);
        res.status(500).send({ message: "Error Fetching Comments" });
    }
});

module.exports = router;
