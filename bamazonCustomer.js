const mysql = require('promise-mysql');
const inq = require('inquirer');
const key = require('./keys');
const table = require('./table');

const main = () => {
    let connection;
    let productInfo;
    mysql.createConnection(key).then(conn => {
        connection = conn;
        return connection.query('SELECT item_id, product_name, price, stock_quantity FROM products;')
    }).then(rows => {
        table(rows);
        return rows
    }).then(rows => {
        return inq.prompt({
            type: "input",
            name: "productID",
            message: "What would you like to purchase?"
        })
    }).then(res => {
        return connection.query('SELECT item_id, product_name, price, stock_quantity FROM products WHERE item_id=?;', res.productID)
    }).then(row => {
        productInfo = row[0];
        return inq.prompt({
            type: "input",
            name: "qty",
            message: `${productInfo.product_name} - How many would you like?`
        })
    }).then(res => {
        let qty = res.qty;
        if (qty > productInfo.stock_quantity) {
            console.log('Sorry, there is not enough remaining in stock to fulfill your order!')
        } else {
            let sales = qty * productInfo.price;
            console.log('Your purchase info:')
            console.log(`${productInfo.product_name}, ${qty}, ${productInfo.price}, ${qty * productInfo.price}.`)
            return connection.query(
                `UPDATE products 
                SET stock_quantity = stock_quantity - ?, product_sales = product_sales + ? 
                WHERE item_id = ?;`, [qty, sales, productInfo.item_id])
        }
    }).then(row => {
        console.log(row)
    }).then(() => {
        return inq.prompt({
            type: "confirm",
            name: "repeat",
            message: "Would you like to make another purchase?"
        })
    }).then(res => {
        if (res.repeat) {
            console.log('Con end from cst prompt, before repeat.')
            connection.end();
            main();
        } else {
            console.log('Con end from cst prompt.')
            connection.end();
        }
    });
}

module.exports = main;