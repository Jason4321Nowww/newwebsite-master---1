const Order   = require('../models/Order');
const Product = require('../models/ShopItem');
const nodemailer = require('nodemailer');
const { orderConfirmationEmail, orderShippedEmail, orderCancelledEmail } = require('../utils/emailTemplates');

const createTransporter = () =>
  nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
  });

const sendMail = (to, tpl) => {
  createTransporter()
    .sendMail({ from: process.env.GMAIL_USER, to, ...tpl })
    .catch(() => {});
};

const generateInvoiceNumber = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

// Kaufnummer — numeric-only, 12 digits, auto-generated for bank transfer reference
const generatePaymentNumber = () =>
  Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join('');

const createOrder = async (req, res) => {
  const {
    items,
    customerName,
    customerEmail,
    customerAddress,
    paymentMethod,
    lang,
  } = req.body;

  try {
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    let total = 0;
    const emailItems = [];

    // Only read prices — stock is decremented when admin marks as paid
    for (let item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ error: 'One or more products not found.' });
      }
      total += product.price * item.quantity;
      emailItems.push({ name: product.name, quantity: item.quantity, price: product.price });
    }

    const invoiceNumber = generateInvoiceNumber();
    const paymentNumber = generatePaymentNumber();
    const orderLang = ['de', 'fr', 'it', 'en'].includes(lang) ? lang : 'de';

    const order = new Order({
      items,
      customerName,
      customerEmail,
      customerAddress,
      paymentMethod,
      totalAmount: total,
      paymentNumber,
      invoiceNumber,
      lang: orderLang,
    });

    await order.save();

    sendMail(
      customerEmail,
      orderConfirmationEmail(customerName, invoiceNumber, paymentNumber, emailItems, total, customerAddress, orderLang)
    );

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOrders = async (_req, res) => {
  try {
    const orders = await Order.find().populate('items.product').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

const getOrdersByStatus = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const orders = await Order.find(filter).populate('items.product').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders by status' });
  }
};

const markAsPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.status !== 'pending') {
      return res.status(400).json({ error: 'Order is not in pending state.' });
    }

    // Atomically decrement stock now that payment is confirmed
    for (const item of order.items) {
      const updated = await Product.findOneAndUpdate(
        { _id: item.product._id, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity, orderCount: item.quantity } },
        { new: true }
      );
      if (!updated) {
        return res.status(409).json({
          error: `Insufficient stock for "${item.product.name}". Please adjust inventory before confirming.`,
        });
      }
    }

    order.status = 'paid';
    await order.save();
    res.json({ message: 'Order marked as paid', order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const markAsShipped = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: 'shipped' }, { new: true });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    sendMail(
      order.customerEmail,
      orderShippedEmail(order.customerName, order.invoiceNumber, order.lang)
    );

    res.json({ message: 'Order marked as shipped', order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.status === 'cancelled') {
      return res.status(400).json({ error: 'Order is already cancelled.' });
    }

    order.status = 'cancelled';
    await order.save();

    sendMail(
      order.customerEmail,
      orderCancelledEmail(order.customerName, order.invoiceNumber, order.lang)
    );

    res.json({ message: 'Order cancelled', order });
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

module.exports = { createOrder, getOrders, getOrdersByStatus, markAsPaid, markAsShipped, cancelOrder, getOrderStatus };
