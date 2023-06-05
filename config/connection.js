var mysql = require('mysql');

//buat koneksi database
const conn = mysql.createConnection({
    instanceName: 'freshcheck-c23-ps202f:asia-southeast2:freshcheck-db', // your socket connection path
    credentials: './credentials/user-upload.json',
    host: '34.101.96.86', // Your ip host
    user: 'root', // Your username
    password: 'freshcheck', // Your password
    database: 'fresh_db' // Your database name
});

conn.connect((err)=>{
    if(err) throw err;
    console.log('Mysql terkoneksi');
});

module.exports = conn;
