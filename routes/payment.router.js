const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller')

router.get('/option/t/:id', paymentController.PaymentOptions);
router.post('/checkout/:id', paymentController.Checkout); 

module.exports = router;
