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

var studentObj = require('../models/student-model');

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
        //getting all student records
        studentObj.getAllStudentDetails(function (error, studentRecord) {
            if (error) {
                req.flash('error', 'Error Getting the student records');
                res.render('edit-student', {
                    successMessage: req.flash('success'),
                    errorMessage: req.flash('error'),
                    title: 'Student Management',
                    student_records: null
                });
            } else {
                res.render('edit-student', {
                    successMessage: req.flash('success'),
                    errorMessage: req.flash('error'),
                    title: 'Student Management',
                    student_records: studentRecord
                });
            }
        });
    } else {
        req.flash('error', 'Invalid Session or Session Expired');
        res.redirect('/');
    }
});

router.post('/get-student-details', function (req, res, next) {
    if (req.session != null && req.session.loginDetails != null) {
        // console.log(req.body);
        var student_id = entities.encode(req.body.studentId);
        //generating csrf token
        let randomNumber = Math.floor(Math.random() * 90000) + 10000,
            csrfToken = crypto.createHash('sha512').update(randomNumber.toString()).digest('hex');
        studentObj.getIndividualStudentDetails(student_id, function (error, studentDetails) {
            if (error) {
                res.json({
                    success: false,
                    msg: 'Error Occured During the Search',
                    student_details: null
                });
            } else {
                // console.log(studentDetails);
                studentDetails[0]._csrf = csrfToken;
                //setting up the csrf token
                req.session._csrf = csrfToken;
                res.json({
                    success: true,
                    msg: 'Student Record Found',
                    student_details: studentDetails[0]
                });
            }
        })
    } else {
        req.flash('error', 'Invalid Session or Session Expired');
        res.redirect('/');
    }
    // res.json({
    //     success: true
    // });
});

router.post('/update-student', function (req, res, next) {
    if (req.session != null && req.session.loginDetails != null) {
        // console.log(req.body);
        if (req.session._csrf == req.body._csrf) {
            var data = req.body;
            var studentId = data.student_id;
            delete data.student_id;
            delete data._csrf;
            var updateData = {};
            for (var key in data) {
                updateData[key] = entities.encode(data[key]);
            }
            // console.log(updateData);
            studentObj.updateStudentDetails(studentId, updateData, function (err) {
                if (err) {
                    res.json({
                        success: false,
                        msg: 'Error Updating the Data'
                    });
                } else {
                    res.json({
                        success: true,
                        msg: 'Data Updated Successfully'
                    });
                }
            });
        } else {
            res.json({
                success: false,
                msg: 'Invalid token'
            });
        }
    } else {
        res.json({
            success: false,
            msg: 'Invalid Session. Please Re-Login'
        });
    }
});

router.post('/delete-student', function (req, res, next) {
    if (req.session != null && req.session.loginDetails != null) {
        var student_id = req.body.studentId;
        studentObj.deleteStudent(student_id, function (isError) {
            if (isError == true) {
                res.json({
                    success: false,
                    msg: 'Error Deleting the Data'
                });
            } else {
                res.json({
                    success: true,
                    msg: 'Student Record Deleted Successfully'
                });
            }
        });
    } else {
        res.json({
            success: false,
            msg: 'Invalid Session. Please Re-Login'
        });
    }
})
module.exports = router;