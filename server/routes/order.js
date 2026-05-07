const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrdersByStatus, markAsPaid, markAsShipped, cancelOrder, getOrderStatus } = require('../controllers/orderController');

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/filter', getOrdersByStatus);
router.patch('/:id/mark-paid', markAsPaid);
router.patch('/:id/mark-shipped', markAsShipped);
router.patch('/:id/cancel', cancelOrder);
router.get('/:id/status', getOrderStatus);

module.exports = router;
