const mysql = require('promise-mysql');
const inq = require('inquirer');
const key = require('./keys');

const main = () => {
	let connection;
	let productInfo;
	mysql.createConnection(key).then(conn => {
		connection = conn;
		return connection.query('SELECT item_id, product_name, price, stock_quantity FROM products;')
	}).then(rows => {
	    rows.forEach(val => {console.log(`${val.item_id} - ${val.product_name} - ${val.price} - ${val.stock_quantity}`)});
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
			updateInventory(productInfo.item_id, qty);
			console.log('Your purchase info:')
			console.log(`${productInfo.product_name}, ${qty}, ${productInfo.price}, ${qty * productInfo.price}.`)
		}
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

const updateInventory = (id, qty) => {
	console.log('Inventory Updated (not yet, actually).')
}