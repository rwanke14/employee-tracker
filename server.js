const mysql = require('mysql');
const inquirer = require('inquirer');


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
                    addDepartment()
                    break;

                case 'Add a role.':
                    addRole()
                    break;

                case 'Add an employee.':
                    addEmployee()
                    break;

                case 'View all departments.':
                    viewDepartment()
                    break;

                case 'View all roles.':
                    viewRoles()
                    break;

                case 'View all employees.':
                    viewEmployee()
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
            name: 'newdepartment',
            type: 'input',
            message: 'What is the department name?',
        })
        .then((answer) => {
            // const newDepartment = answer.newdepartment
            const query = 'INSERT INTO departments VALUES ?';
            const newDepartment = answer.newdepartment
            connection.query(query, [newDepartment], (err, res) => {
                //console.log(newDepartment)
                console.log(res)

                res.forEach(({ department }) => {
                    console.log(
                        `Department: ${department}`
                    );
                });

                runApp();
            });
        });

}


const addRole = () => {

    inquirer
        .prompt({
            name: 'newRole',
            type: 'input',
            message: 'What is the name of the role?',
        })
        .then((answer) => {
            const query =
                'INSERT INTO roles (title) VALUES ?';
            connection.query(query, [answer.newRole], (err, res) => {
                res.forEach(({ title }) => {
                    console.log(
                        `Department: ${title}`
                    );
                });

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
                name: 'roleid',
                type: 'input',
                message: "What is the employee's role id?",
            },
            {
                name: 'managerid',
                type: 'input',
                message: "If the employee is a manager, what is their id?",
            }
        ])
        .then((answer) => {
            const query =
                'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ?';
            const firstName = answer.firstName;
            const lastName = answer.lastname;
            const roleId = answer.roleid;
            const managerId = answer.managerid;
            connection.query(query, [firstName, lastName, roleId, managerId], (err, res) => {
                res.forEach(({ first_name, last_name, role_id, manager_id }) => {
                    console.log(
                        `First Name: ${first_name} || Last Name: ${last_name} || Role ID: ${role_id} || Manager ID: ${manager_id}`
                    );
                });

                runApp();
            });
        });

}

const viewDepartment = () => {

    connection.query(
        'SELECT department FROM departments',
        (err, res) => {
            res.forEach(({ department }) => {
                console.log(
                    `Department: ${department}`
                );
            });
        }
    
    
    );

}

const viewRoles = () => {

    connection.query(
        'SELECT title, salary, department_id FROM roles', 
        (err, res) => {
            if (err) throw err;
            console.log(res)
            res.forEach(({ title, salary, department_id }) => {
                console.log(
                    `Position: ${title} || Salary: ${salary} || Department ID: ${department_id}`
                );
            });
        });
    runApp();
}

const viewEmployee = () => {

    connection.query(
        'SELECT first_name, last_name, role_id, manager_id FROM employee',
        (err, res) => {
            if (err) throw err;
            console.log(res)
            res.forEach(({ first_name, last_name, role_id, manager_id }) => {
                console.log(
                    `First Name: ${first_name} || Last Name: ${last_name} || Role ID: ${role_id} || Manager ID: ${manager_id}`
                );
            });
        }
    );
}
// updateRole()
// updateManager()
// viewManager()
// deleteDepartment()
// deleteRole()
// deleteEmployee()
// budget()
// stopApp();

