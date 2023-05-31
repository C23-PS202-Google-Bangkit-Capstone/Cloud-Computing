const express = require('express');
const router = express.Router();
const db = require('./connection');
const { signupValidation, loginValidation } = require('./validation');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const util = require('util');
const dbQuery = util.promisify(db.query).bind(db);


//REGISTER
router.post('/register', signupValidation, (req, res, next) => {
    db.query(
        `SELECT * FROM user WHERE LOWER(email) = LOWER('${req.body.email}')`,
        (err, result) => {
            if (result.length > 0) {
                return res.status(409).send({
                    msg: 'Akun sudah terdaftar!'
                });
            } else {
                // username is available
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).send({
                            msg: 'Gagal melakukan hashing password.'
                        });
                    }
                    db.query(
                        `INSERT INTO user (email, password, phone_number, location) VALUES ('${req.body.email}', '${hash}', '${req.body.phone_number}', '${req.body.location}')`,
                        (err, result) => {
                            if (err) {
                                console.log(err);
                                return res.status(400).send({
                                    msg: 'Gagal melakukan register.'
                                });
                            }
                            return res.status(201).send({
                                msg: 'User berhasil terdaftar'
                            });
                        }
                    );
                });
            }
        }
    );
});

//lOGIN 
router.post('/login', loginValidation, async (req, res, next) => {
    try {
        const queryResult = await new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM user WHERE email = '${req.body.email}'`,
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            );
        });

        if (!queryResult.length) {
            return res.status(401).send({
                msg: 'Email or password is incorrect!'
            });
        }

        const passwordMatch = await new Promise((resolve, reject) => {
            bcrypt.compare(
                req.body.password,
                queryResult[0]['password'],
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            );
        });

        if (!passwordMatch) {
            return res.status(401).send({
                msg: 'Email or password is incorrect!'
            });
        }

        const token = jwt.sign({ id: queryResult[0].id }, 'the-super-strong-secret', { expiresIn: '1h' });

        return res.status(200).send({
            msg: 'Logged in!',
            token,
            user: queryResult[0]
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            msg: 'Internal server error'
        });
    }
});

//Search
router.get("/search", async (req, res) => {
    try {
        const receiptname = req.query.receipt_name; 
        const sqlQuery = `SELECT * FROM resep WHERE receipt_name = "${receiptname}"`;
        const result = await new Promise((resolve, reject) => {
            db.query(sqlQuery, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
        return res.send(result);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            msg: 'Internal server error'
        });
    }
});


module.exports = router;