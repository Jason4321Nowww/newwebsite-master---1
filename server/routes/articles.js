const express = require('express');
const multer = require('multer');
const router = express.Router();
const { createArticle, getArticles, deleteArticle, updateArticle, getArticleById } = require('../controllers/articleController');
const {authMiddleware} = require('../middlewares/authMiddleware');
const uploadArticle = require('../middlewares/uploadArticle');

const uploadFields = uploadArticle.fields([
  { name: 'images', maxCount: 10 },
  { name: 'images_it', maxCount: 10 },
  { name: 'images_fr', maxCount: 10 },
  { name: 'images_en', maxCount: 10 },
]);

function handleUpload(req, res, next) {
  uploadFields(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'One or more images exceed the 10 MB limit.' });
      }
      return res.status(400).json({ message: `Upload error: ${err.message}` });
    }
    if (err) return res.status(400).json({ message: err.message });
    next();
  });
}

router.post('/', handleUpload, createArticle);
router.put('/:id', handleUpload, updateArticle);
router.get('/', getArticles);
router.get('/:id' ,getArticleById);
router.delete('/:id' ,deleteArticle);
 

module.exports = router;