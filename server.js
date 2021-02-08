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

                case 'View all employees.':
                    viewEmployees()
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
        'SELECT department FROM departments',
        (err, res) => {
            if (err) throw err;
            console.table(res)
        }


    );

}

const viewRoles = () => {

    connection.query(
        'SELECT title, salary, department_id FROM roles',
        (err, res) => {
            if (err) throw err;
            console.table(res)
        });
    runApp();
}

const viewEmployees = () => {
    let query = 
        'SELECT employee.id, employee.first_name, employee.last_name, roles.title, departments.department AS department, roles.salary'
    query += 
        'FROM employee LEFT JOIN roles ON employee.role_id = role.id' //Roles connect to Role ID //Manager connects to managerID
    query += 
        'LEFT JOIN departments ON roles.department_id = departments.id' //Roles connect to department ID
    connection.query(
        query, (err, res) => {
            if (err) throw err;

            console.table(res)
            
        }
    );

    runApp();
}


const updateRole = () => {
    connection.query ('SELECT * FROM roles', (err, res) => {
        if (err) throw err;
        inquirer
        .prompt([
            {
                name: 'selectrole',
                type: 'rawlist',
                message: "Which role would you like to change?",
                choices() {
                    const roleArray = [];
                    res.forEach(({ title, salary, department_id }) => {
                        roleArray.push(title, salary, department_id);
                    });
                    return roleArray;
                }
            },
        ])
        .then((answer) => {
           

            inquirer
            .prompt([
                {
                    name: 'selectrole',
                    type: 'rawlist',
                    message: "Which role would you like to change?",
                    choices() {
                        const roleArray = [];
                        res.forEach(({ title, salary, department_id }) => {
                            roleArray.push(title, salary, department_id);
                        });
                        return roleArray;
                    }
                },
            ])
            .then((answer) => {
               
    
                
    
    
    
                
    
            
    
            })



            

        

        })

    })
   

}

// const query = connection.query(
//                 'UPDATE roles SET ? WHERE ?',
//                 [
//                     {
//                         quantity: 100,
//                     },
//                     {
//                         flavor: 'Rocky Road',
//                     },
//                 ],
//                 (err, res) => {
//                     if (err) throw err;
//                     console.log(`${res.affectedRows} products updated!\n`);
//                     // Call deleteProduct AFTER the UPDATE completes
//                     deleteProduct();
//                 }
//             );

// updateManager()
// viewManager()
// deleteDepartment()
// deleteRole()
// deleteEmployee()
// budget()
// stopApp();

