const express = require('express');
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  markAsPaid,
  markAsDelivered,
  markAsReturned,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authmiddleware');

const router = express.Router();

router.post('/', protect,createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.get('/', protect, admin, getAllOrders);
router.put('/:id/return', protect, admin, markAsReturned);
router.put('/:id/pay', protect,admin, markAsPaid);
router.put('/:id/deliver', protect, admin, markAsDelivered);

module.exports = router;
