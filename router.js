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
router.post('/register', signupValidation, async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const phone_number = req.body.phone_number;
        const location = req.body.location;

        const checkEmailQuery = `SELECT * FROM user WHERE LOWER(email) = LOWER('${email}')`;
        const existingUser = await new Promise((resolve, reject) => {
            db.query(checkEmailQuery, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        if (existingUser.length > 0) {
            return res.status(409).send({
                msg: 'Akun sudah terdaftar!'
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const insertUserQuery = `INSERT INTO user (email, password, phone_number, location) VALUES ('${email}', '${hashedPassword}', '${phone_number}', '${location}')`;
        await new Promise((resolve, reject) => {
            db.query(insertUserQuery, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        return res.status(201).send({
            msg: 'User berhasil terdaftar'
        });
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            msg: 'Gagal melakukan register.'
        });
    }
});

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
                queryResult[0]['Password'],
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
        const recipename = req.query.recipe_name; // Use req.query instead of req.params for query parameters
        const sqlQuery = `SELECT * FROM recipe WHERE recipe_name = "${recipename}"`;
        const result = await new Promise((resolve, reject) => {
            db.query(sqlQuery, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
        return res.send(result);
    } catch (err) {
        console.error(err); // Log the error instead of throwing it
        return res.status(500).json({ error: "Internal server error" }); // Return an error response
    }
});

//Lihat semua data recipe
router.get("/getRecipeData", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter, default to page 1 if not provided
        const limit = 3; // Number of items per page
        const offset = (page - 1) * limit; // Calculate the offset based on the current page

        const sqlQuery = `SELECT * FROM recipe LIMIT ${limit} OFFSET ${offset}`;

        const result = await new Promise((resolve, reject) => {
            db.query(sqlQuery, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        const listRecipe = result.map((recipe) => ({
            id: recipe.recipe_id,
            name: recipe.recipe_name,
            location: recipe.location,
            description: recipe.recipe_detail,
        }));

        const response = {
            message: "Recipes fetched successfully",
            listStory: listRecipe,
        };

        return res.send(response);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            msg: 'Internal server error'
        });
    }
});


module.exports = router;