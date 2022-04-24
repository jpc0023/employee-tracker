const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    // Your MySQL username,
    user: 'bootcampjpc0023',
    // Your MySQL password
    password: 'bootcamp99',
    database: 'employees'
  });

module.exports = db;