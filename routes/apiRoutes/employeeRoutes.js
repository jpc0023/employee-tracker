const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

router.get('/employees', (req, res) => {
    const sql = `SELECT employee.*, role.title
            AS role_title
            FROM employee
            LEFT JOIN role
            ON  employee.role_id = role.id`;

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

router.get('/employee/:id', (req, res)=>{
    const sql = `SELECT employee.*, role.title 
             AS role_title 
             FROM employee 
             LEFT JOIN role 
             ON employee.role_id = role.id 
             WHERE employee.id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, row)=>{
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

router.delete('/employee/:id', (req, res)=>{
    const sql = `DELETE FROM employee WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, result)=>{
        if (err) {
            res.statusMessage(400).json({ error: res.message});
        } else if (!result.affectedRows) {
            res.json({
                message: 'Employee not found'
            });
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});

// Create an employee //
router.post('/employee', ({ body }, res)=>{
    const sql = `INSERT INTO employee (first_name, last_name, role_id)
        VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.role_id];

    db.query(sql, params, (err, result)=>{
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    });
});

// Update an employee's role //
router.put('/employee/:id', (req, res)=>{
    const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
    const params = [req.body.employee, req.params.id];
    db.query(sql, params, (err, result)=>{
        if (err) {
            res.status(400).json({ error: err.message });
            // check if a record was found //
        } else if (!result.affectedRows) {
            res.json({
                message: `Employee not found`
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