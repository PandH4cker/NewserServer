const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { isAuthenticated } = require("./middlewares/isAuthenticated");
const { errorPage, errorHandler } = require('./middlewares/errors');

const routes = require('./routes/index');
const users = require('./routes/users');


const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Request-Headers', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(isAuthenticated);
app.use('/', routes);
//app.use('/api/', users);
app.use(errorPage);
app.use(errorHandler);

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost:27017/newser', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connection to MongoDB established..'))
.catch(() => console.error.bind(console, 'Connection error:'));

module.exports = app;