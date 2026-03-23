const express = require('express');
const router = express.Router();
const { createArticle, getArticles, deleteArticle, updateArticle, getArticleById } = require('../controllers/articleController');
const {authMiddleware} = require('../middlewares/authMiddleware');
const uploadArticle = require('../middlewares/uploadArticle')

const uploadFields = uploadArticle.fields([
  { name: 'images', maxCount: 10 },
  { name: 'images_it', maxCount: 10 },
  { name: 'images_fr', maxCount: 10 },
  { name: 'images_en', maxCount: 10 },
]);

router.post('/', uploadFields, createArticle);
router.put('/:id', uploadFields, updateArticle);
router.get('/', getArticles);
router.get('/:id' ,getArticleById);
router.delete('/:id' ,deleteArticle);
 

module.exports = router;