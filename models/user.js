const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;
const { civilityList } = require('../constants/index');

const userSchema = new Schema({
    civility: {
        type: String,
        enum: civilityList,
        required: true
    },
    firstname: {
        type: String,
        match: /^([A-Za-z])([a-zA-Z]|\s[A-Za-z])+/gm,
        lowercase: true,
        required: true
    },
    lastname: {
        type: String,
        match: /^([A-Za-z])([a-zA-Z]|\s[A-Za-z])+/gm,
        lowercase: true,
        required: true
    },
    username: {
        type: String,
        match: /^[A-Za-z0-9]+(?:[_-][A-Za-z0-9]+)*$/gm,
        required: true
    },
    phone: {
        type: String,
        match: /^(?:0|\(?\+33\)?\s?|0033\s?)[1-79](?:[\.\-\s]?\d\d){4}$/,
        required: false
    },
    email: {
        type: String,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gm,
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.plugin(timestamps);

module.exports = mongoose.model('User', userSchema);