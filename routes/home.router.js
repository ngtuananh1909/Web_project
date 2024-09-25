const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth')
const homeController = require('../controllers/home.controller');

router.get('/', homeController.home);
router.get('/login', homeController.loginDisplay);
router.get('/register', homeController.registerDisplay);
router.get('/hotproduct', homeController.hot_product);
router.get('/salelist', homeController.sale_product);
router.get('/cart', homeController.cartDisplay);
router.get('/logout', homeController.logout);
router.get('/settings', homeController.SettingDisplay);
router.get('/user/:id', homeController.ProfileDisplay)
router.get('/scoreboard', homeController.ScoreboardDisplay)
router.get('/message/t/:id', homeController.MessageDisplay)
router.post('/auth/UserUpdate', authMiddleware, homeController.UserUpdate);
router.post('/auth/register', homeController.register);
router.post('/auth/login', homeController.login);
router.post('/auth/add-to-cart', homeController.AddToCart);
router.post('/add-rating', homeController.addRating);
router.post('/send-message', homeController.SendMessage)
router.delete('/cart/remove/:id', homeController.RemoveFromCart);

module.exports = router;
