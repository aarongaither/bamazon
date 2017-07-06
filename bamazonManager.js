const mysql = require('promise-mysql');
const inq = require('inquirer');
const key = require('./keys');

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
    })
}

const viewProducts = function() {
    let connection;
    mysql.createConnection(key).then(conn => {
        connection = conn;
        return connection.query('SELECT * FROM products;')
    }).then(rows => {
        console.log(rows);
        connection.end();
        console.log('\n')
        main();
    })
}

const viewLowInv = function() {
    let connection;
    mysql.createConnection(key).then(conn => {
        connection = conn;
        return connection.query('SELECT * FROM products WHERE stock_quantity < 5;')
    }).then(rows => {
        console.log(rows);
        connection.end();
        console.log('\n')
        main();
    })
}

const addtoInv = function() {
    let connection;
    let productInfo;
    inq.prompt([
    {
        type: 'input',
        name: 'id',
        message: 'For which ID would you like to add inventory?'
    },
    {
        type: 'input',
        name: 'qty',
        message: 'How many units would you like to add?'
    }]).then(res => {
        productInfo = res;
        return mysql.createConnection(key);
    }).then(conn => {
        connection = conn;
        return connection.query('UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?;', [productInfo.qty, productInfo.id])
    }).then(rowReturn => {
        console.log(rowReturn);
        connection.end();
        console.log('\n')
        main();
    })
}

const addNewProduct = function() {
    let connection;
    let productInfo;
    inq.prompt([
    {
        type: 'input',
        name: 'name',
        message: 'product name?'
    },
    {
        type: 'input',
        name: 'dep',
        message: 'Department it belongs in?'
    },
    {
        type: 'input',
        name: 'price',
        message: 'Price?'
    },
    {
        type: 'input',
        name: 'qty',
        message: 'Quantity in stock?'
    }
    ]).then(res => {
        productInfo = res;
        return mysql.createConnection(key);
    }).then(conn => {
        connection = conn;
        return connection.query('INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?);',[productInfo.name, productInfo.dep, productInfo.price, productInfo.qty])
    }).then(row => {
        console.log(row);
        connection.end();
        console.log('\n')
        main();
    })  
}

module.exports = main;