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

let captchaConfig = {
	siteKey: "6LcJxS4UAAAAAAGXubPt1DjkAkVVJJvE68mpfqzS",
	secretKey: "6LcJxS4UAAAAAFhI1Dx1mEDzYQk_s21ID9Jf2w0X"
};

router.get('/', function (req, res, next) {
	res.render('login', {
		successMessage: req.flash('success'),
		errorMessage: req.flash('error')
	});
});

router.post('/', function (req, res, next) {
	var userName = entities.encode(req.body.username),
		password = entities.encode(req.body.password);
	//if captcha is not filled..
	if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
		req.flash('error', 'Captcha is required');
		res.redirect('/');
	} else {
		//if captcha is filled
		// req.connection.remoteAddress will provide IP address of connected user.
		var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + captchaConfig.secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
		// Hitting GET request to the URL, Google will respond with success or error scenario.
		request(verificationUrl, function (error, response, body) {
			body = JSON.parse(body);
			// Success will be true or false depending upon captcha validation.
			if (body.success !== undefined && !body.success) {
				//if captcha vaerification is failed
				req.flash('error', 'Captcha is not correct');
				res.redirect('/');
			} else {
				//Hard Coded UserName and Password 
				// TO Change the username or password change it here.
				if (userName == 'jRdmNKXqt3CTL6m6' && password == '88rYKthxvpEGepWz') {
					req.session.loginDetails = {
						status: true
					};
					req.flash('success', 'Login Authenticated');
					res.redirect('/dashboard');
				} else {
					req.flash('error', 'Username and Password Do Not Match');
					res.redirect('/');
				}
			}
		});
	}
});

module.exports = router;
