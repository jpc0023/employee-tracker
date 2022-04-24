const express = require('express');
const db = require('./db/connection');
const apiRoutes = require('./routes/apiRoutes');


const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
const res = require('express/lib/response');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware //
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// use apiroutes //
app.use('/api', apiRoutes);

// default response for other request (Not found) //
app.use((req, res) => {
    res.status(404).end();
});


// start server after DB connection //
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});


function viewAllEmployees() {
    var query = 'SELECT * FROM employee';
    db.query(query, function(err, res) {
        if (err) throw err;
        console.table('****EMPLOYEES****', res);
        promptQuestions();
    })
};

function viewAllRoles() {
    var query = 'SELECT * FROM role';
    db.query(query, function(err, res) {
        if (err) throw err;
        console.table('****ROLES****', res);
        promptQuestions();
    })
};

function viewAllDepartments() {
    var query = 'SELECT * FROM department';
    db.query(query, function(err, res) {
        if (err) throw err;
        console.table('****DEPARTMENTS****', res);
        promptQuestions();
    })
};

const addEmployee = () => {
    db.query('SELECT * FROM role', function(err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: 'first_name',
                type: 'input',
                message: 'What is the first name?'
            },
            {
                name: 'last_name',
                type: 'input',
                message: 'What is the last name?'
            },
            {
                name: 'manager_id',
                type: 'input',
                message: 'What is the manager ID?'
            },
            {
                name: 'role',
                type: 'list',
                choices: function() {
                var roles = [];
                for (let i = 0;i<res.length;i++) {
                    roles.push(res[i].title);
                }
                return roles;
            },
            message: "What is the employee role?"
            }
        ]).then(function (answer) {
            let role_id;
            for (let a = 0; a < res.length; a++) {
                if (res[a].title == answer.role) {
                    role_id = res[a].id;
                    console.log(role_id)
                }
            }
            db.query('INSERT INTO employee SET ?', {
                first_name: answer.first_name,
                last_name: answer.last_name,
                manager_id: answer.manager_id,
                role_id: role_id,
            },
            function (err) {
                if (err) throw err;
                console.log('Employee added.');
                promptQuestions();
            })
        })
    })
};

const addDepartment = () => {
    inquirer.prompt([
        {
            name: 'department',
            type: 'input',
            message: 'What department is being added?'
        }
    ]).then(function (answer) {
        db.query('INSERT INTO department SET ?', {
            name: answer.department
        });
        var query = 'SELECT * FROM department';
        db.query(query, function(err, res) {
            if (err) throw err;
            console.table('****DEPARTMENTS****', res);
            promptQuestions();
        })
    })
};

const addRole = () => {
    db.query('SELECT * FROM department', function(err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: 'new_role',
                type: 'input', 
                message: "What new role would you like to add?"
            },
            {
                name: 'salary',
                type: 'input',
                message: 'What is the salary of this role? (Enter a number)'
            },
            {
                name: 'Department',
                type: 'list',
                choices: function() {
                    var department = [];
                    for (let i = 0; i < res.length; i++) {
                    department.push(res[i].name);
                    }
                    return department;
                },
            }
        ]).then(function (answer) {
            let department_id;
            for (let a = 0; a < res.length; a++) {
                if (res[a].name == answer.Department) {
                    department_id = res[a].id;
                }
            }
            db.query(
                'INSERT INTO role SET ?',
                {
                    title: answer.new_role,
                    salary: answer.salary,
                    department_id: department_id
                });
                var query = 'SELECT * FROM role';
                db.query(query, function (err, res) {
                    if(err) throw err;
                    console.table('****ROLES****', res);
                    promptQuestions();
                })
        })
    })
};

const updateEmployeeRole = () => {
    inquirer.prompt([
        {
            name: 'employee',
            type: 'list',
            message: 'Which employee role do you want to change?',
            choices: function() {
                var employee = [];
                for (let i = 0; i < res.length; i++) {
                    employee.push(res[i].employee);
                }
                return employee;
            }
        },
            {
                name: 'role',
                type: 'list',
                choices: function() {
                var roles = [];
                for (let i = 0;i<res.length;i++) {
                    roles.push(res[i].title);
                }
                return roles;
            },
            message: "What is the employee role?"
            }
        ]).then(function (answer) {
            let role_id;
            for (let a = 0; a < res.length; a++) {
                if (res[a].title == answer.role) {
                    role_id = res[a].id;
                    console.log(role_id)
                }
            }
        db.query('UPDATE role SET ?', 
        {
            name: answer.role
        });
        var query = 'SELECT * FROM employee';
        db.query(query, function(err, res) {
            if (err) throw err;
            console.table("****EMPLOYEES****", res);
            promptQuestions();
        })
    })
};

// Questions prompt //
function promptQuestions() {
    inquirer.prompt({
            type: 'list',
            message: "What would you like to do?",
            name: 'choice',
            choices: [
                "View all employees",
                "View all roles",
                "View all departments",
                "Update employee role",
                "Add employee",
                "Add role",
                "Add department"
            ]
        }).then((answer) => {
        switch (answer.choice) {
            case "View all employees":
                viewAllEmployees();
                break;
            case "View all roles":
                viewAllRoles();
                break;
            case "View all departments":
                viewAllDepartments();
                break;
            case "Update employee role":
                updateEmployeeRole();
                break;
            case "Add employee":
                addEmployee();
                break;
            case "Add role":
                addRole();
                break;
            case "Add department":
                addDepartment();
                break;
        }
    })
};

promptQuestions();