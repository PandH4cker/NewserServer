const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
    let token = req.headers['authorization'];
    if (!token)
        return next();

    token = token.replace('Bearer ', '');
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(401).json({
                success: false,
                message: 'Please register or log in using valid email to submit posts'
            });
        } else {
            req.user = user;
            next();
        }
    });
};
exports.isAuthenticated = isAuthenticated;
