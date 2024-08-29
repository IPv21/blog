const express = require('express');
const router = express.Router();
const User = require('../model/user.model');
const bcrypt = require('bcryptjs');

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

//login a user
router.post('/login', async(req, res) => {
    try {
        console.log(req.body);
        const { email, password } = req.body;
        const user = await  User.findOne
        ({ email });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send({ message: "Invalid credentials" });
        }
        res.status(200).send({
            message: "Login Successful Welcome Back " + user.username + " " + user.email + " ROLE:::" + user.role
        });

        //todo generate token
        

    } catch (error) {
        console.error("<<<>ERROR Logging In User<>>>", error);
        res.status(500).send({ message: "Login Failed. Please try again. You were so close!" });
    }}

);



module.exports = router;
