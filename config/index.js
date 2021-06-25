const database = require('./database')
const token = require('./token')
const nodemailer = require('./nodemailer')

module.exports = ({
    ...database, ...nodemailer, ...token
})