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
    console.log('You are connected on local host 3306')
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

//View employees by manager.
const viewManager = () => {
    
    let query = 
    "SELECT "
    query +=
    'CONCAT(m.first_name, " ",m.last_name) AS Employee, '
    query += 
    "CONCAT(e.first_name, ' ',e.last_name) AS Manager "
    query +=
    "FROM employee m LEFT JOIN employee e "
    query += 
    "ON m.manager_id = e.id "
    query += 
    "ORDER BY m.manager_id "
    
    connection.query(
        query,
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
                                'UPDATE employee SET role_id=? WHERE id=?', [roleId, employeeId]

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


const updateManager = () => {

    connection.query('SELECT * FROM employee', (err, res) => {
        console.log(res)
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: 'employee',
                    type: 'list',
                    message: "Which employee's manager do you want to change?",
                    choices() {
                        console.log('Hi!')
                        const employArray = [];
                        console.log(employArray)
                        res.forEach(({ id, first_name, last_name }) => {
                            employArray.push(id + '. ' + first_name + ' ' + last_name);
                        });
                        return employArray;
                    }
                },
            ])
            .then((answer) => {
                console.log(answer);

                let employId = answer.employee.split('. ')[0]
                console.log(employId)

                connection.query('SELECT * FROM employee', (err, res) => {
                    inquirer
                        .prompt([
                            {
                                name: 'manager',
                                type: 'list',
                                message: "Who is the employee's new manager?",
                                choices() {
                                    const managerArray = [];
                                    res.forEach(({ id, first_name, last_name }) => {
                                        managerArray.push(id + '. ' + first_name + ' ' + last_name);
                                    });
                                    return managerArray;
                                }
                            },
                        ])
                        .then((answer) => {

                            console.log(answer)
                            let managerId = answer.manager.split(".")[0]
                            console.log(managerId)
                            connection.query(
                                'UPDATE employee SET manager_id=? WHERE id=?', [managerId, employId]
                                , (err, res) => {
                                    if (err) throw err;
                                    console.table(res)

                                    runApp();
                                }
                            );


                        });

                });

            });

    })



}



const deleteDepartment = () => {
    connection.query('SELECT * FROM departments', (err, res) => {
        console.log(res)
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: 'removedepart',
                    type: 'list',
                    message: "Which department would you like to remove?",
                    choices() {
                        console.log('Hi!')
                        const departArray = [];
                        console.log(departArray)
                        res.forEach(({ id, department }) => {
                            departArray.push(id + '. ' + department);
                        });
                        return departArray;
                    }
                },
            ])
            .then((answer) => {
                console.log(answer);

                let departmentId = answer.removedepart.split('. ')[0]
                console.log(departmentId)


                connection.query('DELETE FROM departments WHERE departments.id = ? ', [departmentId], (err, res) => {
                    if (err) throw err;
                    console.log('Department removed successfully!')

                    runApp();

                });

            });

    })

}




const deleteRole = () => {

    connection.query('SELECT * FROM roles', (err, res) => {
        console.log(res)
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: 'role',
                    type: 'list',
                    message: "Which role do you want to remove?",
                    choices() {
                        console.log('Hi!')
                        const roleArray = [];
                        console.log(roleArray)
                        res.forEach(({ id, title }) => {
                            roleArray.push(id + '. ' + title);
                        });
                        return roleArray;
                    }
                },
            ])
            .then((answer) => {
                console.log(answer);

                let roletId = answer.role.split('. ')[0]
                console.log(roletId)


                connection.query('DELETE FROM roles WHERE roles.id = ? ', [roletId], (err, res) => {
                    if (err) throw err;
                    console.log('Role removed successfully!')

                    runApp();

                });

            });

    })


}

const deleteEmployee = () => {

    connection.query('SELECT * FROM employee', (err, res) => {
        console.log(res)
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: 'employee',
                    type: 'list',
                    message: "Which role do you want to remove?",
                    choices() {
                        console.log('Hi!')
                        const employeeArray = [];
                        console.log(employeeArray)
                        res.forEach(({ id, first_name, last_name }) => {
                            employeeArray.push(id + '. ' + first_name + ' ' + last_name);
                        });
                        return employeeArray;
                    }
                },
            ])
            .then((answer) => {
                console.log(answer);

                let employeeId = answer.employee.split('. ')[0]
                console.log(employeeId)


                connection.query('DELETE FROM employee WHERE employee.id = ? ', [employeeId], (err, res) => {
                    if (err) throw err;
                    console.log('Employee removed successfully!')

                    runApp();

                });

            });

    })


}


// budget()

//Stops connection and exits prompts when exit is selected. 

const stopApp = () => {

    connection.end()


};

