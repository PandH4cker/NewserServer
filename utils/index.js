const jwt = require('jsonwebtoken');
const { civilityList, expirationTime } = require('../constants/index');
const User = require('../models/user');

const generateToken = user => {
    const u = {
        civility: user.civility,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        email: user.email,
        _id: user._id.toString()
    };

    return token = jwt.sign(u, Buffer.from(process.env.JWT_SECRET, "base64"), {
        expiresIn: expirationTime // expires in 24H
    });
};

const validateSignUpForm = (values, callback) => {
    let errors = {};
    let hasErrors = false;

    if(!civilityList.includes(values.civility)) {
        errors.civility = 'Choose a valid civility';
        hasErrors = true;
    }

    if(!values.firstname || values.firstname.trim() === '') {
        errors.firstname = 'Enter a valid firstname';
        hasErrors = true;
    }

    if(!values.lastname || values.lastname.trim() === '') {
        errors.lastname = 'Enter a valid lastname';
        hasErrors = true;
    }

    if(!values.username || values.username.trim() === '') {
        errors.username = 'Enter a valid username';
        hasErrors = true;
    }

    if(!values.email || values.email.trim() === '') {
        errors.email = 'Enter a valid email';
        hasErrors = true;
    }

    if(!values.password || values.password.trim() === '') {
        errors.password = 'Enter a valid password';
        hasErrors = true;
    }

    if(!values.confirmPassword || values.confirmPassword.trim() === '') {
        errors.confirmPassword = 'Enter confirm password';
        hasErrors = true;
    }

    if(values.confirmPassword && values.confirmPassword.trim() !== '' && 
       values.password && values.password.trim() !== '' &&
       values.password !== values.confirmPassword
    ) {
        errors.matchPasswords = 'Password and Confirm password don\'t match';
        hasErrors = true;
    }

    if(callback) callback(hasErrors && errors);
    else return hasErrors && errors;
};

const getCleanUser = user => {
    if(!user) return {};

    let u = user.toJSON();
    return {
        _id: u.id,
        civility: u.civility,
        firstname: u.firstname,
        lastname: u.lastname,
        username: u.username,
        email: u.email,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt
    };
};

const isUserUnique = (body, callback) => {
    let username = body.username ? body.username.trim() : '';
    let email = body.email ? body.email.trim() : '';

    User.findOne({
        $or: [{
            'username': new RegExp(["^", username, "$"].join(""), "i")
        }, {
            'email': new RegExp(["^", email, "$"].join(""), "i")
        }]
    }, (err, user) => {
        if (err) throw err;
        if (!user && callback) {
            callback();
            return;
        }

        var err;
        if (user.username === username) {
            err = {};
            err.username = '"' + username + '" is not unique';
        }
        if (user.email === email) {
            err = err ? err : {};
            err.email = '"' + email + '" is not unique';
        }

        callback(err);
    });
}

module.exports = {
    generateToken,
    validateSignUpForm,
    getCleanUser,
    isUserUnique
}