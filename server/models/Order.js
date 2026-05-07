const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, required: true }
    }
  ],
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerAddress: {
    street: String,
    postalCode: String,
    city: String,
    country: String
  },
  paymentMethod: {
    type: String,
    enum: ['vorkasse'],
    required: true
  },
  totalAmount: Number,
  status: {
    type: String,
    enum: ['pending', 'paid', 'shipped', 'cancelled'],
    default: 'pending'
  },
  paymentNumber: { type: String },   // Auto-generated Kaufnummer shown to customer for bank transfer reference
  invoiceNumber: { type: String, unique: true, sparse: true }, // 10-char alphanumeric, generated on create
  lang: { type: String, enum: ['de', 'fr', 'it', 'en'], default: 'de' }, // Customer's UI language
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
