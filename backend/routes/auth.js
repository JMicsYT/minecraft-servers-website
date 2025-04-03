const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.me);
router.post('/logout', authMiddleware, authController.logout);
router.post('/me/password', authMiddleware, authController.changePassword);

router.post('/me/news-subscriptions', authMiddleware, authController.subscribeToNews); // Подписаться на новости
router.delete('/me/news-subscriptions', authMiddleware, authController.unsubscribeFromNews); // Отписаться от новостей
router.get('/me/news-subscriptions', authMiddleware, authController.getUserNewsSubscriptions); // Получить список подписок пользователя

module.exports = router;