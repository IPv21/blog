const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET_KEY;

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("<<<>ERROR Verifying Token<>>>", error);
        console.log("TOKEN DECODED: ", req.user);
        res.status(401).send({ message: "Unauthorized" });
    }

}


module.exports = verifyToken;



