const createError = require('http-errors');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const Router = require('..routes/router.js');


// Bikin instance buat express
const app = express();

app.use(express.json());

// set body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let corsOptions = {
    origin: "http://localhost:3000",
};
app.use(cors(corsOptions));

// set up router
app.use('/api', Router);

// Handling Errors
app.use((err, req, res, next) => {
    // console.log(err);
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
      message: err.message,
    });
});

// Start Server
const port = 3000;
app.listen(port, () => {
    console.log(`Server berjalan pada ${port}`);
});
