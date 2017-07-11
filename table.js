const Table = require('cli-table');

let printTable = rows => {
    let t = new Table({
        head: Object.keys(rows[0]).map(key => key)
    });

    rows.forEach(obj => t.push(Object.values(obj)))
    console.log(t.toString());
}

module.exports = printTable;