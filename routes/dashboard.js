'use strict';
var express = require('express');
var router = express.Router();

let path = require('path'),
    winston = require('winston'),
    fs = require('fs'),
    env = process.env.NODE_ENV || 'development',
    logDir = path.join(__dirname, '../log'),
    validator = require('express-validator'),
    session = require('client-sessions'),
    crypto = require('crypto'),
    flash = require('connect-flash'),
    Entities = require('html-entities').AllHtmlEntities,
    entities = new Entities(),
    request = require('request'),
    //timeStamp format
    tsFormat = new Date().toLocaleTimeString();

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const logger = new (winston.Logger)({
    transports: [
        new (winston.transports.File)({
            filename: `${logDir}/errorLog.log`,
            timestamp: tsFormat,
            level: 'error'
        })
    ]
});

router.get('/', function (req, res, next) {
    if (req.session != null && req.session != null) {
        res.render('dashboard', {
            successMessage: req.flash('success'),
            errorMessage: req.flash('error'),
            title: 'Dashboard'
        });
    } else {
        req.flash('error', 'Invalid Session or Session Expired');
        res.redirect('/');
    }
});

module.exports = router;