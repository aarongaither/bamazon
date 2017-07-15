const mysql = require('promise-mysql');
const inq = require('inquirer');
const key = require('./keys');
const table = require('./table');

const main = function() {
    inq.prompt({
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Exit']
    }).then((res) => {
        let inp = res.action;
        if (inp == 'Exit') {
            return false;
        } else if (inp == 'View Products for Sale') {
            viewProducts();
        } else if (inp == 'View Low Inventory') {
            viewLowInv();
        } else if (inp == 'Add to Inventory') {
            addtoInv();
        } else if (inp == 'Add New Product') {
            addNewProduct();
        } else {
            console.log('Somehow, we have an invalid command...')
        }
    }).catch(err => {console.log(err)})
}

const viewProducts = function() {
    let connection;
    mysql.createConnection(key).then(conn => {
        connection = conn;
        return connection.query('SELECT * FROM products;')
    }).then(rows => {
        table(rows);
        connection.end();
        console.log('\n')
        main();
    }).catch(err => {console.log(err)})
}

const viewLowInv = function() {
    let connection;
    mysql.createConnection(key).then(conn => {
        connection = conn;
        return connection.query('SELECT * FROM products WHERE stock_quantity < 5;')
    }).then(rows => {
        table(rows);
        connection.end();
        console.log('\n')
        main();
    }).catch(err => {console.log(err)})
}

const addtoInv = function() {
    let connection;
    mysql.createConnection(key).then(conn => {
        connection = conn;
        return connection.query('SELECT item_id FROM products;')
    }).then(rows => {
        return inq.prompt([
        {
            type: 'input',
            name: 'id',
            message: 'For which ID would you like to add inventory?',
            validate: val => !rows.every(e => e.item_id != val) || "Please enter a valid ID"
        },
        {
            type: 'input',
            name: 'qty',
            message: 'How many units would you like to add?',
            validate: val => !isNaN(val) || "Please enter a number."
        }])
    }).then(res => {
        return connection.query('UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?;', [res.qty, res.id])
    }).then(rowReturn => {
        console.log('Inventory Updated.');
        connection.end();
        console.log('\n')
        main();
    }).catch(err => {console.log(err)})
}

const addNewProduct = function() {
    let connection;
    let productInfo;
    mysql.createConnection(key).then(conn =>{
        connection = conn;
        return connection.query('SELECT department_name FROM departments;')
    }).then(rows => {
        return inq.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Product name?'
            },
            {
                type: 'input',
                name: 'dep',
                message: 'Department it belongs in?',
                validate: val => !rows.every(e => e.department_name != val) || "Please enter a valid department."
            },
            {
                type: 'input',
                name: 'price',
                message: 'Price?',
                validate: val => !isNaN(val) || "Please enter a number."
            },
            {
                type: 'input',
                name: 'qty',
                message: 'Quantity in stock?',
                validate: val => !isNaN(val) || "Please enter a number."
            }
        ])
    }).then(res => {
        return connection.query('INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?);',[res.name, res.dep, res.price, res.qty])
    }).then(row => {
        console.log('Product Added.');
        connection.end();
        console.log('\n')
        main();
    }).catch(err => {console.log(err)})
}

module.exports = main;