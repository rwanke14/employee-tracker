USE employeesDB

INSERT INTO departments (departments)
VALUES
    ('Legal'), 
    ('Web Development'), 
    ('Development'), 
    ('Marketing'), 
    ('Operations'), 
    ('Security'), 
    ('Communications'), 
    ('Research') 



INSERT INTO roles (title, salary, department_id)
VALUES 
    ('Attorney', 120,000, 1),
    ('Software Engineer', 110,000, 2),
    ('Account Manager', 150,000, 3),
    ('Operations Manager', 80,000, 5),
    ('Security Officer', 50,000, 6),
    ('Copywriter', 55,000, 7),
    ('Data Analyst', 60,000, 8),
    ('Brand Marketing Manager', 90,000, 4)


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Alice', 'James', 1)
('Bob', 'Jones', 2, 1)
('Ricky', 'Zales', 3, 2)
('Zoey', 'Lane', 4, 3)
('Lacey', 'Christian', 5)