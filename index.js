require('dotenv').config(); // env 
const express = require('express');
const app = express();
const port = 3000;
const multer = require('multer');
const { Storage } = require('@google-cloud/storage'); // cloud storage
const userKey = process.env.USER_UPLOAD_KEY; // service account's key
const storage = new Storage({ keyFilename: userKey }); // authentication 

// checking img extension
const filterImg = (req, file, callback) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        callback(null, true);
    } else {
        const error = 'Invalid file type! Only JPEG and PNG files are allowed.';
        error.status = 403;
        callback(error);
    }
};

const storageImg = multer.memoryStorage(); // Use in-memory storage for multer
const uploadImg = multer({ storage: storageImg, fileFilter: filterImg });

app.set("view engine", "ejs"); // html response

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

    const blob = bucket.file(`testing/${img.originalname}`);
    const blobStream = blob.createWriteStream();

    console.log('File name:', img.originalname);
    console.log('File size:', Math.round(img.size / 1024), "KB");
    console.log('File MIME type:', img.mimetype);

    blobStream.on('error', (err) => {
        console.error(`Error uploading image: ${err.message}`);
        res.status(408).json({ error: 'Error uploading image.' });
    });

    blobStream.on('finish', () => {
        console.log(`Image uploaded to ${bucketName}.`);
        res.status(200).json({ message: 'Image uploaded successfully.' });
    });

    blobStream.end(img.buffer);
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
