const express = require('express');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addReviewToProduct,
  deleteReview,
  getProductReviews,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authmiddleware');

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);

// router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

router.post('/:id/reviews', protect, addReviewToProduct);
router.delete('/:id/reviews/:reviewId', protect, deleteReview);
router.get('/:id/reviews', getProductReviews);

module.exports = router;
