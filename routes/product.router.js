const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const authMiddleware = require('../middleware/auth')

router.get('/add', authMiddleware, productController.AddProductDisplay);
router.get('/:id', productController.DisplayProductDetails);
router.post('/auth/add', authMiddleware, productController.CreateProduct);

module.exports = router;
