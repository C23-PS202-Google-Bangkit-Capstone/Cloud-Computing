const createError = require('http-errors');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Router = require('./routes/router');
const uploadApp = require('./controller/upload');

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let corsOptions = {
  origin: "*", 
};
app.use(cors(corsOptions));

app.use('/api', Router);

app.use('/upload', uploadApp);

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  res.status(err.statusCode).json({
    message: err.message,
  });
});

app.listen(port, () => {
  console.log(`Server berjalan pada port ${port}`);
});
