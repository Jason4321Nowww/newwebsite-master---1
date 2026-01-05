const express = require('express');
const router = express.Router();
const {  createProduct, getAllProducts, updateProduct, deleteProduct, toggleFeatured, toggleActive, getProductById} = require('../controllers/shopController');
const uploadProduct = require('../middlewares/uploadProduct');

router.get('/',  getAllProducts);
router.get('/:id',  getProductById);
router.post('/',  uploadProduct.single('image'), createProduct);
router.put('/:id',  uploadProduct.single('image'), updateProduct);
router.delete('/:id',  deleteProduct);
router.patch('/:id/toggle', toggleActive);
router.patch('/:id/featured', toggleFeatured);



module.exports = router;
