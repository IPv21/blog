const express = require('express');
const router = express.Router();
const User = require('../model/user.model');
const bcrypt = require('bcryptjs');
const generateToken = require('../middleware/generateToken');

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

        //generate token
        const token = await generateToken(user._id);
        res.cookie("Token", token, { 
        httpOnly: true, //enable this only when you havew https://
        sameSite: true,
        secure: true
         });
        console.log("Generated Token = " + token);
        res.status(200).send({
            message: "Login Successful " + user.email + " ROLE--->" + user.role, token, user
        });

       

        

    } catch (error) {
        console.error("<<<>ERROR Logging In User<>>>", error);
        res.status(500).send({ message: "Login Failed. Please try again. You were so close!" });
    }});

    //logout a user
    router.post('/logout', async (req, res) => {
        try {
            res.clearCookie('token'); // Make sure the cookie name matches what you set during login
            res.status(200).send({ message: "Logout Successful" });
        } catch (error) {
            console.error("<<<>ERROR Logging Out User<>>>", error);
            res.status(500).send({ message: "Logout Failed. Please try again. You were so close!" });
        }
    });

    //get all users
    router.get('/users', async (req, res) => {
        try {
            const users = await User.find({}, 'id email username role');
            res.status(200).send({
                message: "I gotchyer uuusers right here!",
                users: users
            });
        } catch (error){
            console.error("<<<>ERROR Fetching Users<>>>", error);
            res.status(500).send({ message: "Error Fetching Users" });
        } 
    }
    );

    //delete user
    router.delete('/:id', async (req, res) => {
        try {
            const {id} = req.params.id;
            const user = await User.findByIdAndDelete(id);
            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }
            res.status(200).send({
                message: "User Deleted Successfully",
                user: user
            });
        } catch (error) {
            console.error("<<<>ERROR Deleting User<>>>", error);
            res.status(500).send({ message: "Error Deleting User" });
        }
    });

    //update a user role

    router.put('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const { role } = req.body;
            const user = await User.findByIdAndUpdate(id, { role }, { new: true });
            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }
            res.status(200).send({
                message: "User Updated Successfully",
                user: user
            });
        } catch (error) {
            console.error("<<<>ERROR Updating User<>>>", error);
            res.status(500).send({ message: "Error Updating User" });
        }
    });


module.exports = router;
