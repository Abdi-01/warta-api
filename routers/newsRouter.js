const router = require('express').Router()
const { newsController } = require('../controllers')

router.get('/get-news', newsController.getNews)
router.post('/add', newsController.addNews)
router.patch('/update', newsController.updateNews)
router.delete('/delete/:idnews', newsController.deleteNews)

module.exports = router