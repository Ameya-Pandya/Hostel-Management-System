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
    tsFormat = new Date().toLocaleString(),
    dateVar = new Date(),
    fileDate = dateVar.getDay() + '-' + dateVar.getMonth() + '-' + dateVar.getFullYear();

var studentModel = require('../models/student-model');

var multer = require('multer');

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
        res.render('add-student', {
            successMessage: req.flash('success'),
            errorMessage: req.flash('error'),
            title: 'Student Management',
            token: csrfToken
        });
    } else {
        req.flash('error', 'Invalid Session or Session Expired');
        res.redirect('/');
    }
});

router.post('/new-student', function (req, res, next) {
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, '../uploads'))
        },
        filename: function (req, file, cb) {
            var ext = path.extname(file.originalname)
            if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
                return cb(res.end('Only images are allowed'), null)
            } else {
                cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
            }
        }
    }),
        upload = multer({ storage: storage }).any();
    upload(req, res, function (err) {
        if (req.session != null && req.session.loginDetails != null) {
            //session is valid, check csrf code
            // console.log(req.files);
            // console.log('\n\n' + req.session._csrf);
            if (entities.encode(req.body._csrf) == req.session._csrf) {
                //generate Student Id
                var randomNumber = Math.floor(Math.random() * 90000) + 10000,
                    student_id = crypto.createHash('sha512').update(entities.encode(req.body.student_name) + randomNumber.toString()).digest('hex'),
                    admission_date = entities.encode(req.body.admission_date),
                    student_name = entities.encode(req.body.student_name),
                    room_no = entities.encode(req.body.room_number);
                //get all the data
                var studentDetails = ({
                    student_id: student_id,
                    student_name: student_name,
                    college_name: entities.encode(req.body.college_name),
                    branch_name: entities.encode(req.body.branch),
                    college_roll: entities.encode(req.body.roll_no),
                    permanent_address: entities.encode(req.body.permanent_address),
                    correspondence_address: entities.encode(req.body.correspondence_address),
                    parent_contact: entities.encode(req.body.parent_contact),
                    student_contact: entities.encode(req.body.student_contact),
                    room_no: room_no,
                });
                var officeDetails = ({
                    student_id: student_id,
                    admission_date: admission_date,
                    next_payment_date: admission_date,
                    rent_finalized: entities.encode(req.body.rent_amount),
                    rent_balance: entities.encode(req.body.rent_amount),
                    rent_duration: entities.encode(req.body.payment_duration)
                });
                var documents = ({
                    student_id: student_id,
                    student_photo: req.files[0].filename,
                    aadhar_card_photo: req.files[1].filename,
                    college_id_photo: req.files[2].filename,
                });
                // console.log(studentDetails, officeDetails, documents);
                // Inserting the data
                studentModel.add_new_student(studentDetails, officeDetails, documents, function (error) {
                    if (error == true) {
                        req.flash('error', 'Error Inserting the Data');
                        res.redirect('/add-student');
                    } else {
                        req.flash('success', 'Data Inserted Successfully');
                        res.redirect('/add-student');
                    }
                });
            } else {
                req.flash('error', 'Invalid Token');
                res.redirect('/add-student');
            }
        } else {
            req.flash('error', 'Invalid Session or Session Expired');
            res.redirect('/');
        }
    });
});
module.exports = router;