const mysql = require('mysql')
const util = require('util')

const db = mysql.createPool({
    host: "localhost",
    user: "allysarh",
    password: "Fivestars5",
    database: "db_warta_3",
    port: 3306,
    multipleStatements: true
})

const dbQuery = util.promisify(db.query).bind(db)

module.exports = { db, dbQuery }