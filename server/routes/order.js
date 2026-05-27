const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { createOrder, getOrders, getOrdersByStatus, markAsPaid, markAsShipped, cancelOrder, getOrderStatus } = require('../controllers/orderController');

// ── Reusable middleware: return 422 if any validator failed ──
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array()[0].msg, details: errors.array() });
  }
  next();
};

// ── Order creation validators ────────────────────────────────
const orderValidators = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Cart is empty — add at least one item before placing an order.'),

  body('items.*.product')
    .isMongoId()
    .withMessage('Each item must reference a valid product ID.'),

  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Each item quantity must be a whole number of at least 1.'),

  body('customerName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required.'),

  body('customerEmail')
    .trim()
    .isEmail()
    .withMessage('A valid email address is required.'),

  body('customerAddress.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required.'),

  body('customerAddress.postalCode')
    .trim()
    .notEmpty()
    .withMessage('Postal code is required.'),

  body('customerAddress.city')
    .trim()
    .notEmpty()
    .withMessage('City is required.'),

  body('customerAddress.country')
    .trim()
    .notEmpty()
    .withMessage('Country is required.'),

  body('paymentMethod')
    .equals('vorkasse')
    .withMessage('Invalid payment method.'),
];

router.post('/', orderValidators, validate, createOrder);
router.get('/', getOrders);
router.get('/filter', getOrdersByStatus);
router.patch('/:id/mark-paid', markAsPaid);
router.patch('/:id/mark-shipped', markAsShipped);
router.patch('/:id/cancel', cancelOrder);
router.get('/:id/status', getOrderStatus);

module.exports = router;
