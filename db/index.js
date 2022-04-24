const mysql = require('mysql2');
const fs = require('fs');
require('dotenv').config()

const seedQuery = fs.readFileSync('db/seeds.sql', {
    encoding: 'utf-8',
})

const connection =mysql.createConnection({
    host: 'localhost',
    user: 'bootcampjpc0023',
    password: 'bootcamp99',
    database: 'employees',
    multipleStatements: true,
})

connection.connect()
connection.query(seedQuery);