const express = require('express')
const { readToken } = require('../config')
const usersController = require('../controllers/usersController')
const router = express.Router()

router.get('/get-all', usersController.getUser)
router.post('/login', readToken, usersController.login)
router.post('/keeplogin', readToken, usersController.keepLogin)
router.post('/register', usersController.register)
router.patch('/verified', readToken, usersController.verified)
router.patch('/reverified', usersController.reVerified)

module.exports = router