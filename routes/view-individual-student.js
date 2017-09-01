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
    if (req.session != null && req.session.loginDetails != null) {
        //generating csrf token
        let randomNumber = Math.floor(Math.random() * 90000) + 10000,
            csrfToken = crypto.createHash('sha512').update(randomNumber.toString()).digest('hex');
        //setting up the csrf token
        req.session._csrf = csrfToken;
        res.render('view-individual-student', {
            successMessage: req.flash('success'),
            errorMessage: req.flash('error'),
            title: 'Student Management',
            csrf_token: csrfToken
        });
    } else {
        req.flash('error', 'Invalid Session or Session Expired');
        res.redirect('/');
    }
});
module.exports = router;