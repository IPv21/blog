// const jwt = require('jsonwebtoken');

// const JWT_SECRET = process.env.JWT_SECRET_KEY;

// const verifyToken = (req, res, next) => {
//     try {
//         const token = req.cookies.token; 
//         console.log('Token from cookie:', token);
//         if (!token) {
//             return res.status(401).send({ message: 'Token not found' });
//         }

//         const decoded = jwt.verify(token, JWT_SECRET);
//         if (!decoded.userId) {
//             return res.status(401).send({ message: 'User ID not found in token' });
//         }

//         req.userId = decoded.userId;
//         req.role = decoded.role;
//         next();
//     } catch (error) {
//         console.error('Error verifying token:', error);
//         res.status(401).send({ message: 'Invalid token' });
//     }
// };

// module.exports = verifyToken;

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET_KEY;

const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log('Authorization header:', authHeader);
        if (!authHeader) {
            return res.status(401).send({ message: 'Authorization header not found' });
        }

        const token = authHeader.split(" ")[1].replace(/"/g, ''); // Remove any extra quotes
        console.log('Token extracted:', token);
        if (!token) {
            return res.status(401).send({ message: 'Token not found' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded.userId) {
            return res.status(401).send({ message: 'User ID not found in token' });
        }

        req.user = decoded; // Set the decoded token data to req.user
        next();
    } catch (error) {
        console.error('Error verifying token:', error.message);
        res.status(401).send({ message: 'Invalid token' });
    }
};

module.exports = verifyToken;
