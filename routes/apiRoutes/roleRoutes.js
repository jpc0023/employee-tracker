const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

router.get('/roles', (req, res) => {
    const sql = `SELECT * FROM role`;
    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

router.get('/role:id', (req, res) => {
    const sql = `SELECT role.*, role.title
        as role_title
        FROM role 
        LEFT JOIN role
        on employee.role_title = role.title
        WHERE emploee.id = ?`;
    const params = [req.params.id];
    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

router.put('/role/:id', (req, res)=>{
    const sql = `UPDATE role SET name WHERE id = ?
            WHERE id = ?`
    const params = [req.body.role, req.params.id];
    db.query(sql, params, (err, result)=>{
        if (err) {
            res.status(400).json({ error: err.message });
            // check if a record was found //
        } else if (!result.affectedRows) {
            res.json({
                message: `Department not found`
            });
        } else {
            res.json({
                message: 'success',
                data: req.body,
                changes: result.affectedRows
            });
        }
    });
});

module.exports = router;