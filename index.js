const express = require('express')
const PORT = process.env.PORT || 2000
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())

app.get('/', (req, res, next) => {
    res.status(200).send('Warta API')
})

app.listen(PORT, () => console.log('WARTA API is Running :', PORT))