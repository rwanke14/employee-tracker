const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table')

//Used for adding color and heading to application in terminal.
var figlet = require('figlet');
const chalk = require('chalk');

//Setting up Employee Tracker header with figlet.
figlet.text('Employee Tracker', 
function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(chalk.blue.bold(data))
});


const port = 3306

//Connects to mysql database.
const connection = mysql.createConnection({
    host: 'localhost',


    port: 3306,


    user: 'root',


    password: 'password',
    database: 'employeesDB',

});

 
//Creates connection to database.
connection.connect((err) => {

    if (err) throw err;
    console.log("\x1b[32m", 'You are connected on local host 3306')

    runApp()

});

//This function starts the application and runs the prompts to select what you want to do with your database. Switch statement takes you to the function for the selected action.
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
                'Delete an employee.',
                'View Deparment Budgets.',
                'Exit'
            ],
        })
        .then((answer) => {
            const todo = answer.start
            switch (todo) {

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

                case 'Delete an employee.':
                    deleteEmployee()
                    break;

                case 'View Deparment Budgets.':
                    budget()
                    break;

                case 'Exit':
                    stopApp();
                    break;

                default:
                    console.log('No such action available.')
                    break;
            }

        });

}



//Function to create department.
const addDepartment = () => {

    inquirer
        .prompt({
            name: 'department',
            type: 'input',
            message: 'What is the department name?',
        })
        .then((answer) => {

            //Insert new department into the departments table.
            const query = connection.query('INSERT INTO departments SET ?',
                {
                    department: answer.department,
                },
                (err, res) => {
                    if (err) throw err;

                    console.log("\x1b[32m", 'Department added!');

                    runApp();
                });
        });

}

//Function to add role to database.
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

            //Insert new role into roles table along with department id.
            connection.query('INSERT INTO roles SET ?',
                {
                    title: answer.title,
                    salary: answer.salary,
                    department_id: answer.departmentid,
                },
                (err, res) => {
                    if (err) throw err;

                    console.log("\x1b[32m", 'Role added!');

                    runApp();
                });
        });


}



//Function to add employee to database.
const addEmployee = () => {

    //Select list of roles from roles table.
    connection.query('SELECT * FROM roles', (err, res) => {
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
                    choices() {
                        const roleArray = [];
                        res.forEach(({ id, title, salary }) => {
                            roleArray.push(id + '. ' + title + ' ' + salary);
                        });
                        return roleArray;
                    }
                },
            ])
            .then((answer) => {

                const roleId = answer.role.split('. ')[0]
                const fName = answer.firstname
                const lName = answer.lastname

                //Select list of employees to assign manager from employee table.
                connection.query('SELECT * FROM employee', (err, res) => {
                    inquirer
                        .prompt([
                            {
                                name: 'manager',
                                type: 'list',
                                message: "Who is the employee's manager?",
                                choices() {
                                    const managerArray = [];
                                    res.forEach(({ id, first_name, last_name }) => {
                                        managerArray.push(id + '. ' + first_name + ' ' + last_name);
                                    });
                                    return managerArray;
                                }
                            }
                        ])
                        .then((answer) => {


                            const managerId = answer.manager.split('. ')[0]

                            //Insert new employee into the employee table and assign their manager.
                            connection.query('INSERT INTO employee SET ?',
                                {
                                    first_name: fName,
                                    last_name: lName,
                                    role_id: roleId,
                                    manager_id: managerId
                                },
                                (err, res) => {
                                    if (err) throw err;


                                    console.log("\x1b[32m", 'Employee added!');


                                    runApp();
                                });
                        });
                })
            })

    })
}


//Function to view all departments in the departments table.
const viewDepartment = () => {

    //Selects the departments table with all columns.
    connection.query(
        'SELECT department FROM departments ORDER BY departments.id',
        (err, res) => {
            if (err) throw err;
            console.table("\x1b[35m", res)
            runApp();
        }


    );

}



//Function to view all roles in the roles table.
const viewRoles = () => {

    //Selects the roles table with all columns.
    connection.query(
        'SELECT title, salary, department_id FROM roles',
        (err, res) => {
            if (err) throw err;
            console.table("\x1b[35m", res)
            runApp();
        });
}

//This is just a list of the employees table, not a full list joined with the other tables.
const viewEmployees = () => {

    connection.query(
        'SELECT first_name, last_name, role_id, manager_id FROM employee',
        (err, res) => {
            if (err) throw err;
            console.table("\x1b[35m", res)
            runApp();
        });
}

//View employees by manager, joining within the employee table to show each employee and their managers name.
const viewManager = () => {

    //Query concats the first name and last name and sets one column for employee and one for manager.
    //A left join is used to join with in the employee table using the manager id and employee id and then ordered by manager.
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
            console.table("\x1b[35m", res)
            runApp();
        });


}

//This is a full employee list joining all three tables to show the employee, their title, salary and department.
const viewAllEmployees = () => {

    //Query selects the columns needed, joins the employee table to the roles table via the role id and then joins the department table via the department id.
    let query =
        'SELECT employee.id, employee.first_name, employee.last_name, roles.title, roles.salary, departments.department ';
    query +=
        'FROM employee INNER JOIN roles ON (roles.id = employee.role_id ) '; 
    query +=
        'INNER JOIN departments ON (departments.id = roles.department_id) '; 

    connection.query(
        query, (err, res) => {
            if (err) throw err;
            console.table("\x1b[35m", res)

            runApp();
        }
    );


}

//This function updates an employees role by selecting the employee and then the new role and updating the database.
const updateRole = () => {

    //Select employee list from database.
    connection.query('SELECT * FROM employee', (err, res) => {
        
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
                

                let employeeId = answer.selectrole.split(".")[0]
               

                //Select list of roles from database.
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
                           

                            let roleId = answer.role.split(".")[0]
                           
                            //Update the employee table with the new role for the employee.
                            connection.query(
                                'UPDATE employee SET role_id=? WHERE id=?', [roleId, employeeId]

                                , (err, res) => {
                                    if (err) throw err;
                                    console.log("\x1b[34m", 'Role updated!')

                                    runApp();
                                }
                            );


                        });

                });


            })

    })


}


//This function updates the employees manager.
const updateManager = () => {

    //Select from the employee table for a list of employees.
    connection.query('SELECT * FROM employee', (err, res) => {
    
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
                
                let employId = answer.employee.split('. ')[0]
                
                //Select from the employee table to get a list employees.
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

                            
                            let managerId = answer.manager.split(".")[0]
                            
                            //Update the employee table to set the manager id for the employee to their new manager based on the managers employee id.
                            connection.query(
                                'UPDATE employee SET manager_id=? WHERE id=?', [managerId, employId]
                                , (err, res) => {
                                    if (err) throw err;
                                    console.log("\x1b[34m", 'Manager was updated for the employee!')

                                    runApp();
                                }
                            );


                        });

                });

            });

    })



}


//This function deletes a department.
const deleteDepartment = () => {

    //Select list of departments from the table.
    connection.query('SELECT * FROM departments', (err, res) => {
       
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: 'removedepart',
                    type: 'list',
                    message: "Which department would you like to remove?",
                    choices() {
                        
                        const departArray = [];
                        
                        res.forEach(({ id, department }) => {
                            departArray.push(id + '. ' + department);
                        });
                        return departArray;
                    }
                },
            ])
            .then((answer) => {
                

                let departmentId = answer.removedepart.split('. ')[0]
                

                //Delete selected department from the departments table based on id.
                connection.query('DELETE FROM departments WHERE departments.id = ? ', [departmentId], (err, res) => {
                    if (err) throw err;
                    console.log("\x1b[31m", 'Department removed successfully!')

                    runApp();

                });

            });

    })

}



//Function to delete a role from the database.
const deleteRole = () => {

    //Select roles from roles database.
    connection.query('SELECT * FROM roles', (err, res) => {
        
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: 'role',
                    type: 'list',
                    message: "Which role do you want to remove?",
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
                

                let roletId = answer.role.split('. ')[0]
                
                //Deleted selected role from roles table based on it's id.
                connection.query('DELETE FROM roles WHERE roles.id = ? ', [roletId], (err, res) => {
                    if (err) throw err;
                    console.log("\x1b[31m", 'Role removed successfully!')

                    runApp();

                });

            });

    })


}

//Function to delete employees from database.
const deleteEmployee = () => {

    //Create list of employees by selecting employees from the employee table.
    connection.query('SELECT * FROM employee', (err, res) => {
        
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: 'employee',
                    type: 'list',
                    message: "Which employee do you want to remove?",
                    choices() {
                        
                        const employeeArray = [];
                        
                        res.forEach(({ id, first_name, last_name }) => {
                            employeeArray.push(id + '. ' + first_name + ' ' + last_name);
                        });
                        return employeeArray;
                    }
                },
            ])
            .then((answer) => {
                

                let employeeId = answer.employee.split('. ')[0]
               
                //Delete selected employee from the employee table based on employee id.
                connection.query('DELETE FROM employee WHERE employee.id = ? ', [employeeId], (err, res) => {
                    if (err) throw err;
                    console.log("\x1b[31m", 'Employee removed successfully!')

                    runApp();

                });

            });

    })


}

//View department budgets based on salaries.
const budget = () => {

    //Select the departments and the sum of each role in the department to view the total budget. Joining the department and roles table on the department id. 
    connection.query(
        'SELECT departments.department AS Department, SUM(salary) AS Budget FROM roles LEFT JOIN departments ON roles.department_id = departments.id GROUP BY departments.id', (err, res) => {
            if (err) throw err;
            console.table("\x1b[35m", res)

            runApp();
        }
    );

}

//Stops connection and exits prompts when exit is selected. 

const stopApp = () => {

    connection.end()


};

