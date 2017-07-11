const mysql = require('promise-mysql');
const inq = require('inquirer');
const key = require('./keys');
const table = require('./table');

const main = function() {
    inq.prompt({
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: ['View Product Sales by Department', 'Create New Department', 'Exit']
    }).then((res) => {
        let inp = res.action;
        if (inp == 'Exit') {
            return false;
        } else if (inp == 'View Product Sales by Department') {
            viewProductSales();
        } else if (inp == 'Create New Department') {
            createDept();
        } else {
            console.log('Somehow, we have an invalid command...')
        }
    }).catch(err => {console.log(err)})
}

const viewProductSales = function() {
	let connection;
	mysql.createConnection(key).then(conn => {
		connection = conn;
		return connection.query(`
			SELECT departments.department_name, departments.over_head_costs, SUM(products.product_sales)
			FROM departments
			INNER JOIN products ON departments.department_name=products.department_name
			GROUP BY department_name
		`)
	}).then(rows => {
		table(rows);
		connection.end();
		console.log('\n')
		main();
	}).catch(err => {console.log(err)})
}

const createDept = function() {
    let connection;
    let deptInfo;
    inq.prompt([
    {
        type: 'input',
        name: 'name',
        message: 'Department name:'
    },
    {
        type: 'input',
        name: 'over',
        message: 'Overhead:'
    }
    ]).then(res => {
        deptInfo = res;
        return mysql.createConnection(key);
    }).then(conn => {
        connection = conn;
        return connection.query('INSERT INTO departments (department_name, over_head_costs) VALUES (?, ?);',[deptInfo.name, deptInfo.over])
    }).then(row => {
        console.log('Department Added.');
        connection.end();
        console.log('\n')
        main();
    }).catch(err => {console.log(err)})
}

module.exports = main;
