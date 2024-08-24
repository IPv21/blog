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

module.exports = router;
