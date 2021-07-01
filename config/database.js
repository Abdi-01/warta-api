const mysql = require('mysql')
const util = require('util')

const db = mysql.createPool({
    host: "localhost",
    user: "gugi",
    password: "Penerbangan91",
    database: "db_warta",
    port: 3306,
    multipleStatements: true
})

const dbQuery = util.promisify(db.query).bind(db)

module.exports = { db, dbQuery }