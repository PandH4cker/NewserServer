const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
    let token = req.headers['authorization'];
    if (!token)
        return next();

    token = token.replace('Bearer ', '');
    jwt.verify(token, Buffer.from(process.env.JWT_SECRET, "base64"), (err, user) => {
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

const isLoggedIn = (req, res, next) => req.headers['authorization'] ? next() : res.redirect('/');

module.exports = {
    isAuthenticated,
    isLoggedIn
}
