const jwt = require('jsonwebtoken');
const User = require('../model/user.model');
const JWT_SECRET = process.env.JWT_SECRET_KEY;

const generateToken = async (userId) => {
    try {
        const user = await User.findById(userId); // Use User model here
        if (!user) {
            throw new Error("User NOT Found!");
        }
        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        return token;
    } catch (error) {
        console.error("ERROR Generating Token", error);
        throw error; // Rethrow the error to handle it elsewhere if needed
    }
};

module.exports = generateToken;