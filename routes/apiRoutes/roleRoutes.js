const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

 router.get('/employees', (req, res) => {
     const sql = `SELECT employees.*, `
 })





module.exports = router;