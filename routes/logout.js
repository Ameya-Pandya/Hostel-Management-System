'use strict';
var express = require('express');
var router = express.Router();

let session = require('client-sessions');

router.get('/', function (req, res, next) {
    req.session.reset();
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;