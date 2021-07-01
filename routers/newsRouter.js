const router = require('express').Router()
const { readToken } = require('../config')
const { newsController } = require('../controllers')

router.get('/get-news', newsController.getNews)
router.post('/add', newsController.addNews)
router.patch('/update', newsController.updateNews)
router.delete('/delete/:idnews', newsController.deleteNews)
router.patch('/update-view', newsController.updateView)

// Komentar
router.get('/get-komentar', newsController.getKomentar)
router.post('/add-komentar', newsController.addKomentar)

module.exports = router