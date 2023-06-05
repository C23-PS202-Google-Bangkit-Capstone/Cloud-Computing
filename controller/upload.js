require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');

const userKey = process.env.USER_UPLOAD_KEY;
const storage = new Storage({ keyFilename: userKey });

const filterImg = (req, file, callback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    const error = 'Invalid file type! Only JPG/JPEG and PNG files are allowed.';
    error.status = 403;
    callback(error);
  }
};

const maxSize = 2 * 1024 * 1024; // 2MB
const storageImg = multer.memoryStorage();
const uploadImg = multer({ storage: storageImg, fileFilter: filterImg, limits: { fileSize: maxSize } });

const app = express();

app.set("view engine", "ejs");

app.get('/upload', (req, res) => {
  res.render("upload");
});

app.post('/upload', uploadImg.single('image'), (req, res) => {
  const img = req.file;

  if (!img) {
    res.status(400).send('No file uploaded.');
    return;
  }

  const bucketName = process.env.BUCKET_NAME;
  const bucket = storage.bucket(bucketName);

  const blob = bucket.file(`upload/${img.originalname}`);
  const blobStream = blob.createWriteStream();

  console.log('File name:', img.originalname, img.mimetype);
  console.log('File size:', Math.round(img.size / 1024), "KB");

  blobStream.on('error', (err) => {
    console.error(`Error uploading image: ${err.message}`);
    res.status(408).json({ error: 'Error uploading image.' });
  });

  blobStream.on('finish', () => {
    console.log(`Image uploaded to ${bucketName}.`);
    res.status(200).json({
      message: 'Image uploaded successfully.',
      imgName: img.originalname,
      type: img.mimetype,
    });
  });

  blobStream.end(img.buffer);
});

module.exports = app;
