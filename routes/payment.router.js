const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller')

router.get('/option/t/:id', paymentController.PaymentOptions);
router.post('/option/t/:id', paymentController.PaymentOptions);
router.post('/confirm-payment', paymentController.ConfirmPayment)

module.exports = router;
