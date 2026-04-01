/* === controllers/orderController.js === */
const Order = require('../models/Order');
const Product = require('../models/ShopItem')

const createOrder = async (req, res) => {
  const {
    items,
    customerName,
    customerEmail,
    customerAddress,
    paymentMethod,
    totalAmount
  } = req.body;

  try {
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    let total = 0;
    for (let item of items) {
      // Atomic decrement — only succeeds if stock >= quantity (prevents negative stock)
      const product = await Product.findOneAndUpdate(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity, orderCount: item.quantity } },
        { new: true }
      );
      if (!product) {
        return res.status(400).json({ error: `Item is out of stock or unavailable` });
      }
      total += product.price * item.quantity;
    }

    const order = new Order({
      items,
      customerName,
      customerEmail,
      customerAddress,
      paymentMethod,
      totalAmount: total
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('items.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};


// Add this below getOrders
const getOrdersByStatus = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const orders = await Order.find(filter).populate('items.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders by status' });
  }
};

const markAsPaid = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: 'paid' },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order marked as paid', order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const markAsShipped = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: 'shipped' },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order marked as shipped', order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Not found' });
    res.json({ status: order.status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  createOrder,
  getOrders,
  getOrdersByStatus,
  markAsPaid,
  markAsShipped,
  getOrderStatus
};
