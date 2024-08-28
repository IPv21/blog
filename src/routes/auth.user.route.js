const express = require('express');
const router = express.Router();
const User = require('../model/user.model');

//register a new user
router.post('/register', async(req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({email, username, password});
        console.log(user);
        await user.save();
        res.status(201).send({
            message: "User Registered Successfully",
            user: user
        });
    } catch (error) {
        console.error("<<<>ERROR Registering User<>>>", error);
        res.status(500).send({ message: "Error Registering User" });
    }

}
);



module.exports = router;
