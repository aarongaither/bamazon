const figlet = require('figlet');
const man = require('./bamazonManager.js');
const cust = require('./bamazonCustomer.js');
const sup = require('./bamazonSupervisor.js');

console.log(figlet.textSync('Bamazon', {
    font: 'Doom',
    horizontalLayout: 'default',
    verticalLayout: 'default'
}));

const mode = process.argv[2];
if (mode == 'manager') {
	man();
} else if (mode == 'super') {
	sup();
} else {
	cust();
}