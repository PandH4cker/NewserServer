const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.json({
        message: 'Make POST request to /auth to authenticate'
    });
});

module.exports = router;