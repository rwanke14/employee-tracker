const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table')


const port = 3306

const connection = mysql.createConnection({
    host: 'localhost',


    port: 3306,


    user: 'root',


    password: 'password',
    database: 'employeesDB',

});

connection.connect((err) => {

    if (err) throw err;
    runApp()

});

const runApp = () => {

    inquirer
        .prompt({
            name: 'start',
            type: 'list',
            message: 'What do you want to do in the employee database?',
            choices: [
                'Add a deparment.',
                'Add a role.',
                'Add an employee.',
                'View all departments.',
                'View all roles.',
                'View employees',
                'View all employees.',
                'Update employee roles.',
                'Update employee manager.',
                'View employee by manager.',
                'Delete a department.',
                'Delete a role.',
                'Delete an employee',
                'View the total utilized budget of a department',
                'Exit'
            ],
        })
        .then((answer) => {
            const todo = answer.start
            switch (todo) {

                case 'Add a deparment.':
                    console.log('department')
                    addDepartment(Adddata)
                    break;

                case 'Add a role.':
                    addRole(Adddata)
                    break;

                case 'Add an employee.':
                    addEmployee(Adddata)
                    break;

                case 'View all departments.':
                    viewDepartment()
                    break;

                case 'View all roles.':
                    viewRoles()
                    break;

                case 'View employees':
                    viewEmployees()
                    break;

                case 'View all employees.':
                    viewAllEmployees()
                    break;

                case 'Update employee roles.':
                    updateRole()
                    break;

                case 'Update employee manager.':
                    updateManager()
                    break;

                case 'View employee by manager.':
                    viewManager()
                    break;

                case 'Delete a department.':
                    deleteDepartment()
                    break;

                case 'Delete a role.':
                    deleteRole()
                    break;

                case 'Delete an employee':
                    deleteEmployee()
                    break;

                case 'View the total utilized budget of a department':
                    budget()
                    break;

                case 'Exit':
                    stopApp();
                    break;

                // default:
                //     console.log('No such action available.')
                //     break;
            }

        });

}


const addDepartment = () => {

    inquirer
        .prompt({
            name: 'department',
            type: 'input',
            message: 'What is the department name?',
        })
        .then((answer) => {
            const query = connection.query('INSERT INTO departments SET ?',
                {
                    department: answer.department,
                },
                (err, res) => {
                    if (err) throw err;

                    console.table(res)

                    runApp();
                });
        });

}


const addRole = () => {

    inquirer
        .prompt([
            {
                name: 'title',
                type: 'input',
                message: 'What is the title for this role?',
            },
            {
                name: 'salary',
                type: 'input',
                message: 'What is the salary for this role?',
            },
            {
                name: 'departmentid',
                type: 'input',
                message: 'What is the department id for this role?',
            }
        ])
        .then((answer) => {
            const query = connection.query('INSERT INTO roles SET ?',
                {
                    title: answer.title,
                    salary: answer.salary,
                    department_id: answer.departmentid,
                },
                (err, res) => {
                    if (err) throw err;

                    console.table(res)

                    runApp();
                });
        });


}


const addEmployee = () => {

    inquirer
        .prompt([
            {
                name: 'firstname',
                type: 'input',
                message: "What is the employee's first name?",
            },
            {
                name: 'lastname',
                type: 'input',
                message: "What is the employee's last name?",
            },
            {
                name: 'role',
                type: 'list',
                message: "What is the employee's role?",
                choices
            },
            {
                name: 'manager',
                type: 'list',
                message: "Who is the employee's manager?",
            }
        ])
        .then((answer) => {

            const query = connection.query('INSERT INTO employee SET ?',
                {
                    first_name: answer.firstname,
                    last_name: answer.lastname,
                    role_id: answer.roleid,
                    manager_id: answer.managerid
                },
                (err, res) => {
                    if (err) throw err;
                    //console.table(res)
                    res.forEach(({ title, salary, department_id }) => {
                        console.table(
                            `Position: ${title} || Salary: ${salary} || Department ID: ${department_id}`
                        );
                    });

                    runApp();
                });
        });

}

const viewDepartment = () => {

    connection.query(
        'SELECT department FROM departments ORDER BY departments.id',
        (err, res) => {
            if (err) throw err;
            console.table(res)
            runApp();
        }


    );

}

const viewRoles = () => {

    connection.query(
        'SELECT title, salary, department_id FROM roles',
        (err, res) => {
            if (err) throw err;
            console.table(res)
            runApp();
        });
}

//This is just a list of the employees table, not a full list.
const viewEmployees = () => {

    connection.query(
        'SELECT first_name, last_name, role_id, manager_id FROM employee',
        (err, res) => {
            if (err) throw err;
            console.table(res)
            runApp();
        });
}

const viewEmpManger = () => {

    connection.query(
        'SELECT first_name, last_name, role_id, manager_id FROM employee',
        (err, res) => {
            if (err) throw err;
            console.table(res)
            runApp();
        });
}

//This is a full employee list joining all three tables.
const viewAllEmployees = () => {

    let query =
        'SELECT employee.id, employee.first_name, employee.last_name, roles.title, roles.salary, departments.department ';
    query +=
        'FROM employee INNER JOIN roles ON (roles.id = employee.role_id ) '; //Roles connect to Role ID //Manager connects to managerID
    query +=
        'INNER JOIN departments ON (departments.id = roles.department_id) '; //Roles connect to department ID

    connection.query(
        query, (err, res) => {
            if (err) throw err;
            console.table(res)

            runApp();
        }
    );


}


const updateRole = () => {
    connection.query('SELECT * FROM employee', (err, res) => {
        console.log(res)
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: 'selectrole',
                    type: 'list',
                    message: "Which employee's role would you like to update?",
                    choices() {
                        const roleArray = [];
                        res.forEach(({ id, first_name, last_name }) => {
                            roleArray.push(id + '. ' + first_name + ' ' + last_name);
                        });
                        return roleArray;
                    }
                },
            ])
            .then((answer) => {
                console.log(answer);

                let employeeId = answer.selectrole.split(".")[0]
                console.log(employeeId)

                let changeEmployee = answer.selectrole
                connection.query('SELECT * FROM roles', (err, res) => {
                    inquirer
                        .prompt([
                            {
                                name: 'role',
                                type: 'list',
                                message: "What is the employee's new role?",
                                choices() {
                                    const roleArray = [];
                                    res.forEach(({ id, title }) => {
                                        roleArray.push(id + '. ' + title);
                                    });
                                    return roleArray;
                                }
                            },
                        ])
                        .then((answer) => {
                        console.log(answer)
                        let newRole = answer.role
                        let roleId = answer.role.split(".")[0]
                        console.log(roleId)
                        connection.query(
                            'UPDATE employee SET role_id=? WHERE id=?', [roleId,employeeId]
                            //'UPDATE employee, roles SET ? WHERE employees.role_id = roles.id',
                           //[newRole]
                           , (err, res) => {
                                if (err) throw err;
                                console.table(res)
                    
                                runApp();
                            }
                        );
            
            
                        });
            
                });


            })

    })


}


// updateManager()
    'UPDATE employee SET manager_id=? WHERE id=?'
    //need to select employee and new employee manager then update employee manager id









// viewManager()
// deleteDepartment()
// deleteRole()
// deleteEmployee()
// budget()
// stopApp();

