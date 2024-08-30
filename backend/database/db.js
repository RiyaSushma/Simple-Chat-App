const express = require('express');
const mysql = require('mysql');
const app = express();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'chat_app',
    port: 3306
});

db.connect((err) => {
    if(err) {
        console.log(err);
    };
    console.log('Connected to Mysql');
});

module.exports = db;