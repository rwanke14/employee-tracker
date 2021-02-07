const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost',


    port: 3306,


    user: 'root',


    password: 'password',
    database: 'top_songsDB',

});

connection.connect((err) => {

    if (err) throw err;
    runSearch();

});

const runApp = () => {

    const runSearch = () => {
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

                switch (answer) {

                    case 'Add a deparment.':
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

                    default:
                        console.log('No such action available.')

                }

            });
    };

}


const addDepartment = () => {

    inquirer
        .prompt({
            name: 'newdepartment',
            type: 'input',
            message: 'What is the department name?',
        })
        .then((answer) => {
            const query =
                'INSERT INTO departments (department) VALUES ?';
            connection.query(query, [answer.newdepartment], (err, res) => {
                res.forEach(({ department }) => {
                    console.log(
                        `Department: ${department}`
                    );
                });

                runApp();
            });
        });





}


addRole = () => {

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


addEmployee = () => {

    inquirer
        .prompt(
            {
                name: 'firstname',
                type: 'input',
                message: "What is the employee's first name?",
            },
            {
                name: 'lastname',
                type: 'input',
                message: "What is the employee's last name?",
            }
        )
        .then((answer) => {
            const query =
                'INSERT INTO employee (first_name, last_name) VALUES ? AND ?';
            connection.query(query, [answer.firstname, answer.lastname], (err, res) => {
                res.forEach(({ first_name, last_name }) => {
                    console.log(
                        `First Name: ${first_name} || Last Name: ${last_name}`
                    );
                });

                runApp();
            });
        });

}

viewDepartment()

viewRoles()
viewEmployee()
updateRole()
updateManager()
viewManager()
deleteDepartment()
deleteRole()
deleteEmployee()
budget()
stopApp();