const express = require('express')
const PORT = process.env.PORT || 2000
const app = express()
const cors = require('cors')
const bearerToken = require('express-bearer-token')
const https = require('https')
const fs = require('fs')
const { db } = require('./config/database')

app.use(cors())
app.use(bearerToken())
app.use(express.json())

db.getConnection((err, connection) => {
    if (err) {
        return console.error('Error MySQL :', err.message)
    }
    console.log(`Connected to MySQL Server : ${connection.threadId}`)
})

app.get('/', (req, res, next) => {
    res.status(200).send('Warta API')
})

const { usersRouter, newsRouter } = require('./routers')
app.use('/users', usersRouter)
app.use('/news', newsRouter)

app.use((error, req, res, next) => {
    console.log("Handling Error :", error)
    res.status(500).send({ status: 'Error My SQL', messages: error })
})



app.listen(PORT, () => console.log('WARTA API is Running :', PORT))