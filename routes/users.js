const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const utils = require('../utils/index');
const expressJwt = require('express-jwt');
const { isLoggedIn } = require('../middlewares/auth');

if(!process.env.JWT_SECRET) {
    console.error('ERROR!: Please set JWT_SECRET before running the app. \n run: export JWT_SECRET=<some secret string> \n or set it in the .env file.');
    process.exit(1);
}

const User = require('../models/user');

router.post('/users/signin', (req, res) => {
    User
    .findOne({
        username: req.body.username
    })
    .select({
        __v: 0,
        updatedAt: 0,
        createdAt: 0
    })
    .exec((err, user) => {
        if (err) throw err;
        if (!user) {
            return res.status(404).json({
                error: true,
                message: 'Username or password is incorrect.'
            });
        }

        bcrypt.compare(req.body.password, user.password, (err, valid) => {
            if (!valid) {
                return res.status(404).json({
                    error: true,
                    message: 'Username or password is incorrect'
                });
            }

            let token = utils.generateToken(user);
            user = utils.getCleanUser(user);
            res.json({
                user: user,
                token: token,
            });
        });
    });
});

router.post('/users/signup', (req, res, next) => {
    const body = req.body;

    let errors = utils.validateSignUpForm(body);
    if (errors) return res.status(403).json(errors);

    utils.isUserUnique(body, err => {
        if (err) return res.status(403).json(err);

        const hash = bcrypt.hashSync(body.password.trim(), 10);
        const user = new User({
            civility: body.civility.trim(),
            firstname: body.firstname.trim(),
            lastname: body.lastname.trim(),
            username: body.username.trim(),
            phone: body.phone ? body.phone.trim() : null,
            email: body.email.trim(),
            password: hash
        });

        user.save((err, user) => {
            if (err) throw err;

            const token = utils.generateToken(user);
            user = utils.getCleanUser(user);
            res.json({
                user: user,
                token: token
            });
        });
    });
});

router.get('/users/refresh-token', (req, res, next) => {
    let token = req.body.token || req.query.token || req.headers['x-access-token'];
    if(!token) 
        return res.status(401).json({
            error: 'Token must be passed'
        });
    
    jwt.verify(token, Buffer.from(process.env.JWT_SECRET, "base64"), (err, user) => {
        if(err) throw err;

        User.findById({
            '_id': user._id
        }, (err, user) => {
            if(err) throw err;

            var token = utils.generateToken(user);
            user = utils.getCleanUser(user);

            res.json({
                user: user,
                token: token
            });
        });
    });
});

router.get('/users/welcome', isLoggedIn, (req, res, next) => {
    const user = req.user;
    res.json({
        message: `Welcome ${user.username} !`
    });
});

module.exports = router;