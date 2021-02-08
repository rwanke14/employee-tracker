const inquirer = require('inquirer');
const cTable = require('console.table')


class Departments {

    constructor(id, department){
        this.id = id
        this.department = department;
    }

    viewDepartment = () => {

        connection.query(
            'SELECT department FROM departments',
            (err, res) => {
                if (err) throw err;
                console.table(res)
            }
    
    
        );
    
    }


    addDepartment = () => {

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

    updateDepartment = () => {

        
    }

    deleteDepartment = () => {



    }



}

module.exports = Departments;