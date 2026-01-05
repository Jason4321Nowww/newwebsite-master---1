
/* === controllers/productController.js === */
const Product = require('../models/ShopItem');

const createProduct = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) {
      data.mediaUrl = `/uploads/products/${req.file.filename}`;
      data.mediaType = 'image';
    }
    const product = new Product(data);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getAllProducts = async (req, res) => {
  const filter = req.query.category ? { category: req.query.category } : {};
  try {
    const products = await Product.find(filter).sort({ createdAt: -1 }); ;
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updates = { ...req.body };

    if (req.file) {
      updates.mediaUrl = `/uploads/products/${req.file.filename}`; // New image path
    }

    // If there's no new file but mediaUrl was sent (i.e. old one), retain it
    if (!req.file && req.body.mediaUrl) {
      updates.mediaUrl = req.body.mediaUrl;
    }

    const updated = await Product.findByIdAndUpdate(productId, updates, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    console.error('❌ Update product error:', err);
    res.status(400).json({ message: err.message });
  }
};
// Get single product
const  getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const toggleFeatured = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    product.isFeatured = !product.isFeatured;
    await product.save();
    res.json({ status: product.isActive ? 'enabled' : 'disabled' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const toggleActive = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    product.isActive = !product.isActive;
    await product.save();
    res.json({ status: product.isActive ? 'enabled' : 'disabled' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = { createProduct, getAllProducts, updateProduct, deleteProduct, toggleActive, toggleFeatured, getProductById}