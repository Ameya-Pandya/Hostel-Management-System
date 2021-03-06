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
var knex = require('knex')({
    client: 'mysql',
    connection: {
        host: 'localhost',
        user: 'Clown_Root',
        password: 'mdbEaRjhmY7537pY',
        database: 'kandi_hostel'
    },
    pool: {
        min: 1,
        max: 100
    },
    acquireConnectionTimeout: 9000 //,
    // debug: true
});

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

module.exports.add_new_student = function (studentDetails, officeDetails, documents, callback) {
    // console.log(documents);
    knex
        .transaction(function (t) {
            return knex('student_table')
                .transacting(t)
                .insert(studentDetails)
                .then(function (response) {
                    return knex('office_table')
                        .transacting(t)
                        .insert(officeDetails)
                        .then(function (result) {
                            return knex('documents_table')
                                .transacting(t)
                                .insert(documents);
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                })
                .then(t.commit)
                .catch(t.rollback);
        })
        .then(function () {
            // transaction suceeded, data written
            callback(false);
        })
        .catch(function (error) {
            // console.log('till here');
            console.log(error);
            logger.error(error);
            // transaction failed, data rolled back
            callback(true);
        });
}

module.exports.getAllStudentDetails = function (callback) {
    knex('student_table')
        .select()
        .then(result => {
            callback(false, result)
        })
        .catch(error => {
            logger.error(error);
            callback(true, null);
        })
}

module.exports.getIndividualStudentDetails = function (student_id, callback) {
    // console.log(student_id);
    knex
        .select('*')
        .from('student_table')
        .innerJoin('office_table', 'student_table.student_id', '=', 'office_table.student_id')
        .innerJoin('documents_table', 'student_table.student_id', '=', 'documents_table.student_id')
        .whereRaw('student_table.student_id = ?', [student_id])
        .then(result => {
            callback(false, result);
        })
        .catch(error => {
            console.log(error);
            logger.error(error);
            callback(true, null);
        });
}

module.exports.updateStudentDetails = function (student_id, newValues, callback) {
    knex
        .update(newValues)
        .table('student_table')
        .innerJoin('office_table', 'student_table.student_id', '=', 'office_table.student_id')
        .innerJoin('documents_table', 'student_table.student_id', '=', 'documents_table.student_id')
        .whereRaw('student_table.student_id = ?', [student_id])
        .then(result => {
            callback(false);
        })
        .catch(error => {
            console.log(error);
            logger.error(error);
            callback(true);
        });
}

module.exports.deleteStudent = function (student_id, callback) {
    knex
        .transaction(function (t) {
            return knex('student_table')
                .transacting(t)
                .del()
                .where({
                    student_id: student_id
                })
                .then(function (response) {
                    return knex('office_table')
                        .transacting(t)
                        .del()
                        .where({
                            student_id: student_id
                        })
                        .then(function (result) {
                            return knex('documents_table')
                                .transacting(t)
                                .del()
                                .where({
                                    student_id: student_id
                                })
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                })
                .then(t.commit)
                .catch(t.rollback);
        })
        .then(function () {
            // transaction suceeded, data written
            callback(false);
        })
        .catch(function (error) {
            // console.log('till here');
            console.log(error);
            logger.error(error);
            // transaction failed, data rolled back
            callback(true);
        });
}