const mysql = require('mysql')
const util = require('util')

const db = mysql.createPool({
    host: "139.162.63.45",
    user: "docsql",
    password: "docker123",
    database: "dbwarta",
    port: 8060,
    multipleStatements: true
})

const dbQuery = util.promisify(db.query).bind(db)

module.exports = { db, dbQuery }