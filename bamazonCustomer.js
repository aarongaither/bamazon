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
            message: "What would you like to purchase?",
            validate: val => !rows.every(e => e.item_id != val) || "Please enter a valid ID"  
        })
    }).then(res => {
        return connection.query('SELECT item_id, product_name, price, stock_quantity FROM products WHERE item_id=?;', res.productID)
    }).then(row => {
        productInfo = row[0];
        return inq.prompt({
            type: "input",
            name: "qty",
            message: `${productInfo.product_name} - How many would you like?`,
            validate: val => !isNaN(val) || "Please enter a number."
        })
    }).then(res => {
        let qty = res.qty;
        if (qty > productInfo.stock_quantity) {
            console.log('Sorry, there is not enough remaining in stock to fulfill your order!')
        } else {
            let sales = (qty * productInfo.price).toFixed(2);
            console.log('\nYour purchase info:')
            table([{
                product_name: productInfo.product_name,
                quantity: qty,
                price_each: productInfo.price,
                total_cost: sales
            }]);
            return connection.query(
                `UPDATE products 
                SET stock_quantity = stock_quantity - ?, product_sales = product_sales + ? 
                WHERE item_id = ?;`, [qty, sales, productInfo.item_id])
        }
    }).then(() => {
        return inq.prompt({
            type: "confirm",
            name: "repeat",
            message: "Would you like to make another purchase?"
        })
    }).then(res => {
        console.log('\n')
        connection.end();
        if (res.repeat) main()
    }).catch(err => {console.log(err)});
}

module.exports = main;