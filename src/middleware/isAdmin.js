const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send({ message: "You are not authorized to access this resource. Seriously, what were you thinking???" });
    }
    next();
}

module.exports = isAdmin;