const express = require('express');
const { createProduct} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authmiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/', protect, admin, upload.array('images', 10), createProduct);

module.exports = router;
