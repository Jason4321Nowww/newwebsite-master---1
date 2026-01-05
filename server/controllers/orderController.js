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
    let total = 0;
    for (let item of items) {
      const product = await Product.findById(item.product);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ error: `Invalid or out-of-stock item` });
      }

      total += product.price * item.quantity;
      product.stock -= item.quantity
      product.orderCount += item.quantity;
      await product.save();
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
