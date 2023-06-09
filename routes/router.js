const express = require('express');
const router = express.Router();
const db = require('../config/connection.js');
const { signupValidation, loginValidation } = require('../middleware/validation.js');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const util = require('util');
const dbQuery = util.promisify(db.query).bind(db);


//REGISTER
router.post('/register', signupValidation, async (req, res) => {
    try {
        const username = req.body.username;
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

        const insertUserQuery = `INSERT INTO user (username, email, password, phone_number, location) VALUES ('${username}','${email}', '${hashedPassword}', '${phone_number}', '${location}')`;
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

//LOGIN
router.post('/login', loginValidation, async (req, res) => {
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
        //Checking password dan hash 
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
    const recipename = req.query.recipe_name;
    const sort = req.query.sort || 'recipe_name';
    const sortOrder = req.query.sortOrder || 'ASC';
    const pageSize = 5;
    const currentPage = parseInt(req.query.page) || 1;
    const offset = (currentPage - 1) * pageSize;

    const sqlQuery = `SELECT * FROM recipe WHERE recipe_name LIKE "%${recipename}%" ORDER BY ${sort} ${sortOrder} LIMIT ${pageSize} OFFSET ${offset}`;

    const result = await new Promise((resolve, reject) => {
      db.query(sqlQuery, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });

    const listRecipe = result.map(recipe => ({
      id: recipe.recipe_id,
      name: recipe.recipe_name,
      location: recipe.location,
      description: recipe.recipe_detail,
      photoUrl: recipe.recipe_img
    }));

    const response = {
      error: false,
      message: "Recipes fetched successfully",
      listRecipe: listRecipe
    };

    return res.send(response);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});



//Lihat semua data recipe
router.get("/getRecipeData", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 3;
        const offset = (page - 1) * limit;

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

        const listRecipe = await Promise.all(result.map(async (recipe) => {
            return {
                id: recipe.recipe_id,
                name: recipe.recipe_name,
                location: recipe.location,
                description: recipe.recipe_detail,
                photoUrl: recipe.recipe_img, 
            };
        }));

        const response = {
            error: false,
            message: "Recipes fetched successfully",
            listRecipe: listRecipe,
        };

        return res.send(response);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            msg: 'Internal server error'
        });
    }
});

//Menampilkan Additional Information
router.get("/getAdditionaldata", async (req, res) => {
    try {
        const fruitId = req.query.fruit_id
        const sqlQuery = `SELECT detail FROM information WHERE fruit_id = "${fruitId}"`; 
        const result = await new Promise((resolve, reject) => {
            db.query(sqlQuery, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
          });
        const response = {
            message: "Detail fetched successfully",
            Description :result[0],
        };
        return res.send(response);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

//Display Recipe di akun
router.get("/DisplayRecipe", async (req, res) => {
    try {
        const recipeloc = req.query.location
        const page = parseInt(req.query.page) || 1;
        const limit = 3;
        const offset = (page - 1) * limit;

        const sqlQuery = `SELECT * FROM recipe WHERE location = "${recipeloc}" LIMIT ${limit} OFFSET ${offset}`;

        const result = await new Promise((resolve, reject) => {
            db.query(sqlQuery, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        const listRecipe = await Promise.all(result.map(async (recipe) => {
            return {
                id: recipe.recipe_id,
                name: recipe.recipe_name,
                location: recipe.location,
                description: recipe.recipe_detail,
                photoUrl: recipe.recipe_img, 
            };
        }));

        const response = {
            error: false,
            message: "Recipes fetched successfully",
            listRecipe: listRecipe,
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
