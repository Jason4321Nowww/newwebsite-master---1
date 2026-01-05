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
    enum: ['vorkasse'], // Only vorkasse
    required: true
  },
  totalAmount: Number,
  status: {
    type: String,
    enum: ['pending', 'paid', 'shipped'],
    default: 'pending'
  },
  bankReference: String, // optional field for payment reference
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
