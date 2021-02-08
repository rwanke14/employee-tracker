USE employeesDB

INSERT INTO departments (department)
VALUES
    ('Legal'), 
    ('Web Development'), 
    ('Marketing'), 
    ('Operations'),  
    ('Communications');




INSERT INTO roles (title, salary, department_id)
VALUES 
    ('Attorney', 120000, 1),
    ('Paralegal', 70000, 1)
    ('Software Engineer', 110000, 2),
    ('Account Manager', 150000, 3),
    ('Operations Manager', 80000, 4),
    ('Security Officer', 50000, 4),
    ('Designer', 80000, 5);



INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Alice', 'James', 1, NULL),
('Bob', 'Jones', 2, 1),
('Ricky', 'Zales', 4, 1),
('Zoey', 'Lane', 3, NULL),
('Lacey', 'Christian', 5, NULL)
('Jimmy', 'McKinely', 6, 5)
('Alexa', 'Zane', 7, 4)