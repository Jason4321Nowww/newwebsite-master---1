const express = require('express');
const router = express.Router();
const { createArticle, getArticles, deleteArticle, updateArticle, getArticleById } = require('../controllers/articleController');
const {authMiddleware} = require('../middlewares/authMiddleware');
const uploadArticle = require('../middlewares/uploadArticle')

router.post('/', uploadArticle.array('images', 10) ,createArticle);
router.put('/:id', uploadArticle.array('images', 10), updateArticle);
router.get('/', getArticles);
router.get('/:id' ,getArticleById);
router.delete('/:id' ,deleteArticle);
 

module.exports = router;