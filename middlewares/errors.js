const errorPage = (req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
};

const errorHandler = (err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500);
    if(err.status === 500) {
        console.error(err.stack);
        res.json({
            error: 'Internal Server Error'
        });
    } else if (err.status === 404) {
        res.json({
            error: '404 - Not Found'
        });
    } else {
        res.json({
            error: err.message
        });
    }
};

module.exports = {
    errorPage,
    errorHandler
}