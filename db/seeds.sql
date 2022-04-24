INSERT INTO department (name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');

INSERT INTO role (title, salary, department_id)
VALUES
    ('Salesperson', 80000, 1),
    ('Linesman', 120000, 2),
    ('Official', 4000, 3);

INSERT INTO employee (first_name, last_name, role_id)
VALUES
    ('John', 'Smith', '1'),
    ('Sue', 'Jackson', '3');

