const express = require('express');
const router = express.Router();
const User = require('../model/user');

router.get('/payment', (req, res) => {
    res.render('payment');
});

router.post('/payment', (req, res) => {

});

module.exports = router; //export router as a middleware function